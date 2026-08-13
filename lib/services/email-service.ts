import * as nodemailer from "nodemailer";
import { google } from "googleapis";
import { Resend } from "resend";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const OAUTH_CONFIG = {
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  user: process.env.SMTP_USER || "contact@example.com",
};

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465,
};

const COMPANY_INFO = {
  name: process.env.COMPANY_NAME || "My CMS Site",
  email:
    process.env.RESEND_FROM_EMAIL ||
    process.env.SMTP_USER ||
    process.env.COMPANY_EMAIL ||
    "contact@example.com",
  adminEmail:
    process.env.RESEND_TO_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER ||
    "contact@example.com",
  ccEmail: process.env.ADMIN_CC_EMAIL || "",
  phone: process.env.COMPANY_PHONE || "",
  website: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string;
  fromName?: string;
};

async function sendViaResend(options: SendEmailOptions) {
  if (!resendClient) return null;

  const fromAddress = process.env.RESEND_FROM_EMAIL || COMPANY_INFO.email;
  const from = options.fromName
    ? `${options.fromName} <${fromAddress}>`
    : fromAddress;

  const { data, error } = await resendClient.emails.send({
    from,
    to: options.to,
    cc: options.cc || undefined,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getOAuth2AccessToken() {
  const oauth2Client = new google.auth.OAuth2(
    OAUTH_CONFIG.clientId,
    OAUTH_CONFIG.clientSecret,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: OAUTH_CONFIG.refreshToken,
  });

  const accessToken = await oauth2Client.getAccessToken();
  return accessToken.token;
}

const createTransport = async () => {
  if (
    OAUTH_CONFIG.clientId &&
    OAUTH_CONFIG.clientSecret &&
    OAUTH_CONFIG.refreshToken &&
    OAUTH_CONFIG.user
  ) {
    try {
      const accessToken = await getOAuth2AccessToken();

      return nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        auth: {
          type: "OAuth2",
          user: OAUTH_CONFIG.user,
          clientId: OAUTH_CONFIG.clientId,
          clientSecret: OAUTH_CONFIG.clientSecret,
          refreshToken: OAUTH_CONFIG.refreshToken,
          accessToken: accessToken,
        },
      });
    } catch (error) {
      console.error("Failed to create OAuth2 transporter:", error);
    }
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
};

async function sendEmail(options: SendEmailOptions) {
  if (resendClient) {
    try {
      const data = await sendViaResend(options);
      return { success: true as const, provider: "resend" as const, messageId: data?.id };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Resend send failed";
      console.error("Resend email failed:", message);
    }
  }

  const transporter = await createTransport();
  if (!transporter) {
    return { success: false as const, message: "Email service not configured" };
  }

  const info = await transporter.sendMail({
    from: `"${options.fromName || COMPANY_INFO.name}" <${COMPANY_INFO.email}>`,
    to: options.to,
    cc: options.cc || undefined,
    subject: options.subject,
    html: options.html,
  });

  return { success: true as const, provider: "smtp" as const, messageId: info.messageId };
}

export const sendEnquiryAutoReply = async (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
}) => {
  try {
    const result = await sendEmail({
      to: enquiry.email,
      fromName: COMPANY_INFO.name,
      subject: getSubjectByType(enquiry.type),
      html: generateEmailTemplate(enquiry),
    });

    if (!result.success) {
      console.log("Email service not configured, skipping auto-reply");
      return result;
    }

    console.log(`Auto-reply sent via ${result.provider}:`, result.messageId);
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send auto-reply email:", message);
    return { success: false, error: message };
  }
};

const getSubjectByType = (type: string): string => {
  switch (type) {
    case "product":
      return `Thank You for Your Product Enquiry - ${COMPANY_INFO.name}`;
    case "general_product":
      return `Thank You for Your Product Enquiry - ${COMPANY_INFO.name}`;
    case "general":
      return `Thank You for Contacting ${COMPANY_INFO.name}`;
    default:
      return `Thank You for Your Enquiry - ${COMPANY_INFO.name}`;
  }
};

const generateEmailTemplate = (enquiry: {
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
}): string => {
  const { name, type, productName, casNumber, message } = enquiry;

  const getEnquiryTypeText = () => {
    switch (type) {
      case "product":
        return "Product Enquiry";
      case "general_product":
        return "Product Enquiry";
      case "general":
        return "General Enquiry";
      default:
        return "Enquiry";
    }
  };

  const getEnquirySpecificContent = () => {
    if (type === "product" || type === "general_product") {
      return `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Enquiry Details:</h3>
          ${productName ? `<p style="margin: 5px 0;"><strong>Product Name:</strong> ${productName}</p>` : ""}
          ${casNumber ? `<p style="margin: 5px 0;"><strong>CAS Number:</strong> ${casNumber}</p>` : ""}
          ${message ? `<p style="margin: 5px 0;"><strong>Your Message:</strong></p><p style="margin: 5px 0; font-style: italic;">"${message}"</p>` : ""}
        </div>
      `;
    }
    return message
      ? `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Your Message:</h3>
        <p style="margin: 0; font-style: italic;">"${message}"</p>
      </div>
    `
      : "";
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Thank You for Your Enquiry</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #2563eb; margin: 0 0 20px 0; font-size: 24px;">Thank You, ${name}!</h1>
        <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 16px;">
          We have received your <strong>${getEnquiryTypeText()}</strong>. Our team will get back to you shortly.
        </p>
        ${getEnquirySpecificContent()}
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <p style="margin: 0; color: #1e3a8a; font-weight: 500;">
            Response time: we aim to reply within 24 business hours.
          </p>
        </div>
        <p style="margin: 5px 0; color: #4b5563;">Email: <a href="mailto:${COMPANY_INFO.adminEmail}" style="color: #2563eb;">${COMPANY_INFO.adminEmail}</a></p>
        ${COMPANY_INFO.phone ? `<p style="margin: 5px 0; color: #4b5563;">Phone: <a href="tel:${COMPANY_INFO.phone}" style="color: #2563eb;">${COMPANY_INFO.phone}</a></p>` : ""}
      </div>
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${COMPANY_INFO.name}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

export const sendAdminNotification = async (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
  phone?: string;
  company?: string;
}) => {
  try {
    const result = await sendEmail({
      to: COMPANY_INFO.adminEmail,
      cc: COMPANY_INFO.ccEmail || undefined,
      fromName: `${COMPANY_INFO.name} Enquiries`,
      subject: `New ${enquiry.type.replace("_", " ").toUpperCase()} Enquiry from ${enquiry.name}`,
      html: generateAdminNotificationTemplate(enquiry),
    });

    if (!result.success) {
      console.log("Email service not configured, skipping admin notification");
      return result;
    }

    console.log(
      `Admin notification sent via ${result.provider} to ${COMPANY_INFO.adminEmail}:`,
      result.messageId,
    );
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send admin notification email:", message);
    return { success: false, error: message };
  }
};

export type ConsultationPayload = {
  name: string;
  phone: string;
  shedDimension: string;
  shedUnit: string;
  kindOfShed: string;
  roofPuff: string;
  wallPuff: string;
  civilRequired: string;
  designRequired: string;
  subsidy: string;
  soilReportUrl?: string;
  soilReportName?: string;
};

/** KEIL project consultation form → admin inbox (Resend / SMTP) */
export const sendConsultationNotification = async (
  payload: ConsultationPayload,
) => {
  try {
    const site = COMPANY_INFO.website.replace(/\/$/, "");
    const soilLink = payload.soilReportUrl
      ? `${site}${payload.soilReportUrl}`
      : "";

    const rows: [string, string][] = [
      ["Name", payload.name],
      ["Phone", payload.phone],
      ["Shed Dimension (L × W × H)", `${payload.shedDimension} ${payload.shedUnit}`],
      ["Kind of Shed", payload.kindOfShed],
      ["Roof — PUF", payload.roofPuff],
      ["Wall — PUF", payload.wallPuff],
      ["Civil — Required", payload.civilRequired],
      ["Design — Required", payload.designRequired],
      ["Subsidy", payload.subsidy],
      [
        "Soil Report",
        soilLink
          ? `<a href="${soilLink}">${payload.soilReportName || "Download"}</a>`
          : "Not uploaded",
      ],
    ];

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; color: #1f2937; max-width: 640px; margin: 0 auto; padding: 20px;">
        <div style="background:#002B5B; color:#fff; padding:20px 24px; border-radius:8px 8px 0 0;">
          <p style="margin:0; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.85;">KEIL</p>
          <h1 style="margin:6px 0 0; font-size:22px;">New Project Consultation</h1>
        </div>
        <div style="border:1px solid #e5e7eb; border-top:0; padding:20px 24px; border-radius:0 0 8px 8px;">
          <p style="margin:0 0 16px; color:#6b7280; font-size:13px;">Received: ${new Date().toLocaleString()}</p>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            ${rows
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; width:40%; color:#6b7280; vertical-align:top;">${label}</td>
                <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-weight:600; color:#002B5B;">${value}</td>
              </tr>`,
              )
              .join("")}
          </table>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to: COMPANY_INFO.adminEmail,
      cc: COMPANY_INFO.ccEmail || undefined,
      fromName: "KEIL Consultations",
      subject: `KEIL Consultation — ${payload.name} (${payload.kindOfShed})`,
      html,
    });

    if (!result.success) {
      console.log("Email service not configured, skipping consultation email");
      return result;
    }

    console.log(
      `Consultation email sent via ${result.provider}:`,
      result.messageId,
    );
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send consultation email:", message);
    return { success: false as const, error: message };
  }
};

const generateAdminNotificationTemplate = (enquiry: {
  email: string;
  name: string;
  type: string;
  productName?: string;
  casNumber?: string;
  message?: string;
  phone?: string;
  company?: string;
}): string => {
  const { name, email, phone, company, type, productName, casNumber, message } =
    enquiry;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Enquiry Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #dc2626; margin: 0;">New Enquiry Received</h1>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Type: <strong>${type.replace("_", " ").toUpperCase()}</strong> | Received: ${new Date().toLocaleString()}</p>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0;">Customer Information</h2>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
        ${company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ""}
        ${
          productName || casNumber
            ? `
          <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Product Details</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            ${productName ? `<p style="margin: 5px 0;"><strong>Product Name:</strong> ${productName}</p>` : ""}
            ${casNumber ? `<p style="margin: 5px 0;"><strong>CAS Number:</strong> ${casNumber}</p>` : ""}
          </div>
        `
            : ""
        }
        ${
          message
            ? `
          <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Message</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `;
};
