from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, Ticket

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # React's exact addresses
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# 1. The Pydantic Model (The Bouncer / Internet Form)
# The form for POST (Creating)
class TicketCreate(BaseModel):
    title: str
    description: str

# The form for PUT (Updating)
class TicketUpdate(BaseModel):
    status: str
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. Our Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to BugTrackr!"}

@app.get("/status")
def server_status():
    return {"status": "Server is running perfectly!"}

@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int):
    return {"ticket_id": ticket_id, "status": "In Progress"}

@app.get("/tickets")
def get_all_tickets(db: Session = Depends(get_db)):
    all_tickets= db.query(Ticket).all()
    return all_tickets

@app.post("/tickets")
def create_ticket(new_ticket: TicketCreate, db: Session = Depends(get_db)):

    db_ticket= Ticket(
        title= new_ticket.title,
        description= new_ticket.description
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return {"message": "Ticket created successfully!", "ticket": db_ticket}

@app.put("/tickets/{ticket_id}")
def update_ticket_status(
    ticket_id: int, 
    update_data: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket_to_update = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket_to_update:
        return {"error": "Ticket not found"}
    
    ticket_to_update.status = update_data.status
    db.commit()
    
    return {"message": "Ticket updated!", "new_status": ticket_to_update.status}


@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id:int, db: Session= Depends(get_db)):
    ticket_to_delete = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket_to_delete:
        return {"error": "Ticket not found"}
    db.delete(ticket_to_delete)
    db.commit()
    return {"message": "Ticket deleted successfully!"}