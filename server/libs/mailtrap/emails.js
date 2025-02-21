import { EMAIL_VERIFICATION_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationToken = async (email, name, verificationToken) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
          from: sender,
          to: recipients,
          subject: "Verify your email",
          html: EMAIL_VERIFICATION_TEMPLATE.replace("{{USERNAME}}", name).replace("{{VERIFICATION_CODE}}", verificationToken),
          category: "Email Verification",
        })

        console.log("Email sent successfully", response);

        return true

    } catch (error) {
        console.error("Error sending verification token: ", error);
        return false
    }
}