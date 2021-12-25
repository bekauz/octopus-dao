import sdk from "./1-initialize-sdk.js"
import ethers from "ethers"

const voteModule = sdk.getBundleDropModule("0xF2bC16309dDB09f36e2254101c235D422FE2bE7F");

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
  try {
    // grand the treasury an option to mint tokens
    await tokenModule.grantRole("minter", voteModule.address);
    console.log("successfully granted minter role to treasury");
  } catch (err) {
    console.error("failed to grant minting role to treasury", err);
    process.exit(1);
  }

  try {
    // currently the entire supply is in our wallet
    const ownedTokenBalance = await tokenModule.balanceOf(
        process.env.WALLET_ADDRESS
    );
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const daoFraction = ownedAmount.div(100).mul(90);
    // transfer 90% of entire supply to vote module contract
    await tokenModule.transfer(
        voteModule.address,
        daoFraction
    );

    console.log("tokens successfully transferred to treasury");
  } catch (err) {
    console.error("failed to transfer tokens to treasury", err);
  }
})();