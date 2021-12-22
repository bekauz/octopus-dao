import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // connectWallet hook from thirdWeb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

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
  
  // once user is connected display landing page
  return (
    <div className="landing">
      <h1>wallet connected, welcome!</h1>
    </div>);
};

export default App;
