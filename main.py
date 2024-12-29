from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dependencies import get_db
from models import Book
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost",  # Local development
    "http://127.0.0.1",  # Local development
    # "https://yourfrontend.com", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/get-message")
async def hello(name:str):
    return {'Message':'Hello '+ name}

#enter books
class BookCreate(BaseModel):
    id : int
    title : str
    author : str
    genre : str

@app.post("/books/")
def create_book(book:BookCreate,db:Session = Depends(get_db)):
    new = Book(id=book.id,title=book.title,author = book.author,genre=book.genre)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@app.get("/books/")
def getBooksAll(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    if not books:
        raise HTTPException(status_code=404,detail="No Books Found")
    return books

@app.get("/books/{id}")
def get_book(id : int, db:Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.put("/books/{id}")
def update(id:int , updated : BookCreate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.title = updated.title
    book.author = updated.author
    book.genre = updated.genre
    db.commit()
    db.refresh(book)
    return {"message": "Book updated successfully", "book": book}

@app.delete("/books/{id}")
def delete_book(id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}