import ControllerConnector from "@cartridge/connector";
import { Policy } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: Policy[] = [
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "spawn",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "decrease_stats",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "feed",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "sleep",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "awake",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "play",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "clean",
  },
  {
    target: '0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99',
    method: "revive",
  },
]

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: "https://api.cartridge.gg/x/babyb/katana",
}) as never as Connector;

export default cartridgeConnector;
