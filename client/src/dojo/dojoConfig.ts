import { createDojoConfig } from "@dojoengine/core";

import manifest from "../dojo/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    masterAddress: '0x5b6b8189bb580f0df1e6d6bec509ff0d6c9be7365d10627e0cf222ec1b47a71',
    masterPrivateKey: '0x33003003001800009900180300d206308b0070db00121318d17b5e6262150b',
    rpcUrl: 'https://api.cartridge.gg/x/babyb/katana',
    toriiUrl: 'https://api.cartridge.gg/x/babyb/torii',
});
