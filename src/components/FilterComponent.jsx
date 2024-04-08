import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { MovieList } from './movieList';
import './stylesheets/filtercomp.css'

export const FilterComponent = ({ genres, mediaType}) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [page, setPage] = useState(1)

    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';
  
    const fetchData = async (page) => {
      const genresQuery = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';
      let apiUrl;
      if (mediaType === 'movie') {
        apiUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc${genresQuery}&page=${page}`;
      } else if (mediaType === 'tv') {
        apiUrl = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc${genresQuery}&page=${page}`;
      } else {
        console.log('error')
      }
      const response = await axios.get(apiUrl);
      return response.data.results;
    };
  
    const { data: results, isLoading, isError, isFetching } = useQuery({
        queryKey: ['results', selectedGenres, mediaType, page],
        queryFn: () => fetchData(page),
        placeholderData: keepPreviousData,
    });
  
    
    const handleGenreChange = (genre) => {
      const updatedGenres = selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
      setPage(1)
    };
  
    if (isError) {
      return <div>Error fetching movies.</div>;
    }
  
  return (
    <div>
      <div>
      <div className='genre-collection'>
        <h3>Genre:</h3>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreChange(genre.id)}
            style={{
              backgroundColor: selectedGenres.includes(genre.id) ? 'blue' : 'transparent',
              color: selectedGenres.includes(genre.id) ? 'white' : 'black',
            }}
            className='genre'
          >
            {genre.name}
          </button>
        ))}
      </div>
      <div className='pagination'>
        <button 
          onClick={() => setPage(prev => prev > 1 ? prev - 1 : 1)}
          disabled = {page === 1}
          className='pag-buttons'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width='24' height='24'>
            <path fillRule="evenodd" d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
        </button>
        <span className='pag-page'>{page}</span>
      <button
        onClick = {() => setPage(prev => prev + 1) }
        disabled = {isFetching}
        className='pag-buttons'
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width='24' height='24'>
          <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
        </svg>
      </button>
      </div>
      

      {isLoading ? (
        <div>Loading</div>
      ) : (
        <MovieList movies={results}/>
      )}
    </div>
    </div>
  )
}

export default FilterComponent;
