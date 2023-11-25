//This is my own library of helper functions

const nodemailer = require("nodemailer");

//Sendmail function - used when sending email to users
module.exports = {
  sendMail: (recvr, subject, emailbody, fileAttachment, filepath) => {
    const filePath =
      filepath === null || filepath === undefined || filepath === ""
        ? "./" + fileAttachment
        : filepath + fileAttachment;
    var transporter = nodemailer.createTransport({
      pool: true,
      host: "mail.supremecluster.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.USERMAIL,
        pass: process.env.MAILPWD,
      },
    });

    if (fileAttachment) {
      var mailOptions = {
        attachments: [
          {
            path: filePath,
          },
        ],
        from: "wpm@safenode.co.nz",
        to: recvr,
        cc: "gagabon@safenode.co.nz",
        subject: subject,
        text: emailbody,
      };
    } else {
      var mailOptions = {
        from: "wpm@safenode.co.nz",
        to: recvr,
        cc: "gagabon@safenode.co.nz",
        subject: subject,
        text: emailbody,
      };
    }

    transporter.sendMail(mailOptions, function (error, info) {
      error
        ? console.log(error)
        : console.log("Email sent: " + recvr + " " + info.response);
      transporter.close();
    });
  }, //sendMail
}; //module.exports
