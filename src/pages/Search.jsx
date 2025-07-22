import React, { useEffect, useState } from 'react'
import './stylesheets/search.css'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '../../hooks/useDebounce'
import { MovieList } from '../components/movieList'
import { Nav } from '../components/Nav'
import { HashLoader, MoonLoader } from 'react-spinners'

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const baseUrl = `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_API_KEY}`
    

    const debouncedSearch = useDebounce(searchQuery, 1000)

    const searchOnline = async() => {
        const response = await axios.get(`${baseUrl}&query=${searchQuery}`)
        const results = response.data.results ? response.data.results : []
        const filteredResults = results.filter(result => result.media_type === 'tv' || result.media_type === "movie")
        return filteredResults
    }

    const {data: results, isLoading, isError } = useQuery({
        queryKey: ['search', debouncedSearch],
        queryFn: () => searchOnline(),
        refetchOnWindowFocus: false,
    })
    

    if (isError) {
        return <div className="no-data"><img src="/images/server-down.svg" alt="" /></div>
    }
    
  return (
    <div className='search'>
        <Nav />
        <h2 className='search-head'>Search</h2>
        <div className='search-bar'>
            <form>
                <input type="text" className='search-box' onChange={(event) => setSearchQuery(event.target.value)} value={searchQuery} placeholder="enter movie/show name ; )"/>
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
                            <div className='loading'>
                                <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                            </div>
                ) : (
                    <div className='collection-section'>
                        <MovieList movies={results}/>
                    </div>
                )}
                </div>
            </div>
        ) : (
            <div className='search-holding'>
                <img src="/images/search.svg" alt="" />
                <h4>Let's find it</h4>
            </div>
        )}

    </div>
  )
}
