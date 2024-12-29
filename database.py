from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./library.db"

#conect_args is specifically for sqlite, if check is false, other threads (who did not create the db can also use)
engine = create_engine(DATABASE_URL,connect_args={"check_same_thread":False})

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()