import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.vue";
import { initializeAuth } from "./auth/useAuth";

// Must resolve before mounting: it processes the redirect response coming
// back from Entra ID after loginRedirect()/acquireTokenRedirect() (ADR.md
// 3.3/3.5, Phase 2).
initializeAuth().then(() => {
  createApp(App).mount("#app");
});
