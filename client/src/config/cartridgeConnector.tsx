import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: SessionPolicies = {
  contracts: {
    ["0x580018d0619d59b00c9248951007655dd1172f9151670f35c79369eb19a0e9f"]: {
      methods: [
        {
          name: "spawn",
          entrypoint: "spawn",
        },
        {
          name: "decrease_stats",
          entrypoint: "decrease_stats",
        },
        {
          name: "feed",
          entrypoint: "feed",
        },
        {
          name: "sleep",
          entrypoint: "sleep",
        },
        {
          name: "awake",
          entrypoint: "awake",
        },
        {
          name: "play",
          entrypoint: "play",
        },
        {
          name: "clean",
          entrypoint: "clean",
        },
        {
          name: "revive",
          entrypoint: "revive",
        },
      ],
    },
  },
};

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: "https://api.cartridge.gg/x/bbslot/katana",
}) as never as Connector;

export default cartridgeConnector;
