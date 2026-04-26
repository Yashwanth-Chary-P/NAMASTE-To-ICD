#!/bin/bash

echo "Starting ML service..."

source venv/Scripts/activate

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000