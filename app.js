const express = require('express')
const dialogflow = require('dialogflow');
var cors = require('cors')
const uuid = require('uuid');
const {
    parseDialogFlowResponse
} = require("./utills/parseDialogFlowResponse");
// will use this later to send requests
// const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.status(200).send('Server is working fine.')
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
})


const sessionId = uuid.v4();

app.post('/api', async (req, res) => {
    console.log("process env", process.env.GOOGLE_APPLICATION_CREDENTIALS)

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath("agent-name-hkuino", req.body.source ? req.body.source : sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.message ? req.body.message : "Hi",
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        }
    };

    // Send request and log result
    try {
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`  No intent matched.`);
        }
        res.status(200).json(parseDialogFlowResponse(result));
    } catch (e) {
        console.log('error calling dialog flow', e)
        res.status(500).json(e);
    }
})

app.listen(port, () => {
    console.log(`🌏 Server is running at http://localhost:${port}`)
})