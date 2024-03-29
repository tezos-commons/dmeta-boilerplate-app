import React, { useState, useEffect, useCallback } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MintQuetzal from './MintQuetzal';

const getOwnedTokenIds = async (userAddress) => {
  const url = `https://api.tzkt.io/v1/tokens/balances?account=${userAddress}&token.contract=KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN`;
  try {
    const response = await fetch(url);
    const balances = await response.json();
    if (Array.isArray(balances)) { // Check if the response is an array
      return balances.map(balance => balance.token.tokenId);
    } else {
      return []; // Ensure an array is returned even when the response isn't what's expected
    }
  } catch (error) {
    console.error("Failed to fetch owned token IDs:", error);
    return []; // Return an empty array on error
  }
};

const OwnedQuetzals = ({ Tezos, userAddress }) => {
  const [quetzals, setQuetzals] = useState([]);
  const [renameInput, setRenameInput] = useState({});
  const proxy = "dmeta.mantodev.com";
  const network = "mainnet"; // e.g., mainnet, ghostnet, etc.
  const contractAddress = "KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN";

  const fetchOwnedQuetzals = async (tokenIds) => {
    try {
      const metadata = tokenIds.map(async (tokenId) => {
        const response = await fetch(`https://${proxy}/${network}/${contractAddress}/tokenMetadata/${tokenId}`);
        
        // Check if the response is OK and the content type is JSON
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          return response.json().then(data => ({ ID: tokenId, ...data }));
        } else {
          // Attempt to read the response text to see the error message
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch metadata for tokenId ${tokenId}: ${errorMessage}`);
        }
      });

      const quetzalsMetadata = await Promise.all(metadata);
      setQuetzals(quetzalsMetadata);

      // subscribe to live updates
      // if (quetzalsMetadata.subscriptionId) {
      //   listenForUpdates(quetzalsMetadata.subscriptionId, tokenIds);
      // }
    } catch (error) {
      console.error("Failed to fetch Quetzals metadata:", error);
      setQuetzals([]); // Handle the error appropriately in your application context
    }
  };

  // const listenForUpdates = async (subscriptionId, tokenIds) => {
  //   const wsUrl = 'wss://dmeta.mantodev.com/subscribe';
  //   const socket = new WebSocket(wsUrl);

  //   socket.onopen = () => {
  //       const message = {
  //           action: 'subscribe',
  //           subscriptions: [subscriptionId],
  //           id: 'Quetzals' // This should be a unique ID for this client
  //       };
  //       socket.send(JSON.stringify(message));
  //   };

  //   socket.onmessage = async (event) => {
  //       const data = JSON.parse(event.data);
  //       if (data.subscription_update && data.subscription_update === subscriptionId) {
  //           // Fetch the updated image using exec call again
  //           const updatedData = await fetchOwnedQuetzals(tokenIds);
  //           if (!updatedData) {
  //               console.log('Failed to update the image.');
  //           }
  //       }
  //   };

  //   socket.onerror = (error) => {
  //       console.log('WebSocket Error:', error);
  //   };
  // }

  useEffect(() => {
    if (userAddress) {
      getOwnedTokenIds(userAddress).then(tokenIds => {
        if (tokenIds.length > 0) {
          fetchOwnedQuetzals(tokenIds);
        } else {
          console.log('No token IDs found for this address.');
          setQuetzals([]); // Clear or set a default state as needed
        }
      });
    }
  }, [userAddress]); // Dependency array ensures this effect runs when `userAddress` changes


  const handleRename = async (tokenId, newName) => {
    if (!tokenId || !newName.trim()) {
      alert('Token ID and new name are required.');
      return;
    }

    try {
      const contractAddress = 'KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN';
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.rename(tokenId, newName).send({
        amount: 0.05, // The rename function requires 0.05 tez
      });

      await op.confirmation();
      alert('Quetzal renamed successfully!');
      // Optionally, refresh the list of owned Quetzals to show the updated name
    } catch (error) {
      console.error('Error renaming Quetzal:', error);
      alert('Failed to rename Quetzal. Please try again.');
    }
  };


  const handleFeed = async (tokenId) => {
    if (!Tezos.wallet) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const contract = await Tezos.wallet.at('KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN');
      const op = await contract.methods.feed(tokenId).send({
        amount: 0.05, // Required fee to feed
      });

      await op.confirmation();
      alert(`Quetzal #${tokenId} fed successfully!`);
    } catch (error) {
      console.error('Error feeding Quetzal:', error);
      alert('Failed to feed Quetzal. See console for details.');
    }
  };

  const handleInputChange = useCallback((id, newValue) => {
    setRenameInput(prevState => ({
      ...prevState,
      [id]: newValue
    }));
  }, []);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
          <h1>My Quetzals</h1>
          </Grid>
          {quetzals.map((quetzal) => (
            <Grid item xs={12} sm={6} md={3} key={quetzal.ID}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  image={`https://${proxy}/${network}/${contractAddress}/tokenImage/${quetzal.ID}`}
                  alt="Quetzal"

                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {quetzal.Name}
                  </Typography>
                  <TextField
                    key={`input-${quetzal.ID}`}
                    label="New Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={renameInput[quetzal.ID] || ''}
                    onChange={(e) => handleInputChange(quetzal.ID, e.target.value)}
                    margin="normal"
                  />
                  <Button variant="outlined" onClick={() => handleRename(quetzal.ID, renameInput[quetzal.ID])}>
                    Rename
                  </Button>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" onClick={() => handleFeed(quetzal.ID)}>
                      Feed
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default OwnedQuetzals;
