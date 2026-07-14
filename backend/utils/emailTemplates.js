const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7fa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0077b6, #00b4d8); padding: 30px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: #e0f7fa; margin: 5px 0 0; font-size: 14px; }
    .content { padding: 30px; color: #333; line-height: 1.6; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0077b6, #00b4d8); color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: linear-gradient(135deg, #005f8a, #0096b7); }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
    .highlight { background: #e0f7fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0077b6; margin: 15px 0; }
    .warning { background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sheger Health Connect</h1>
      <p>Your Health, Our Priority</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Sheger Health Connect. All rights reserved.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`;

const emailTemplates = {
  verification: (name, token) => ({
    subject: 'Verify Your Email - Sheger Health Connect',
    html: baseTemplate('Verify Your Email', `
      <h2>Welcome, ${name}! 👋</h2>
      <p>Thank you for registering with <strong>Sheger Health Connect</strong>. We're excited to have you on board!</p>
      <p>Please verify your email address to activate your account and start using our services.</p>
      <div class="highlight">
        <strong>Why verify?</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Book appointments with doctors</li>
          <li>Access your medical records</li>
          <li>Get health recommendations</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${FRONTEND_URL}/verify-email/${token}" class="btn">Verify Email Address</a>
      </div>
      <p class="warning"><strong>Note:</strong> This link expires in 24 hours.</p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0077b6;">${FRONTEND_URL}/verify-email/${token}</p>
    `)
  }),

  passwordReset: (name, token) => ({
    subject: 'Reset Your Password - Sheger Health Connect',
    html: baseTemplate('Reset Your Password', `
      <h2>Password Reset Request</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset your password for your Sheger Health Connect account.</p>
      <div class="highlight">
        <strong>What happens next?</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Click the button below to create a new password</li>
          <li>You'll be redirected to a secure page</li>
          <li>Your old password will be replaced</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${FRONTEND_URL}/resetpassword/${token}" class="btn">Reset Password</a>
      </div>
      <p class="warning"><strong>Important:</strong> This link expires in 10 minutes for security reasons.</p>
      <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0077b6;">${FRONTEND_URL}/resetpassword/${token}</p>
    `)
  }),

  welcomeVerified: (name) => ({
    subject: 'Account Verified! Welcome - Sheger Health Connect',
    html: baseTemplate('Account Verified', `
      <h2>Your Account is Ready! 🎉</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Great news! Your email has been verified and your account is now active.</p>
      <div class="highlight">
        <strong>You can now:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Sign in to your account</li>
          <li>Book appointments with doctors</li>
          <li>View your medical records</li>
          <li>Use our AI health assistant</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${FRONTEND_URL}/login" class="btn">Sign In Now</a>
      </div>
      <p>If you have any questions, feel free to contact our support team.</p>
    `)
  })
};

module.exports = emailTemplates;
