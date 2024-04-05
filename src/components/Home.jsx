import { MovieList } from "./movieList";
import { Nav } from './Nav'
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Carousel";
import { getMovies } from "../services/movies";

const Home = () => {
    const {data: trendin , isLoading, isError} = useQuery({
        queryKey:["trending"],
        queryFn: () => getMovies('trending')
    })


    if(isError) {
        return <div>You messed up</div>
    }

    return ( 
        <>
            < Nav />
            <Carousel />
            {isLoading ? (
                <div>Loading</div>
            ) : (
                < MovieList movies={trendin}/>
            )}
        </>
     );
}
 
export default Home;