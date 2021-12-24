import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
  try {
    // total supply
    const amount = 1_000_000;
    // ERC-20 requires 18 decimal amounts
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);

    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    console.log(`Minted ${ethers.utils.formatUnits(totalSupply, 18)} $TNTCL`);
  } catch (error) {
    console.error("Failed ")
  }
})();