from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from datetime import datetime
from uuid import uuid4
import os
from sqlalchemy import create_engine, Column, String, TIMESTAMP, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import psycopg2
from psycopg2 import sql

# Import data retrieval functions
from retrive_data.data_retrieval import get_provider_time_slots, get_providers, get_provider_by_name

app = FastAPI()

# PostgreSQL connection configuration
DB_HOST = os.getenv("DB_HOST", "postgres_db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "user_service_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    provider_name = Column(String, nullable=False)
    service_type = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    available_spots = Column(Integer, nullable=True)
    booking_reference = Column(String, nullable=False, unique=True)
    status = Column(String, nullable=False, default="confirmed")
    booked_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "booking-agent-service"}

# Data Retrieval Endpoints (Agent Tools)
@app.get("/provider-time-slots/{provider_name}/{date}")
async def provider_time_slots(provider_name: str, date: str):
    """Get available time slots for a provider on a specific date"""
    try:
        result = get_provider_time_slots(provider_name, date)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to retrieve time slots: {str(e)}"}
        )

@app.get("/providers")
async def list_providers():
    """Get all service providers"""
    try:
        result = get_providers()
        return {"providers": result}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to retrieve providers: {str(e)}"}
        )

@app.get("/provider/{provider_name}")
async def get_provider(provider_name: str):
    """Get provider details by name"""
    try:
        result = get_provider_by_name(provider_name)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to retrieve provider: {str(e)}"}
        )

@app.post("/book")
async def book_slot(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Invalid JSON format",
                "booking_reference": None
            }
        )

    required_fields = ["provider_name", "service_type", "date", "time_slot", "booking_reference"]
    missing = [f for f in required_fields if not data.get(f)]

    if missing:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": f"Missing required fields: {', '.join(missing)}",
                "booking_reference": None
            }
        )

    db = SessionLocal()
    try:
        # Check if booking reference already exists
        existing_booking = db.query(Booking).filter(
            Booking.booking_reference == data["booking_reference"]
        ).first()

        if existing_booking:
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "message": "Booking reference already exists",
                    "booking_reference": data["booking_reference"]
                }
            )

        booking = Booking(
            provider_name=data["provider_name"],
            service_type=data["service_type"],
            date=data["date"],
            time_slot=data["time_slot"],
            available_spots=data.get("available_spots"),
            booking_reference=data["booking_reference"],
            status="confirmed",
            booked_at=datetime.utcnow()
        )

        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {
            "success": True,
            "message": f"Booking confirmed for {booking.provider_name} ({booking.service_type}) on {booking.date} at {booking.time_slot}.",
            "booking_reference": booking.booking_reference,
            "booking_id": booking.id
        }

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Booking failed: {str(e)}",
                "booking_reference": None
            }
        )
    finally:
        db.close()

@app.get("/bookings/{booking_reference}")
async def get_booking(booking_reference: str):
    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(
            Booking.booking_reference == booking_reference
        ).first()

        if not booking:
            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "message": "Booking not found"
                }
            )

        return {
            "success": True,
            "booking": {
                "id": booking.id,
                "provider_name": booking.provider_name,
                "service_type": booking.service_type,
                "date": booking.date,
                "time_slot": booking.time_slot,
                "available_spots": booking.available_spots,
                "booking_reference": booking.booking_reference,
                "status": booking.status,
                "booked_at": booking.booked_at.isoformat()
            }
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Error retrieving booking: {str(e)}"
            }
        )
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
