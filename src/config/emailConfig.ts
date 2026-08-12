// Email Configuration - Web3Forms Integration
// Documentation: https://web3forms.com

export const EMAIL_CONFIG = {
  WEB3FORMS_ACCESS_KEY: "83422139-030e-4dec-8082-92bbec276f0f",
  STRATEGIST_EMAIL: "imnotjustanybody@gmail.com",
};

// Legacy EmailJS config (deprecated - using Web3Forms now)
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
  notes?: string;
}
