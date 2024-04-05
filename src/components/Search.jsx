import React, { useEffect, useState } from 'react'
import './stylesheets/search.css'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '../../hooks/useDebounce'
import { MovieList } from './movieList'
import { Nav } from './Nav'

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const baseUrl = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_KEY}`
    

    const debouncedSearch = useDebounce(searchQuery, 2000)

    const searchOnline = async() => {
        const response = await axios.get(`${baseUrl}&query=${searchQuery}`)
        return response.data.results
    }

    const {data: results, isLoading, isError } = useQuery({
        queryKey: ['search', debouncedSearch],
        queryFn: () => searchOnline(),
        refetchOnWindowFocus: false,
    })
    

    if (isError) {
        return <div>You messed somewhere</div>
    }


  return (
    <div className='search'>
        <Nav />
        <div className='search-bar'>
            <form>
                <input type="text" className='search-box' onChange={(event) => setSearchQuery(event.target.value)} value={searchQuery}/>
            </form>
        </div>
        {searchQuery != '' ? (
            <div className='search-container'>
                <div className='search-heading'>
                    Showing results for {searchQuery}
                </div>
                <hr />
                <div>
                {isLoading ? (
                    <div>loading</div>
                ) : (
                    < MovieList movies={results}/>
                )}
                </div>
            </div>
        ) : (
            <div className='search-holding'>
                Top shows/Recently searched
            </div>
        )}

    </div>
  )
}
