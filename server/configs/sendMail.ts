import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
import path from "path";

import { getNameBySSO } from "../routes/ncgRoutes";

const Stage = {
  "0": "Created",
  "1": "Accepted",
  "2": "Solved",
  "3": "Closed",
  "-1": "Cancelled",
};

// initialize nodemailer
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME!,
    pass: process.env.MAIL_PASSWORD!,
  },
});

const viewPath = path.resolve(__dirname, "./templates/views/");
const partialsPath = path.resolve(__dirname, "./templates/partials");

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    defaultLayout: false,
    layoutsDir: path.resolve("./templates/views/"),
    partialsDir: path.resolve("./templates/partials"),
  },
  viewPath: path.resolve("./templates/views/"),
  extName: ".handlebars",
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions as NodemailerExpressHandlebarsOptions));

export default async function sendMailToValidator(nc: any) {
  const creatorName = await getNameBySSO(nc.creator);
  const mailOptions = {
    from: "quynhluu1305@gmail.com", // sender address
    template: "index", // the name of the template file, i.e., email.handlebars
    to: ["quynhluu1305@gmail.com", "younghungold@gmail.com"],
    subject: `Sending Email using Node.js`,
    context: {
      ncId: nc.id,
      ncProblemTitle: nc.problemTitle,
      ncStatus: Stage[nc.stage.toString() as keyof typeof Stage],
      ncCreatedBy: creatorName,
      ncCreatedDate: nc.createdDate,
    },
    // cc: "email@gmail.com",
    // bcc: "email@gmail.com",
    // attachments: [{ filename: "pic-1.jpeg", path: path.resolve(__dirname, './image/abc.jpg') }],
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(`Nodemailer get error while sending email to someone`, error);
  }
}
