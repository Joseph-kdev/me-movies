import { MovieList } from "./movieList";
import axios from 'axios'
import { Nav } from './Nav'
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Carousel";



const Home = () => {
    const baseUrl = 'https://api.themoviedb.org/3/'
    const API_KEY = import.meta.env.VITE_API_KEY

    const trendingMovies = async() => {
        const response = await axios.get(`${baseUrl}trending/movie/day?api_key=${API_KEY}&page=1`)
        return response.data.results
    }

    const {data: trending , isLoading, isError} = useQuery({
        queryKey:["trending"],
        queryFn: trendingMovies
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if(isError) {
        return <div>You fucked up</div>
    }

    return ( 
        <>
            < Nav />
            <Carousel />
            < MovieList movies={trending}/>
        </>
     );
}
 
export default Home;