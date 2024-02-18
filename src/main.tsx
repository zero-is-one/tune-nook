import { AtomStoreProvider } from "@/components/AtomStoreProvider/AtomStoreProvider";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <AtomStoreProvider>
        <RouterProvider router={router} />
      </AtomStoreProvider>
    </MantineProvider>
  </React.StrictMode>,
);
