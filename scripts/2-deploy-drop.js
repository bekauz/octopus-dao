import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xb829e419909DDa91856eB6672F9Ac7f67Ae4bFB9");

(async () => {
  try {
    // describe ERC-1155 metadata
    const bundleDropModule = await app.deployBundleDropModule({
      name: "OctopusDAO Membership",
      description: "A DAO for octopus take over",
      // png that will appear on OpenSea
      image: readFileSync("scripts/assets/octopus.jpg"),
      // address for proceeds from sales of nfs in the module (0x0)
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });
    
    console.log(
      "Successfully deployed bundleDrop module, address:",
      bundleDropModule.address,
    );
    console.log(
      "bundleDrop metadata:",
      await bundleDropModule.getMetadata(),
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})()