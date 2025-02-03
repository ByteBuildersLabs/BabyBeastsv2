import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { init, createDojoStore } from "@dojoengine/sdk";
import { Schema, schema } from "./dojo/bindings.ts";
import { dojoConfig } from "./dojo/dojoConfig.ts";
import { DojoContextProvider } from "./dojo/DojoContext.tsx";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { RpcProvider } from "starknet";
import cartridgeConnector from "./config/cartridgeConnector.tsx";

// Componentes
// Nota: Se usa NewCover como portada sin header
import NewCover from "./components/NewCover/index.tsx";
import Tamagotchi from "./components/Tamagotchi/index.tsx";
import Bag from "./components/Bag/index.tsx";
import Chat from "./components/Chat/index.tsx";
// Importamos el layout que incluye el header
import AppLayout from "./components/Layouts/AppLayout.tsx";

import "./index.css";

function provider() {
  return new RpcProvider({
    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}

export const useDojoStore = createDojoStore<Schema>();

async function main() {
  const sdk = await init<Schema>(
    {
      client: {
        rpcUrl: dojoConfig.rpcUrl,
        toriiUrl: dojoConfig.toriiUrl,
        relayUrl: dojoConfig.relayUrl,
        worldAddress: dojoConfig.manifest.world.address,
      },
      domain: {
        name: "WORLD_NAME",
        version: "1.0",
        chainId: "KATANA",
        revision: "1",
      },
    },
    schema
  );

  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.render(
      <StrictMode>
        <DojoContextProvider>
          <StarknetConfig
            autoConnect
            chains={[sepolia]}
            connectors={[cartridgeConnector]}
            explorer={starkscan}
            provider={provider}
          >
            <Router>
              <Routes>
                {/* Ruta de portada: no incluye header */}
                <Route path="/" element={<NewCover />} />
                
                {/* Rutas internas que usan el layout con header */}
                <Route element={<AppLayout />}>
                  <Route path="/bag" element={<Bag sdk={sdk} />} />
                  <Route path="/play/:beastId" element={<Tamagotchi sdk={sdk} />} />
                  <Route path="/chat" element={<Chat />} />
                </Route>
              </Routes>
            </Router>
          </StarknetConfig>
        </DojoContextProvider>
      </StrictMode>,
      rootElement
    );
  }
}

main().catch((error) => {
  console.error("Hello: Falló la inicialización de la aplicación:", error);
});
