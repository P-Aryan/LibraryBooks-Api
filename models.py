#here, define the tables by extending the Base table (in database.py)
from sqlalchemy import Column, Integer, String
from database import Base

class Book(Base):
    __tablename__ = "books" #if not specified , class name is used as table name (in lowercase)

    id = Column(Integer,primary_key=True,index=True)
    title = Column(String,index=True)
    author = Column(String,index = True)
    genre = Column(String,index=True)