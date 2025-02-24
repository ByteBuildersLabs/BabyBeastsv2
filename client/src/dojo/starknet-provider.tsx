import type { PropsWithChildren } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
    jsonRpcProvider,
    StarknetConfig,
    starkscan,
} from "@starknet-react/core";
import { dojoConfig } from "./dojoConfig";
import cartridgeConnector from "../config/cartridgeConnector.tsx";

const { VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env;

export default function StarknetProvider({ children }: PropsWithChildren) {
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: dojoConfig.rpcUrl as string }),
    });

    return (
        <StarknetConfig
            autoConnect
            chains={[VITE_PUBLIC_DEPLOY_TYPE === "mainnet" ? mainnet : sepolia]}
            connectors={[cartridgeConnector]}
            explorer={starkscan}
            provider={provider}
        >
            {children}
        </StarknetConfig>
    );
}