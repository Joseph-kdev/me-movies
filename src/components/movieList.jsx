import { Movie } from "./Movie"
import './stylesheets/movielist.css'


export const MovieList = ({ movies }) => {

  return (
    <>
        <div id="movie-list">
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>
                        <Movie
                         id = {movie.id}
                         title={movie.title}
                         overview={movie.overview}
                         poster_path={movie.poster_path}
                         vote_average={movie.vote_average}
                         release_date={movie.release_date}
                         />
                    </li>
                ))}
            </ul>
        </div>
    </>
  )
}
