import { useEffect, useMemo, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDrop = sdk.getBundleDropModule(
  "0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7",
);
const tokenModule = sdk.getTokenModule(
  "0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec"
);
const voteModule = sdk.getVoteModule(
  "0xF2bC16309dDB09f36e2254101c235D422FE2bE7F"
  );


const App = () => {
  // connectWallet hook from thirdWeb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Connected with address:", address)

  // used to sign txs on the blockchain (for writing)
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab addresses of users who hold the NFT 
    bundleDrop
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("members addresses: ", addresses);
        setMemberAddresses(addresses);
      }).catch((err) => {
        console.error("failed to retrieve member list", err);
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab balances of users who hold the erc-20 token
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("holder amounts", amounts);
        setMemberTokenAmounts(amounts);
      }).catch((err) => {
        console.error("failed to retrieve token amounts", err);
      });
  }, [hasClaimedNFT]);

  // combine memberAddresses and memberTokenAmounts
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // return 0 if address is not in memberTokenAmounts
          memberTokenAmounts[address] || 0,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // pass signer to the sdk
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // skip if user has not connected the wallet yet
    if (!address) {
      return;
    }
    // check if the user has the membership nft
    return bundleDrop
    .balanceOf(address, "0")
    .then((balance) => {
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("user has the membership NFT");
      } else {
        setHasClaimedNFT(false);
        console.log("user does not have the membership NFT");
      }
    }).catch((error) => {
      setHasClaimedNFT(false);
      console.error("failed to get balance", error);
    });
  }, [address]);

  // retrieve all active proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    voteModule
      .getAll()
      .then((activeProposals) => {
        setProposals(activeProposals);
        console.log("proposals:", activeProposals);
      }).catch((err) => {
        console.error("failed to retrieve proposals", err);
      });
  }, [hasClaimedNFT]);

  // check if user has voted 
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // if proposals have not been retrieved yet
    if (!proposals.length) {
      return;
    }

    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((voteStatus) => {
        setHasVoted(voteStatus);
        console.log("user has already voted");
      }).catch((err) => {
        console.error("failed to check user vote status", err);
      });
  }, [hasClaimedNFT, proposals, address]);
  
  if (error && error.name === "UnsupportedChainIdError") {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          OctopusDAO currently supports Rinkeby network only.
          Please switch the network in your connected wallet.
        </p>
      </div>
    );
  }

  // if user hasn't connected the wallet, display an option to do so
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to OctopusDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  const bgImgStyling = {
    zIndex: "0",
    position: "absolute",
    left: "0",
    top: "0",
    width: "50vw",
  }

  const elevatedZIndex = {
    zIndex: "1",
  }

  // display internal DAO page for users who have claimed the NFT
  if (hasClaimedNFT) {
    return (
      <div className="member-page"> 
        <img 
          src={`${process.env.PUBLIC_URL}/octopus_home.png`} 
          alt="home-octopus" 
          style={bgImgStyling} 
        />
        <h1 style={elevatedZIndex}>OctopusDAO Member Page</h1>
        <div style={elevatedZIndex}>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                // disable button before entering async mode
                setIsVoting(true);

                // grab votes from the form into values
                const votes = proposals.map((proposal) => {
                  // 2 = abstrain (default)
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      `${proposal.proposalId}-${vote.type}`
                    );
                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // validate that user delegates their token to vote
                try {
                  const delegation = await tokenModule.getDelegationOf(address);
                  // check if user hasn't delegated their gov tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    await tokenModule.delegateTo(address);
                  }
                  // vote on proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // check if proposal is open for voting
                        const proposal = await voteModule.get(vote.proposalId);
                        // vote if it is, continue otherwise
                        if (proposal.state === 1) {
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        return;
                      })
                    );
                    try {
                      // execute proposals ready to be executed (state 4)
                      await Promise.all(
                        votes.map(async (vote) => {
                          const proposal = await voteModule.get(vote.proposalId);
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute vote", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  } 
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // re-enable button regardless
                  setIsVoting(false);
                }
              }}
            >
             {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    bundleDrop
      .claim("0", 1)
      .catch((err) => {
        setIsClaiming(false);
        console.error("failed to claim", err);
      }).finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        console.log("Sucessfully minted!");
        console.log(`See it on OpenSea: https://testnets.opensea.io/assets/${bundleDrop.address}/0`);
      });
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free OctopusDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;