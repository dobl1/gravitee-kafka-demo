import React, { useContext } from "react";
import { gravitee } from "./gravitee-context";
import Box from '@mui/material/Box';

class GraviteeConfig extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }


  render() {
    return (
      <Box sx={{ height: 80, width: 1, '& .super-app-theme--header': { backgroundColor: 'rgba(18, 20, 204, 0.75)', color: 'rgba(255,255,255,1)', fontWeight: 'bold' }, }} >
        <h3>Connection info</h3>

        <p><b>URL</b>: {gravitee.gatewayUrl}{gravitee.contextPath}/{gravitee.topic}</p>
        <p><b>ApiKey</b>: {gravitee.apikey}</p>

      </Box>
    )
  }

}

export default GraviteeConfig;