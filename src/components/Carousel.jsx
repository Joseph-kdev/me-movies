import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';
import './stylesheets/carousel.css'
import { ClimbingBoxLoader } from 'react-spinners';



export const Carousel = () => {
  const API_KEY = import.meta.env.VITE_API_KEY
  const images = [
    { id: 293660, src: '/images/deadpool.jpg' },
    { id: 546554, src: '/images/knives-out.jpg' },
    { id: 157336, src: '/images/interstellar.jpg' },
    { id: 372058, src: '/images/your-name.jpg' },
    { id: 359724, src: '/images/ford-v-ferrari.jpg' },
    { id: 569094, src: '/images/spiderman.jpg' },
    { id: 13, src: '/images/forrest-gump.jpg' },
  ]

  const editorsChoiceIds = [293660, 546554, 13, 372058, 157336, 359724, 569094]

  const getMovie = async(id) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const results = response.data ? response.data : []
    return results
  }

  const queries = editorsChoiceIds.map(movieId => ({
    queryKey:["movie", movieId],
    queryFn: () => getMovie(movieId),
    enabled:!!movieId,
  }))

  const queryResults = useQueries({queries})

  const isLoading = queryResults && queryResults.some((result) => result.isLoading);
  const isError = queryResults && queryResults.some((result) => result.isError);

  if (isLoading) {
    return (
      <div className='loading'>
        <ClimbingBoxLoader size={20} color="#efe4ef"/>
      </div>
    );
  }

  if (isError) {
    return <div className="no-data"><img src="/images/server-down.svg" alt="" /></div>;
  }
  

  return (
  <>
    <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={0}
    centeredSlides={true}
    autoplay={{
      delay: 5500,
      disableOnInteraction: false,
    }}
    navigation = {false}
    pagination={{
      clickable: true,
    }}
    loop = {true}
    className='mySwiper'
    >
      {queryResults.map(movie => (
        <SwiperSlide key={movie.data.id}>
            <div className='poster'>
                <img
                  src={images.find((image) => image.id === movie.data.id).src}
                  alt={movie.data.title}
                />
            </div>
            <div className='overlay'>

            </div>
            <div className='movie-details'>
              <h1>
                {movie.data.title}
              </h1>
              <p className='overview'>
                {movie.data.overview}
              </p>
              <span className='rate'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#ffcc00" className="w-6 h-6" width="24px" height="24px">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                <p>{movie.data.vote_average}</p>
              </span>
            </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </>
  )
}

