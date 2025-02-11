import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { init, createDojoStore } from "@dojoengine/sdk";
import { SchemaType, schema } from "./dojo/bindings.ts";
import { dojoConfig } from "./dojo/dojoConfig.ts";
import { DojoContextProvider } from "./dojo/DojoContext.tsx";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { RpcProvider } from "starknet";
import cartridgeConnector from "./config/cartridgeConnector.tsx";
import { GlobalProvider } from "./hooks/appContext.tsx";

// Import components to use in the routes
import NewCover from "./components/NewCover/index.tsx";
import Tamagotchi from "./components/Tamagotchi/index.tsx";
import Bag from "./components/Bag/index.tsx";
import Chat from "./components/Chat/index.tsx";
import Dex from "./components/Dex/Grid.tsx";

// Import the layout component
import AppLayout from "./components/Layouts/AppLayout.tsx";

import "./index.css";

function provider() {
  return new RpcProvider({
    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}

export const useDojoStore = createDojoStore<SchemaType>();

async function main() {
  const sdk = await init<SchemaType>(
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
            <GlobalProvider>
              <Router>
                <Routes>
                  {/* Cover route without header*/}
                  <Route path="/" element={<NewCover sdk={sdk} />} />
                  {/* Internal routes using layout for header */}
                  <Route element={<AppLayout />}>
                    <Route path="/bag" element={<Bag sdk={sdk} />} />
                    <Route path="/dex" element={<Dex />} />
                    <Route path="/play/:beastId" element={<Tamagotchi sdk={sdk} />} />
                    <Route path="/chat" element={<Chat />} />
                  </Route>
                </Routes>
              </Router>
            </GlobalProvider>
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
