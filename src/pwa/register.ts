export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.info("Service worker registrado"))
        .catch((error) => console.error("Error al registrar el service worker", error));
    });
  }
}
