import { MovieList } from "./movieList";
import { Nav } from './Nav'
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Carousel";
import { getTrending } from "../services/movies";
import './stylesheets/home.css'
import { ClimbingBoxLoader, MoonLoader } from "react-spinners";

const Home = () => {
    const {data: trendin , isLoading, isError} = useQuery({
        queryKey:["trending"],
        queryFn: () => getTrending()
    })


    if(isError) {
        return <div>You messed up</div>
    }

    return ( 
        <>
            < Nav />
            <Carousel />
            <h1 className="trending-heading">Trending</h1>
            <hr />
            {isLoading ? (
                  <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                < MovieList movies={trendin}/>
            )}
        </>
     );
}
 
export default Home;