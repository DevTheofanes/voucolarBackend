import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1357bee1a68fe8",
    pass: "c3325070dbcf6d",
  },
});

export default transport;
