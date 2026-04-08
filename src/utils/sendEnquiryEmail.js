import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 📩 ADMIN EMAIL (YOU)
export const sendAdminEnquiryEmail = async (data) => {
    const mailOptions = {
        from: '"Nutfullo Enquiry" <info@nutfullo.com>',
        to: "info@nutfullo.com",
        subject: "🚀 New Business Enquiry - Nutfullo",
        html: `
      <h2>New Enquiry Received</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || "N/A"}</p>
      <p><strong>City:</strong> ${data.city || "N/A"}</p>
      <p><strong>Business Type:</strong> ${data.businessType}</p>
      <p><strong>Message:</strong> ${data.message || "N/A"}</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

// 📩 USER THANK YOU EMAIL
export const sendUserEnquiryEmail = async (data) => {
    const mailOptions = {
        from: '"Nutfullo" <info@nutfullo.com>',
        to: data.email,
        subject: "Thank You for Contacting Nutfullo 🙌",
        html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        
        <div style="background:#10b981;padding:20px;text-align:center">
          <h2 style="color:white;margin:0;">Nutfullo</h2>
        </div>

        <div style="padding:30px;text-align:center">
          <h3 style="color:#1e293b;">Thank You, ${data.fullName}! 🙌</h3>

          <p style="color:#475569;font-size:14px;">
            Thank you for connecting with us. Our sales team will contact you as soon as possible.
          </p>

          <p style="margin-top:20px;font-size:13px;color:#64748b;">
            📞 Phone: ${data.phone}
          </p>

          <p style="margin-top:10px;font-size:13px;color:#64748b;">
            We’re excited to help you grow with Nutfullo 🚀
          </p>

          <div style="margin-top:25px;">
            <a href="https://nutfullo.com" 
               style="background:#10b981;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
               Visit Website
            </a>
          </div>
        </div>

      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};