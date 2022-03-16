import React from "react";
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Box from '@mui/material/Box';
import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { gravitee } from "./gravitee-context";

const attendeesWS = new W3CWebSocket("wss://" + gravitee.gatewayUrl + gravitee.contextPath + "/" + gravitee.topic + "?api-key=" + gravitee.apikey);

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
      <Box sx={{ mt: 1 }}>Waiting for new attendees..</Box>
    </StyledGridOverlay>
  );
}

class Attendees extends React.Component {
  columns = [
    { field: 'key', headerClassName: 'super-app-theme--header', headerName: 'Key', flex: 1, },
    { field: 'firstname', headerClassName: 'super-app-theme--header', headerName: 'Firstname', flex: 1, },
    { field: 'lastname', headerClassName: 'super-app-theme--header', headerName: 'Lastname', flex: 1, },
    { field: 'company', headerClassName: 'super-app-theme--header', headerName: 'Company', flex: 1, },
  ];

  componentDidMount() {
    function attendeesKeepAlive() {
      if (attendeesWS.readyState === W3CWebSocket.OPEN) {
        console.log("Keeping attendees session alive...");
        var number = Math.round(Math.random() * 0xFFFFFF);
        attendeesWS.send(number.toString());
        setTimeout(attendeesKeepAlive, 5000);
      }
    }

    attendeesWS.onopen = () => {
      console.log('Connected to attendees topic Websocket...');
      attendeesKeepAlive();
    };

    attendeesWS.onmessage = (message) => {
      try {
        console.log("New attendees...");
        console.log("DATA:")
        console.log(message.data)

        var data = JSON.parse(message.data);
        var key = data.metadata.key;
        var payload = JSON.parse(data.payload);
        console.log(payload);

        var attendee = {
          id: key,
          key: key,
          firstname: payload.firstname,
          lastname: payload.lastname,
          company: payload.company
        }

        this.setState(state => {
          const list = [attendee, ...state.attendees];

          return {
            attendees: list,
          };
        });

      } catch (error) {
        console.log("Error while parsing message from websocket");
        console.log(error);
      }
    };
    attendeesWS.onerror = (error) => {
      console.log(error);
      console.log("Error while connecting to the websocket: " + error.message + " " + error.name);
    }
    attendeesWS.onclose = (event) => {
      console.log("Websocket closed: " + event.reason);
    }
  }

  constructor() {
    super();
    this.state = {
      attendees: []
    }
  }

  render() {
    return (
      <Box sx={{ height: 370, width: 1, '& .super-app-theme--header': { backgroundColor: 'rgba(18, 20, 204, 0.75)', color: 'rgba(255,255,255,1)', fontWeight: 'bold' }, }} >
        <h3>Attendees list - Secured WebSocket</h3>
        <div style={{ height: '100%' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid rows={this.state.attendees} columns={this.columns} components={{ NoRowsOverlay: CustomNoRowsOverlay }} />
            </div>
          </div>
        </div>
      </Box>
    )
  }

}

export default Attendees;