#!/bin/bash

# Start FastAPI backend in background
cd backend && python run.py &
BACKEND_PID=$!

# Start Vite dev server for frontend
cd ..
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
