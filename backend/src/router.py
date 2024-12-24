from fastapi import APIRouter

from backend.src.init import model

router = APIRouter(
    prefix='/films'
)

@router.get('')
async def get_films():
    return model.get_films()

@router.get('/search/{title}')
async def get_film(title: str):
    return model.get_film(title)

@router.get('/{title}')
async def get_recommendations(title: str):
    return model.get_recommendations(title)
