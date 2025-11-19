import type { TelegramUser } from "./shared/api/auth";

declare global {
  interface Window {
    TelegramOnAuthCb?: (user: TelegramUser) => Promise<void>;
  }
}

export {};
