from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta
import models
import schemas
import auth
import random
import string
import email_service
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Vercel production
        "https://url-shortener-virid-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


security = HTTPBearer()


Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Connected Successfully"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return "Database session created successfully"


@app.post("/register", response_model=schemas.MessageResponse)
def registerUser(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        return {"message": "Email already Registered"}

    hashed_password = auth.hash_password(user.password)

    otp = auth.generate_otp()

    otp_hash = auth.hash_password(otp)

    verification = models.EmailVerification(
        email=user.email,
        hashed_password=hashed_password,
        otp_hash=otp_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        attempts=0
    )

    db.add(verification)
    db.commit()

    email_service.send_otp_email(user.email, otp)
    return {"message": "Verification OTP Sent"}

@app.post("/register/verify", response_model=schemas.UserResponse)
def verify_email(
    request: schemas.VerifyEmailRequest,
    db: Session = Depends(get_db)
):
    # 1. Find pending verification
    verification = db.query(models.EmailVerification).filter(
        models.EmailVerification.email == request.email
    ).first()

    if not verification:
        raise HTTPException(
            status_code=404,
            detail="Verification request not found"
        )

    # 2. Check OTP attempts
    if verification.attempts >= 5:
        db.delete(verification)
        db.commit()

        raise HTTPException(
            status_code=429,
            detail="Too many incorrect attempts. Please register again."
        )

    # 3. Check OTP expiry
    if datetime.utcnow() > verification.expires_at:
        db.delete(verification)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired. Please register again."
        )

    # 4. Verify OTP
    if not auth.verify_password(
        request.otp,
        verification.otp_hash
    ):
        verification.attempts += 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # 5. Check whether user was somehow already created
    existing_user = db.query(models.User).filter(
        models.User.email == verification.email
    ).first()

    if existing_user:
        db.delete(verification)
        db.commit()

        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    # 6. Create actual user
    new_user = models.User(
        email=verification.email,
        hashed_password=verification.hashed_password
    )

    db.add(new_user)

    # 7. Delete temporary verification record
    db.delete(verification)

    # 8. Save everything
    db.commit()
    db.refresh(new_user)

    return new_user

# Login API
@app.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing_user:
        return "User Not Found"

    if not auth.verify_password(
        user.password,
        existing_user.hashed_password
    ):
        return "Enter a valid password"

    token = auth.create_access_token(existing_user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# JWT Authentication Dependency
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    user_id = auth.verify_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return user_id


# Test Email Verification System
@app.get("/test-email")
def test_email():
    return email_service.send_test_email("viveksaha096@gmail.com")

# Protected Route
@app.get("/profile")
def profile(
    user_id: int = Depends(get_current_user)
):

    return {
        "message": "You are authenticated",
        "user_id": user_id
    }


def generate_short_code(db, length=6):
    characters = string.ascii_letters + string.digits

    while True:
        code = ''.join(
            random.choice(characters)
            for _ in range(length)
        )

        existing_url = db.query(models.URL).filter(
            models.URL.short_code == code
        ).first()

        if existing_url is None:
            return code


@app.post("/url")
def create_url(
    url_data: schemas.URLCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    short_code = generate_short_code(db)

    new_url = models.URL(
        long_url=url_data.url,
        short_code=short_code,
        user_id=user_id
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    return new_url

@app.get("/{short_code}")
def redirect_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = db.query(models.URL).filter(
        models.URL.short_code == short_code
    ).first()

    if url is None:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    return RedirectResponse(url=url.long_url)

