import sdk from "./1-initialize-sdk.js"
import ethers from "ethers"

const voteModule = sdk.getVoteModule("0xF2bC16309dDB09f36e2254101c235D422FE2bE7F");

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
  try {
    const amt = 100_000;

    await voteModule.propose(
        `Should the DAO mint additional ${amt} tokens into the treasury?`,
        [
            {
                // nativeToken (ETH) could be sent along with this proposal
                // in this case we just mint new tokens, so 0
                nativeTokenValue: 0,
                transactionData: tokenModule.contract.interface.encodeFunctionData(
                    // minting to the voteModule/treasury
                    "mint",
                    [
                        voteModule.address,
                        ethers.utils.parseUnits(amt.toString(), 18),
                    ]
                ),
                // module that will execute the mint
                toAddress: tokenModule.address,
            }
        ]
    );

    console.log(`successfully created proposal to mint tokens`);
  } catch (err) {
    console.error("failed to create proposal", err);
    process.exit(1);
  }

  try {
    const amt = 500;

    await voteModule.propose(
      `Should the DAO transfer ${amt} $TNTCL to ${process.env.WALLET_ADDRESS}?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amt.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        }
      ]      
    )

    console.log("successfully created proposal to transfer tokens");
  } catch (err) {
    console.error("failed to create proposal", err);
  }
})();


