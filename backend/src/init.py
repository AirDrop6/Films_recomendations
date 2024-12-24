import pandas as pd

from src.model import RecommendationModel


PATH = 'kinopoisk_top_850.csv'
data = pd.read_csv(PATH, index_col=[0])
combined_features = data['Genre']+''+data['Director']+''+data['Star1']+''+data['Star2']+''+data['Overview']

model = RecommendationModel(data=data, features=combined_features)
