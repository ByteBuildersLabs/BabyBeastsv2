import slot from "../../../dojo/manifest_dev.json";
import sepolia from "../../../dojo/manifest_sepolia.json";
import mainnet from "../../../dojo/manifest_dev.json";

// Defines a type for the valid keys of manifests
type DeployType = keyof typeof manifests;

// Create an object to hold the different manifests
const manifests = {
  mainnet,
  sepolia,
  slot,
};

// Verify if deployType is a valid key
const deployType = import.meta.env.VITE_PUBLIC_DEPLOY_TYPE as string;

// Use the safe check to ensure deployType is a valid key
export const manifest = deployType in manifests 
  ? manifests[deployType as DeployType] 
  : slot;

export type Manifest = typeof manifest;