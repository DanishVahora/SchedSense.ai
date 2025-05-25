from retrive_data.db import ProviderSessionLocal
from retrive_data.models import ServiceProvider, TimeSlot
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_provider_time_slots(provider_name: str, date: str):
    """Get available time slots for a provider on a specific date"""
    session: Session = ProviderSessionLocal()
    try:
        # Use last name, case-insensitive matching
        last_name = provider_name.strip().split()[-1].lower()

        # Find provider by name (case-insensitive, partial match)
        provider = session.query(ServiceProvider).filter(
            func.lower(ServiceProvider.name).like(f"%{last_name}%")
        ).first()

        if not provider:
            logger.warning(f"Provider not found: {provider_name}")
            return {"error": "Provider not found", "provider_searched": provider_name}

        # Parse date string to ensure proper format
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD", "date_provided": date}

        # Get time slots for the provider on the specified date
        slots = session.query(TimeSlot).filter(
            TimeSlot.provider_id == provider.id,
            TimeSlot.date == date_obj
        ).order_by(TimeSlot.time).all()

        if not slots:
            return {
                "provider": provider.name,
                "service_type": provider.service_type,
                "date": date,
                "available_slots": [],
                "message": "No time slots available for this date"
            }

        available_slots = []
        for slot in slots:
            available_spots = max(0, slot.capacity - slot.booked)
            available_slots.append({
                "time": slot.time.strftime('%H:%M'),
                "available_spots": available_spots,
                "total_capacity": slot.capacity,
                "currently_booked": slot.booked,
                "is_available": available_spots > 0
            })

        return {
            "provider": provider.name,
            "service_type": provider.service_type,
            "date": date,
            "available_slots": available_slots,
            "total_slots": len(available_slots)
        }

    except Exception as e:
        logger.error(f"Error retrieving time slots: {str(e)}")
        return {"error": f"Database error: {str(e)}"}
    finally:
        session.close()


def get_providers():
    """Get all service providers"""
    session = ProviderSessionLocal()
    try:
        providers = session.query(ServiceProvider).order_by(ServiceProvider.name).all()

        provider_list = []
        for provider in providers:
            provider_list.append({
                "id": str(provider.id),
                "name": provider.name,
                "email": provider.email,
                "phone": provider.phone,
                "service_type": provider.service_type,
                "created_at": provider.created_at.isoformat() if provider.created_at else None
            })

        return provider_list

    except Exception as e:
        logger.error(f"Error retrieving providers: {str(e)}")
        return {"error": f"Database error: {str(e)}"}
    finally:
        session.close()


def get_provider_by_name(provider_name: str):
    """Get provider details by name (supports partial matching)"""
    session = ProviderSessionLocal()
    try:
        # Extract the last word (likely the last name) for flexible matching
        last_name = provider_name.strip().split()[-1].lower()

        # Find any provider whose name contains the search term (case-insensitive)
        provider = session.query(ServiceProvider).filter(
            func.lower(ServiceProvider.name).like(f"%{last_name}%")
        ).first()

        if not provider:
            logger.warning(f"Provider not found: {provider_name}")
            return {"error": "Provider not found", "searched_name": provider_name}

        # Get upcoming time slots count for this provider
        upcoming_slots_count = session.query(TimeSlot).filter(
            TimeSlot.provider_id == provider.id,
            TimeSlot.date >= datetime.now().date()
        ).count()

        return {
            "id": str(provider.id),
            "name": provider.name,
            "email": provider.email,
            "phone": provider.phone,
            "service_type": provider.service_type,
            "created_at": provider.created_at.isoformat() if provider.created_at else None,
            "upcoming_slots_available": upcoming_slots_count
        }

    except Exception as e:
        logger.error(f"Error retrieving provider: {str(e)}")
        return {"error": f"Database error: {str(e)}"}
    finally:
        session.close()


def get_provider_availability_summary(provider_name: str, days: int = 7):
    """Get availability summary for a provider for the next N days"""
    session = ProviderSessionLocal()
    try:
        last_name = provider_name.strip().split()[-1].lower()
        provider = session.query(ServiceProvider).filter(
            func.lower(ServiceProvider.name).like(f"%{last_name}%")
        ).first()

        if not provider:
            return {"error": "Provider not found"}

        from datetime import date, timedelta
        start_date = date.today()
        end_date = start_date + timedelta(days=days)

        slots = session.query(TimeSlot).filter(
            TimeSlot.provider_id == provider.id,
            TimeSlot.date >= start_date,
            TimeSlot.date <= end_date
        ).order_by(TimeSlot.date, TimeSlot.time).all()

        daily_summary = {}
        for slot in slots:
            date_str = slot.date.strftime('%Y-%m-%d')
            if date_str not in daily_summary:
                daily_summary[date_str] = {
                    "total_slots": 0,
                    "available_spots": 0,
                    "total_capacity": 0
                }

            daily_summary[date_str]["total_slots"] += 1
            daily_summary[date_str]["available_spots"] += max(0, slot.capacity - slot.booked)
            daily_summary[date_str]["total_capacity"] += slot.capacity

        return {
            "provider": provider.name,
            "service_type": provider.service_type,
            "summary_period": f"{start_date} to {end_date}",
            "daily_availability": daily_summary
        }

    except Exception as e:
        logger.error(f"Error retrieving availability summary: {str(e)}")
        return {"error": f"Database error: {str(e)}"}
    finally:
        session.close()
