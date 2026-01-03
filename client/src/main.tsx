import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/config";

// Dev-only: avoid Windows localhost (IPv6) resolution issues that can cause
// intermittent ERR_CONNECTION_REFUSED when the backend is bound on IPv4.
if (import.meta.env.DEV && window.location.hostname === "localhost") {
	const port = window.location.port;
	const nextUrl = `${window.location.protocol}//127.0.0.1${port ? `:${port}` : ""}${window.location.pathname}${window.location.search}${window.location.hash}`;
	window.location.replace(nextUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
