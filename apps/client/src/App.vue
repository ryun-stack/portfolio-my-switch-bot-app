<script setup lang="ts">
import { computed, ref } from "vue";
import type { SwitchRequestStatus } from "@my-switch-bot-app/shared-types";
import { pressSwitch, getSwitchStatus } from "./api/switchApi";
import { useAuth } from "./auth/useAuth";

const { account, isAuthenticated, login, logout } = useAuth();

// ADR.md 3.7: poll every 1-2s, give up after a fixed number of attempts.
// The exact cutoff is still an open item (ADR.md 4章); 20 tries (~30s) is a
// placeholder for Phase 1 local verification.
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 20;

type UiState = "idle" | "pressing" | "polling" | "done" | "failed" | "timeout" | "error";

const uiState = ref<UiState>("idle");
const requestId = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const statusLabel: Record<UiState, string> = {
  idle: "待機中",
  pressing: "送信中...",
  polling: "実行待ち...",
  done: "完了しました",
  failed: "失敗しました",
  timeout: "タイムアウトしました（応答を確認できませんでした）",
  error: "エラーが発生しました",
};

const statusBadgeClass: Record<UiState, string> = {
  idle: "text-bg-secondary",
  pressing: "text-bg-primary",
  polling: "text-bg-primary",
  done: "text-bg-success",
  failed: "text-bg-danger",
  timeout: "text-bg-warning",
  error: "text-bg-danger",
};

const isBusy = computed(() => uiState.value === "pressing" || uiState.value === "polling");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function onPressClick() {
  errorMessage.value = null;
  requestId.value = null;
  uiState.value = "pressing";

  try {
    const { requestId: id } = await pressSwitch();
    requestId.value = id;
    uiState.value = "polling";
    await pollUntilSettled(id);
  } catch (e) {
    uiState.value = "error";
    errorMessage.value = e instanceof Error ? e.message : String(e);
  }
}

async function pollUntilSettled(id: string) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const result = await getSwitchStatus(id);
    const status: SwitchRequestStatus = result.status;

    if (status === "done") {
      uiState.value = "done";
      return;
    }
    if (status === "failed") {
      uiState.value = "failed";
      return;
    }
    // status === "pending" -> keep polling
  }

  uiState.value = "timeout";
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container" style="max-width: 480px">
      <div class="card shadow-sm">
        <div class="card-body text-center p-4">
          <h1 class="h3 card-title mb-4">スイッチボット</h1>

          <template v-if="!isAuthenticated">
            <p class="text-muted mb-3">利用するにはサインインしてください。</p>
            <button class="btn btn-outline-primary" @click="login">サインイン</button>
          </template>

          <template v-else>
            <p class="text-muted small mb-3">
              {{ account?.username }} でサインイン中
              <button class="btn btn-link btn-sm p-0 ms-2" @click="logout">サインアウト</button>
            </p>

            <button
              class="btn btn-primary btn-lg px-5 mb-3"
              :disabled="isBusy"
              @click="onPressClick"
            >
              <span
                v-if="isBusy"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              スイッチを押す
            </button>

            <div>
              <span class="badge rounded-pill" :class="statusBadgeClass[uiState]">
                {{ statusLabel[uiState] }}
              </span>
            </div>

            <p v-if="requestId" class="text-muted small mt-3 mb-0">
              requestId: {{ requestId }}
            </p>
            <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="alert">
              {{ errorMessage }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
