import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Octopus Membership",
        description: "This NFT will give you access to OctopusDAO!",
        image: readFileSync("scripts/assets/nothing-is-beyond-our-reach.png"),
      },
    ]);
    console.log("Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()