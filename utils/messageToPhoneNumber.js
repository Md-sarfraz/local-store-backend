const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "80e4cbf0",
  apiSecret: "5myTQ7ZCefrOVHMm",
});

const from = "Vonage APIs";
const to = phone;
const text = `hello this ${user.username}`;

async function sendSMS() {
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

sendSMS();
