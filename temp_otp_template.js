export const Reset_Password_OTP_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - AI Mall</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #ddd; }
        .header { background-color: #FF5733; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; font-weight: bold; }
        .content { padding: 30px 25px; }
        .otp-code { display: block; margin: 25px 0; font-size: 32px; color: #FF5733; background: #fff0eb; border: 2px dashed #FF5733; padding: 20px; text-align: center; border-radius: 8px; font-weight: bold; letter-spacing: 4px; font-family: 'Courier New', monospace; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset OTP</h1>
        </div>
        <div class="content">
            <p>Hello {name},</p>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            <span class="otp-code">{otp}</span>
            <p>This code expires in 15 minutes.</p>
            <p>If you didn't request this, safely ignore this email.</p>
        </div>
        <div class="footer">
            <p><strong>AI Mall</strong> - Secure & Intelligent AI Solutions</p>
        </div>
    </div>
</body>
</html>
`;
