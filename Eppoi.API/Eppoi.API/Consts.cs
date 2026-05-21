namespace Eppoi.API
{
    public static class Consts
    {
        // Token claims
        public const string PurposeEmailVerification = "email_verification";

        // API Response Messages
        public const string EmailExists = "An account with this email already exists.";
        public const string UsernameTaken = "This username is already taken.";
        public const string UserRegistered = "User registered successfully. Please check your email to verify your account.";
        public const string InvalidCredentials = "Invalid credentials.";
        public const string EmailNotVerified = "Please verify your email address before logging in.";
        public const string LoginSuccessful = "Login successful.";

        // Email Data
        public const string EmailVerificationSubject = "Eppoi - Verify your registration";

        public static string GetEmailVerificationBody(string username, string verificationLink) => $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                <h2 style='color: #2c3e50;'>Welcome to Eppoi, {username}!</h2>
                <p>Thank you for registering. You are almost ready to start.</p>
                <p>To activate your account and confirm your email address, click the button below:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{verificationLink}' style='background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Verify Email Address</a>
                </div>
                <p style='font-size: 12px; color: #7f8c8d;'>This link will expire in 24 hours. If you did not request this registration, you can ignore this email.</p>
            </div>";

        // HTML Responses for Verification Endpoint
        public const string HtmlMissingToken = "<h2>Error: Missing token.</h2>";
        public const string HtmlInvalidToken = "<h2>Error: The link has expired or is invalid. Please register again or request a new link.</h2>";
        public const string HtmlInvalidTokenType = "<h2>Error: Invalid token type.</h2>";
        public const string HtmlInvalidUserData = "<h2>Error: Invalid user data in token.</h2>";
        public const string HtmlUserNotFound = "<h2>Error: User not found in the system.</h2>";
        public const string HtmlEmailAlreadyVerified = "<h2>Email is already verified!</h2><p>You can close this page and log into the app.</p>";
        public const string HtmlVerificationSuccess = @"
            <html>
            <body style='font-family: Arial, sans-serif; text-align: center; padding-top: 50px; background-color: #f8f9fa;'>
                <h1 style='color: #2ecc71;'>&#10004; Email successfully verified!</h1>
                <p style='font-size: 18px; color: #333;'>Thank you for confirming your address.</p>
                <p style='color: #666;'>You can now return to the application and log in.</p>
            </body>
            </html>";
    }
}