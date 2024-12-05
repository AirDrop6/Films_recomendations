import { movieDatabase } from "./data.js";
import "../styles/index.css"

const logoImg = document.querySelector(".logo");


logoImg.addEventListener("click", () => {
    window.location.reload();
});
// Функция перезагрузки страницы по клику на логотип
function reloadPage() {
    window.location.reload(); // Обновление текущей страницы
}


// Получаем ссылки на элементы из HTML
const searchInput = document.getElementById('search-input');
const suggestionsDiv = document.getElementById('suggestions');
const foundMovieDiv = document.getElementById('found-movie');
const recommendationsDiv = document.getElementById('recommendations');

const titlefoundMovieDiv = document.getElementById('title-found-movie')
const titlerecommendationsDiv = document.getElementById('title-recommendations')
const titlePopularMovieDiv = document.getElementById('title-popular-movies')

let lastSearchedMovie = '';

// Обработчик события ввода текста в поисковую строку
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim(); // Получаем введенное значение и удаляем лишние пробелы
    suggestionsDiv.innerHTML = ''; // Очищаем предыдущие подсказки

    if (query) {
        // Фильтруем фильмы по введенному названию
        const filteredMovies = movieDatabase.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase()) // Учитываем регистр
        ).slice(0, 5); // Ограничиваем количество подсказок до 5

        // Создаем элементы для каждой подсказки
        filteredMovies.forEach(movie => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = movie.title; // Устанавливаем текст подсказки
            suggestionItem.classList.add('suggestion-item'); // Добавляем класс для стилей

            // Обработчик клика по подсказке
            suggestionItem.addEventListener('click', () => {
                searchInput.value = movie.title; // Устанавливаем значение в поле ввода
                suggestionsDiv.innerHTML = ''; // Очищаем подсказки
                lastSearchedMovie = movie.title; // Запоминаем последнее искомое название
                fetchMovieDetails(lastSearchedMovie); // Запрашиваем детали фильма
            });

            suggestionsDiv.appendChild(suggestionItem); // Добавляем подсказку в контейнер
        });
    }
});



// Функция для запроса деталей фильма по названию
async function fetchMovieDetails(title) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/films/search/${encodeURIComponent(title)}`); // Кодируем название
        const data = await response.json(); // Преобразуем ответ в JSON

        if (data.data && data.data.length > 0) { // Проверяем, есть ли данные
            displayFoundMovie(data.data[0]); // Отображаем первый найденный фильм
            fetchRecommendations(data.data[0].Series_Title);
        } else {
            foundMovieDiv.innerHTML = '<h2>Фильм не найден.</h2>'; // Сообщение, если фильм не найден
            foundMovieDiv.classList.remove('hidden'); // Показываем сообщение
            recommendationsDiv.classList.add('hidden'); // Скрываем рекомендации
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error); // Логируем ошибку
    }

}

// Функция для отображения найденного фильма
function displayFoundMovie(movie) {
    titlefoundMovieDiv.classList.remove('hidden')
    foundMovieDiv.classList.remove('hidden'); // Убираем скрытие
    foundMovieDiv.innerHTML = `
        <div class="movie-card">
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.IMDB_Rating}</p> <!-- Рейтинг фильма -->
        </div>
    `;
}



// Функция для запроса рекомендаций
async function fetchRecommendations(title) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/films/${encodeURIComponent(title)}`); // Кодируем название
        const data = await response.json(); // Преобразуем ответ в JSON

        if (data.data && data.data.length > 0) { // Проверяем, есть ли данные
            displayRecommendations(data.data); // Передаем весь массив рекомендаций
        } else {
            recommendationsDiv.innerHTML = '<h2>Рекомендации не найдены.</h2>'; // Сообщение, если рекомендации не найдены
            recommendationsDiv.classList.remove('hidden'); // Показываем сообщение
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error); // Логируем ошибку
    }
}

// Функция для отображения рекомендаций
function displayRecommendations(recommendations) {
    titlerecommendationsDiv.classList.remove('hidden')
    recommendationsDiv.classList.remove('hidden'); // Убираем скрытие
    //recommendationsDiv.innerHTML = '<h2>Рекомендации</h2>'; // Заголовок для рекомендаций

    recommendations.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Добавляем класс для стилей
        movieCard.innerHTML = `
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.IMDB_Rating}</p> <!-- Рейтинг фильма -->
        `;
        recommendationsDiv.appendChild(movieCard); // Добавляем карточку фильма в контейнер
    });
}




// Элемент для отображения популярных фильмов
const popularMoviesDiv = document.getElementById('popular-movies'); // Убедитесь, что элемент с таким ID существует на странице

// Функция для запроса популярных фильмов
async function fetchPopularMovies() {
    try {
        const response = await fetch('http://127.0.0.1:8000/films'); // Запрос на получение популярных фильмов
        const data = await response.json(); // Преобразование ответа в JSON

        if (data.data && data.data.length > 0) { // Проверяем, есть ли данные
            displayPopularMovies(data.data); // Передаем массив популярных фильмов
        } else {
            popularMoviesDiv.innerHTML = '<h2>Популярные фильмы не найдены.</h2>'; // Сообщение, если фильмы не найдены
            popularMoviesDiv.classList.remove('hidden'); // Показываем сообщение
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error); // Логируем ошибку
    }
}

// Функция для отображения популярных фильмов
function displayPopularMovies(movies) {
    titlePopularMovieDiv.classList.remove('hidden')
    popularMoviesDiv.classList.remove('hidden'); // Убираем скрытие
    // popularMoviesDiv.innerHTML = '<h2>Популярные фильмы</h2>'; // Заголовок для популярных фильмов

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Добавляем класс для стилей
        movieCard.innerHTML = `
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.IMDB_Rating}</p> <!-- Рейтинг фильма -->
        `;
        popularMoviesDiv.appendChild(movieCard); // Добавляем карточку фильма в контейнер
    });
}

// Вызов функции для загрузки популярных фильмов при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchPopularMovies);


















// Получаем элементы модального окна и карточек фильмов
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const moviesContainer = document.getElementById('movies-container');


// Функция для открытия модального окна
function openModal(movie) {
    const title = movie.getAttribute('data-title');
    const description = movie.getAttribute('data-description');
    const actors = movie.getAttribute('data-actors');
    const director = movie.getAttribute('data-director');

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-actors').textContent = actors;
    document.getElementById('modal-director').textContent = director;

    modal.style.display = 'block';
}

// Обработчик событий при нажатии на карточки фильмов
moviesContainer.addEventListener('click', (event) => {
    const movieCard = event.target.closest('.movie-card');
    if (movieCard) {
        openModal(movieCard);
    }
});

// Закрыть модальное окно
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрыть модальное окно при клике за его пределами
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});