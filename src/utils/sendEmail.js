const transport = require("./transport");

const sendEmail = (to, subject, html) => {
  const mailOptions = { from: "mail@ecommerce.com", to, subject, html };
  transport.sendMail(mailOptions);
};

module.exports = sendEmail;
