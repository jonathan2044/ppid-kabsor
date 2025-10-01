from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .database import engine, Base
from .routers import auth, permohonan, informasi_publik, berita, galeri, faq

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PPID Kabupaten Sorong API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client_dist_path = Path(__file__).parent.parent.parent / "client" / "dist"
if client_dist_path.exists():
    app.mount("/assets", StaticFiles(directory=str(client_dist_path / "assets")), name="assets")

app.include_router(auth.router)
app.include_router(permohonan.router)
app.include_router(informasi_publik.router)
app.include_router(berita.router)
app.include_router(galeri.router)
app.include_router(faq.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "PPID Kabupaten Sorong API is running"}

@app.get("/")
def root():
    return {"message": "PPID Kabupaten Sorong API", "version": "1.0.0"}
