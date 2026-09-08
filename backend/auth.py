from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from jose import jwt

load_dotenv()

ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")


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


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )