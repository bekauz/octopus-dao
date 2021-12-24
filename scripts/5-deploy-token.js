import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xb829e419909DDa91856eB6672F9Ac7f67Ae4bFB9");

(async () => {
  try {
    // deploy ERC-20 contract
    const tokenModule = await app.deployTokenModule({
        name: "OctopusDAO Governance Token",
        symbol: "TNTCL"
    });
    console.log("sucessfully deployed token module at address ", tokenModule.address);
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();