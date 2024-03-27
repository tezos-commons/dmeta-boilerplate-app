import React, { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

type MintQuetzalProps = {
  Tezos: TezosToolkit;
  userAddress: string; // Adding the missing prop
};

const MintQuetzal: React.FC<MintQuetzalProps> = ({ Tezos, userAddress }) => {
  const [name, setName] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!name.trim()) {
      alert('Please provide a name for your Quetzal.');
      return;
    }

    try {
      setIsMinting(true);
      const contractAddress = 'KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN';
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.mint(name).send({
        amount: 0.1, // The mint function requires 0.1 tez
      });

      await op.confirmation();
      alert('Minting successful!');
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      <h3>Mint a New Quetzal</h3>
      <TextField
        type="text"
        label="Name your Quetzal"
        variant="outlined"
        size="small"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        disabled={isMinting}
      />
      <Button variant="contained" onClick={handleMint} disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Mint Quetzal'}
      </Button>
    </div>
  );
};

export default MintQuetzal;
