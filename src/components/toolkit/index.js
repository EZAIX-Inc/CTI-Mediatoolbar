import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, Card, CardContent, CardActions, Button, IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Instance from "../../services/axiosInstance";
import { Stack } from "@mui/system";
import { CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";


const Toolkit = ({ wsMessages, setWsMessages }) => {
    const [callerContact, setCallerContact] = useState(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isOnHold, setIsOnHold] = useState(false)


    const rejectIncomingCall = async (callDetails) => {
        try {
            console.log("call details", callDetails)
            const response = await Instance.post('/calls/decline_call', callDetails);
        } catch (error) {
            console.error("getting errors on rejecting the incoming call")
        }
    }

    const hungupOngoingCall = async (callDetails) => {
        try {
            console.log("call details", callDetails)
            const response = await Instance.post('/calls/hung_up_call', callDetails);
        } catch (error) {
            console.error("getting errors on hanging up ongoing call")
        }
    }

    return (
        <Box sx={{ justifyContent: "center", backgroundColor: '#312D2A', height: '70px' }}>
            {
                (wsMessages[wsMessages.length - 1] && wsMessages[wsMessages.length - 1].message.caller && wsMessages[wsMessages.length - 1].publisher == 'publish_call_notifications') &&
                <Card sx={{ maxWidth: 250, padding: 0.1, display: 'flex', justifyContent: 'space-between', backgroundColor: '#312D2A' }}>
                    <CardContent>
                        <Typography sx={{ fontSize: '11px' }}> Incomming Call </Typography>
                        <Typography sx={{ fontSize: '13px' }}>{wsMessages[wsMessages.length - 1].message.caller}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="error" onClick={() => rejectIncomingCall(wsMessages[wsMessages.length - 1].message)}>
                            <CallEndIcon />
                        </Button>
                    </CardActions>
                </Card>
            }

            {
                (wsMessages[wsMessages.length - 1] && wsMessages[wsMessages.length - 1].message.caller && wsMessages[wsMessages.length - 1].publisher == 'publish_call_accepted_notifications') &&
                <Card sx={{ maxWidth: 300, display: 'flex', justifyContent: 'space-between', backgroundColor: '#312D2A' }}>
                    <CardContent>
                        <Typography sx={{ fontSize: '11px' }}> Ongoing Call </Typography>
                        <Typography sx={{ fontSize: '13px' }}>{wsMessages[wsMessages.length - 1].message.caller}</Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton>{isMuted ? <VolumeOffIcon sx={{ fontSize: '17px' }} /> : <VolumeUpIcon sx={{ fontSize: '17px' }} />}</IconButton>
                        <IconButton >{isOnHold ? <PlayArrowIcon sx={{ fontSize: '17px' }} /> : <PauseIcon sx={{ fontSize: '17px' }} />}</IconButton>

                        <Button variant="contained" color="error" onClick={() => hungupOngoingCall(wsMessages[wsMessages.length - 1].message)}>
                            <CallEndIcon />
                        </Button>
                    </CardActions>
                </Card>
            }
        </Box>
    );
};

export default Toolkit;
