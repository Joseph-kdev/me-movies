import { Movie } from "./Movie"
import './stylesheets/movielist.css'


export const MovieList = ({ movies }) => {

    const movielist = movies ? movies : []

  return (
    <>
        <div id="movie-list">
            <ul>
                {movielist.map(movie => (
                    <li key={movie.id}>
                        <Movie
                         id = {movie.id}
                         title={movie.title ? movie.title : movie.name}
                         overview={movie.overview}
                         poster_path={movie.poster_path}
                         vote_average={movie.vote_average}
                         release_date={movie.release_date ? movie.release_date : movie.first_air_date}
                         type = {movie.type || (movie.name ? 'tv' : 'movie')}
                         />
                    </li>
                ))}
            </ul>
        </div>
    </>
  )
}
