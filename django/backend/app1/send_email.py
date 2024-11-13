import smtplib
import environ
from email.mime.text import MIMEText


def send_email(to,otp):
    subject = "Reset Password"
    body = f"""
    Dear User,

    Your One-Time Password (OTP) is: {otp}
    This OTP is valid for 10 minutes and should not be shared with anyone.

    

    Thank you,
    cPhone
    """
    sender = "shijumkt@gmail.com"
    password = "xpoi zryw ktot dozm"
    recipients = [sender, to]
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = to
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(sender, password)
            smtp_server.sendmail(sender, to, msg.as_string())
        print("Message sent!")
    except smtplib.SMTPException as e:
        print(f"Failed to send email: {e}")


