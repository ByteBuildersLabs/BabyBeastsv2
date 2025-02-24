import { manifest } from "../config/manifest";
import { createDojoConfig } from "@dojoengine/core";

const {
    VITE_PUBLIC_NODE_URL,
    VITE_PUBLIC_TORII,
    VITE_PUBLIC_MASTER_ADDRESS,
    VITE_PUBLIC_MASTER_PRIVATE_KEY,
  } = import.meta.env;

export const dojoConfig = createDojoConfig({
    manifest,
    masterAddress: VITE_PUBLIC_MASTER_ADDRESS || '0x5b6b8189bb580f0df1e6d6bec509ff0d6c9be7365d10627e0cf222ec1b47a71',
    masterPrivateKey: VITE_PUBLIC_MASTER_PRIVATE_KEY || '0x33003003001800009900180300d206308b0070db00121318d17b5e6262150b',
    rpcUrl: VITE_PUBLIC_NODE_URL || 'https://api.cartridge.gg/x/hhbb/katana',
    toriiUrl: VITE_PUBLIC_TORII || 'https://api.cartridge.gg/x/hhbb/torii',
});
