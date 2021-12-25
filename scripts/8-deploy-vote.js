import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xb829e419909DDa91856eB6672F9Ac7f67Ae4bFB9");

(async () => {
  try {
    const voteModule = await app.deployVoteModule({
        name: "OctopusDAO Proposals",
        // erc-20 gov token 
        votingTokenAddress: "0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec",
        // members can start voting on it right away
        proposalStartWaitTimeInSeconds: 0,
        // valid time window to vote is 1 day
        proposalVotingTimeInSeconds: 24*60*60,
        // min fraction of votes needed for vote to be considered valid
        votingQuorumFraction: 0,
        minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      `successfully deployed vote module with address ${voteModule.address}`
    );
  } catch (err) {
    console.error("failed to deploy the vote module", err);
  }
})();