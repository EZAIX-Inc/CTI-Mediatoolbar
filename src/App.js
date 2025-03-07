import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { OracleService } from "./services/oracleService";


// Dark theme definition
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#03dac6" },
    background: { default: "#1e1e1e", paper: "#1e1e1e" },
    text: { primary: "#ffffff" },
  },
});

const App = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [callEvent, setCallEvent] = useState(null)
  const eventId = "12345-1234-67890"

  const oracleService = new OracleService();


  useEffect(() => {

    if (window?.svcMca?.tlb?.api && window.dynamicLoadCompleted) {
      oracleService.getConfiguration();
      oracleService.readyForOperation(setIsApiLoaded)
    }

  }, []);

  useEffect(() => {
    console.log("callEvent", callEvent)
  }, [callEvent])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      API: loaded :
      {isApiLoaded ? 'true' : 'false'} - value

      <input type="button" value="Get customer datas" onClick={() => oracleService.inboundCallNotification("+1 (331) 725-2599", eventId, setCallEvent)} />
      <input type="button" value="start communication" onClick={() => oracleService.startCommunicationEvent("300001821785183", eventId)} />
      <input type="button" value="end communication" onClick={()=> oracleService.endCommunicationEvent("300001821785183", eventId, "ENDCOMMUNICATION")} />
      
    </ThemeProvider>
  );
};

export default App;

