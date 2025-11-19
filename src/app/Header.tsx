import { useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { logout } from "../shared/api/auth.ts";
import { Button } from "@mantine/core";

export function Header() {
  const navigate = useNavigate();
  const session = appSessionStore.useSession();

  const [isTransitioning, startTransition] = useTransition();

  const handleLogout = () =>
    startTransition(async () => {
      await logout();
      navigate("/login");
    });

  if (!session) return;

  return (
    <header className="bg-gray-700 shadow">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white">
                Mixify
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              {session?.photoUrl && (
                <img
                  src={session.photoUrl}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="avatar"
                />
              )}
              <span className="mr-4">{session.username}</span>
            </div>
            <Button onClick={handleLogout} disabled={isTransitioning}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
