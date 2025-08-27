FROM python:3.11-slim

WORKDIR /app

# Copy only the main.py file
COPY main.py .

# Install dependencies directly
RUN pip install fastapi uvicorn

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "main.py"]
