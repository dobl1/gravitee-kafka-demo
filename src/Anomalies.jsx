import React from "react";
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

//DataGrid: https://mui.com/components/data-grid/getting-started/
//WS Tutorial: https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/

//Create anomalies stream using ksql
/*
CREATE TABLE anomalies WITH (
    kafka_topic = 'anomalies'
)   AS
    SELECT card_number AS `card_number_key`,
           as_value(card_number) AS `card_number`,
           latest_by_offset(email_address) AS `email_address`,
           count(*) AS `n_attempts`,
           sum(amount) AS `total_amount`,
           collect_list(tx_id) AS `tx_ids`,
           WINDOWSTART as `start_boundary`,
           WINDOWEND as `end_boundary`
    FROM transactions
    WINDOW TUMBLING (SIZE 30 SECONDS, RETENTION 1000 DAYS)
    GROUP BY card_number
    HAVING count(*) >= 3
    EMIT CHANGES;
    
*/
const anomaliesWS = new W3CWebSocket('ws://nico.gravitee.io/apim/gateway-dev/ws/kafka/anomalies?api-key=f04da048-1eb8-491f-b653-9bfc1c24fe2c');

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

  
function CustomNoAnomaliesOverlay() {
  return (
    <StyledGridOverlay>
      <Box sx={{ mt: 1 }}>No Frauds Detected</Box>
    </StyledGridOverlay>
  );
}

class Anomalies extends React.Component {
  columns = [
    { field: 'key', headerClassName: 'super-app-theme--header', headerName: 'Tx-ID', flex: 1, },
    { field: 'email', headerClassName: 'super-app-theme--header', headerName: 'Email', flex: 1, },
    { field: 'card', headerClassName: 'super-app-theme--header', headerName: 'Card N.', flex: 1,},
    { field: 'attempts', headerClassName: 'super-app-theme--header', headerName: 'No. Attempts', flex: 1,},
    { field: 'amount', headerClassName: 'super-app-theme--header', headerName: 'Total Amount', flex: 1,},
  ];

   componentDidMount() {
    console.log("Transactions componentDidMount Called ");
     function anomaliesKeepAlive() {
        if (anomaliesWS.readyState === W3CWebSocket.OPEN) {
            console.log("Keeping Anomalies session alive...");
            var number = Math.round(Math.random() * 0xFFFFFF);
            anomaliesWS.send(number.toString());
            setTimeout(anomaliesKeepAlive, 5000);
        }
      }

     anomaliesWS.onopen = () => {
       console.log('Connected to Anomalies topic Websocket...');
       anomaliesKeepAlive();
     };

     anomaliesWS.onmessage = (message) => {
       try {
         console.log("New Anomaly...");
         var data = JSON.parse(message.data);
         var payload = JSON.parse(data.payload);
         var key = payload.tx_ids[payload.tx_ids.length - 1];
         console.log(payload);

         var anomaly = {
           id: key,
           key: key,
           email : payload.email_address,
           card: payload.card_number,
           attempts: payload.n_attempts,
           amount: payload.total_amount
         }

         this.setState(state => {
          const list = [anomaly, ...state.anomalies ];
          
          return {
            anomalies: list,
          };
        });

         
       } catch (error) {
         console.log("Error while parsing message from websocket");
         console.log(error);
       }
     };
     anomaliesWS.onerror = (error) => {
       console.log(error);
       console.log("Error while connecting to the websocket: " + error.message + " " + error.name);
     }
     anomaliesWS.onclose = (event) => {
       console.log("Websocket closed: " + event.reason);
     }
   }

  constructor() {
    super();
    this.state = {
        anomalies: []
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
            rows={this.state.anomalies} 
            columns={this.columns}
            components={{
                NoRowsOverlay: CustomNoAnomaliesOverlay,
              }}  
            />
          </div>
        </div>
      </div>
      </Box>
    )
  } 
  
}

export default Anomalies;