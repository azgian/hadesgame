import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { PUBLIC_MAILERSEND_API_KEY, PUBLIC_VERIFIED_EMAIL } from '$env/static/public';

const mailerSend = new MailerSend({
  apiKey: PUBLIC_MAILERSEND_API_KEY,
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const sentFrom = new Sender(PUBLIC_VERIFIED_EMAIL, "HADES");

  const recipients = [
    new Recipient(to)
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html)
    .setText(text);

  try {
    const response = await mailerSend.email.send(emailParams);
    return { success: true, response };
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: String(error) };
    }
  }
}
