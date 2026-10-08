import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

def send_otp_email(to_email: str, otp: str):

    params = {
        "from": "urlstack.in",
        "to": [to_email],
        "subject": "Verify your email - URL Shortener",
        "html": f"""
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        """
    }

    return resend.Emails.send(params)