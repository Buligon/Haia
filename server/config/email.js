const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "haia.software.noreply@gmail.com",
    pass: "NF#JlQyOqex5"
  }
});

/* transporter.sendMail({
  from: "Haia <haia.software.noreply@gmail.com>",
  to: "lukasbuligonantunes@gmail.com",
  subject: "email teste",
  text: "olá, esse email é um teste!",
  html: 
}).then(message => {
  console.log(message);
}).catch(err => {
  console.log(err);
}) */

module.exports = transporter
