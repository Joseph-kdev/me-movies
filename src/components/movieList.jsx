import { Movie } from "./Movie";
import "./stylesheets/movielist.css";
import '../App.css'

export const MovieList = ({ movies }) => {
  const movielist = movies ? movies : [];
  return (
    <>
      <div id="movie-list">
        <ul className="">
          {movielist.map((movie, index) => (
            <li key={movie.id} className="flex justify-center">
              <Movie
                index = {index}
                id={movie.id}
                title={movie.title ? movie.title : movie.name}
                overview={movie.overview}
                poster_path={movie.poster_path}
                vote_average={movie.vote_average}
                release_date={
                  movie.release_date ? movie.release_date : movie.first_air_date
                }
                type={movie.type || (movie.name ? "tv" : "movie")}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
