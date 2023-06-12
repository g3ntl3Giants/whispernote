# db_model.py

import os
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from contextlib import contextmanager

DATABASE_URL = os.getenv("DB_URI")

engine = create_engine(DATABASE_URL)

@contextmanager
def SessionLocal():
    """Provide a transactional scope around a series of operations."""
    session = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()

Base = declarative_base()

class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    transcription = Column(Text, nullable=False)