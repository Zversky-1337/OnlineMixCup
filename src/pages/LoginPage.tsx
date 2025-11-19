import clsx from "clsx";
import type { FC } from "react";
import { useEffect } from "react";
import { appSessionStore } from "../shared/session.ts";
import { useNavigate } from "react-router-dom";
import { loginByTelegram, type TelegramUser } from "../shared/api/auth.ts";
import { Card } from "@mantine/core";

type LoginPageProps = {
  className?: string;
};

export const LoginPage: FC<LoginPageProps> = ({ className }) => {
  const navigate = useNavigate();

  appSessionStore.updateSessionSteam.useEvent(() => {
    if (event?.type === "update") {
      navigate("/tournament");
    }
  });

  const botName = import.meta.env.VITE_TELEGRAM_BOT_NAME as string | undefined;

  useEffect(() => {
    if (!botName) {
      return;
    }

    window.TelegramOnAuthCb = async (user: TelegramUser) => {
      try {
        await loginByTelegram(user);
        navigate("/tournament");
      } catch (e) {
        console.error("Telegram login failed", e);
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramOnAuthCb(user)");
    script.setAttribute("data-lang", "ru");

    script.onload = () => console.log("[TG] widget script loaded");
    script.onerror = (e) => console.error("[TG] widget script error", e);

    const container = document.getElementById("tg-login-container");
    container?.appendChild(script);

    return () => {
      console.log("[TG] cleanup");
      window.TelegramOnAuthCb = undefined;
      script.remove();
    };
  }, [botName]);

  return (
    <div className={clsx("flex justify-center items-center mt-20", className)}>
      <Card>
        <p className="text-xl mb-4 text-center block">Войдите в аккаунт</p>
        <div id="tg-login-container" />
        <button type="button"></button>
      </Card>
    </div>
  );
};
