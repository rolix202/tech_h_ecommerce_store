import { MailtrapClient } from "mailtrap"

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  testInboxId: 3373351,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Roland",
};
