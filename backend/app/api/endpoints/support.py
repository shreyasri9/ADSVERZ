from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.endpoints.auth import get_current_user, RoleChecker
from app.models.all_models import User, SupportTicket
from app.schemas.all_schemas import SupportTicketCreate, SupportTicketResponse, SupportTicketReply

router = APIRouter()

# Guards
any_user_guard = get_current_user
admin_guard = RoleChecker(["admin"])

@router.post("/", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(any_user_guard)
):
    """File a support ticket (for Brand or Hospital users)."""
    db_ticket = SupportTicket(
        user_id=current_user.id,
        subject=ticket_in.subject,
        category=ticket_in.category,
        message=ticket_in.message,
        status="open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    t_schema = SupportTicketResponse.model_validate(db_ticket)
    t_schema.user_email = current_user.email
    return t_schema


@router.get("/", response_model=List[SupportTicketResponse])
def get_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(any_user_guard)
):
    """Get all tickets filed by the logged-in user. If Admin, returns all system tickets."""
    if current_user.role == "admin":
        tickets = db.query(SupportTicket).all()
    else:
        tickets = db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).all()
        
    result = []
    for t in tickets:
        t_schema = SupportTicketResponse.model_validate(t)
        t_schema.user_email = t.user.email if t.user else "Deleted User"
        result.append(t_schema)
    return result


@router.post("/{ticket_id}/reply", response_model=SupportTicketResponse)
def reply_to_ticket(
    ticket_id: int,
    reply_in: SupportTicketReply,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_guard)
):
    """Submit an admin response to a ticket."""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found."
        )
        
    ticket.admin_reply = reply_in.admin_reply
    ticket.status = reply_in.status
    db.commit()
    db.refresh(ticket)
    
    t_schema = SupportTicketResponse.model_validate(ticket)
    t_schema.user_email = ticket.user.email if ticket.user else "Deleted User"
    return t_schema


@router.post("/{ticket_id}/close", response_model=SupportTicketResponse)
def close_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(any_user_guard)
):
    """Close a support ticket. Users can close their own, and admins can close any."""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found."
        )
        
    # Check ownership
    if current_user.role != "admin" and ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to close this ticket."
        )
        
    ticket.status = "closed"
    db.commit()
    db.refresh(ticket)
    
    t_schema = SupportTicketResponse.model_validate(ticket)
    t_schema.user_email = ticket.user.email if ticket.user else "Deleted User"
    return t_schema
