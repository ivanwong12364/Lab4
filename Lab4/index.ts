import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";

const app: Koa = new Koa();
const router: Router = new Router();

interface Film {
  id: number;
  name: string;
  genre: string;
}

let films: Film[] = [
  { id: 1, name: "Inception", genre: "Sci-Fi" },
  { id: 2, name: "The Godfather", genre: "Crime" },
  { id: 3, name: "Toy Story", genre: "Animation" },
];

// 1. GET – Return a list of films
router.get("/film", async (ctx: RouterContext) => {
  ctx.body = films;
});

// 2. POST – Insert a new film
router.post("/film", async (ctx: RouterContext) => {
  const newFilm = ctx.request.body as Film; // Explicitly cast to Film
  newFilm.id = films.length + 1; // Auto-generate an ID
  films.push(newFilm);
  ctx.body = { msg: "Film added successfully", film: newFilm };
});


// 3. PUT – Update a film
router.put("/film/:id", async (ctx: RouterContext) => {
    const id = parseInt(ctx.params.id);
    const updatedFilm = ctx.request.body as Partial<Film>; // Explicitly assert type
  
    const filmIndex = films.findIndex((film) => film.id === id);
  
    if (filmIndex === -1) {
      ctx.status = 404;
      ctx.body = { msg: "Film not found" };
      return;
    }
  
    films[filmIndex] = { ...films[filmIndex], ...updatedFilm };
    ctx.body = { msg: "Film updated successfully", film: films[filmIndex] };
  });
  

// 4. GET – Return a film name with a parameter name id
router.get("/film/:id", async (ctx: RouterContext) => {
  const id = parseInt(ctx.params.id); // Extract parameter from URL
  const film = films.find((film) => film.id === id);

  if (!film) {
    ctx.status = 404;
    ctx.body = { msg: "Film not found" };
    return;
  }

  ctx.body = { filmName: film.name };
});

// Middleware
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

// Start the server
app.listen(10888, () => {
  console.log("Koa server started on port 10888");
});
