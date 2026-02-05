import { Verification_Email_Template, Welcome_Email_Template, Reset_Password_Email_Template, Password_Change_Success_Template, Reset_Password_OTP_Template } from "./EmailTemplate.js";
import { resend, transporter } from "./Email.config.js";
import { marketPlace } from "../consts.js";
import { getEmailTranslation } from "./EmailLocalizations.js";

// ... existing imports ...

// ... existing code ...

export const sendPasswordChangeSuccessEmail = async (email, name, lang = 'english') => {
  try {
    const t = getEmailTranslation(lang);

    // Create localized HTML by replacing placeholders with translated text
    let htmlContent = Password_Change_Success_Template
      .replace("{name}", name)
      .replace("{title}", t.successTitle)
      .replace("{body}", t.successBody)
      .replace("{contact}", t.successContact)
      .replace("A-Series - Secure & Intelligent AI Solutions", t.footer); // Replace footer if hardcoded

    // If template has specific ID placeholders, we might need to adjust template. 
    // For now, let's assume we inject these values.
    // Actually, the template uses hardcoded text. We need to dynamicize the TEMPLATE itself 
    // OR we just use English for now and only change the subject?
    // User asked "msg that is coming in users mail... should apply language translation".
    // So I MUST update the template to accept these placeholders {body}, {title}, etc.

    // Let's use a simpler approach: Reconstruct the HTML here or pass variables to template.
    // I will replace specific English phrases in the template with variables.

    // Let's use a simpler approach: Reconstruct the HTML here or pass variables to template.
    // I will replace specific English phrases in the template with variables.

    htmlContent = htmlContent
      .replace("Password Changed", t.successTitle)
      .replace("Hello {name},", t.otpGreeting.replace("{name}", name))
      .replace("Your password for A-Series has been successfully updated.", t.successBody)
      .replace("If you did not make this change, please contact our support team immediately.", t.successContact)
      .replace("Secure & Intelligent AI Solutions", t.footer.replace("A-Series - ", ""));


    const response = await resend.emails.send({
      from: `A-Series <${process.env.EMAIL}>`,
      to: [email],
      subject: t.successSubject,
      html: htmlContent
    })
    console.log("resend_msg", response);
  } catch (error) {
    console.log('Email error', error)
  }
}


export const sendResetPasswordOTPEmail = async (email, name, otp, lang = 'english') => {
  try {
    const t = getEmailTranslation(lang);

    // Replace hardcoded English in Template with localized strings
    let htmlContent = Reset_Password_OTP_Template
      .replace("{name}", name)
      .replace("{otp}", otp)
      .replace("Password Reset OTP", t.otpTitle)
      .replace("Hello {name},", t.otpGreeting.replace("{name}", name))
      .replace("You requested to reset your password. Use the OTP below to proceed:", t.otpBody)
      .replace("This code expires in 15 minutes.", t.otpExpire)
      .replace("If you didn't request this, safely ignore this email.", t.otpIgnore)
      .replace("Secure & Intelligent AI Solutions", t.footer.replace("A-Series - ", ""));

    const response = await resend.emails.send({
      from: `A-Series <${process.env.EMAIL}>`,
      to: [email],
      subject: t.otpSubject,
      html: htmlContent
    })
    console.log("resend_msg", response);
  } catch (error) {
    console.log('Email error', error)
  }
}



export const sendVerificationEmail = async (email, name, verificationCode) => {
  try {
    const response = await resend.emails.send({
      from: `A-Series <${process.env.EMAIL}>`,
      to: [email],
      subject: "Verify Your Email",
      html: Verification_Email_Template.replace("{name}", name).replace("{verificationCode}", verificationCode)
    })
    console.log("resend_msg", response);

  } catch (error) {
    console.log('Email error', error)
  }
}

// WELCOME EMAIL
export const welcomeEmail = async (name, email) => {
  const info = await resend.emails.send({
    from: `A-Series <${process.env.EMAIL}>`,
    to: [email],
    subject: `Welcome ${name}`,
    html: Welcome_Email_Template.replace("{name}", name).replace("{dashboardUrl}", marketPlace),
  });

};

export const sendResetPasswordEmail = async (email, name, resetUrl) => {
  try {
    const response = await resend.emails.send({
      from: `A-Series <${process.env.EMAIL}>`,
      to: [email],
      subject: "Reset Your Password",
      html: Reset_Password_Email_Template.replace("{name}", name).replace("{resetUrl}", resetUrl)
    })
    console.log("resend_msg", response);
  } catch (error) {
    console.log('Email error', error)
  }
}



