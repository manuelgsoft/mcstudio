import nodemailer from "nodemailer";

const from = process.env.EMAIL_ADDRESS;
const pass = process.env.GOOGLE_APP_PASSWORD;

type emailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendMail(payload: emailPayload): Promise<void> {
  const to = payload.to;
  const subject = payload.subject;
  const text = payload.text;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: pass,
    },
  });

  await transporter.sendMail({
    to,
    from,
    subject,
    text,
  });
}
