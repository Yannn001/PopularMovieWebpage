//Model
const moviesContainer = document.querySelector(".movies_container");
const navContainer = document.querySelector(".nav_container");
let movieArr = [];
let likedMovieArr = [];

const api = {
  popular: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  now_playing:
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
  top_rated:
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  up_coming:
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
};

//Controller
const generateMovieCardDiv = (movie) => {
  // console.log(movie);
  div = `      
  <div id='${movie.id}' class="movie_card">
    <img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    />
    <div class="movie_name_container">${movie.original_title}</div>
    <div class="movie_rating_container">
      <div class="rating_container">
        <i class="icon ion-md-star rating-icon"></i>
        <span>${movie.vote_average}</span>
      </div>
      <i id="likeIcon" class="like-icon icon ion-md-heart-empty"></i>
    </div>
  </div>`;
  return div;
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjdkZjUyMzkzNTMxMmU2ZThjYjQ0MDg4YTMzY2FjMCIsInN1YiI6IjY0NzNiOWUxY2MyNzdjMDBmOWY0ODczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oQbUahzJjiY2oB6ASRXnwLL5E0zWKTLNmdH2-tVXprU",
  },
};

fetch(api.popular, options)
  .then((response) => response.json())
  .then((response) => {
    for (let result of response.results) {
      appendMovieCard(generateMovieCardDiv(result));
      movieArr.push(result);
    }
  })
  .catch((err) => console.error(err));

//View
const appendMovieCard = (div) => {
  moviesContainer.innerHTML += div;
};

const selectElement = document.getElementById("mySelect");

selectElement.addEventListener("change", function () {
  movieArr = [];
  moviesContainer.innerHTML = "";
  const selectedOption = this.value;

  fetch(api[selectedOption], options)
    .then((response) => response.json())
    .then((response) => {
      for (let result of response.results) {
        appendMovieCard(generateMovieCardDiv(result));
        movieArr.push(result);
      }
    })
    .catch((err) => console.error(err));
  console.log("Selected option: ", selectedOption);
});

moviesContainer.addEventListener("click", (event) => {
  if (event.target.className === "movie_name_container") {
    // console.log(event.target.parentElement.id);
    // console.log(movieArr);
    for (let movie of movieArr) {
      if (movie.id == event.target.parentElement.id) {
        // console.log(movie)
        updateModal(movie);
      }
    }
  } else if (event.target.className.includes("ion-md-heart-empty")) {
    event.target.classList.remove("ion-md-heart-empty");
    event.target.classList.add("ion-md-heart");
    console.log("from the little heart");
    console.log(event.target.parentElement.parentElement);
  } else if (event.target.className.includes("ion-md-heart")) {
    event.target.classList.remove("ion-md-heart");
    event.target.classList.add("ion-md-heart-empty");
  }
});

navContainer.addEventListener("click", (event) => {
  if (event.target.id == "likedList") {
    document.getElementById("home").classList.remove("active");
    event.target.classList.add("active");
    renderLikedView();
  } else if (event.target.id == "home") {
    moviesContainer.innerHTML=''
    document.getElementById("likedList").classList.remove("active");
    event.target.classList.add("active");
    for (let movie of movieArr) {
      appendMovieCard(generateMovieCardDiv(movie));
    }
  }
});

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const updateModal = (movie) => {
  document.getElementById("modalImg").src =
    "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
  document.getElementById("modalTitle").textContent = movie.original_title;
  document.getElementById("modalOverview").textContent = movie.overview;
  document.getElementById("modalRating").textContent = movie.vote_average;

  movie.genre_ids.forEach((id) => {
    let span = document.createElement("span");
    span.textContent = id;
  });

  modal.style.display = "block";
};

const renderLikedView = () => {
  likedMovieArr=[];
  let likedList = document.querySelectorAll(".ion-md-heart");
  moviesContainer.innerHTML = "";
  // console.log(likedList)
  for (let liked of likedList) {
    for (let movie of movieArr) {
      if (liked.parentNode.parentElement.id == movie.id) {
        // movie.classList.add("ion-md-heart")
        likedMovieArr.push(movie);
      }
    }
  }

  for (let likedMovie of likedMovieArr) {
    appendMovieCard(generateMovieCardDiv(likedMovie));
    let movieCards = document.querySelectorAll('.movie_card');
    
    for (let movieCard of movieCards) {
      for (let liked of likedList) {
        if (movieCard.id == liked.parentNode.parentElement.id) {
          // console.log(movieCard.id)
          let likeIconElement = movieCard.querySelector('#likeIcon');
         
          if (likeIconElement) {
            likeIconElement.classList.remove("ion-md-heart-empty");
            likeIconElement.classList.add("ion-md-heart");
            console.log(likeIconElement)
          }
        }
      }
    }
  }
};
