// EmailJS Service Configuration
// Replace these placeholder variables with your EmailJS credentials:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an Email Service (get SERVICE_ID)
// 3. Create an Email Template (get TEMPLATE_ID)
// 4. Get your Public Key under Account Settings (get PUBLIC_KEY)

export const EMAILJS_CONFIG = {
  SERVICE_ID: "YOUR_SERVICE_ID",
  TEMPLATE_ID: "YOUR_TEMPLATE_ID",
  PUBLIC_KEY: "YOUR_PUBLIC_KEY",
  DEFAULT_STRATEGIST_EMAIL: "strategist@brandagency.com",
};

export interface EmailSubmissionData {
  strategistEmail: string;
  senderName: string;
  senderEmail: string;
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  notes?: string;
}
