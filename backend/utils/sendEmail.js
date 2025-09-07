import nodemailer from 'nodemailer';
import config from '../config.js';

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.emailHost, // <-- USE CONFIG
    port: config.emailPort, // <-- USE CONFIG
    auth: {
      user: config.emailUser, // <-- USE CONFIG
      pass: config.emailPass, // <-- USE CONFIG
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: 'Attendance Portal <noreply@attendance.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email and log the result
  try {
    console.log('Attempting to send email with the following options:');
    console.log(mailOptions);

    let info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    // You can even see the preview URL for Mailtrap here!
    console.log('👀 Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

export default sendEmail;