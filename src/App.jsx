import { useEffect, useMemo, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";


const sdk = new ThirdwebSDK("rinkeby");
const bundleDrop = sdk.getBundleDropModule(
  "0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7",
);

const App = () => {
  // connectWallet hook from thirdWeb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Connected with address:", address)

  // used to sign txs on the blockchain (for writing)
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>OctopusDAO Member page</h1>
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