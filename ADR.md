# 自作スイッチボット構想 壁打ちメモ

## 1. 前提：購入済みハードウェア

| 商品名 | 数量 |
|---|---|
| Raspberry Pi Zero WH | 1 |
| microSDHCメモリカード(16GB) | 1 |
| ラズパイ用ACアダプター 5V/3.0A | 1 |
| ジャンプワイヤーセット オス-メス 100mm 10本 | 1セット |
| SG92R マイクロサーボモーター | 購入済み（物理スイッチ押下用） |



## 2. スイッチ押下までの流れ

- Web SPAからの指示をNestJS API経由でQueueに投入
- ラズパイ側はQueueをポーリングして指示を取得し、サーボを駆動（Ver1.0スコープ外。3.10節参照）
  - ラズパイ側にポート開放・固定グローバルIPが不要になるのが最大のメリット
- **クライアント技術方針の変更**: 当初はReact Native(Expo)アプリを想定していたが、家族利用時の配布手段（3.4節参照）を踏まえWebアプリ（SPA）に変更した

> 全体図: `Architecture.drawio`（1ページ目「全体アーキテクチャ」/ 2ページ目「オニオンアーキテクチャ」の2ページ構成）


## 3. 技術選定と意思決定の経緯

### 3.1 Azureサービス選定
- **API**: NestJS（コンテナデプロイ、例: Azure Container Apps/Cloud Run/ECS等）※3.10節参照
  - 要件的にはAzure Functions（HTTPトリガー、従量課金でほぼ無料枠に収まる）で十分であるが、フレームワークへのチャレンジということであえてNestJS を選択
- **キュー**: Azure Queue Storage
  - 理由: シンプルなFIFOキューで十分。Service Busは順序保証・デッドレターなど高機能だが今回の用途には過剰。

### 3.2 開発言語・技術スタック
| レイヤー | 技術 | 選定理由 |
|---|---|---|
| クライアント | Web SPA (TypeScript) | 家族利用時の配布容易性、他フレームワークへの興味関心を優先 |
| API | NestJS (TypeScript, コンテナデプロイ) | クライアント(Web SPA)と型・バリデーション(zodなど)を共有できる。 |
| エッジ(ラズパイ) | Go（実装予定） | 単一バイナリでデプロイが容易（ランタイム不要）、RPi Zeroの非力なCPU/メモリでも軽量に動作、systemd常駐に向く |

**検討の流れ:**
1. 当初はNode.js/TypeScriptで全体統一も検討（Web経験の最大活用）
2. ラズパイが「機能拡張せず単純なエッジサービス」である点を踏まえ、軽量であることや、単一バイナリでデプロイの容易さからGoに変更
3. クライアントがReact Native（TypeScript）になることを踏まえ、API言語をTypeScript/Goで再比較
   - TypeScript採用の決め手: クライアントとの型共有、バリデーションの共通化（zod等）、Web経験の最大活用、個人開発での言語切り替えコスト削減
   - Goの強み（軽量・単一バイナリ）は、リソースが厳しいラズパイ側でこそ活きると判断し、Go運用はエッジに限定
4. API実行基盤をAzure Functions（FaaS）からNestJS＋コンテナデプロイへ変更（3.10節参照）
5. クライアントをReact Native(Expo)からWeb SPAへ変更（3.4節参照）。API/エッジの言語選定自体には影響なし
6. **最終決定（現時点）**: クライアント＝Web SPA(TS)、API＝NestJS(TS, コンテナ)、エッジ＝Go（Ver2.0以降）

### 3.3 認証方式
- **クライアント→API**: Microsoft Entra IDでのユーザー認証（OAuth2 Authorization Code + PKCE、ブラウザリダイレクト方式）を採用
- **エッジ(ラズパイ)→API**: ユーザー認証ではなく、Entra IDへのエッジ専用アプリ登録＋クライアントシークレットによるOAuth2クライアントクレデンシャルフロー（アプリのみのトークン）を採用。同一テナントのJWKSでトークン署名・issuer・audienceを検証したうえで、`appid`（無ければ`azp`）クレームをTable Storageの`Applications`テーブル（allowlist）と突合し、登録済みアプリ登録から発行されたトークンであることを確認する（`EdgeClientAuthGuard`、`PATCH /api/edge/switch/:requestId/status`。詳細は3.9節参照）
- クライアントがWeb SPAになったことで、モバイルアプリ特有のカスタムスキームリダイレクト対応が不要になり、標準的なWeb OAuthフロー（リダイレクトURIはhttps）で完結する

### 3.4 クライアント構成
- **当初案**: React Native (Expo managed)
- **見直しの背景**: 完成後に家族（iOS端末前提）へ配布することを想定した際、iOSはApp Store経由の配布を避けようとするとApple Developer Program（年間$99）への加入とTestFlight/Ad Hoc配布が事実上必須になり、証明書更新（Ad Hocは年1回の再ビルド、無料プロビジョニングは7日で失効）という運用負荷が個人開発のスコープに見合わないと判断
- **決定**: **Web SPA**として実装する
- **理由**:
  - ストア審査・証明書更新・年会費が不要で、URLを共有するだけで家族全員が利用可能
  - iOSでも「ホーム画面に追加」でPWA的に利用可能（プッシュ通知の制約はあるが、3.7節の方針は元々ポーリング方式のため影響なし）
  - 認証もOAuth2 Authorization Code + PKCEの標準的なブラウザリダイレクトで完結し、モバイル特有のカスタムスキーム対応が不要になり実装がシンプルになる
  - クライアント⇔API間のTypeScript型・バリデーション共有という当初のモノレポ方針は維持できる
- **将来の再検討余地**: 本格的なネイティブ機能（Bluetooth等）が必要になった場合は、React Native化や配布方式の再検討を行う

### 3.4.1 Webフロントエンドフレームワーク
- **候補比較**: React (Vite) / Vue.js (Vite) / Blazor WASM
- **前提**: 自身のフロントエンド実務経験はC# Blazor WASMが中心で、React/Vueはいずれも本格経験なし
- **検討の流れ**:
  1. Blazor WASMは経験を活かせて開発速度は最速だが、NestJS(TS)とのTypeScript型・バリデーション共有（3.1節のモノレポ方針の根幹）ができなくなる
  2. React/Vueであれば型共有は維持できるが、いずれも未経験のため学習コストが発生する。開発期限（目安1ヶ月）を踏まえ、学習機会は確保しつつスイッチングコストが低い方を選びたい
  3. Blazorの設計思想（`.razor`＝マークアップ＋`@code`が1ファイルに同居、`@if`/`@foreach`ディレクティブ、`@bind`による双方向バインディング、フィールド変更→再描画というメンタルモデル）と比較すると、Vue.jsは`.vue`のSFC（`<template>`+`<script>`+`<style>`）構成、`v-if`/`v-for`ディレクティブ、`v-model`による双方向バインディングなど構造的に類似点が多く、学習の転移がしやすい
  4. Reactはマークアップをコード内に埋め込むJSX、双方向バインディングを持たない制御コンポーネントパターン、イミュータブルな状態＋再レンダリングという異なるメンタルモデルの習得が必要で、Blazor経験からのスイッチングコストはVueより高いと判断
- **決定**: **Vue.js 3 (Composition API) + Vite** を採用する
- **理由**: 型・バリデーション共有というモノレポ当初方針を維持しつつ、Blazor WASM経験からのスイッチングコストを最小化して開発速度を確保できるため
- **認証ライブラリへの影響**: Vue公式のMSALラッパーは存在しないため、`@azure/msal-browser`を素で利用する実装になる（3.5節参照）

### 3.4.2 Webクライアントのホスティング先
- **現状（Ver1.0時点）**: Azure Storage静的サイトに配置し稼働中
- **残課題**: SPAルーティング（Vue Router等）で直接URL/リロード時に、Azure Storage静的サイトはサーバー側フォールバック設定を持てず404になるルーティング不整合が発生する可能性がある
- **暫定運用とする判断**: Ver1.0時点ではクライアント側にルーティング（複数ページ/パス）を持たないため、上記の404問題は実際には発生しない。したがって**Azure Static Web Appsへの移行は現時点では行わず、Azure Storage静的サイトのまま暫定運用を継続する**
- **移行タイミング**: クライアント側にVue Router等でルーティングを導入するタイミングで、Azure Static Web Apps等への移行を再検討する
- **候補比較（将来移行時の参考）**: Azure Static Web Apps / NestJSコンテナへの静的ファイル同居 / Azure Storage静的サイト（現状）
- **Static Web Apps移行時に見込まれる利点**:
  - 無料枠が手厚く、GitHub Actions CI/CDが自動セットアップされるため運用の手間が最小
  - 既存のAzureリソース群（Container Apps, Queue/Table Storage, Entra ID）と一貫性がある
  - デプロイ単位をAPIと分離できる（フロント修正だけでAPIコンテナの再ビルドが不要になり、疎結合を維持できる）
- **移行時のトレードオフとして許容する点**: オリジンが分かれるためCORS設定が必要（NestJS側で`enableCors({ origin: [...] })`を設定するだけで解決する軽微なコストと判断）。

### 3.5 認証実装方式
- **使用ライブラリ**: `@azure/msal-browser`（Microsoft公式のブラウザ向けMSAL SDK）。Vue.js採用（3.4.1節）により、公式Reactラッパー(`@azure/msal-react`)のようなフレームワーク別ラッパーは存在しないため、Composition API向けの薄いラッパー（`ref`でアカウント状態を保持する程度）を自前で用意する想定
- **実装フロー概要**:
  1. Entra ID側でアプリ登録（SPAプラットフォーム、クライアントシークレット不要、PKCE前提）
  2. MSAL SDKで認可エンドポイントにリダイレクト（PKCE自動付与）→ブラウザでログイン→認可コード取得
  3. MSAL SDKがトークンエンドポイントとのやり取り・トークンキャッシュ（メモリ/sessionStorage等）を管理
  4. アクセストークン有効期限切れ時はMSAL SDKによるサイレントリフレッシュ（iframe/リフレッシュトークン）
  5. APIリクエスト時はAuthorizationヘッダーにBearerアクセストークンを付与
- **家族限定ログインの方式**: **ワークフォーステナント（既存のEntra IDテナント）でのB2Bゲスト招待**
  - **検討の経緯**:
    - Microsoft Entra External ID（旧Azure AD B2C相当のCIAM機能）はself-service sign-upが標準であり「テナント参加＝家族」を担保できず、かつ本来「事業として不特定多数の顧客にアプリを提供する」ケースを想定した機能（Microsoft公式ドキュメントでも"consumer apps"/"business customers"向けと明記）であり、家族向け個人アプリには過剰
    - Entra IDのB2B協業には「ゲストユーザーのGoogleフェデレーション」機能があり、招待した特定の人物のみがGoogle資格情報でサインインできる。「自組織リソースに招待した特定の外部者をアクセスさせる」というB2B協業の想定ケースが、家族利用の実態（既知の特定個人を個別に招待）に最も近い
  - **決定内容**: 3.3節のEntra IDワークフォーステナントはそのままに、B2Bゲスト招待で家族を個別に招待する。self-service sign-upは無効のままとし、招待制（＝テナント参加者が家族に限定される）を維持する
  - **理由**: 追加のExternal IDテナントを新規プロビジョニングする必要がなく、当初のADR方針（3.3節）をそのまま拡張できる。テナント参加自体が家族限定を担保するため、API側allowlistは必須ではなく多層防御として任意で維持する程度に留める
- **残論点**: トークン保存先（メモリ vs sessionStorage、XSS耐性とのトレードオフ）、トークンリフレッシュのタイミング、ログアウト時のトークン破棄・Entra ID側セッション終了の扱い（実装しながら別途検討する）


### 3.6 リポジトリ構成（決定・Ver1.0時点で更新）
- **方針**: フルモノレポではなく、TS側とGo側でリポジトリを分割する
  - `my-switch-bot-app`: クライアント(Web SPA/TS) + API(NestJS/TS, コンテナデプロイ) + shared-types（zod等での型・バリデーション共有）
  - `my-switch-bot-edge`: ラズパイ側(Go, systemd常駐) ※Ver2.0以降で着手。Ver1.0では実装せず、本ADRに構想のみ残す
- **理由**:
  - モノレポの主目的である型・バリデーション共有の恩恵はクライアント⇔API間（共にTS）にしかなく、Go側は言語・ランタイムが異なるため共有の余地がない
  - 言語・ビルドツール・デプロイ先（コンテナ vs 自宅ラズパイ）が全く異なるGoを無理にTSリポジトリへ同居させると、CI/CD設定が複雑になる可能性がある
  - フル分割（3リポジトリ）にすると型共有のメリット自体を放棄することになり、当初の技術選定意図（3.2節）と矛盾する

### 3.7 動作結果のスマホ側への返却方法（決定）
- **採用**: ステータスストア＋スマホ側ポーリング方式
- **仕組み**:
  1. スマホがサーボ駆動指示を送信する際、リクエストIDを発行し、ステータスストア（Azure Table Storage）に`pending`として登録
  2. Queue経由でラズパイに指示が渡り、サーボ駆動完了後、ラズパイがリクエストIDを使ってNestJS API経由でステータスを`done`（または`failed`）に更新
  3. スマホは指示送信後、数秒おき（1〜2秒間隔を想定）にNestJS APIへリクエストIDでステータスを問い合わせ、`done`になったら完了表示。一定回数で打ち切り
- **理由**:
  - ラズパイはインターネットから直接アクセスできない（固定グローバルIPなし）ため、ラズパイ→スマホの通信は必ずAzure経由になる
  - Expo Push NotificationsやAzure SignalR Serviceによるリアルタイムプッシュも検討したが、実装・運用コストが増える割に、今回の「サーボ駆動完了を数秒後に確認できれば十分」という要件には見合わずオーバースペックと判断
  - シンプルな実装・低コストで要件を満たせる
- **永続化先（決定）**: Azure Table Storage
  - `PartitionKey`/`RowKey`によるキー・バリュー型ストアで、`requestId`をRowKeyにすればpending登録・完了更新・ポーリング取得という単純なread/write/updateパターンに合致
  - Queue Storageと同一Storage Account内に同居でき、リソース管理がシンプル
  - 従量課金でごく低コスト。NestJS APIからは`@azure/data-tables`SDKで容易に読み書き可能
  - 複雑な検索・集計・トランザクション跨ぎの整合性を要さない今回の要件には十分と判断し、Cosmos DBやAzure SQL Databaseは見送り

### 3.8 Queueメッセージのスキーマ設計（決定）
- **前提**: Azure Queue Storageの1メッセージは中身が構造を持たないただの文字列（最大64KB）。JSON形式にするかどうかはQueue側の制約ではなく、送信側(NestJS API/TypeScript)と受信側(ラズパイ/Go)が合意する契約に過ぎない
- **スキーマ案**:
  ```json
  {
    "requestId": "uuid-v4形式の文字列",
    "action": "press",
    "issuedAt": "2026-07-21T21:53:00Z"
  }
  ```
  - `requestId`: ステータスストア（3.7節）と紐づけるための一意なID。スマホ側で発行しAPI経由でそのままQueueメッセージにも含める
  - `action`: 将来「長押し」「連続押し」等のバリエーション拡張を見越し固定値でなく文字列にする（現状は`"press"`のみ）
  - `issuedAt`: 発行時刻。ラズパイ側で古すぎるメッセージを無視するタイムアウト判定に使える
- **複数デバイス対応の方針**: Azure Queue Storageにはトピック/フィルタ購読機能がなく、「同一Queueに貯めて自分宛てだけ選択消費」は可視性タイムアウトの再Enqueueが必要になり順序崩れ・遅延の原因になるため不向き。将来デバイスが増えた場合は**デバイスごとにQueueを分ける**方針とし、メッセージスキーマに`deviceId`は含めない（Queue自体がデバイスを表すため冗長）。実際のQueue分割設計は複数デバイスが必要になった時点で検討する

### 3.9 サーバーサイド(NestJS)のアーキテクチャ（決定・Ver1.0実装完了時点で更新）
- **採用**: オニオンアーキテクチャ
  - Domain: `SwitchRequest`/`User`/`Application`をドメインモデルとし、`Uuid`/`EmailAddress`を値オブジェクト(VO)として導入（コンストラクタで形式検証することで、Table StorageのOData filterに渡す前段で不正な文字列を型レベルで排除し、injectionを防止）
  - Application: ユースケースを実装（詳細は後述）
  - Infrastructure: Table Storage/Queue Storageへのアクセス実装（Domain/Applicationが定義するリポジトリ等のインターフェースを実装）
  - Presentation: NestJSのController（Azure Functions HTTPトリガーから移行）、および認証ガード（`EntraIdAuthGuard`でJWT検証・`RegisteredUserGuard`でTable Storage上のUser allowlistと照合、`EdgeClientAuthGuard`でエッジ(ラズパイ)からのクライアントクレデンシャルトークンを検証・`RegisteredApplicationGuard`でTable Storage上のApplication allowlistと照合。いずれも「トークン検証してRequestに情報を載せるだけのGuard」と「allowlist照合を行うGuard」を分離する設計で統一）
- **DIの実装（Phase 2完了時点で追記）**: リポジトリ実装・Queue送信実装のDI登録を`repository.provider.ts`/`queue.provider.ts`に集約し、Symbolトークンで疎結合に解決する構成とした（当初のADR記載になかった実装上の工夫）
- **エンドポイント**:
  - `POST /api/switch/press`: requestId(uuid)発行 → ステータスストアに`pending`登録 → Queueへメッセージ投入 → requestIdを返す（実行者を示す`executorId`もあわせて記録）
  - `GET /api/switch/status/{requestId}`: ステータスストアから状態と`executorId`を取得して返す
  - `PATCH /api/edge/switch/{requestId}/status`: エッジ(ラズパイ)からの実行結果コールバック（`done`/`failed`）を受け取り、ステータスストアを更新する。`EdgeClientAuthGuard`＋`RegisteredApplicationGuard`で保護し、家族の委任トークン(`EntraIdAuthGuard`＋`RegisteredUserGuard`)とは異なるクライアントクレデンシャルトークンで認証する
- **Applicationレイヤーの実装パターン**: Mediator + CQRS
  - 使用ライブラリ: [`mediatr-ts`](https://github.com/m4ss1m0g/mediatr-ts)（.NETの`MediatR`のTypeScript移植版、MITライセンス）
  - Command（例: `PressSwitchCommand`/`CompleteSwitchRequestCommand`）/Query（例: `GetSwitchStatusQuery`）とそれぞれのHandlerを分離し、`Mediator`経由でPresentation層(NestJS Controller)から呼び出す
  - **理由**: 当初、Azure Functionsで一部ユースケース実装（`mediatr-ts`によるCommand/Query分離）していたものをそのまま移植し、移行コストを抑える。NestJS標準の`@nestjs/cqrs`への置き換えは行わず、既存ロジックをNestJSのModule/Controllerに載せ替えるだけに留める（3.10節参照）。エコシステムとしては、`@nestjs/cqrs`にまとめたほうが良いので、後日折を見て移行する
- **エンティティ設計（ステータスストア: Table Storage）**:

  | 項目 | 値 | 備考 |
  |---|---|---|
  | PartitionKey | `issuedAt`の日付(`yyyy-MM-dd`) | 将来の日付単位でのクエリ・クリーンアップを考慮 |
  | RowKey | `requestId` (uuid v4) | 一意性の担保 |
  | status | `pending` \| `done` \| `failed` | |
  | action | `press`（3.8節のQueueスキーマと同じ） | |
  | executorId | ユーザー(`User`)のUuid | 実行者の記録用（家族間の閲覧制限はなし。誰が実行したかの履歴・監査目的） |
  | issuedAt | ISO8601文字列 | リクエスト発行時刻 |
  | updatedAt | ISO8601文字列 | 最終更新時刻（ラズパイからの更新時に上書き） |

- **登録済み呼び出し元アプリの管理（Applicationsテーブル、エッジAPI追加時に決定）**:
  - `User`（家族）を`Users`テーブルのallowlistで管理するのと同じ発想で、`Application`（エッジデバイス等、クライアントクレデンシャルで認証する非人間の呼び出し元）を`Applications`テーブルのallowlistで管理する
  - `ENTRA_EDGE_CLIENT_ID`のような単一の環境変数でエッジのクライアントIDを固定するのではなく、Table Storageの行として登録することで、再デプロイなしに新しい呼び出し元アプリを追加でき、将来的に複数のエッジデバイス/呼び出し元を登録できる拡張性を確保した
  - スキーマ: `id`(Uuid、レコードの内部ID) / `clientId`(Uuid、Entra IDアプリ登録のApplication (client) ID) / `name`(登録名、例: `edge-raspberrypi`)
  - **Guardの責務分離**（Userの`EntraIdAuthGuard`/`RegisteredUserGuard`と対称的な設計）: `EdgeClientAuthGuard`はトークンの署名・issuer・audienceのみ検証し、`appid`(または`azp`)クレームを`request.application.clientId`としてRequestに載せるだけに留める。allowlist照合（`Applications`テーブル検索・未登録なら403）は別ガードの`RegisteredApplicationGuard`が担当し、ヒットした`Application.id`を`request.application.registeredApplicationId`に格納する。認証(JWT検証)と認可(allowlist照合)の関心を分離することで、それぞれ単体でテストしやすくしている

### 3.9.1 TS関連知識、意思決定に関する備忘
NestJS移植を通じて理解した内容の個人的な整理。設計判断ではなく学習記録として残す。

**NestJSのDI構成（ASP.NET Core経験との対比）**
- `@Module()`/`@Controller()`/`@Injectable()`等のデコレータは「おまじない」ではなく、TypeScriptのデコレータ機能＋`reflect-metadata`でクラスにメタデータを付与しているだけ。`NestFactory.create(AppModule)`実行時にNestがこのメタデータを再帰的に読み取り、依存関係グラフを構築する（C#の`[ApiController]`等の属性をASP.NET Coreがリフレクションで読む仕組みと同型）
- `tsconfig.json`の`emitDecoratorMetadata: true`により、コンストラクタ引数の型情報もメタデータとして埋め込まれ、Nestが注入対象を解決できるようになる
- **Provider自体はDIコンテナ本体ではなく「コンテナに登録される部品（作り方のレシピ）」**。DIコンテナ（IoCコンテナ)はNestランタイムが内部に持つ見えない仕組みで、Moduleごとにスコープが分かれる
- `Controller`はASP.NET Coreの`Controller`クラスとほぼ1:1対応
- Providerのスコープ既定値は`DEFAULT`（シングルトン、C#の`AddSingleton`相当）で、`AddScoped`相当は`Scope.REQUEST`を明示指定した場合のみ
- 他Moduleが提供するProviderを使うには、提供側Moduleの`@Module({ exports: [...] })`に明示する必要がある（`imports`しただけでは見えない、Module境界でカプセル化されている）

### 3.10 API実行基盤・エッジ言語の最終決定（決定）
- **背景**: Ver1.0のスコープを踏まえ、FaaS(Azure Functions)を避けてNestJS等のフレームワーク＋コンテナデプロイにする案と、API/エッジ言語構成の再検討を行った
- **検討の流れ**:
  1. 技術特性を比較: NestJSはDI/モジュール構造によりテスト容易性・保守性に優れ、コンテナデプロイならローカル環境と本番環境の実行方式を統一できる。Goはクラウドネイティブ/マイクロサービス構成との相性が良く単一バイナリで軽量だが、マイクロサービス分割（`device-service`/`automation-service`/`notification-service`等への分割）は工数が大きい
  2. モジュラーモノリスで先にリリースし、後から必要な部分だけ切り出す"Monolith First"戦略や、「TypeScriptモノリス→一部をGoへ切り出す」段階移行構成も検討したが、**開発期限（目安1ヶ月）**を踏まえ、未経験言語(Go)での新規実装は見積もりが甘くなりやすくリスクが高いと判断
  3. 既存`apps/api`は既にTypeScript + `mediatr-ts`（CQRS的な構成）で実装済みのため、ゼロから書き直すより既存ロジックをNestJSの構造に移植する方が圧倒的に速く、期限内に確実に完成させやすい
  4. エッジ(ラズパイ)側もTypeScript(Node.js)への統一を検討したが、Raspberry Pi Zero WHはARMv6アーキテクチャであり、Node.jsは公式にはNode 12以降ARMv6ビルドを提供していないため非公式ビルドへの依存が必要になる。単一バイナリでARMv6を公式ツールチェーンのみでクロスコンパイルでき、メモリ/起動時間の面でもPi Zeroに適したGoを維持する方がリスクが小さいと判断
- **決定**:
  - **Ver1.0（本リポジトリ）はTypeScript(NestJS)一本に絞り、Azure Functions(FaaS)からコンテナデプロイ（Azure Container Apps/Cloud Run/ECS等）へ変更する。エッジ(ラズパイ/Go)の実装はVer1.0のスコープ外とし、本ADRに「今後の展望」として明記するに留める**
  - エッジ(ラズパイ)側の言語は引き続きGoを採用し、Ver2.0で実装に着手する
- **理由（まとめ）**:
  - 開発期限を踏まえ「理想の設計」より「確実に完成して動くこと」を優先すべき
  - 既存TypeScript資産の再利用によりVer1.0の開発スピードを最大化できる
  - エッジ側はNode.jsの公式ARMv6サポート終了というハードウェア制約上のリスクがあり、Goの方が技術的に適している

## 4. 開発の進め方（決定・Ver1.0スコープに合わせて更新）
- **方針**: 本ドキュメントは「最終的に目指す形（ロードマップ）」として保持しつつ、実装は**最小の縦切り(Walking Skeleton)から始め、段階的に機能を足していく**
- **段階イメージ（2026-08-03見直し版、Ver1.0スコープに合わせて更新。実装しながら見直してよい）**:
  1. ✅ **Phase 0（完了）**: サーバーサイドから着手。認証なしのNestJS APIを実装し、REST Client等でAPIを直接叩いて、Queueへのメッセージ挿入とエンティティ永続化（ステータスストア）の動作確認までローカルで行う
  2. ✅ **Phase 1（完了）**: Web SPAクライアントを実装。まだ認証なしでPhase 0のAPIを叩き、一連の動作を確認する
  3. ✅ **Phase 2（完了）**: Entra ID認証(MSAL/@azure/msal-browser)をクライアント・APIに組み込む。あわせてセキュリティレビュー・設計レビューを実施し、値オブジェクト(Uuid/EmailAddress)によるOData injection対策、認証ガードのテスト整備、実行者(executorId)記録などを追加対応済み
  4. ✅ **Phase 3（完了）**: NestJS APIをコンテナ化し、Prod環境を整備してデプロイまで完了させる（Ver1.0完了）。Dockerfile（マルチステージビルド）・docker-compose.yml（Azuriteをローカル開発で検討したが使用しない。サービス本体側のアップデートに追い付かず、SDKの要求するAPIバージョンに対応していないために動作しないケースがあったため）・GitHub Actions CI（build/test）・CD（GHCRへのイメージpush、API＝Azure Container Apps、クライアント＝Azure Storage静的サイトへの実デプロイまで含めて稼働中。クライアントのAzure Static Web Appsへの移行は3.4.2節の通りルーティング導入時まで先送り）まで整備済み。
  5. ⬜ **Phase 4（Ver2.0・別リポジトリ、着手中）**: ラズパイ側(Go)を実装。Queueポーリング・サーボ駆動、ラズパイ→Queue、WebAPIの認証、物理的な環境の調整