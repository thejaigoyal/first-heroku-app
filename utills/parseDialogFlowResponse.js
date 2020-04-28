function parseDialogFlowResponse(resp) {
    const result = {
        Buttons: [],
        Flags: {},
        Message: resp.fulfillmentText,
        RawIncomingMessage: resp.queryText,
        User: {},
        DialogFlowResponse: {
            ...resp
        }
    }

    return result;
}

module.exports = {
    parseDialogFlowResponse
}