const movies = document.querySelector(".movies");
const hightlightSize = document.querySelector(".highlight size");
const backGroundImg = document.querySelector(".highlight__video");
const input = document.querySelector("input");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal__body");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");
const modalClose = document.querySelector(".modal__close");
const btnTheme = document.querySelector(".btn-theme");
const header = document.querySelector(".header");
const body = document.querySelector("body");
const h1Header = document.querySelector(".header__title");
const moviesContainer = document.querySelector(".movies-container");
const highlightSize = document.querySelector(".highlight");
const title = document.querySelector(".highlight__title");
const genres = document.querySelector(".highlight__genres");
const description = document.querySelector(".highlight__description");

let valueInput = "";
let count = 0;
let page0 = [];
let page1 = [];
let page2 = [];
let flag0 = 0;
let flag1 = 0;
let dark = false;
let light = true;

/* Visualização de filmes */
async function loadData(responseData) {
  if (responseData) {
    populateHTML(responseData);
  } else {
    try {
      const response = await api.get(
        "/3/discover/movie?language=pt-BR&include_adult=false"
      );
      if (response.status === 200) {
        pagination(response.data.results);
      }
    } catch (error) {}
  }
}

function populateHTML(listMovies) {
  count = 0;
  for (let listMovie of listMovies) {
    if (count === 6) {
      return;
    }
    const movie = document.createElement("div");
    const movieInfo = document.createElement("div");
    const movieTitle = document.createElement("span");
    const movieRating = document.createElement("span");
    const movieStar = document.createElement("img");
    movie.className = "movie";
    movie.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${listMovie.poster_path})`;
    movies.appendChild(movie);
    movieInfo.className = "movie__info";
    movie.appendChild(movieInfo);
    movieTitle.className = "movie__title";
    movieTitle.textContent = listMovie.title;
    movieInfo.appendChild(movieTitle);
    movieRating.className = "movie__rating";
    movieRating.textContent = listMovie.vote_average;
    movieInfo.appendChild(movieRating);
    movieStar.src = "./assets/estrela.svg";
    movieRating.appendChild(movieStar);
    count++;
    movie.addEventListener("click", (event) => {
      if (event.target) {
        modalLoad(listMovie);
      }
    });
  }
}
//Paginação
function pagination(populate) {
  count = 0;
  for (const list of populate) {
    if (count < 6) {
      page0.push(list);
    } else if (count > 6 && count < 13) {
      page1.push(list);
    } else if (count > 12 && count < 19) {
      page2.push(list);
    }
    count++;
  }

  populateHTML(page0);

  btnPrev.addEventListener("click", () => {
    if (flag1 === 0) {
      movies.innerHTML = "";
      populateHTML(page0);
      flag1 = 0;
    } else if (flag1 === 1) {
      movies.innerHTML = "";
      populateHTML(page0);
      flag1 = 0;
    } else if (flag0 === 2) {
      movies.innerHTML = "";
      populateHTML(page1);
      flag1 = 1;
    }
  });
  btnNext.addEventListener("click", () => {
    if (flag0 === 0) {
      movies.innerHTML = "";
      populateHTML(page1);
      flag0 = 1;
      flag1 = 1;
    } else if (flag0 === 1) {
      movies.innerHTML = "";
      populateHTML(page2);
      flag0 = 2;
      flag1 = 2;
    } else if (flag0 === 2) {
      movies.innerHTML = "";
      populateHTML(page0);
      flag0 = 0;
      flag1 = 0;
    }
  });
}

/* Busca Filme */
function searchDisplay(filterData) {
  if (filterData) {
    loadData(filterData);
  } else {
    loadData();
  }
}
async function callSearch() {
  const resultSearch = await inputSearch();
  searchDisplay(resultSearch);
}
input.addEventListener("keyup", (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (event.key === "Enter" && !input.value) {
    movies.innerHTML = "";

    loadData();
  } else if (event.key === "Enter") {
    movies.innerHTML = "";
    valueInput = input.value;
    input.value = "";
    callSearch();
  }
});
async function inputSearch() {
  const response = await api.get(
    `/3/search/movie?language=pt-BR&include_adult=false&query=${valueInput}`
  );

  return response.data.results;
}

/* Filme do Dia */
async function dayMovie() {
  try {
    const response = await api.get("/3/movie/436969?language=pt-BR");
    const responseVideo = await api.get(
      "/3/movie/436969/videos?language=pt-BR"
    );
    const imgBackgroundDay = response.data.backdrop_path;
    if (response.status === 200) {
      backGroundImg.style.background = `url(${imgBackgroundDay})`;
      backGroundImg.style.backgroundSize = "560px 310px";

      title.textContent = response.data.title;
      const rating = document.querySelector(".highlight__rating");
      rating.textContent = response.data.vote_average.toFixed(1);
      const arrayGenres = response.data.genres;
      let genresString = "";
      let newData = new Date(response.data.release_date).toLocaleDateString(
        "pt-BR",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        }
      );
      arrayGenres.forEach((element) => {
        return (genresString += element.name + ",");
      });

      genres.textContent = genresString + " /" + newData;
      const launch = document.querySelector(".highlight__launch");
      launch.textContent = response.data.release_data;
      description.textContent = response.data.overview;
      const videoLink = document.querySelector(".highlight__video-link");
      const resultVideos = responseVideo.data.results[0].key;

      videoLink.href = `https://www.youtube.com/watch?v=${resultVideos}`;
    }
  } catch (error) {
    console.log(error.response.data);
  }
}

async function modalLoad(list) {
  modalGenres.innerHTML = "";
  const responseModal = await api.get(`/3/movie/${list.id}?language=pt-BR`);
  if (responseModal.status === 200) {
    modal.className = "modal";

    modalTitle.textContent = responseModal.data.title;
    modalImg.src = responseModal.data.backdrop_path;
    modalDescription.textContent = responseModal.data.overview;
    modalAverage.textContent = responseModal.data.vote_average.toFixed(1);
    let gens = responseModal.data.genres;
    for (let genre of gens) {
      let spanGenre = document.createElement("span");
      spanGenre.className = "modal__genre";
      spanGenre.textContent = genre.name;
      modalGenres.appendChild(spanGenre);
    }

    modalClose.addEventListener("click", () => {
      modal.className = "modal hidden";
    });
    modal.addEventListener("click", () => {
      modal.className = "modal hidden";
    });
  }
}

btnTheme.addEventListener("click", () => {
  if (dark === false || light === true) {
    btnTheme.src = "./assets/dark-mode.svg";
    header.style.backgroundColor = "var(--background-dark)";
    body.style.backgroundColor = "var(--background-dark)";
    h1Header.style.color = "var(--text-color-dark)";
    moviesContainer.style.backgroundColor = "var(--bg-secundary-dark)";
    highlightSize.style.backgroundColor = "var(--bg-secundary-dark)";
    title.style.color = "var(--text-color-dark)";
    genres.style.color = "var(--text-color-dark)";
    description.style.color = "var(--text-color-dark)";
    input.style.border = "1px solid var(--input-border-dark)";
    input.style.backgroundColor = "var(--input-color-dark)";
    input.style.color = "var(--text-color-dark)";
    btnPrev.src = "./assets/arrow-left-light.svg";
    btnNext.src = "./assets/arrow-right-light.svg";
    modalBody.style.backgroundColor = "var(--bg-secundary-dark)";
    modalTitle.style.color = "var(--text-color-dark)";
    modalDescription.style.color = "var(--text-color-dark)";
    modalClose.src = "./assets/close.svg";
    dark = true;
    light = false;
  } else if (dark === true || light === false) {
    btnTheme.src = "./assets/light-mode.svg";
    header.style.backgroundColor = "var(--background)";
    body.style.backgroundColor = "var(--background)";
    h1Header.style.color = "var(--text-color)";
    moviesContainer.style.backgroundColor = "var(--bg-secondary)";
    highlightSize.style.backgroundColor = "var(--bg-secondary)";
    title.style.color = "var(--text-color)";
    genres.style.color = "var(--text-color)";
    description.style.color = "var(--text-color)";
    input.style.border = "1px solid var(--input-color)";
    input.style.backgroundColor = "#fff";
    input.style.color = "var(--text-color)";
    btnPrev.src = "./assets/arrow-left-dark.svg";
    btnNext.src = "./assets/arrow-right-dark.svg";
    modalBody.style.backgroundColor = "var(--bg-secondary)";
    modalTitle.style.color = "var(--text-color)";
    modalDescription.style.color = "var(--text-color)";
    modalClose.src = "./assets/close-dark.svg";
    dark = false;
    light = true;
  }
});

loadData();
dayMovie();