import Chart from 'chart.js/auto';
import movieData from './movie-data.json';

const getMoviesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('movies')) || movieData;
};

const saveMoviesToLocalStorage = (movies) => {
  localStorage.setItem('movies', JSON.stringify(movies));
};

const displayMovies = () => {
  const moviesList = document.getElementById('movies-list');
  moviesList.innerHTML = ''; 
  const movies = getMoviesFromLocalStorage();
  movies.forEach(movie => {
    const movieElement = document.createElement('li');
    movieElement.textContent = `${movie.title} - Gross: $${movie.domestic}`;
    moviesList.appendChild(movieElement);
  });
};

const addNewMovie = (movie) => {
  const movies = getMoviesFromLocalStorage();
  movies.unshift(movie); 
  saveMoviesToLocalStorage(movies);
  displayMovies();
  updateCharts();  // Ensure charts are updated when a new movie is added
};

const getFormattedMovieData = () => {
  const movies = getMoviesFromLocalStorage();

  const barChartData = {
    labels: movies.map(movie => movie.title),
    datasets: [{
      label: 'Domestic Gross',
      data: movies.map(movie => movie.domestic),
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  const genres = [...new Set(movies.map(movie => movie.genre))];
  const genreData = genres.map(genre => {
    return {
      genre,
      count: movies.filter(movie => movie.genre === genre).length
    };
  });

  const doughnutChartData = {
    labels: genreData.map(g => g.genre),
    datasets: [{
      label: 'Number of Movies',
      data: genreData.map(g => g.count),
      backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey', 'cyan']
    }]
  };

  const scatterChartData = {
    datasets: [{
      label: 'Critic vs Audience Scores',
      data: movies.map(movie => ({ x: movie.criticScore, y: movie.audienceScore })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }]
  };

  return { barChartData, doughnutChartData, scatterChartData };
};

let barChart, doughnutChart, scatterChart;

const initBarChart = (data) => {
  const ctx = document.getElementById('bar-chart').getContext('2d');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const initDoughnutChart = (data) => {
  const ctx = document.getElementById('doughnut-chart').getContext('2d');
  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Movie Distribution by Genre'
        }
      }
    },
  });
};

const initScatterChart = (data) => {
  const ctx = document.getElementById('scatter-chart').getContext('2d');
  scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Critic vs Audience Scores'
        }
      }
    }
  });
};

const updateBarChart = (chart, data) => {
  chart.data = data;
  chart.update();
};

const updateDoughnutChart = (chart, data) => {
  chart.data = data;
  chart.update();
};

const updateScatterChart = (chart, data) => {
  chart.data = data;
  chart.update();
};

const updateCharts = () => {
  const formattedData = getFormattedMovieData();
  if (barChart) {
    updateBarChart(barChart, formattedData.barChartData);
  } else {
    initBarChart(formattedData.barChartData);
  }

  if (doughnutChart) {
    updateDoughnutChart(doughnutChart, formattedData.doughnutChartData);
  } else {
    initDoughnutChart(formattedData.doughnutChartData);
  }

  if (scatterChart) {
    updateScatterChart(scatterChart, formattedData.scatterChartData);
  } else {
    initScatterChart(formattedData.scatterChartData);
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault(); 
  const title = document.getElementById('movie-title').value;
  const criticScore = parseInt(document.getElementById('critic-score').value, 10);
  const audienceScore = parseInt(document.getElementById('audience-score').value, 10);
  const domestic = parseInt(document.getElementById('domestic-gross').value, 10);
  const genre = document.getElementById('movie-genre').value;

  const newMovie = { title, criticScore, audienceScore, domestic, genre };
  addNewMovie(newMovie);
};

const resetMoviesToDefault = () => {
  saveMoviesToLocalStorage(movieData);
  displayMovies();
  updateCharts();
};

const handleListReset = () => {
  resetMoviesToDefault();
};

document.getElementById('movie-form').addEventListener('submit', handleFormSubmit);
document.getElementById('reset-movies').addEventListener('click', handleListReset);

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('movies')) {
    saveMoviesToLocalStorage(movieData);
  }
  displayMovies();
  updateCharts();
});
