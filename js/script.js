let movies = [];
const url_movies = 'https://japceibal.github.io/japflix_api/movies-data.json'; // URL de donde obtener los datos de películas

// Función para obtener los datos desde la URL
let getJSONData = async function (url) {
    let result = {};
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const data = await response.json();
        result.status = 'ok';
        result.data = data;
    } catch (error) {
        result.status = 'error';
        result.data = error;
    }
    return result;
};

// Obtiene las estrellas de vote_average
function getStars(vote_average) {
    let stars = '';
    const vote = Math.round(vote_average / 2); // Convertir a escala de 5 estrellas

    for (let i = 1; i <= 5; i++) {
        if (i <= vote) {
            stars += `<span class="fa fa-star checked"></span>`;
        } else {
            stars += `<span class="fa fa-star"></span>`;
        }
    }
    return stars;
}

// Muestra los resultados de la búsqueda
function showResults(results) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpiar resultados

    if (results.length === 0) {
        lista.innerHTML = `<li class="list-group-item bg-dark text-white">No se encontraron resultados.</li>`;
        return;
    }

    results.forEach(pelicula => {
        const item = document.createElement('li');
        item.classList.add('list-group-item', 'bg-dark', 'text-white');
        item.innerHTML = `
            <h5>${pelicula.title}</h5>
            <p>${pelicula.tagline}</p>
            <p>${getStars(pelicula.vote_average)}</p>
        `;

        lista.appendChild(item);
        item.addEventListener('click', () => showDetails(pelicula));
    });
}

// Muestra los detalles de la película
function showDetails(pelicula) {
    document.getElementById('movieTitle').innerText = pelicula.title;
    document.getElementById('movieOverview').innerText = pelicula.overview;

    // Mostrar géneros como una lista
    const genresList = pelicula.genres.map(genre => genre.name).join(', '); // Corrige el acceso a los nombres
    document.getElementById('movieGenres').innerText = genresList;

    const releaseYear = new Date(pelicula.release_date).getFullYear();
    document.getElementById('movieReleaseYear').innerText = `Año de lanzamiento: ${releaseYear}`;
    document.getElementById('movieDuration').innerText = `Duración: ${pelicula.runtime} minutos`;
    document.getElementById('movieBudget').innerText = `Presupuesto: $${pelicula.budget.toLocaleString()}`;
    document.getElementById('movieRevenue').innerText = `Ganancias: $${pelicula.revenue.toLocaleString()}`;
    
    // Mostrar el contenedor de detalles
    const movieDetail = new bootstrap.Offcanvas(document.getElementById('movieDetail'));
    movieDetail.show();
}

document.addEventListener('DOMContentLoaded', async () => {
    // Llamar a la función para obtener datos
    const moviesData = await getJSONData(url_movies);

    if (moviesData.status === 'ok') {
        movies = moviesData.data; // Almacenar datos en el array
    } else {
        console.error('Error al obtener los datos:', moviesData.data);
    }

    const btnBuscar = document.getElementById('btnBuscar');

    btnBuscar.addEventListener('click', function () {
        const search = document.getElementById('inputBuscar').value.toLowerCase();

        // Variable que almacene las peliculas que incluyan el texto obtenido del input.
        const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(search) ||
            movie.genres.some(genre => genre.name.toLowerCase().includes(search)) ||
            movie.tagline.toLowerCase().includes(search) ||
            movie.overview.toLowerCase().includes(search)
        );

        showResults(results);
    });

    document.addEventListener('click', (event) => {
        const movieDetail = document.getElementById('movieDetail');
        if (movieDetail.style.display === 'block' && !movieDetail.contains(event.target)) {
            movieDetail.style.display = 'none';
        }
    });
});
