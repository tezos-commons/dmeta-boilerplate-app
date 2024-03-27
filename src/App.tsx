import React, { useState, useEffect } from 'react';
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import './App.css';
import ConnectButton from './components/ConnectWallet';
import DisconnectButton from './components/DisconnectWallet';
import OwnedQuetzals from './components/OwnedQuetzals'; // You will need to create this component
import MintQuetzal from './components/MintQuetzal'; // You will need to create this component

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected",
}

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://prod.tcinfra.net/rpc/mainnet")
  );
  const [userAddress, setUserAddress] = useState('');
  const [activeTab, setActiveTab] = useState('ownedQuetzals');
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<number>(0);
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const contractAddress: string = "KT1WmCQrN2UWU2jJcCnumwHPaaaEByCtNGt8";

  if (publicToken && (!userAddress || isNaN(userBalance))) {
    return (
      <div className="main-box">
        <h1>Subscription-based Dynamic Metadata Example dApp.</h1>
        <div id="dialog">
          <header>Try out dMeta with Quetzals!</header>
          <div id="content">
            <p className="text-align-center">
              <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
              your wallet
            </p>
            <p id="public-token">
              {copiedPublicToken ? (
                <span id="public-token-copy__copied">
                  <i className="far fa-thumbs-up"></i>
                </span>
              ) : (
                <span
                  id="public-token-copy"
                  onClick={() => {
                    if (publicToken) {
                      navigator.clipboard.writeText(publicToken);
                      setCopiedPublicToken(true);
                      setTimeout(() => setCopiedPublicToken(false), 2000);
                    }
                  }}
                >
                  <i className="far fa-copy"></i>
                </span>
              )}

              <span>
                Public token: <span>{publicToken}</span>
              </span>
            </p>
            <p className="text-align-center">
              Status: {beaconConnection ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <div id="footer">
        </div>
      </div>
    );
  } else if (userAddress && !isNaN(userBalance)) {
    return (
      <div className="main-box">
        <h1>Quetzal dMeta NFT Collection</h1>
        <div id="tabs">
          <div
            id="ownedQuetzals"
            className={activeTab === 'ownedQuetzals' ? 'active' : ''}
            onClick={() => setActiveTab('ownedQuetzals')}
          >
            My Quetzals
          </div>
          <div
            id="mintQuetzal"
            className={activeTab === 'mintQuetzal' ? 'active' : ''}
            onClick={() => setActiveTab('mintQuetzal')}
          >
            Mint Quetzal
          </div>
        </div>
        <div id="content">
          {activeTab === 'ownedQuetzals' && <OwnedQuetzals Tezos={Tezos} userAddress={userAddress} />}
          {activeTab === 'mintQuetzal' && <MintQuetzal Tezos={Tezos} userAddress={userAddress} />}
        </div>
        <DisconnectButton
          wallet={wallet}
          setPublicToken={setPublicToken}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setWallet={setWallet}
          setTezos={setTezos}
          setBeaconConnection={setBeaconConnection}
        />
        <div id="footer">
        </div>
      </div>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <div className="main-box">
        <div className="title">
          <h1>Dynamic Metadata Example</h1>
        </div>
        <div id="dialog">
          <header>Welcome to Quetzals!</header>
          <div id="content">
            <p>Hello!</p>
            <p>
              This is a basic example Tezos dApp built using the Dynamic Metadata standard and infrastructure by Tezos Commons. It's a starting
              point for you to hack on and build your own dMeta dApp for Tezos.
              <br />
            </p>
          </div>
          <ConnectButton
            Tezos={Tezos}
            setContract={setContract}
            setPublicToken={setPublicToken}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            contractAddress={contractAddress}
            setBeaconConnection={setBeaconConnection}
            wallet={wallet}
          />
        </div>
        <div id="footer">
        </div>
      </div>
    );
  } else {
    return <div>An error has occurred</div>;
  }
};

export default App;
