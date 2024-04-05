import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { MovieList } from './movieList';
import './stylesheets/filtercomp.css'

export const FilterComponent = ({ genres, mediaType}) => {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';
  
    const fetchData = async () => {
      const genresQuery = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';
      let apiUrl;
      if (mediaType === 'movie') {
        apiUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&page=1&sort_by=popularity.desc${genresQuery}`;
      } else if (mediaType === 'tv') {
        apiUrl = `${baseUrl}/discover/tv?api_key=${apiKey}&page=1&sort_by=popularity.desc${genresQuery}`;
      } else {
        console.log('error')
      }
      const response = await axios.get(apiUrl);
      return response.data.results;
    };
  
    const { data: results, isLoading, isError } = useQuery({
        queryKey: ['results', selectedGenres, mediaType],
        queryFn: fetchData,
    });
  
    
    const handleGenreChange = (genre) => {
      const updatedGenres = selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
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
