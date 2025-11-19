import { appSessionStore } from "../session";
import { authorizedApiClient, publicApiClient } from "./client";

export const logout = async () => {
  const response = await authorizedApiClient.post<{ token: string }>(
    "/auth/logout",
  );
  appSessionStore.removeSession();

  return response;
};

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export const loginByTelegram = async (user: TelegramUser) => {
  // The backend should verify the hash according to Telegram docs and return a JWT token.
  const response = await publicApiClient.post<{ accessToken: string }>(
    "/auth/telegram/login",
    user,
  );

  if (response.data.accessToken) {
    appSessionStore.setSessionToken(response.data.accessToken);
  }

  return response;
};
