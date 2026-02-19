/**
 * Cloudflare Turnstile — global type augmentation.
 *
 * Shared across all components that use the Turnstile CAPTCHA widget.
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          execution?: "render" | "execute";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          size?: "normal" | "compact" | "invisible";
          theme?: "light" | "dark" | "auto";
          action?: string;
        }
      ) => string;
      execute: (widgetIdOrContainer?: string | HTMLElement) => void;
      reset: (widgetIdOrContainer?: string | HTMLElement) => void;
      remove: (widgetIdOrContainer?: string | HTMLElement) => void;
      getResponse: (widgetIdOrContainer?: string | HTMLElement) => string | undefined;
    };
  }
}

export {};

