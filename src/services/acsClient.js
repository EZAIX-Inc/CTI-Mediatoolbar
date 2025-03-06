import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let callAgent = null;

export const createCallClient = async (userToken) => {
  if (typeof window === "undefined") {
    console.error("ACS CallClient cannot be created on the server.");
    return null; // Prevents execution on the server
  }

  try {
    if (callAgent) {
      await callAgent.dispose(); // Dispose of the existing CallAgent
      console.log("Previous CallAgent disposed.");
    }

    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    const callClient = new CallClient();
    callAgent = await callClient.createCallAgent(tokenCredential);
    console.log("New CallAgent created.");
    return callAgent;
  } catch (error) {
    console.error("Failed to create the call client", error);
    return null;
  }
};
