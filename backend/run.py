# -*- coding: utf-8 -*-
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", "8891"))
    print("Starting PPID Kabsor FastAPI server on port {}...".format(port))
    print("API Documentation: http://localhost:{}/docs".format(port))
    print("Auto-reload enabled for development")
    print("Using PostgreSQL database")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
