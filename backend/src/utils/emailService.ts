import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email timeout in milliseconds (5 seconds)
const EMAIL_TIMEOUT = 5000;

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
  // Set connection timeout
  connectionTimeout: EMAIL_TIMEOUT,
  // Set socket timeout
  socketTimeout: EMAIL_TIMEOUT,
});

// Common styles for all emails
const emailStyles = {
  body: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;',
  header: 'background-color: #3f51b5; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;',
  headerText: 'color: white; margin: 0; font-size: 24px; font-weight: bold;',
  logo: 'width: 80px; height: 80px; margin-bottom: 15px;',
  content: 'padding: 30px 25px; line-height: 1.6; color: #333333;',
  contentBox: 'background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);',
  heading: 'color: #3f51b5; font-size: 20px; margin-top: 0; margin-bottom: 20px; font-weight: bold;',
  paragraph: 'margin: 0 0 15px; font-size: 16px; line-height: 1.6;',
  highlight: 'font-weight: bold; color: #3f51b5;',
  button: 'display: inline-block; background-color: #3f51b5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; margin: 20px 0; border: none;',
  infoBox: 'background-color: #f5f7ff; border-left: 4px solid #3f51b5; padding: 15px; margin: 20px 0;',
  footer: 'margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666; text-align: center;',
  list: 'padding-left: 20px; margin: 15px 0;',
  listItem: 'margin-bottom: 10px;',
  chip: 'display: inline-block; padding: 5px 10px; border-radius: 16px; font-size: 14px; font-weight: 500; margin-right: 5px;',
  chipSuccess: 'background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;',
  chipWarning: 'background-color: #fff8e1; color: #f57f17; border: 1px solid #ffe082;',
  chipError: 'background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a;',
  signature: 'margin-top: 25px; font-style: italic;',
  divider: 'height: 1px; background-color: #eeeeee; margin: 25px 0; border: none;',
};

// Update the logo URL in all email templates
const LOGO_URL = 'https://i.imgur.com/yTSN5Ae.jpeg';

// Email templates
const emailTemplates = {
  // Volunteer email templates
  volunteerApplication: (name: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Received',
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Thank You for Volunteering!</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <h2 style="${emailStyles.heading}">Your Application Has Been Received</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">Thank you for your interest in volunteering with Dog Rescue Mission. We've received your application and appreciate your willingness to help our furry friends!</p>
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0;">Our team will review your application and get back to you within 3-5 business days. In the meantime, you can check the status of your application in your account dashboard.</p>
            </div>
            
            <p style="${emailStyles.paragraph}">If you have any questions or need to update your application, please don't hesitate to contact us.</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  
  volunteerApproved: (name: string, volunteerType: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Approved!',
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Application Approved!</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="${emailStyles.chip} ${emailStyles.chipSuccess}">Approved</span>
            </div>
            
            <h2 style="${emailStyles.heading}">Welcome to Our Volunteer Team!</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">We are delighted to inform you that your application to volunteer as a <strong>${volunteerType}</strong> with Dog Rescue Mission has been <span style="color: #2e7d32; font-weight: bold;">APPROVED</span>!</p>
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0; font-weight: bold;">Next Steps:</p>
              <ol style="${emailStyles.list}">
                <li style="${emailStyles.listItem}">Please visit our center during our operating hours to complete your orientation.</li>
                <li style="${emailStyles.listItem}">Bring a valid ID and any certifications relevant to your volunteer role.</li>
                <li style="${emailStyles.listItem}">We'll provide you with a volunteer handbook and schedule during orientation.</li>
              </ol>
            </div>
            
            <p style="${emailStyles.paragraph}">If you have any questions or need to reschedule your orientation, please contact our volunteer coordinator.</p>
            
            <p style="${emailStyles.paragraph}">We're excited to have you join our team and make a difference in the lives of our rescue dogs!</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  
  volunteerRejected: (name: string) => ({
    subject: 'Dog Rescue Mission - Volunteer Application Update',
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Application Update</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <h2 style="${emailStyles.heading}">Volunteer Application Status</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">Thank you for your interest in volunteering with Dog Rescue Mission.</p>
            
            <p style="${emailStyles.paragraph}">After careful consideration, we regret to inform you that we are unable to accept your volunteer application at this time. This decision could be due to various factors, including volunteer capacity, specific skills needed for current roles, or schedule compatibility.</p>
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0;">We encourage you to:</p>
              <ul style="${emailStyles.list}">
                <li style="${emailStyles.listItem}">Apply again in the future as our needs change</li>
                <li style="${emailStyles.listItem}">Consider other ways to support our mission, such as donations or attending our fundraising events</li>
              </ul>
            </div>
            
            <p style="${emailStyles.paragraph}">We sincerely appreciate your desire to help animals in need and thank you for your understanding.</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),

  // Adoption email templates
  adoptionApplication: (name: string, dogName: string) => ({
    subject: `Dog Rescue Mission - Adoption Application Received for ${dogName}`,
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Adoption Application Received</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <h2 style="${emailStyles.heading}">Thank You for Your Adoption Application!</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">We have received your application to adopt <span style="${emailStyles.highlight}">${dogName}</span>. Thank you for considering adoption and giving a rescue dog a forever home!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="${emailStyles.chip} ${emailStyles.chipWarning}">Application Under Review</span>
            </div>
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0; font-weight: bold;">What happens next?</p>
              <ul style="${emailStyles.list}">
                <li style="${emailStyles.listItem}">Our team will carefully review your application within 5-7 business days</li>
                <li style="${emailStyles.listItem}">We may contact you for additional information</li>
                <li style="${emailStyles.listItem}">If approved, we'll schedule a meet-and-greet with ${dogName}</li>
              </ul>
            </div>
            
            <p style="${emailStyles.paragraph}">In the meantime, you can check the status of your application through your user dashboard on our website.</p>
            
            <p style="${emailStyles.paragraph}">If you have any questions, please don't hesitate to contact us.</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  
  adoptionApproved: (name: string, dogName: string, adminNotes: string) => ({
    subject: `Dog Rescue Mission - Adoption Application Approved for ${dogName}!`,
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Congratulations!</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="${emailStyles.chip} ${emailStyles.chipSuccess}">Approved</span>
            </div>
            
            <h2 style="${emailStyles.heading}">Your Adoption Application Has Been Approved!</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">Congratulations! We are delighted to inform you that your application to adopt <span style="${emailStyles.highlight}">${dogName}</span> has been <span style="color: #2e7d32; font-weight: bold;">APPROVED</span>!</p>
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0; font-weight: bold;">Next steps:</p>
              <ol style="${emailStyles.list}">
                <li style="${emailStyles.listItem}">Please contact our adoption coordinator to schedule a time to finalize the adoption</li>
                <li style="${emailStyles.listItem}">Bring a valid ID and the adoption fee (details available on our website)</li>
                <li style="${emailStyles.listItem}">We recommend bringing a collar, leash, and carrier for safe transport home</li>
              </ol>
            </div>
            
            ${adminNotes ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 10px; font-weight: bold;">Note from our team:</p>
              <p style="margin: 0;">${adminNotes}</p>
            </div>
            ` : ''}
            
            <p style="${emailStyles.paragraph}">We're excited for ${dogName} to join your family and begin this new chapter!</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  
  adoptionRejected: (name: string, dogName: string, adminNotes: string) => ({
    subject: `Dog Rescue Mission - Adoption Application Update for ${dogName}`,
    html: `
      <div style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <img src="${LOGO_URL}" alt="Dog Rescue Mission Logo" style="${emailStyles.logo}" />
          <h1 style="${emailStyles.headerText}">Application Update</h1>
        </div>
        <div style="${emailStyles.contentBox}">
          <div style="${emailStyles.content}">
            <h2 style="${emailStyles.heading}">Adoption Application Status</h2>
            <p style="${emailStyles.paragraph}">Dear <span style="${emailStyles.highlight}">${name}</span>,</p>
            <p style="${emailStyles.paragraph}">Thank you for your interest in adopting ${dogName} from Dog Rescue Mission.</p>
            
            <p style="${emailStyles.paragraph}">After careful consideration, we regret to inform you that we are unable to approve your adoption application at this time.</p>
            
            ${adminNotes ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 10px; font-weight: bold;">Feedback from our team:</p>
              <p style="margin: 0;">${adminNotes}</p>
            </div>
            ` : ''}
            
            <div style="${emailStyles.infoBox}">
              <p style="margin: 0;">We encourage you to:</p>
              <ul style="${emailStyles.list}">
                <li style="${emailStyles.listItem}">Consider other dogs in our care that might be a better match for your situation</li>
                <li style="${emailStyles.listItem}">Apply again in the future when your circumstances may better align with our adoption requirements</li>
              </ul>
            </div>
            
            <p style="${emailStyles.paragraph}">We appreciate your understanding and your desire to provide a home for a rescue dog.</p>
            
            <div style="${emailStyles.divider}"></div>
            
            <p style="${emailStyles.signature}">Warm regards,<br>The Dog Rescue Mission Team</p>
            
            <div style="${emailStyles.footer}">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Dog Rescue Mission. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

/**
 * Send email with timeout and resilience
 * This function will not throw errors that would block application flow
 * It will log errors but allow the calling function to continue
 */
export const sendEmail = async (
  to: string,
  template: 'volunteerApplication' | 'volunteerApproved' | 'volunteerRejected' | 
           'adoptionApplication' | 'adoptionApproved' | 'adoptionRejected',
  data: { 
    name: string; 
    volunteerType?: string;
    dogName?: string;
    adminNotes?: string;
  }
) => {
  try {
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timed out')), EMAIL_TIMEOUT);
    });

    // Get the appropriate template
    let emailContent;
    switch (template) {
      case 'volunteerApplication':
        emailContent = emailTemplates.volunteerApplication(data.name);
        break;
      case 'volunteerApproved':
        if (!data.volunteerType) {
          console.warn('Volunteer type is missing for approval email, using default');
          emailContent = emailTemplates.volunteerApproved(data.name, data.volunteerType || 'Volunteer');
        } else {
          emailContent = emailTemplates.volunteerApproved(data.name, data.volunteerType);
        }
        break;
      case 'volunteerRejected':
        emailContent = emailTemplates.volunteerRejected(data.name);
        break;
      case 'adoptionApplication':
        if (!data.dogName) {
          console.warn('Dog name is missing for adoption application email, using default');
          emailContent = emailTemplates.adoptionApplication(data.name, data.dogName || 'this dog');
        } else {
          emailContent = emailTemplates.adoptionApplication(data.name, data.dogName);
        }
        break;
      case 'adoptionApproved':
        if (!data.dogName) {
          console.warn('Dog name is missing for adoption approval email, using default');
          emailContent = emailTemplates.adoptionApproved(data.name, data.dogName || 'this dog', data.adminNotes || '');
        } else {
          emailContent = emailTemplates.adoptionApproved(data.name, data.dogName, data.adminNotes || '');
        }
        break;
      case 'adoptionRejected':
        if (!data.dogName) {
          console.warn('Dog name is missing for adoption rejection email, using default');
          emailContent = emailTemplates.adoptionRejected(data.name, data.dogName || 'this dog', data.adminNotes || '');
        } else {
          emailContent = emailTemplates.adoptionRejected(data.name, data.dogName, data.adminNotes || '');
        }
        break;
      default:
        console.warn(`Invalid email template: ${template}, email not sent`);
        return { success: false, error: 'Invalid email template' };
    }

    // Prepare email options
    const mailOptions = {
      from: `"Dog Rescue Mission" <${process.env.EMAIL_FROM || 'noreply@dogrescuemission.com'}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    // Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      timeoutPromise
    ]) as nodemailer.SentMessageInfo;

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // Return failure but don't throw error to prevent blocking application flow
    return { success: false, error };
  }
}; 