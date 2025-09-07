import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // Use process.env for all email credentials
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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