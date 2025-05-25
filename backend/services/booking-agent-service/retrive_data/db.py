import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection configuration
DB_HOST = os.getenv("DB_HOST", "postgres_provider_db")  # Use provider DB for provider data
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("PROVIDER_DB_NAME", "service_provider_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

# For provider data, connect to the provider database
PROVIDER_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine with connection pooling
provider_engine = create_engine(
    PROVIDER_DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300
)

# Create session factory
ProviderSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=provider_engine)
