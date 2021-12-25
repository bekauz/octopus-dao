import sdk from "./1-initialize-sdk.js"
import ethers from "ethers"

const bundleDropModule = sdk.getBundleDropModule("0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7");

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
    try {
      // tokenId 0 is for the membership NFT
      const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

      if (walletAddresses.length === 0) {
          console.log(`No NFT claimed yet`);
          process.exit(0);
      }

      const airDropTargets = walletAddresses.map((address) => {

        console.log(`About to airdrop 1000 tokens to ${address}`);
        return {
          address,
          amount: ethers.utils.parseUnits("1000", 18),
        };
      });

      console.log("Starting airdrop");
      await tokenModule.transferBatch(airDropTargets);
      console.log("Successfully airdropped tokens to all the holders of the NFT");
    

    } catch (err) {
      console.error("Failed to airdrop tokens", err);
    }   
})();