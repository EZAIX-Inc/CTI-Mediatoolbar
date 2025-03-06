import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, Card, CardContent, CardActions, Button, IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import Instance from "../../services/axiosInstance";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";


function formatPhoneNumber(phoneNumber) {
    // Remove the "+" and extract the country code
    let cleanedNumber = phoneNumber.replace("+", "");

    // Extract parts (Assumes US-style numbers)
    let countryCode = cleanedNumber.slice(0, 1); // First digit (Country Code)
    let part1 = cleanedNumber.slice(1, 4); // First 3 digits
    let part2 = cleanedNumber.slice(4, 7); // Next 3 digits
    let part3 = cleanedNumber.slice(7); // Last 4 digits

    // Format as "1-331-725-2599"
    return `${countryCode}-${part1}-${part2}-${part3}`;
}


const Teams = ({ wsMessages, setWsMessages }) => {
    const [isMuted, setIsMuted] = useState(false)
    const [isOnHold, setIsOnHold] = useState(false)
    const [callerContact, setCallerContact] = useState(null)

    useEffect(() => {
        if (wsMessages[wsMessages.length - 1]?.message?.caller) {
            fetchContactByMobile(wsMessages[wsMessages.length - 1].message.caller)
        } else {
            setCallerContact(null)
        }
    }, [wsMessages])

    const fetchContactByMobile = async (mobileNumber) => {
        try {
            const phoneNumber = formatPhoneNumber(mobileNumber)
            const request = `/calls/get_oracle_contact?mobile=${phoneNumber}`
            const response = await Instance.get(request)
            const contact = response.data.data.items
            if (contact.length > 0) {
                setCallerContact(contact[0])
            }
        } catch (error) {
            console.error("Error fetching contact:", error.response ? error.response.data : error.message);
        }
    };

    const rejectIncomingCall = async (callDetails) => {
        try {
            console.log("call details", callDetails)
            const response = await Instance.post('/calls/decline_call', callDetails);
        } catch (error) {
            console.error("getting errors on rejecting the incoming call")
        }
    }

    const holdOngoingCall = async (callDetails) => {
        try {
            console.log("call details", callDetails)
            const response = await Instance.post('/calls/hold_call', callDetails);
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, width: "100%" }}>

            {!wsMessages[wsMessages.length - 1] && !wsMessages[wsMessages.length - 1]?.message?.caller && <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4 }}>
                <img src="/call_9046965.png" alt="No Calls" style={{ width: "120px", height: "120px" }} />
                <Typography variant="h6" sx={{ color: "text.secondary", mt: 2 }}>
                    No Calls In Queue
                </Typography>
            </Box>}


            {
                (wsMessages[wsMessages.length - 1] && wsMessages[wsMessages.length - 1].message.caller && wsMessages[wsMessages.length - 1].publisher == 'publish_call_notifications') &&
                <Card sx={{ maxWidth: 800, width: '100%', marginBottom: 1, padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <CardContent>
                        <Typography variant="h6"> Incomming Call </Typography>
                        <Typography variant="body1"> Caller: {wsMessages[wsMessages.length - 1].message.caller}</Typography>

                        <Stack direction={'row'} gap={2} sx={{ alignItems: 'center' }}>
                            {!callerContact && <>
                                <Typography variant="body1"> Fetching Contact  </Typography>
                                <CircularProgress size={16} />
                            </>}

                        </Stack>
                        {callerContact && <>
                            <Typography variant="body1"> Contact Name: {callerContact.ContactName}  </Typography>
                            <Typography variant="body1"> Email Address: {callerContact.EmailAddress}  </Typography>
                            <Typography variant="body1"> Contact Type: {callerContact.PersonDEO_ContactType_c}  </Typography>
                        </>}

                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="error" startIcon={<CallEndIcon />} onClick={() => rejectIncomingCall(wsMessages[wsMessages.length - 1].message)}>
                            Reject
                        </Button>
                    </CardActions>
                </Card>
            }

            {
                (wsMessages[wsMessages.length - 1] && wsMessages[wsMessages.length - 1].message.caller && wsMessages[wsMessages.length - 1].publisher == 'publish_call_accepted_notifications') &&
                <Card sx={{ maxWidth: 800, width: '100%', marginBottom: 1, padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <CardContent>
                        <Typography variant="h6">Ongoing Call</Typography>
                        <Typography variant="body1">Caller: {wsMessages[wsMessages.length - 1].message.caller}</Typography>
                        <Box sx={{my: 2}}>
                            {callerContact && <>
                                <Typography variant="body1"> Contact Name: {callerContact.ContactName}  </Typography>
                                <Typography variant="body1"> Email Address: {callerContact.EmailAddress}  </Typography>
                                <Typography variant="body1"> Contact Type: {callerContact.PersonDEO_ContactType_c}  </Typography>
                            </>}
                        </Box>

                    </CardContent>
                    <CardActions>

                        <IconButton>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</IconButton>
                        <IconButton onClick={() => holdOngoingCall(wsMessages[wsMessages.length - 1].message)} >{isOnHold ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
                        <Button variant="contained" color="error" startIcon={<CallEndIcon />}
                            onClick={() => hungupOngoingCall(wsMessages[wsMessages.length - 1].message)}
                        >
                            Decline
                        </Button>
                    </CardActions>
                </Card>
            }


        </Box>
    );
};

export default Teams;


// {"publisher":"publish_call_notifications","message":{"callConnectionId":"1b004880-7d0c-4ca8-9e8e-bd92811c0029","caller":"+13317252599","routing":"testing_kdp","connectionTime":"2025-02-27 09:32:36","callType":"incoming","assignedQueue":"6788bd3df234f79a1b0f212e","callhandling":"oracle","redirectTo":"8:acs:6ea13f50-b5ae-40f7-8a2b-0f18253563c7_00000025-e1bd-bbe4-f883-084822006a7b"}}