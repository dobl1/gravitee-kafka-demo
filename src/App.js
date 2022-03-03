import './App.css';
import React from 'react';
import Transactions from './Transactions';
import Anomalies from './Anomalies';
import TransactionForm from './TransactionForm'
import Grid from '@mui/material/Grid';

function App() {
  return (
    <div>
      <div className='container' style={{height: 300}}>
        <div className='child'>
          <h1>Realtime Transactions</h1>
          <Transactions/>
        </div>
        <div className='child'>
          <h1>Detected Frauds</h1>
          <Anomalies/>
        </div>
      </div>
      
      
        <Grid
          container
          spacing={0}
          direction="column"
//          alignItems="center"
          justifyContent="center"
          
          style={{ minHeight: '100vh' }}
        >

          <Grid item xs={3}
                justifyItems="center"
          >
            <h1 style={{textAlign: 'left'}}>Send Transactions to KSQLDB API</h1>
            <TransactionForm/>
          </Grid>   
    
        </Grid>   
      
    </div>
  );
}

export default App;
