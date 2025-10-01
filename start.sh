#!/bin/bash

echo "Starting PPID Kabupaten Sorong - Development Mode"
echo "================================================"

# Start FastAPI backend in background
echo "Starting FastAPI backend on port 8000..."
cd backend && python run.py &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start Express + Vite dev server for frontend
echo "Starting frontend (Express + Vite) on port 5000..."
npm run dev &
FRONTEND_PID=$!

echo "================================================"
echo "Frontend: http://localhost:5000"
echo "Backend API: http://localhost:8000"
echo "================================================"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
