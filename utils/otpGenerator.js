// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

const otpGenerator = require("otp-generator");
const twilio = require("twilio");

const accountSid = "AC33491e92365c587cf76a59a944507de2";
const authToken = "7a1fcc91e2368a16e4f0246334df59ed";
const verifySid = "VA7b3d4f08df856ce535707f0c615570d9";

const client = twilio(accountSid, authToken);


    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Format the phone number to E.164 format (assuming it's an Indian number)
    const formattedPhoneNumber = `+91${phone}`;

    // Send OTP via SMS
    client.verify
      .services(verifySid)
      .verifications.create({ to: formattedPhoneNumber, channel: "sms" })
      .then((verification) => {
        console.log("OTP sent successfully!");
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "OTP sent successfully!",
          data: { user: { email, phoneNumber: formattedPhoneNumber } }, // Return minimal user data for security reasons
        });
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to send OTP",
          error: error.message,
        });
      });

    