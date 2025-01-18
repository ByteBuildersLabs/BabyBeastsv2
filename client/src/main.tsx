import { StrictMode } from "react";
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { init, createDojoStore } from "@dojoengine/sdk";
import { Schema, schema } from "./dojo/bindings.ts";
import { dojoConfig } from "./dojo/dojoConfig.ts";
import { DojoContextProvider } from "./dojo/DojoContext.tsx";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { RpcProvider } from "starknet";
import cartridgeConnector from "./config/cartridgeConnector.tsx";
import Cover from "./components/Cover/index.tsx";
import Tamagotchi from "./components/Tamagotchi/index.tsx";
import Header from "./components/Header/index.tsx";
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
        <DojoContextProvider
        // burnerManager={await setupBurnerManager(dojoConfig)}
        >
          <StarknetConfig
            autoConnect
            chains={[sepolia]}
            connectors={[cartridgeConnector]}
            explorer={starkscan}
            provider={provider}
          >
            <Router>
            <Header sdk={sdk} />
              <Routes>
                <Route path='/' element={<Cover />}/>
                <Route path='/play' element={<Tamagotchi sdk={sdk} />} />
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
  console.error("Helloo Failed to initialize the application:", error);
});
