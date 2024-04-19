import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import './stylesheets/MovieInfo.css'

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
      return <div>Loading...</div>
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
      <div className='movie-poster'>
        <img src={`${imgUrl}${movie.poster_path}`} alt="" />
        <div className='over'></div>
      </div>
      <div className='movie-intro'>
        <h2>
          {movie.title}
        </h2>
        <div className='movie-rating'>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="gold" className="w-6 h-6" width="24px" height="24px">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </span>
          <p>
            {movie.vote_average}
          </p>
        </div>
      </div>
      <div className='movie-genre'>
        {movie.genres.map(genre => (
          <p key={genre.id}>{genre.name}</p>
        ))}
      </div>
        <p className='runtime'>
          Time: {movie.runtime} minutes
        </p>
      <div className='movie-description'>
        <hr />
        <p>
          {movie.overview}
        </p>
      </div>
      <div className='movie-cast'>
        <h2>Top Cast</h2>
        <div className='actors'>
        {topActors.map(actor => (
          <div key={actor.id} className='actor-profile'>
            <div className='actor-pic'>
              <img src={`${imgUrl}${actor.profile_path}`} alt="" />
            </div>
            <h4>
              {actor.name}
            </h4>
          </div>
        ))}
        </div>
      </div>
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
    </>
  )
}
