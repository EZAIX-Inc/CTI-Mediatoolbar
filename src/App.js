import React, { useEffect, useState } from "react";
import { createCallClient } from "./services/acsClient";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab } from "@mui/material";
import CallUI from "./components/cti";
import Teams from "./components/teams";
import wsService from "./services/wsService";
import Toolkit from "./components/toolkit";


// Dark theme definition
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#03dac6" },
    background: { default: "#312D2A", paper: "#1e1e1e" },
    text: { primary: "#ffffff" },
  },
});

const App = () => {
  const [tabIndex, setTabIndex] = useState(0); // Tracks the active tab
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [activeCallerId, setActiveCallerId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [wsMessages, setWsMessages] = useState([]);

  useEffect(() => {
    // Connect WebSocket on mount
    wsService.connect();

    // Listen for messages
    const handleMessage = (message) => {
      console.log("📩 New WebSocket Message:", message);
      setWsMessages((prevMessages) => [...prevMessages, message]);
    };

    wsService.addMessageListener(handleMessage);

    return () => {
      wsService.removeMessageListener(handleMessage);
      wsService.disconnect(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    async function initializeCallAgent() {
      const userToken = process.env.REACT_APP_ACS_CONNECTION_STRING;
      if (!userToken) {
        console.error("ACS connection string is missing");
        return;
      }

      try {
        const agent = await createCallClient(userToken);
        if (agent) {
          console.log("Call client created successfully");

          agent.on("incomingCall", (event) => {
            const callerInfo = event.incomingCall.callerInfo;
            const identifier = callerInfo.identifier;

            let callerId = "Anonymous";
            if (identifier.phoneNumber) {
              callerId = identifier.phoneNumber;
            } else if (identifier.communicationUserId) {
              callerId = identifier.communicationUserId;
            } else if (callerInfo.displayName) {
              callerId = callerInfo.displayName;
            }

            setIncomingCalls((prevCalls) => [
              ...prevCalls,
              { call: event.incomingCall, callerId },
            ]);

            event.incomingCall.on("callEnded", () => {
              setIncomingCalls((prevCalls) =>
                prevCalls.filter((c) => c.call !== event.incomingCall)
              );
            });
          });
        }
      } catch (error) {
        console.error("Error initializing ACS call agent:", error);
      }
    }

    initializeCallAgent();
  }, []);

  const answerCall = async (incomingCall, callerId) => {
    try {
      const call = await incomingCall.accept();
      setActiveCall(call);
      setActiveCallerId(callerId);
      setIncomingCalls((prevCalls) =>
        prevCalls.filter((c) => c.call !== incomingCall)
      );

      setCallDuration(0);
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      call.on("stateChanged", () => {
        console.log("state changed for call", call.state)
        if (call.state === "Disconnected") {
          clearInterval(timer);
          setActiveCall(null);
          setActiveCallerId(null);
        }
      });
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const rejectCall = async (incomingCall) => {
    try {
      await incomingCall.reject();
      setIncomingCalls((prevCalls) =>
        prevCalls.filter((c) => c.call !== incomingCall)
      );
    } catch (error) {
      console.error("Error rejecting call:", error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Home Page Route (/) */}
          <Route
            path="/"
            element={
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 1, width: "100%" }}>
                <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
                  <Tab label="Telephone" onClick={() => setTabIndex(0)} sx={{ fontSize: "16px", fontWeight: "bold", color: "primary.main" }} />
                  {/* <Tab label="Teams" onClick={() => setTabIndex(1)} sx={{ fontSize: "16px", fontWeight: "bold", color: "primary.main" }} /> */}
                </Tabs>

                {/* Show Components Based on Tab Index */}
                {tabIndex === 1 && (
                  <CallUI
                    incomingCalls={incomingCalls}
                    activeCall={activeCall}
                    activeCallerId={activeCallerId}
                    callDuration={callDuration}
                    isMuted={isMuted}
                    isOnHold={isOnHold}
                    answerCall={() => {}} // Dummy function
                    rejectCall={() => {}} // Dummy function
                    toggleMute={() => setIsMuted(!isMuted)}
                    toggleHold={() => setIsOnHold(!isOnHold)}
                    endCall={() => setActiveCall(null)}
                  />
                )}

                {tabIndex === 0 && <Teams wsMessages={wsMessages} setWsMessages={setWsMessages} />}
              </Box>
            }
          />

          {/* Toolkit Page Route (/toolkit) */}
          <Route path="/toolkit" element={<Toolkit  wsMessages={wsMessages} setWsMessages={setWsMessages}  />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
