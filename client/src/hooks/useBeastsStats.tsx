import { useEffect, useMemo, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Models, SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";
import useModel from "../dojo/useModel.tsx";

export const useBeastsStats = (sdk: SDK<SchemaType>, beastId: number) => {
  const { account } = useAccount();
  const state = useDojoStore((state) => state);

  const entityId = useMemo(
    () => account?.address ? getEntityIdFromKeys([BigInt(account.address)]) : null,
    [account?.address]
  );

  const beastStatsData = useModel(entityId ?? "", Models.BeastStats);
  const [beastStats, setBeastStats] = useState(beastStatsData);

  const [beastsStats, setBeastsStats] = useState<any>([]);

  useEffect(() => {
    setBeastStats(beastStatsData);
  }, [beastStatsData]);

  useEffect(() => {
    if (!account) return;
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            BeastStats: {
              $: {
                where: {
                  beast_id: {
                    $is: beastId,
                  },
                },
              },
            },
          },
        },
        (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            state.updateEntity(response.data[0]);
          }
        },
        { logging: true }
      );

      unsubscribe = () => subscription.cancel();
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account]);

  useEffect(() => {
    if (!account) return;
    const fetchEntities = async () => {
      try {
        await sdk.getEntities(
          {
            babybeasts: {
              BeastStats: {
                $: {
                  where: {},
                },
              },
            },
          },
          (resp) => {
            if (resp.error) {
              console.error("resp.error.message:", resp.error.message);
              return;
            }
            if (resp.data) {
              const beastsStatsData = resp.data.map((entity) => entity.models.babybeasts.BeastStats);
              setBeastsStats(beastsStatsData);
              state.setEntities(resp.data);
            }
          }
        );
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account]);

  return {
    beastStats,
    beastsStats,
  };
};
