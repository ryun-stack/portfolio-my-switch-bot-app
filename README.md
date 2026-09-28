# 自作スイッチボット (my-switch-bot-app)

- **家族限定・自宅の物理スイッチをスマホからリモート操作するWebアプリ**
- Entra ID認証で家族だけがサインインでき、リクエストはAzure Queue/Table Storage経由でラズパイのサーボモーターへ指示を伝える設計です。
  - ラズパイ側の実装は別リポジトリにて開発中

---

## 概要 (Overview)

### 解決したい課題
- 自宅の物理スイッチ（家電のボタンなど）を、外出先や別室からでもスマホで押したい
  - ラズパイ側にポート開放や固定グローバルIPを用意せず、セキュアに家庭内デバイスへ指示を届けたい
  - 家族（Microsoftアカウントを持たずGoogleアカウントのみの人を含む）だけに限定してログインさせたい。ストア審査や証明書更新など個人開発のスコープに見合わない運用負荷は避けたい


> 他、オニオンアーキテクチャなどを用いてクリーンな設計を目指す、あるいは普段触らない技術スタックを扱う練習台も兼ねているため
> 機能に対してオーバーエンジニアリング気味かもしれない。

### 現在の実装状況 (Current Status)
- ✅ 実装済み: Entra ID認証（家族限定ログイン）、Web UI（Vue）、API（NestJS・オニオンアーキテクチャ）、Queue/Table Storage連携、単体テスト、CI/CD（GHCRへのイメージpush）
- 🚧 開発中（Ver2.0で対応予定）: ラズパイ側でのQueueメッセージ受信・サーボモーター制御（Go実装）。

---

## 技術スタック (Tech Stack)

| カテゴリ | 技術要素 | 選定理由・補足 |
| :--- | :--- | :--- |
| **Frontend** | TypeScript, Vue.js 3 (Composition API), Vite | Reactに比べ、実務で扱っているBlazor WASMとメンタルモデルが近いため、スイッチングコストを最小化しつつ、API(TS)との型・バリデーション共有を維持するため採用（ADR.md 3.4.1）。 |
| **Backend** | TypeScript, NestJS, `mediatr-ts` (CQRS/Mediatorパターン) | ユースケース的にはFaaSで十分だったが、フレームワークへの理解を深めたいということでTSで主流なものを採用。Mediatorパターンは`Fat Controller`を防止するために導入 |
| **Auth** | Microsoft Entra ID, `@azure/msal-browser`, `jsonwebtoken` / `jwks-rsa` | B2Bゲスト招待で家族限定ログインを実現。APIはJWKS経由でトークン署名を検証（ADR.md 3.3/3.5） |
| **Storage** | Azure Queue Storage, Azure Table Storage | シンプルなFIFOキューとキー・バリュー型ステータスストアで要件を満たすシンプルな構成。価格も抑えられる（ADR.md 3.1/3.7/3.8） |
| **Infrastructure** | Azure Container Apps (API), Azure Storage静的サイト (クライアント、暫定運用) | 無料枠が手厚い。フロント/API間のデプロイ単位を分離。クライアントはルーティング導入時にAzure Static Web Appsへ移行予定（ADR.md 3.4.2） |
| **Edge (Ver2.0以降)** | Go, Raspberry Pi Zero WH, systemd | SSH等でメンテナンスが必要になるエッジデバイスにおいて、単一バイナリで可搬性が高い。ARMv6を公式ツールチェーンのみでクロスコンパイル可能。非力なCPU/メモリでも軽量動作（ADR.md 3.2/3.10） |
| **Monorepo** | npm workspaces (`apps/*`, `packages/*`) | クライアント⇔API間の型・バリデーション共有（`packages/shared-types`）を単一リポジトリで実現（ADR.md 3.6） |

---

## システム構成・アーキテクチャ (Architecture)

### 1. インフラ・全体構成図
`Architecture.drawio`（1ページ目「1. 全体アーキテクチャ」）を参照。

### 2. アプリケーション内部構造（レイヤー依存関係）
`Architecture.drawio`（2ページ目「2. オニオンアーキテクチャ」）を参照。NestJS API (`apps/api/src`) はオニオンアーキテクチャを採用。

### 3. ディレクトリ構造（主要部分）

<details>
<summary>📁 ディレクトリ詳細を表示する</summary>

```text
apps/
├── api/src/                      # NestJS API（オニオンアーキテクチャ）
│   ├── domain/                   # ビジネスロジック・エンティティ（外部非依存）
│   │   ├── SwitchRequest/        # SwitchRequestエンティティ
│   │   ├── User/                 # Userエンティティ・EmailAddress(VO)
│   │   ├── shared/                # Uuid(VO)など共通の値オブジェクト
│   │   └── repositories/         # リポジトリのインターフェース定義
│   ├── application/              # アプリケーション固有のユースケース処理
│   │   ├── commands/              # PressSwitchCommand + Handler
│   │   ├── queries/                # GetSwitchStatusQuery + Handler
│   │   ├── mappers/                # Domain → Queueメッセージ変換
│   │   └── ports/                  # SwitchQueueSender等のポート定義
│   ├── infrastructure/            # 外部依存（Azure Storage実装）
│   │   ├── repositories/          # TableStorageSwitchRequestRepository等
│   │   └── portsimpl/              # QueueStorageSender等のポート実装
│   ├── presentation/               # コントローラー・認証ガード・DI合成
│   │   ├── auth/                    # EntraIdAuthGuard, RegisteredUserGuard
│   │   └── switch/                  # SwitchController
│   └── common/                      # repository/queue/mediator の DI Provider
└── client/src/                    # Vue.js 3 SPA
    ├── api/                       # switchApi.ts (fetchラッパー)
    └── auth/                      # MSALラッパー(Composition API)

packages/
└── shared-types/                  # クライアント/API間で共有するzodスキーマ
```
</details>

---

## 設計思想・技術的こだわり (Design Philosophy & Trade-offs)

### 1. オニオンアーキテクチャ / DDD概念の採用理由
* **関心の分離 (Separation of Concerns)**: Domain層はNestJSやAzure SDKに一切依存させず、`Uuid`/`EmailAddress`といった値オブジェクトとエンティティのみで構成。Infrastructure層の実装（Table/Queue Storage）はDomain/Applicationが定義したインターフェース（ポート）を実装する形にとどめている
* **テスト容易性 (Testability)**: Domain層・Application層のHandlerは外部依存を持たないため、モックを利用した単体テストが可能（`apps/api`は9スイート・53テストが全てグリーン）
* **DIの集約(Composition Root)**: `repository.provider.ts` / `queue.provider.ts` / `mediator.provider.ts` にSymbolトークンベースのDI登録を集約し、Controller/Handlerが具象実装を意識しない構成にした


### 2. 堅牢性・セキュリティへの考慮
* **認証の多層防御**: `EntraIdAuthGuard`（JWT署名/iss/aud検証）→ `RegisteredUserGuard`（Table StorageのUserとの照合）の2段ガード構成。EntraIDによるアクセストークン＋その主体がホワイトリスト内のアドレスであることを確認する形。
* **実行者(executorId)の記録**: `SwitchRequest`に`executorId`を持たせ、誰がリクエストを実行したかを記録。家族間での閲覧制限は設けない（共有前提）が、履歴としては残す

---

## 品質・テスト戦略 (Quality & Testing)

* **テスト方針**: Domain層（`Uuid`/`EmailAddress`/`User`/`SwitchRequest`）とApplication層（Command/QueryのHandler）、Presentation層の認証ガード（`EntraIdAuthGuard`/`RegisteredUserGuard`）を中心に単体テストでカバー

```bash
# テストの実行方法
$ npm run test -w apps/api
$ npm run test -w packages/shared-types

# ビルド
$ npm run build
```

---

## ローカル実行手順 (How to Run)

### 前提条件 (Prerequisites)
* Node.js 20+
* Azure Storage Account(Queue+Table)
* Microsoft Entra IDのアプリ登録（クライアント用SPA・API用、それぞれのdev環境）

### 起動手順
```bash
# 1. リポジトリのクローン
$ git clone https://github.com/ryun-stack/my-switch-bot-app.git
$ cd my-switch-bot-app

# 2. 依存関係のインストール（npm workspaces）
$ npm install

# 3. 環境変数の設定
$ cp apps/api/.env.example apps/api/.env
$ cp apps/client/.env.example apps/client/.env
# それぞれEntra ID関連の値（TENANT_ID/CLIENT_ID/API_AUDIENCE等）を埋める

# 4. APIの起動
$ npm run start:dev -w apps/api

# 5. クライアントの起動（別ターミナル）
$ npm run dev -w apps/client

# 6. アクセス確認
# ブラウザで http://localhost:5173 にアクセスし、Entra IDでログイン
```

### Dockerでの起動（APIサーバ）
API側（NestJS）はDockerコンテナとしても起動できます。ローカルNode環境を汚さずに動作確認したい場合や、本番相当のコンテナイメージを事前に検証したい場合に利用してください（Phase 3、`apps/api/Dockerfile`/`docker-compose.yml`）。

```bash
# 1. 環境変数の設定（前述のローカル実行手順と同じファイルを共用）
$ cp apps/api/.env.example apps/api/.env
# ENTRA_TENANT_ID/ENTRA_API_AUDIENCEなどを埋める

# 2. ビルド＆起動（APIのコンテナ）
$ docker compose up --build

# 3. 動作確認
# APIログに "Nest application successfully started" が出ることを確認
# 別途クライアント（npm run dev -w apps/client）や curl等でAPIに疎通できるか確認

$ docker compose down
```

* API単体イメージのみビルドしたい場合: `docker build -f apps/api/Dockerfile -t my-switch-bot-app-api .`（ビルドコンテキストはリポジトリルート必須）
* コンテナ内プロセスへのデバッガアタッチは `.vscode/launch.json` の `Attach to api (Docker)` 構成を使用（`docker compose up`実行中に有効）
* CI/CD（`.github/workflows/ci.yml`/`cd.yml`）はビルド・テスト・GHCRへのイメージpushに加え、API（Azure Container Apps）・クライアント（Azure Storage静的サイト）への実デプロイまで自動化済み（ADR.md 4章）

---

## ライセンス / 作者 (License & Author)

* Author: ryun-stack
* GitHub: [@ryun-stack](https://github.com/ryun-stack)