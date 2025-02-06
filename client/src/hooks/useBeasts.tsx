import { useEffect, useMemo, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { addAddressPadding } from "starknet";
import { Models, Schema } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import useModel from "../dojo/useModel.tsx";
import { useDojoStore } from "../main.tsx";

export const useBeast = (sdk: SDK<Schema>) => {
  const { account } = useAccount();
  const state = useDojoStore((state) => state);

  const entityId = useMemo(
    () =>
      account?.address ? getEntityIdFromKeys([BigInt(account.address)]) : null,
    [account?.address],
  );

  const beastData = useModel(entityId ?? "", Models.Beast);
  const [beast, setBeast] = useState(beastData);

  const [beasts, setBeasts] = useState<any>([]);

  useEffect(() => {
    setBeast(beastData);
  }, [beastData]);

  useEffect(() => {
    if (!account) return;
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            Beast: {
              $: {
                where: {
                  player: {
                    $is: addAddressPadding(account.address),
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
        { logging: true },
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
              Beast: {
                $: {
                  where: {
                    player: {
                      $eq: addAddressPadding(account.address),
                    },
                  },
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
              const beastsData = resp.data.map(
                (entity) => entity.models.babybeasts.Beast,
              );
              setBeasts(beastsData);
              state.setEntities(resp.data);
            }
          },
        );
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account]);

  return {
    beast,
    beasts,
  };
};
