import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.router import router as router_films


app = FastAPI()
app.include_router(router_films)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    'http://127.0.0.1:8000',
    'http://127.0.0.1:8080',
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)