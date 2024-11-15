import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity


class RecommendationModel:

    def __init__(self, data, features: str):
        self.vectorizer = TfidfVectorizer()
        self.feature_vectors = self.vectorizer.fit_transform(features)
        self.cosine_sim = linear_kernel(self.feature_vectors, self.feature_vectors)
        self.smd = data.reset_index()
        self.titles = self.smd['Series_Title']
        self.indices = pd.Series(self.smd.index, index=self.smd['Series_Title'])

    def get_films(self):
        films = self.smd.sort_values(by=['Released_Year','IMDB_Rating'], ascending=False, axis=0).iloc[1:36]
        films = films.fillna('').to_dict('records')
        result = {'data': films}
        return result

    def get_film(self, title: str):
        film = self.smd.loc[self.smd['Series_Title'] == title]
        film = film.fillna('').to_dict('records')
        result = {'data': film}
        return result

    def get_recommendations(self, title: str):
        idx = self.indices[title]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:31]
        movie_indices = [i[0] for i in sim_scores]

        movies = self.smd.iloc[movie_indices]#[['Series_Title', 'IMDB_Rating']]
        qualified = movies.sort_values(by="IMDB_Rating", ascending=False, axis=0)
        qualified = qualified.fillna('').to_dict('records')
        result = {'data': qualified}
        return result
