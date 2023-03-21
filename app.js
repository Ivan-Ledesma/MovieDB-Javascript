let pagina = 1;
let ultimaPelicula;
let peliculas = "";
let personas = "";
let contenedorHTML = document.getElementById("contenedor");
let buscador = document.getElementById("buscador");


const moviesButton = document.getElementById("movies-button");
const actorsButton = document.getElementById("actors-button");

moviesButton.addEventListener("click", (e) => {
  if (!e.target.classList.contains("selected")) {
    actorsButton.classList.remove("selected");
    e.target.classList.add("selected");
    contenedorHTML.innerHTML = "";
    pagina = 1;
    cargarPeliculas();
  }
});

actorsButton.addEventListener("click", (e) => {
  if (!e.target.classList.contains("selected")) {
    moviesButton.classList.remove("selected");
    e.target.classList.add("selected");
    contenedorHTML.innerHTML = "";
    pagina = 1;
    cargarPersonas();
  }
});

let observador = new IntersectionObserver(
  (entradas, observador) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        pagina++;
        cargarPeliculas();
      }
    });
  },
  {
    rootMargin: "0px 0px 200px 0px",
    threshold: 1.0,
  }
);

const cargarPeliculas = async () => {
  try {
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=e7dafdf764f57fc1e67741fb3a9e3b2d&language=es-MX&page=${pagina}`
    );

    const datos = await respuesta.json();
    const datosPeliculas = datos.results;

    let arrayMovies = []

    for ( let i = 0 ; i < datos.results.length ; i++){
      arrayMovies.push(datosPeliculas[i])
    }

    arrayMovies.map(movie =>{
      let div = document.createElement("div");
      div.classList.add("card") 
      div.setAttribute("id", movie.id) 
      div.setAttribute("movie", true) 
      div.innerHTML = `
      <a href="#" class="card__link" >
        <img class="card__img" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}">
        <h3 class="card__title">${movie.title}</h3>
        </a>
      <h3 class="card__date">${movie.release_date}</h3>
      `;
      contenedorHTML.appendChild(div)
    })
  
    if (pagina < 1000) {
      if (ultimaPelicula) {
        observador.unobserve(ultimaPelicula);
      }
      const peliculasEnPantalla = document.querySelectorAll(".card");
      ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
      observador.observe(ultimaPelicula);
    }
      
  } catch (error) {
    console.log(error);
  }

};

const cargarPersonas = async () => {
  try{
    const respuesta = await fetch(
      "https://api.themoviedb.org/3/person/popular?api_key=e7dafdf764f57fc1e67741fb3a9e3b2d&language=en-US"
    );
    const data = await respuesta.json();
    let dataActors = data.results
    let arrayActors = [];

    for ( let i = 0 ; i < data.results.length ; i++){
      arrayActors.push(dataActors[i])
    }
	
    arrayActors.map(actor =>{
      let div = document.createElement("div");
      div.classList.add("card") 
      div.classList.add("actor") 
      div.setAttribute("id", actor.id) 
      div.innerHTML = `
      <a href="#" class="card__link">
        <img class="card__img" src="https://image.tmdb.org/t/p/w500/${actor.profile_path}">
        <h3 class="card__title">${actor.name}</h3>
      </a>
      `;
      contenedorHTML.appendChild(div)

      if (pagina < 1000) {
        if (ultimaPelicula) {
          observador.unobserve(ultimaPelicula);
        }
        const peliculasEnPantalla = document.querySelectorAll(".card");
        ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
        observador.observe(ultimaPelicula);
      }
    })
  }catch(error){
    console.log(error);
  }
};
cargarPeliculas();

document.addEventListener("click",(e)=>{
  if(e.target.classList.contains('card__img') || e.target.classList.contains('card__title')){
    let card =  e.target.parentElement.parentElement;
    card.classList.contains("actor") ? actorModal(card.id) : movieModal(card.id)
  }
})

const actorModal = async (id) =>{
  try{
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=e7dafdf764f57fc1e67741fb3a9e3b2d&language=en-US`
    );
    const data = await respuesta.json();
    console.log(data.name)

  }catch(error){
    console.log(error);
  }
}

const movieModal = async (id) =>{
  try{
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=e7dafdf764f57fc1e67741fb3a9e3b2d&language=en-US`
    );
    const data = await respuesta.json();
    console.log(data.title)

    let modal = document.createElement("div")
    modal.classList.add("modal")

    modal.innerHTML = `
      <div class="modal__content">
		    <div class="modal__content--info">
          <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="">
		    	<ul class="info__list">
		    		<li><a href=""></a></li>
		    		<li></li>
		    	</ul>
		    </div>
		    <div class="modal__content--biografy">
		    	<h2 class="biografy__title"></h2>
		    	<h3></h3>
		    	<p></p>
		    </div>
	    </div>
    `;
    contenedorHTML.appendChild(modal)
    modal.addEventListener("click", (e)=>{
      e.target.classList.contains("modal") ? contenedorHTML.removeChild(modal) : console.log("nada")  
    })

  }catch(error){
    console.log(error);
  }
}