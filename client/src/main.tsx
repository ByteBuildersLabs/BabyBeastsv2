// React imports
import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { GlobalProvider } from "./hooks/appContext.tsx";
import { MusicProvider } from "./context/contextMusic.tsx";

// Dojo imports
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import type { SchemaType } from "./dojo/bindings.ts";
import { setupWorld } from "./dojo/contracts.gen.ts";
import { dojoConfig } from "./dojo/dojoConfig.ts";
import StarknetProvider from "./dojo/starknet-provider.tsx";

// PostHog imports
import { PostHogProvider } from 'posthog-js/react';
import { posthogInstance } from './utils/posthogConfig';

// Import the layout component
import Main from "./components/Main/index.tsx";
import "./index.css";

async function main() {
  const sdk = await init<SchemaType>({
    client: {
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
  });

  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.render(
      <StrictMode>
        <DojoSdkProvider
          sdk={sdk}
          dojoConfig={dojoConfig}
          clientFn={setupWorld}
        >
          <StarknetProvider>
            <GlobalProvider>
              <MusicProvider>
                {posthogInstance.initialized && posthogInstance.client ? (
                  <PostHogProvider client={posthogInstance.client}>
                    <Main />
                  </PostHogProvider>
                ) : (
                  <Main />
                )}
              </MusicProvider>
            </GlobalProvider>
          </StarknetProvider>
        </DojoSdkProvider>
      </StrictMode>,
      rootElement
    );
  }
}

main().catch((error) => {
  console.error("Hello: Falló la inicialización de la aplicación:", error);
});
