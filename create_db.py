from database import engine, Base
from models import Book  # Import all your models here

# Create all tables in the database
Base.metadata.create_all(bind=engine)