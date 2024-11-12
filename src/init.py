import pandas as pd

from src.model import RecommendationModel


PATH = 'src/imdb_top_1000.csv'
data = pd.read_csv(PATH)
combined_features = data['Genre']+''+data['Director']+''+data['Star1']+''+data['Star2']+''+data['Overview']

model = RecommendationModel(data=data, features=combined_features)
