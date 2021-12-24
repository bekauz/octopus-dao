import sdk from "./1-initialize-sdk.js"

const bundleDropModule = sdk.getBundleDropModule("0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7");

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
    try {
      // tokenId 0 is for the membership NFT
      const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
    } catch (err) {
      console.error(err);
    }
  })();