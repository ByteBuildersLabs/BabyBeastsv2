interface ImportMetaEnv {
    readonly VITE_PUBLIC_DEPLOY_TYPE:
    | "mainnet"
    | "sepolia"
    | "slot"
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}