const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')
dotenv.config()

//NOTE: You will need to set up or use a Slack webhook to use this code in a .env file as "SLACK_WEBHOOK_URL"
//Slack does not permit the posting of webhooks to public repos.
//Contact Joseph Supples if you would like to use the Slack webhook/workspace used for this project.
const slackUrl = process.env.SLACK_WEBHOOK_URL

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())


app.get("/", function (req, res) {
  res.send("This is the landing page for the Spam Notifier");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

// function to send message to slack via webhook
async function sendSlackMessage(message) {
  try {
    const response = await axios.post(slackUrl, {
      "text": message
    })
    // if response status is 200, message sent successfully
    if (response.status == 200) {
      console.log("Message sent successfully")
    }
    else {
      // if response status is not 200, log that message was not sent and log response
      console.log("Message not sent")
      console.log(response)
    }
    return response
  }
  catch (err) {
    console.log('error in sendSlackMessage')
    console.log(err)
  }
}

function convertDateTime(dateTime) {
  if (dateTime.includes("Z")) {
    let date = new Date(dateTime)
    let year = date.getUTCFullYear()
    let month = date.getUTCMonth() + 1
    let day = date.getUTCDate()
    let hour = date.getUTCHours()
    let minute = date.getUTCMinutes()
    let second = date.getUTCSeconds()
    let formattedDateTime = month + "-" + day + "-" + year + " at " + hour + ":" + minute + ":" + second + " UTC"
    return formattedDateTime
  }
  else {
    console.log("dateTime is not in UTC format")
    return dateTime
  }
}


app.post("/api", async (req, res) => {
  console.log(req.body);
  try {
    // check if request has body
    if (req.body) {
      // check if the request is a spam notification
      if (req.body.Type == undefined) {
        res.status(400).send("Does not contain a Type field, unable to determine if Spam Notification");
      }
      if (req.body.Type == "SpamNotification") {
        const email = req.body.Email ?? "No Email Provided"
        const description = req.body.Description ?? "No Description Provided"
        const dateTime = convertDateTime(req.body.BouncedAt)
        const message = "New Spam Notification from email: " + email +
          " on " + dateTime + "\nDescription: " + description
        const response = await sendSlackMessage(message)
        // if message sent successfully, send 200 response
        if (response.status == 200) {
          res.status(200).send("Spam Notification Sent to Slack");
        }
        else {
          res.status(500).send("Spam Notification Not Sent to Slack");
        }
      }
      else {
        res.status(400).send("Not a Spam Notification");
      }
    }

  } catch (err) {
    console.log('error in post request')
    console.log(err)
  }
})