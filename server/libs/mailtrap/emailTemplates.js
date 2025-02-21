export const EMAIL_VERIFICATION_TEMPLATE = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Tech Haven</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .header {
      background: linear-gradient(to right, #007bff, #0056b3);
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px 50px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .code {
      text-align: center;
      margin: 30px 0;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #007bff;
      background: #eef5ff;
      padding: 15px;
      border-radius: 5px;
      display: inline-block;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Verify Your Email</h1>
  </div>
  <div class="container">
    <p>Hello <strong>{{USERNAME}}</strong>,</p>
    <p>Welcome to Tech Haven! Please use the verification code below to verify your email:</p>
    <div class="code">{{VERIFICATION_CODE}}</div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code expires in <strong>15 minutes</strong> for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br><strong>Tech Haven Team</strong></p>
  </div>
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>

`;
