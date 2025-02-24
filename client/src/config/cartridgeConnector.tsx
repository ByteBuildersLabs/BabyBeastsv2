import { Connector } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import {
  ControllerOptions,
  SessionPolicies,
} from "@cartridge/controller";
import { constants } from "starknet";

const CONTRACT_ADDRESS = '0x7c0dd42dd8e7e948453bb8540977f1da32963be8f7c03962cdb2838a52263da'

const policies: SessionPolicies = {
  contracts: {
    [CONTRACT_ADDRESS]: {
      methods: [
        {
          name: "spawn_player",
          entrypoint: "spawn_player"
        },
        {
          name: "set_current_beast",
          entrypoint: "set_current_beast"
        },
        {
          name: "add_initial_food",
          entrypoint: "add_initial_food"
        },
        {
          name: "spawn",
          entrypoint: "spawn"
        },
        {
          name: "decrease_status",
          entrypoint: "decrease_status"
        },
        {
          name: "feed",
          entrypoint: "feed"
        },
        {
          name: "sleep",
          entrypoint: "sleep"
        },
        {
          name: "awake",
          entrypoint: "awake"
        },
        {
          name: "play",
          entrypoint: "play"
        },
        {
          name: "pet",
          entrypoint: "pet"
        },
        {
          name: "clean",
          entrypoint: "clean"
        },
        {
          name: "revive",
          entrypoint: "revive"
        },
        {
          name: "init_tap_counter",
          entrypoint: "init_tap_counter"
        },
        {
          name: "tap",
          entrypoint: "tap"
        }
      ],
    },
  },
}

const options: ControllerOptions = {
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
    },
    {
      rpcUrl: "https://api.cartridge.gg/x/ttttt/katana",
    }
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  policies,
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;