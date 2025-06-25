import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

// Email templates
const emailTemplates = {
  volunteerApplication: (name: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Thank You for Your Volunteer Application!</h2>
        <p>Dear ${name},</p>
        <p>We have received your volunteer application for Dog Rescue Mission. Thank you for your interest in helping our furry friends!</p>
        <p>Our team will review your application and get back to you as soon as possible. This process typically takes 3-5 business days.</p>
        <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
        <p>Warm regards,<br>The Dog Rescue Mission Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
  
  volunteerApproved: (name: string, volunteerType: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Your Volunteer Application Has Been Approved!</h2>
        <p>Dear ${name},</p>
        <p>We are delighted to inform you that your application to volunteer as a <strong>${volunteerType}</strong> with Dog Rescue Mission has been approved!</p>
        <p>Next steps:</p>
        <ol>
          <li>Please visit our center during our operating hours to complete your orientation.</li>
          <li>Bring a valid ID and any certifications relevant to your volunteer role.</li>
          <li>We'll provide you with a volunteer handbook and schedule during orientation.</li>
        </ol>
        <p>If you have any questions or need to reschedule your orientation, please contact our volunteer coordinator.</p>
        <p>We're excited to have you join our team!</p>
        <p>Warm regards,<br>The Dog Rescue Mission Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
  
  volunteerRejected: (name: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Volunteer Application Update</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in volunteering with Dog Rescue Mission.</p>
        <p>After careful consideration, we regret to inform you that we are unable to accept your volunteer application at this time. This decision could be due to various factors, including volunteer capacity, specific skills needed for current roles, or schedule compatibility.</p>
        <p>We encourage you to apply again in the future or explore other ways to support our mission, such as donations or attending our fundraising events.</p>
        <p>We sincerely appreciate your desire to help animals in need.</p>
        <p>Warm regards,<br>The Dog Rescue Mission Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (
  to: string,
  template: 'volunteerApplication' | 'volunteerApproved' | 'volunteerRejected',
  data: { name: string; volunteerType?: string }
) => {
  try {
    // Get the appropriate template
    let emailContent;
    switch (template) {
      case 'volunteerApplication':
        emailContent = emailTemplates.volunteerApplication(data.name);
        break;
      case 'volunteerApproved':
        if (!data.volunteerType) {
          throw new Error('Volunteer type is required for approval emails');
        }
        emailContent = emailTemplates.volunteerApproved(data.name, data.volunteerType);
        break;
      case 'volunteerRejected':
        emailContent = emailTemplates.volunteerRejected(data.name);
        break;
      default:
        throw new Error('Invalid email template');
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Dog Rescue Mission" <${process.env.EMAIL_FROM || 'noreply@dogrescuemission.com'}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 