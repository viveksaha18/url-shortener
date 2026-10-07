
from passlib.context import CryptContext
from dotenv import load_dotenv
from jose import jwt
import os
import secrets

load_dotenv()


# JWT Configuration
ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")


# JWT: Create Access Token
def create_access_token(user_id: int):
    payload = {
        "user_id": user_id
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# JWT: Verify Access Token
def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            return None

        return user_id

    except Exception:
        return None


# Password & OTP Hashing
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# OTP Generation
def generate_otp():
    return str(secrets.randbelow(900000) + 100000)

