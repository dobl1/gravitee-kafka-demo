import React from "react";
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

//DataGrid: https://mui.com/components/data-grid/getting-started/
//WS Tutorial: https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/

//Create stream using ksql
/*
CREATE STREAM transactions (
    tx_id VARCHAR KEY,
    email_address VARCHAR,
    card_number VARCHAR,
    timestamp VARCHAR,
    amount DECIMAL(12, 2)
) WITH (
    kafka_topic = 'transactions',
    partitions = 8,
    value_format = 'json',
    timestamp = 'timestamp',
    timestamp_format = 'yyyy-MM-dd''T''HH:mm:ss'
);
*/
const transactionsWS = new W3CWebSocket('ws://nico.gravitee.io/apim/gateway-dev/ws/kafka/transactions?api-key=f04da048-1eb8-491f-b653-9bfc1c24fe2c');

const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
  flexDirection: 'column',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <Box sx={{ mt: 1 }}>Waiting for transactions..</Box>
      </StyledGridOverlay>
  );
}

class Transactions extends React.Component {
  columns = [
    { field: 'key', headerClassName: 'super-app-theme--header', headerName: 'Tx-ID', flex: 1, },
    { field: 'email', headerClassName: 'super-app-theme--header', headerName: 'Email', flex: 1, },
    { field: 'card', headerClassName: 'super-app-theme--header', headerName: 'Card N.', flex: 1,},
    { field: 'timestamp', headerClassName: 'super-app-theme--header', headerName: 'Timestamp', flex: 1,},
  ];

   componentDidMount() {
     function transactionsKeepAlive() {
      if (transactionsWS.readyState === W3CWebSocket.OPEN) {
          console.log("Keeping Transactions session alive...");
          var number = Math.round(Math.random() * 0xFFFFFF);
          transactionsWS.send(number.toString());
          setTimeout(transactionsKeepAlive, 5000);
      }
    }

     transactionsWS.onopen = () => {
       console.log('Connected to Transactions topic Websocket...');
       transactionsKeepAlive();
     };

     transactionsWS.onmessage = (message) => {
       try {
         console.log("New Transaction...");
         console.log("DATA:")
         console.log(message.data)
         
         var data = JSON.parse(message.data);
         var key = data.metadata.key;
         var payload = JSON.parse(data.payload);
         console.log(payload);

         var transaction = {
           id: key,
           key: key,
           email : payload.EMAIL_ADDRESS,
           card: payload.CARD_NUMBER,
           timestamp: payload.TIMESTAMP
         }

         this.setState(state => {
          const list = [transaction, ...state.transactions ];
          
          return {
            transactions: list,
          };
        });

         
       } catch (error) {
         console.log("Error while parsing message from websocket");
         console.log(error);
       }
     };
     transactionsWS.onerror = (error) => {
       console.log(error);
       console.log("Error while connecting to the websocket: " + error.message + " " + error.name);
     }
     transactionsWS.onclose = (event) => {
       console.log("Websocket closed: " + event.reason);
     }
   }

  constructor() {
    super();
    this.state = {
        transactions: [
        ]
    }
  }

  
  render() {
    return (
      <Box
        sx={{
          height: 300,
          width: 1,
          '& .super-app-theme--header': {
           backgroundColor: 'rgba(18, 20, 204, 0.75)',
           color: 'rgba(255,255,255,1)',
           fontWeight: 'bold'
          },
        }}
      >
      <div style={{ height: 400, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
          <DataGrid 
            rows={this.state.transactions} 
            columns={this.columns}  
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}/>
          </div>
        </div>
      </div>
      </Box>
    )
  } 
  
}

export default Transactions;