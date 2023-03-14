# Spam Reporting endpoint for Slack

This is a basic implementation of a spam reporting endpoint for Slack.\
POST requests sent to this endpoint with a Type of SpamNotification will be sent to a Slack Channel. \
Note: This implementation uses Slack Webhooks which can not be posted in a public repo.\
Use your own webhook in a .env file or contact Joseph Supples for access to the webhook and workspace used to test this functionality 

# Steps to run
run `npm install` to install dependencies\
run `npm start` to start the server\

# POST Request
POST requests are expected in the following format:
```
{
  "RecordType": "Bounce",
  "Type": "SpamNotification",
  "TypeCode": 512,
  "Name": "Spam notification",
  "Tag": "",
  "MessageStream": "outbound",
  "Description": "The message was delivered, but was either blocked by the user, or classified as spam, bulk mail, or had rejected content.",
  "Email": "zaphod@example.com",
  "From": "notifications@honeybadger.io",
  "BouncedAt": "2023-02-27T21:41:30Z",
}
```
Type, Description, Email, BouncedAt, are expected in POST request to prevent unexpected results\
The other fields are optional.\
