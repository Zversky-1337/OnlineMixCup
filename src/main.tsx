import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom"; //import MRT styles
import { router } from "./app/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
