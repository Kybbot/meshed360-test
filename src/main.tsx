import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

Sentry.init({
	sendDefaultPii: true,
	tracesSampleRate: 1.0,
	tracePropagationTargets: [
		"localhost",
		"https://api.meshed-360.com",
		"https://api-qa.meshed-360.com",
		"https://api-dev.meshed-360.com",
	],
	dsn: import.meta.env.VITE_SENTRY_DSN_FE,
	environment: import.meta.env.VITE_STAGE,
	integrations: [Sentry.browserTracingIntegration()],
	release: `meshed-test-${import.meta.env.VITE_STAGE}`,
});

import "react-day-picker/dist/style.css";
import "./assets/css/index.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
