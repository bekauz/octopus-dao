import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

/**
 * 1 = mainnet
 * 3 = ropsten
 * 4 = rinkeby
 */
const supportedChainIds = [4];

/**
 * Include the connectors you want to support
 * injected - MetaMask
 * magic - Magic Link
 * walletconnect - Wallet Connect
 * walletlink - Coinbase Wallet
 */
const connectors = {
  injected: {},
};

// wrap App with ThirdwebWeb3Provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <div className="landing">
        <App />
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);