const nodemailer = require("nodemailer");

exports.sendContactFormEmail = async (req, res) => {
  const { name, company, email, phone, message } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "Valid email address is required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Inquiry from ${name || "Anonymous"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; color: #1e1e1e;">
          <h2 style="color: #588157;">New Contact Form Submission</h2>
          <div style="background: #fff; padding: 12px; border-left: 4px solid #588157; margin-top: 8px;">
            <p><strong>Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Company/Organization:</strong> ${company || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phone || 'N/A'}</p>
            <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
          </div>
          <hr style="margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">Academy of Adventurer | Contact Form Submission</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Your message has been sent successfully!" });

  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({ error: "Something went wrong while sending your message." });
  }
};