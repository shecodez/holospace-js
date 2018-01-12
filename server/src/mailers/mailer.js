import nodemailer from 'nodemailer';

const from = '"HoloSpace" <no-replay@holospace-app.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user:  process.env.EMAIL_USER,
      pass:  process.env.EMAIL_PASS
    }
  });
}

export function sendConfirmationEmail(user) {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Confirmation Instructions",
    text: `
      Welcome ${user.username}!\n

      Thank you for signing up for HoloSpace.\n

      Please verify your email address by clicking the link below.\n

      ${user.generateConfirmationUrl()}
    `
  };
  transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Reset Password Instructions for HoloSpace",
    text: `
      Hi ${user.username}!\n

      To reset your HoloSpace password, you can follow the link below.\n

      Please ignore this email if you did not request a password reset.\n

      ${user.generatePasswordResetRequestUrl()}
    `
  };
  transport.sendMail(email);
}
