import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import App from "./App";
import "./index.css";
import "@mantine/core/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
