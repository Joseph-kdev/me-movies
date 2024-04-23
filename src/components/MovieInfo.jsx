import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import './stylesheets/MovieInfo.css'
import { Nav } from './Nav'
import { MoonLoader } from 'react-spinners'

export const MovieInfo = () => {
  const API_KEY = import.meta.env.VITE_API_KEY
    //grab movie id from url
    const { id, type } = useParams()
    const baseUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    const imgUrl = 'https://image.tmdb.org/t/p/w500/'
    
    //use movie id to return movie details from TMDB
    const getMovieInfo = async() => {
      const response = await axios.get(baseUrl)
      return response.data
    }

    const {data: movie, isLoading, isError} = useQuery({
      queryKey:['movie'],
      queryFn: getMovieInfo
    })

    if (isLoading) {
      return (
        <div className='loading'>
        <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
        </div>
      )
    }

    if (isError) {
      return <div>You fucked up</div>
    }

    console.log(JSON.parse(JSON.stringify(movie)));

    const topActors = movie.credits.cast.slice(0,8)

    // const officialTrailer = movie.videos.results.find(trailer => trailer.name === 'Official Trailer')

    const officialTrailer = movie.videos.results.find(trailer => trailer.type === 'Trailer') 
                              ? movie.videos.results.find(trailer => trailer.type === 'Trailer')
                              : movie.videos.results[0]

  return (
    <>
      <Nav />
      <h1 className='movie-title'>{movie.title ? movie.title : movie.name}</h1>
      <div className='movie-container'>
      <div className='movie-trailer'>
          <h2>Trailer</h2>
          {  movie.videos.results.length != 0 ? (
          <div className='trailer-video'>
                <iframe
                  width="400"
                  height="315"
                  src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className='trailer'
                />
          </div>
          ) : 
          <div>
            <h3>No trailer available</h3>
          </div>
          }
      </div>
      <div className='movie-info-holder'>
      <div className='movie-info'>
        <div className='movie-picture'>
        <img src={`${imgUrl}${movie.poster_path}`} alt="" />
        </div>
        <div className='movie-detail'>
        <div className='movie-rating'>
          <span>
                {type == 'movie' ? (<p>Released: </p>) : (<p>First Aired: </p>) }
                    <div className="heroinIcons"><svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" width="24px" height="24px">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    </div> <span>{movie.release_date? movie.release_date : movie.first_air_date}</span>
                </span>
          <span>
            <p>Rated:</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="gold" className="w-6 h-6" width="24px" height="24px">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            {movie.vote_average}
          </span>
            {type == 'movie' ? (
              <span> Time: {movie.runtime} minutes</span>
            ) : (
              <span>Seasons: {movie.number_of_seasons}</span>
            )} 
        </div>
      <div className='genre'>
        <h3>Genres:</h3>
        <div className='movie-genre'>
        {movie.genres.map(genre => (
          <button key={genre.id}>{genre.name}</button>
        ))}
        </div>
      </div>
      <div className='movie-cast'>
        <h3>Top Cast:</h3>
        <div className='cast'>
        {topActors.map(actor => (
          <p key={actor.id} className='actor-profile'>
              {actor.name}, 
          </p>
        ))}
        </div>
      </div>
        </div>
      </div>
      <div className='movie-description'>
        <h3>Overview</h3>
        <p>
          {movie.overview}
        </p>
      </div>
      </div>
      </div>


    </>
  )
}
