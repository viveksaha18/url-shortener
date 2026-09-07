from fastapi import FastAPI, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
import models

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Connected Successfully"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return "Database session created successfull"