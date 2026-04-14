// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: parseInt(process.env.EMAIL_PORT) || 587,
//   secure: false, // true for 465, false for 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// const sendEnquiryEmail = async (options) => {
//   const mailOptions = {
//     from: '"Nutfullo Official" <info@nutfullo.com>',
//     to: options.email,
//     subject: 'We Received Your Nutfullo Enquiry! 🚀',
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background-color: #ffffff;">
//         <div style="background-color: #065f46; padding: 40px; text-align: center;">
//           <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">Nutfullo.</h1>
//           <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Partner Program</p>
//         </div>
        
//         <div style="padding: 40px; text-align: center;">
//           <h2 style="color: #1e293b; font-size: 22px;">Hello ${options.fullName},</h2>
//           <p style="color: #475569; font-size: 16px; line-height: 1.6;">
//             Thank you for your interest in partnering with us. We’ve received your enquiry and our team will review it shortly.
//           </p>

//           <div style="margin: 30px 0; padding: 25px; background-color: #f0fdf4; border-radius: 16px; border: 1px solid #dcfce7; text-align: left;">
//             <h3 style="color: #166534; font-size: 13px; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #dcfce7; padding-bottom: 10px;">Enquiry Details</h3>
//             <p style="margin: 8px 0; color: #334155; font-size: 15px;"><strong>Interest:</strong> ${options.businessType}</p>
//             <p style="margin: 8px 0; color: #334155; font-size: 15px;"><strong>City:</strong> ${options.city || 'Not Provided'}</p>
//             <p style="margin: 8px 0; color: #334155; font-size: 15px;"><strong>Phone:</strong> ${options.phone}</p>
//           </div>

//           <p style="color: #64748b; font-size: 14px;">
//             One of our representatives will contact you via phone or WhatsApp within 24 hours.
//           </p>
//         </div>

//         <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
//           Nutfullo Official • Shivtirthnagar, Kothrud, Pune – 411038
//         </div>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEnquiryEmail;

import nodemailer from 'nodemailer';

// ✅ Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Enquiry Email
const sendEnquiryEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Nutfullo Official" <${process.env.EMAIL_INFO}>`, // ✅ dynamic
      to: options.email,
      subject: options.subject || 'We Received Your Nutfullo Enquiry! 🚀', // ✅ dynamic
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background-color: #ffffff;">
          
          <div style="background-color: #065f46; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">Nutfullo.</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 14px;">Partner Program</p>
          </div>
          
          <div style="padding: 40px; text-align: center;">
            <h2 style="color: #1e293b;">Hello ${options.fullName || "Partner"},</h2>

            <p style="color: #475569; font-size: 16px;">
              Thank you for contacting us. Our sales team will reach out to you shortly.
            </p>

            <div style="margin: 30px 0; padding: 25px; background-color: #f0fdf4; border-radius: 16px; text-align: left;">
              <h3 style="color: #166534;">Enquiry Details</h3>

              <p><strong>Interest:</strong> ${options.businessType || "-"}</p>
              <p><strong>City:</strong> ${options.city || "Not Provided"}</p>
              <p><strong>Phone:</strong> ${options.phone || "-"}</p>
            </div>

            <p style="color: #64748b; font-size: 14px;">
              Our team will contact you via call or WhatsApp within 24 hours.
            </p>

            <a href="https://wa.me/918767334312"
               style="display:inline-block;margin-top:15px;background:#10b981;color:white;padding:10px 20px;border-radius:8px;text-decoration:none">
               Chat on WhatsApp
            </a>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            Nutfullo • Pune, India
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

export default sendEnquiryEmail;