import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  try {
    if (!process.env.SMTP_USER) {
      console.log(`[Email Mock Service] Email to ${to} with subject "${subject}" logged.`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Nuvexora Technologies <no-reply@nuvexora.com>",
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error);
  }
};

export const sendWelcomeEmail = async (email: string, name: string, activationUrl: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a;">Welcome to Nuvexora Technologies</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${name},</p>
      <p style="color: #475569; font-size: 16px;">Your employee portal account has been successfully created. We are thrilled to have you onboard.</p>
      <p style="color: #475569; font-size: 16px;">Please activate your account and securely set your password by clicking the button below. This activation link expires in 24 hours.</p>
      <a href="${activationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Activate Your Account</a>
      <p style="color: #475569; font-size: 14px;">If you have any questions, please contact our IT support team.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 30px;">
      <p style="color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} Nuvexora Technologies. All rights reserved.</p>
    </div>
  `;
  await sendEmail({ to: email, subject: "Welcome to Nuvexora - Activate Your Account", html });
};

export const sendClientWelcomeEmail = async (email: string, name: string, accountManager: string, activationUrl: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a;">Welcome to Nuvexora Client Portal</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${name},</p>
      <p style="color: #475569; font-size: 16px;">We are excited to partner with you. Your secure Client Portal account has been created.</p>
      <p style="color: #475569; font-size: 16px;">Your dedicated Account Manager is <strong>${accountManager}</strong>.</p>
      <p style="color: #475569; font-size: 16px;">To access your project updates, files, and invoices, please activate your account and set your password by clicking the button below. This link expires in 24 hours.</p>
      <a href="${activationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Activate Client Portal</a>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 30px;">
      <p style="color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} Nuvexora Technologies. All rights reserved.</p>
    </div>
  `;
  await sendEmail({ to: email, subject: "Welcome to Nuvexora - Client Portal Access", html });
};

export const sendMeetingInviteEmail = async (
  employeeName: string,
  employeeEmail: string,
  meeting: {
    title: string;
    meetingDate: string;
    timeSlot: string;
    timezone: string;
    topic: string;
    organizerName: string;
    meetingLink?: string;
  }
) => {
  const formattedDate = new Date(meeting.meetingDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); padding: 40px 32px; text-align: center;">
        <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 28px;">📅</span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Meeting Invitation</h1>
        <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">You have been invited to a meeting</p>
      </div>

      <!-- Body -->
      <div style="background: #ffffff; padding: 32px;">
        <p style="color: #475569; font-size: 15px; margin: 0 0 24px;">Hello <strong style="color: #0f172a;">${employeeName}</strong>,</p>
        <p style="color: #475569; font-size: 15px; margin: 0 0 28px;">
          <strong style="color: #0f172a;">${meeting.organizerName}</strong> has scheduled a meeting and added you as an attendee. Please find the details below.
        </p>

        <!-- Meeting Card -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
          <h2 style="color: #1e40af; font-size: 18px; font-weight: 800; margin: 0 0 16px;">${meeting.title}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600; width: 40%;">📆 DATE</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 700;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">🕐 TIME SLOT</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 700;">${meeting.timeSlot} (${meeting.timezone})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">💬 TOPIC</td>
              <td style="padding: 6px 0; color: #475569; font-size: 13px;">${meeting.topic}</td>
            </tr>
          </table>
        </div>

        ${meeting.meetingLink ? `
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${meeting.meetingLink}" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 15px; letter-spacing: 0.2px; box-shadow: 0 4px 14px rgba(37,99,235,0.35);">
            🎥 Join Meeting
          </a>
        </div>
        ` : `
        <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 10px; padding: 14px 18px; margin-bottom: 28px;">
          <p style="color: #713f12; font-size: 13px; margin: 0;">⚠️ No meeting link has been added yet. Please check the Employee Portal for updates.</p>
        </div>
        `}

        <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">
          You can view all your scheduled meetings in your Employee Portal under 
          <strong style="color: #2563eb;">Dashboard → Upcoming Meetings</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Nuvexora Technologies. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: employeeEmail,
    subject: `📅 Meeting Invitation: ${meeting.title} on ${formattedDate}`,
    html,
  });
};

