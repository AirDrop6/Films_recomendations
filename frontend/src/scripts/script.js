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

const modal = document.getElementById('modal'); // Модальное окно
const closeButton = document.querySelector('.close-button'); // Кнопка закрытия модального окна

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
        const response = await fetch(`http://87.228.37.133/api/films/search/${encodeURIComponent(title)}`); // Кодируем название
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

// Функция для отображения карточки фильма
function displayFoundMovie(movie) {
    var node = document.getElementById("found-movie");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }

    titlefoundMovieDiv.classList.remove('hidden');
    foundMovieDiv.classList.remove('hidden'); // Убираем скрытие
    foundMovieDiv.innerHTML += `  <!-- Добавляем карточку фильма в контейнер -->
        <div class="movie-card" id="movie-${movie.index}">
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.Rating}</p> <!-- Рейтинг фильма -->
        </div>
    `;

    // Добавляем обработчик клика на карточку фильма
    document.getElementById(`movie-${movie.index}`).onclick = function() {
        openModal(movie.Series_Title);
    };
}

// Функция для открытия модального окна
function openModal(title) {
    // Выполняем запрос к API для получения информации о фильме
    fetch(`http://87.228.37.133/api/films/search/${title}`)
        .then(response => response.json()) // Преобразуем ответ в JSON
        .then(data => {
            if (data.data.length > 0) { // Проверяем, есть ли данные
                const movie = data.data[0]; // Получаем первый фильм из результата
                document.getElementById('modal-poster').src = movie.Poster_Link; // Устанавливаем постер
                document.getElementById('modal-title').innerText = movie.Series_Title; // Устанавливаем название
                document.getElementById('modal-overview').innerText = movie.Overview; // Устанавливаем описание
                // Устанавливаем актеров
                const actors = [movie.Star1, movie.Star2, movie.Star3, movie.Star4].filter(Boolean).join(', ');
                document.getElementById('modal-actors').innerText = actors; 
                
                // Показываем модальное окно
                document.getElementById('movie-modal').style.display = "block";
            }
        })
        .catch(error => console.error('Ошибка:', error)); // Обработка ошибок
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('movie-modal').style.display = "none"; // Скрываем модальное окно
}

// Добавляем обработчик клика на кнопку закрытия модального окна
document.addEventListener('DOMContentLoaded', (event) => {
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closeModal); // Закрытие при нажатии на кнопку "крестик"
});

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('movie-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Функция для отображения популярных фильмов
function displayPopularMovies(movies) {
    titlePopularMovieDiv.classList.remove('hidden')
    popularMoviesDiv.classList.remove('hidden'); // Убираем скрытие

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Добавляем класс для стилей
        movieCard.innerHTML = `
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.Rating}</p> <!-- Рейтинг фильма -->
        `;
        
        // Добавляем обработчик клика на карточку фильма
        movieCard.onclick = function() {
            openModal(movie.Series_Title);
        };

        popularMoviesDiv.appendChild(movieCard); // Добавляем карточку фильма в контейнер
    });
}

// Функция для отображения рекомендаций
function displayRecommendations(recommendations) {
    var node = document.getElementById("recommendations");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }

    titlerecommendationsDiv.classList.remove('hidden')
    recommendationsDiv.classList.remove('hidden'); // Убираем скрытие

    recommendations.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Добавляем класс для стилей
        movieCard.innerHTML = `
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}"> <!-- Отображаем постер фильма -->
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2> <!-- Название и год выпуска -->
            <p>Рейтинг: ${movie.Rating}</p> <!-- Рейтинг фильма -->
        `;
        
        // Добавляем обработчик клика на карточку фильма
        movieCard.onclick = function() {
            openModal(movie.Series_Title);
        };

        recommendationsDiv.appendChild(movieCard); // Добавляем карточку фильма в контейнер
    });
}

// Функция для запроса рекомендаций
async function fetchRecommendations(title) {
    try {
        const response = await fetch(`http://87.228.37.133/api/films/${encodeURIComponent(title)}`); // Кодируем название
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

// Элемент для отображения популярных фильмов
const popularMoviesDiv = document.getElementById('popular-movies'); // Убедитесь, что элемент с таким ID существует на странице

// Функция для запроса популярных фильмов
async function fetchPopularMovies() {
    try {
        const response = await fetch('http://87.228.37.133/api/films'); // Запрос на получение популярных фильмов
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

// Вызов функции для загрузки популярных фильмов при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchPopularMovies);



