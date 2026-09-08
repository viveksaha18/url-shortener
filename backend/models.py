from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    urls = relationship("URL", back_populates="owner")


class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True)
    long_url = Column(String, nullable=False)
    short_code = Column(String, unique=True, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship("User", back_populates="urls")