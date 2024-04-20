const fs = require("fs");
const path = require('path');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hibbanrahmanhyt@gmail.com",
    pass: "amiq szhk mkrt iwrb",
  },
});

async function SendEmail(email,username) {
  try {
    // Read the content of the HTML file
    const templatePath = path.join(__dirname, '../services', 'emailTemplate.html');
    let template = fs.readFileSync(templatePath, 'utf8');


    // Replace the placeholder [Username] with the actual username
    template = template.replace('[Username]', username);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"NextGenEdu" <hibbanrahmanhyt@gmail.com>',
      to: email,
      subject: "Congratulations",
      html: template,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  SendEmail,
};
