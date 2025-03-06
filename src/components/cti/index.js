import React from "react";
import { Box, Typography, Button, Card, CardContent, CardActions, IconButton, Tabs, Tab } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import TimerIcon from "@mui/icons-material/Timer";

// UI Component for handling the calls
const CallUI = ({ incomingCalls, activeCall, activeCallerId, callDuration, isMuted, isOnHold, answerCall, rejectCall, toggleMute, toggleHold, endCall }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 1 }}>
      
      {/* Incoming Calls */}
      {incomingCalls.length > 0 && !activeCall ? (
        incomingCalls.map(({ call, callerId }, index) => (
          <Card key={index} sx={{ maxWidth: 800, width: '100%', marginBottom: 1, padding: 1 }}>
            <CardContent>
              <Typography variant="body1">Incoming Call from: {callerId}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="success" startIcon={<CallIcon />} onClick={() => answerCall(call, callerId)}>
                Answer
              </Button>
              <Button variant="contained" color="error" startIcon={<CallEndIcon />} onClick={() => rejectCall(call)}>
                Reject
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        !activeCall && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4 }}>
            <img src="/call_9046965.png" alt="No Calls" style={{ width: "120px", height: "120px" }} />
            <Typography variant="h6" sx={{ color: "text.secondary", mt: 2 }}>
              No Calls In Queue
            </Typography>
          </Box>
        )
      )}

      {/* Active Call UI */}
      {activeCall && (
        <Card sx={{ maxWidth: 800, width: '100%', marginBottom: 1, padding: 1 }}>
          <CardContent>
            <Typography variant="h6">Active Call</Typography>
            <Typography variant="body1">Caller: {activeCallerId}</Typography>
            <Typography variant="body1" sx={{ display: "flex", alignItems: 'center' }}>
              <TimerIcon /> {Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? "0" : ""}{callDuration % 60}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={toggleMute}>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</IconButton>
            <IconButton onClick={toggleHold}>{isOnHold ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
            <Button variant="contained" color="error" startIcon={<CallEndIcon />} onClick={endCall}>
              End Call
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};

export default CallUI;
