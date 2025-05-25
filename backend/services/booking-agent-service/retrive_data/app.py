from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from retrive_data.data_retrieval import (
    get_provider_time_slots,
    get_providers,
    get_provider_by_name,
    get_provider_availability_summary
)
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Booking Agent Data Retrieval Service",
    description="Data retrieval service for booking agents to access provider and time slot information",
    version="1.0.0"
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "booking-agent-data-retrieval",
        "version": "1.0.0"
    }

@app.get("/provider-time-slots/{provider_name}/{date}")
async def provider_time_slots_endpoint(provider_name: str, date: str):
    """
    Get available time slots for a provider on a specific date

    Args:
        provider_name: Name of the service provider (supports partial matching)
        date: Date in YYYY-MM-DD format

    Returns:
        Available time slots with capacity information
    """
    try:
        result = get_provider_time_slots(provider_name, date)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in provider_time_slots_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/providers")
async def list_providers_endpoint():
    """
    Get all service providers

    Returns:
        List of all service providers with their details
    """
    try:
        result = get_providers()
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return {"providers": result, "total": len(result)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in list_providers_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/provider/{provider_name}")
async def get_provider_endpoint(provider_name: str):
    """
    Get provider details by name

    Args:
        provider_name: Name of the service provider (supports partial matching)

    Returns:
        Provider details including contact information and service type
    """
    try:
        result = get_provider_by_name(provider_name)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_provider_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/provider-availability/{provider_name}")
async def get_provider_availability_endpoint(provider_name: str, days: int = 7):
    """
    Get availability summary for a provider for the next N days

    Args:
        provider_name: Name of the service provider
        days: Number of days to look ahead (default: 7)

    Returns:
        Daily availability summary
    """
    try:
        if days < 1 or days > 30:
            raise HTTPException(status_code=400, detail="Days must be between 1 and 30")

        result = get_provider_availability_summary(provider_name, days)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_provider_availability_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Root endpoint with service information
@app.get("/")
async def root():
    """Service information endpoint"""
    return {
        "service": "Booking Agent Data Retrieval Service",
        "version": "1.0.0",
        "description": "Provides data retrieval capabilities for booking agents",
        "endpoints": {
            "health": "/health",
            "providers": "/providers",
            "provider_details": "/provider/{provider_name}",
            "time_slots": "/provider-time-slots/{provider_name}/{date}",
            "availability_summary": "/provider-availability/{provider_name}?days=N"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
