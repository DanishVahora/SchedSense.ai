FROM python:3.11-slim

# Install system dependencies for some packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy language models (adjust as needed)
RUN python -m spacy download en_core_web_sm
# RUN python -m spacy download en_core_web_md  # uncomment if you need medium model

COPY . .

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
