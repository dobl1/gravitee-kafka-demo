import './App.css';
import React from 'react';
import Attendees from './attendees';
import AttendeesForm from './attendees-form'
import Grid from '@mui/material/Grid';

function App() {
  return (
    <div>
      <div className='container'>
        <div className='child'>
          <h1>Gravitee.io Workshop for the Apidays Helsinki & North 2022</h1>
          <h3>Attendees list - Secured WebSocket</h3>
          <Attendees />
        </div>
      </div>

      <div className='container2'>
        <div className='child'>
          <h3>Send your attendees info - Secured POST request</h3>
          <AttendeesForm />
        </div>
      </div>
    </div>
  );
}

export default App;
