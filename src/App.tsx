import React, { useState, useEffect } from 'react';
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import './App.css';
import ConnectButton from './components/ConnectWallet';
import DisconnectButton from './components/DisconnectWallet';
import OwnedQuetzals from './components/OwnedQuetzals';
import MintQuetzal from './components/MintQuetzal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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
      <div>
        <div className="dark-theme">
          <Box
            className="center"
            component="img"
            sx={{
              height: 300,
              width: 300,
              maxHeight: { xs: 300, md: 300 },
              maxWidth: { xs: 300, md: 300 },
              paddingTop: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            alt="Dynamic Metadata"
            src="./dmeta_quetzals_logo.png"
          />
        </div>
        <div className="main-box">
{/*        <div id="tabs">
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
        </div>*/}
          <div id="content">
            <div>
              <p>Hello!</p>
              <p>
                This is a basic example Tezos dApp built using the Dynamic Metadata standard and infrastructure by Tezos Commons. It's a starting
                point for you to hack on and build your own dMeta dApp for Tezos.
                <br />
              </p>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} sx={{ paddingBottom: 1 }}>
                  <MintQuetzal Tezos={Tezos} userAddress={userAddress} />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <OwnedQuetzals Tezos={Tezos} userAddress={userAddress} />
                </Grid>
              </Grid>
            </Box>
  {/*          {activeTab === 'ownedQuetzals' && <OwnedQuetzals Tezos={Tezos} userAddress={userAddress} />}
            {activeTab === 'mintQuetzal' && <MintQuetzal Tezos={Tezos} userAddress={userAddress} />}*/}
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
      </div>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <div>
        <div className="dark-theme">
          <Box
            className="center"
            component="img"
            sx={{
              height: 300,
              width: 300,
              maxHeight: { xs: 300, md: 300 },
              maxWidth: { xs: 300, md: 300 },
              paddingTop: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            alt="Dynamic Metadata"
            src="./dmeta_quetzals_logo.png"
          />
        </div>
        <div className="main-box center">
          <div>
            <div id="content">
              <div className="center">
                <h1>DMeta Example dApp</h1>
              </div>
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
      </div>
    );
  } else {
    return <div>An error has occurred</div>;
  }
};

export default App;
