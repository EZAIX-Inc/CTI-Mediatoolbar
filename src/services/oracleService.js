export class OracleService {
    constructor() {
        if (!window.svcMca || !window.svcMca.tlb || !window.svcMca.tlb.api) {
            console.error("Oracle MCA API is not available!");
        }
    }

    async getConfiguration() {
        try {
            console.log("Getting the configurations...");
            window.svcMca.tlb.api.getConfiguration((response) => {
                if (response.result === "success") {
                    console.log("Configuration (Formatted):", JSON.stringify(response.configuration, null, 2));
                } else {
                    console.error("Operation finished with error:", response.error);
                }
            });
        } catch (err) {
            console.error("Error in getting configuration:", err);
        }
    }


    async readyForOperation(setIsApiLoaded) {
        try {
            console.log("Getting the operations...");
            window.svcMca.tlb.api.readyForOperation(true, (response) => {
                if (response.result === "success") {
                    setIsApiLoaded(true);
                    console.log("readdy for operations successfully");
                } else {
                    alert("Operation finished with error: " + response.error);
                }
            });
        } catch (err) {
            console.error("Error in getting readyForOperation:", err);
        }
    }

    async inboundCallNotification(SVCMCA_ANI, eventId, setCallEvent) {
        try {
            let inData = { SVCMCA_ANI: SVCMCA_ANI };

            window.svcMca.tlb.api.newCommEvent(
                "PHONE",
                "ORA_SERVICE",
                eventId,
                inData,
                null,
                (response) => {
                    if (response.result === "success") {
                        console.log("Customer:", JSON.stringify(response.outData, null, 2));
                        setCallEvent((p) => { return ({ ...p, "oracle_inboundCallNotification": true, "oracle_contact": response.outData }) })
                    } else {
                        console.error("Operation finished with error:", response.error);
                    }
                },
                "ORA_SVC_PHONE"
            );
        } catch (err) {
            console.error("Error in getting inboundCallNotification:", err);
        }
    }

    async startCommunicationEvent(SVCMCA_CONTACT_ID, eventId) {
        try {
            let inData = { SVCMCA_CONTACT_ID: SVCMCA_CONTACT_ID };

            window.svcMca.tlb.api.startCommEvent(
                "PHONE",
                "ORA_SERVICE",
                eventId,
                inData,
                (response) => {
                    if (response.result === "success") {
                        console.log("Created service request:", response.SVCMCA_SR_NUMBER);
                    } else {
                        console.error("Operation finished with error:", response.error);
                    }
                },
                "ORA_SVC_PHONE"
            );
        } catch (err) {
            console.error("Error in getting startCommunicationEvent:", err);
        }
    }

    async endCommunicationEvent(SVCMCA_CONTACT_ID, eventId, reason) {
        try {
            let inData = { SVCMCA_CONTACT_ID: SVCMCA_CONTACT_ID };

            window.svcMca.tlb.api.closeCommEvent(
                "PHONE",
                "ORA_SERVICE",
                eventId,
                inData,
                reason,
                (response) => {
                    if (response.result === "success") {
                        console.info("Success! Call ended.");
                    } else {
                        console.error("Operation finished with error:", response.error);
                    }
                },
                "ORA_SVC_PHONE"
            );
        } catch (err) {
            console.error("Error in getting endCommunicationEvent:", err);
        }
    }
}


