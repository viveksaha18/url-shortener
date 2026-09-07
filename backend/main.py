from fastapi import FastAPI, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
import models
import schemas
import auth
app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Connected Successfully"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return "Database session created successfull"

@app.post("/register")
def registerUser(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()
    if existing_user:
        return {"message" : "Email already Registered"}

    hashed_password = auth.hash_password(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)