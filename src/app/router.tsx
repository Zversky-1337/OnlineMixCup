import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { LoginPage } from "../pages/LoginPage.tsx";
import { App } from "./App.tsx";
import { TournamentPage } from "../pages/TournamentPage.tsx";
import { Lobby } from "../features/Lobby";
import { Header } from "./Header.tsx";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        loader: () => {
          return redirect("/tournament");
        },
      },
      {
        element: (
          <div>
            <Header />
            <Outlet />
          </div>
        ),
        loader: () => {
          if (!appSessionStore.getSessionToken()) {
            return redirect("/login");
          }
          return null;
        },
        children: [
          { path: "/tournament", element: <TournamentPage /> },
          { path: "/lobbies", element: <Lobby /> },
        ],
      },
      {
        loader: () => {
          if (appSessionStore.getSessionToken()) {
            return redirect("/tournament");
          }
          return null;
        },
        children: [{ path: "/login", element: <LoginPage /> }],
      },
    ],
  },
]);

appSessionStore.updateSessionSteam.listen((event) => {
  if (event.type === "remove") {
    router.navigate("/login");
  }
});
