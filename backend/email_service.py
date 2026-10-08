import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_email(to_email: str, subject: str, html_content: str):
    msg = EmailMessage()

    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject

    # Plain-text fallback
    msg.set_content("Please view this email in an HTML-compatible email client.")

    # HTML version
    msg.add_alternative(html_content, subtype="html")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    return True


def send_otp_email(to_email: str, otp: str):
    html_content = f"""
    <html>
        <body>
            <h2>Email Verification</h2>

            <p>Your OTP is:</p>

            <h1>{otp}</h1>

            <p>This OTP will expire in 10 minutes.</p>

            <p>
                If you did not request this, please ignore this email.
            </p>
        </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject="Verify your email - URL Shortener",
        html_content=html_content
    )


def send_test_email(to_email: str):
    html_content = """
    <html>
        <body>
            <h2>Gmail SMTP Test</h2>
            <p>Your Gmail SMTP integration is working successfully.</p>
        </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject="URL Shortener - SMTP Test",
        html_content=html_content
    )
