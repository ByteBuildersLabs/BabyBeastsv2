import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface } from "starknet";

export type IClient = Awaited<ReturnType<typeof client>>;

export function client(provider: DojoProvider) {
  const actions_spawn = async (
    snAccount: Account | AccountInterface,
    specie: number,
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "spawn",
          calldata: [specie],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_decreaseStats = async (
    snAccount: Account | AccountInterface,
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "decrease_stats",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_feed = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "feed",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_sleep = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "sleep",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_awake = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "awake",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_play = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "play",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_clean = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "clean",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const actions_revive = async (snAccount: Account | AccountInterface) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "actions",
          entrypoint: "revive",
          calldata: [],
        },
        "babybeasts",
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    actions: {
      spawn: actions_spawn,
      decreaseStats: actions_decreaseStats,
      feed: actions_feed,
      sleep: actions_sleep,
      awake: actions_awake,
      play: actions_play,
      clean: actions_clean,
      revive: actions_revive,
    },
  };
}
