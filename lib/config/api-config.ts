// Central API Configuration
// All API endpoints and keys should be managed here

export const API_CONFIG = {
  // NIDA Verification API
  NIDA: {
    ENDPOINT: process.env.NIDA_API_ENDPOINT || "https://nida.go.tz/api/v1/verify",
    API_KEY: process.env.NIDA_API_KEY || "",
  },

  // Tanzania Credit Bureau
  CREDIT_BUREAU: {
    ENDPOINT: process.env.TZ_CRB_ENDPOINT || "",
    API_KEY: process.env.TZ_CRB_API_KEY || "",
  },

  // Payment Integrations
  MPESA: {
    CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || "",
    CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || "",
    SHORTCODE: process.env.MPESA_SHORTCODE || "",
    PASSKEY: process.env.MPESA_PASSKEY || "",
    CALLBACK_URL: process.env.MPESA_CALLBACK_URL || "",
  },

  PESAPAL: {
    CONSUMER_KEY: process.env.PESAPAL_CONSUMER_KEY || "",
    CONSUMER_SECRET: process.env.PESAPAL_CONSUMER_SECRET || "",
  },

  // SMS Service (Africa's Talking)
  SMS: {
    USERNAME: process.env.AFRICASTALKING_USERNAME || "",
    API_KEY: process.env.AFRICASTALKING_API_KEY || "",
    SENDER_ID: process.env.AFRICASTALKING_SENDER_ID || "PropertyFlow",
  },

  // Email Service (SendGrid)
  EMAIL: {
    API_KEY: process.env.SENDGRID_API_KEY || "",
    FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || "noreply@propertyflow.co.tz",
  },

  // File Storage (AWS S3)
  STORAGE: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "propertyflow-documents",
    REGION: process.env.AWS_REGION || "af-south-1",
  },

  // Google Maps
  MAPS: {
    API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  },

  // DocuSign (Digital Signatures)
  DOCUSIGN: {
    INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY || "",
    USER_ID: process.env.DOCUSIGN_USER_ID || "",
    ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID || "",
  },

  // Monitoring
  SENTRY: {
    DSN: process.env.SENTRY_DSN || "",
  },
}

// Helper function to check if API is configured
export const isAPIConfigured = (service: keyof typeof API_CONFIG): boolean => {
  const config = API_CONFIG[service]
  return Object.values(config).every((value) => value !== "")
}
