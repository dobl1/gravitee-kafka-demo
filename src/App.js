import './App.css';
import React from 'react';
import GraviteeConfig from './gravitee-config';
import Attendees from './attendees';
import AttendeesForm from './attendees-form'


function App() {
  return (
      <div>
        <div className='container'>
          <div className='child'>
            <h1>Gravitee.io Workshop for the Apidays Helsinki & North 2022</h1>
            <GraviteeConfig />
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
