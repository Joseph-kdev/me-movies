import { MovieList } from "./movieList";
import { Nav } from './Nav'
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Carousel";
import { getLatest, getTrending } from "../services/movies";
import './stylesheets/home.css'
import { MoonLoader } from "react-spinners";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, toast } from "react-toastify";

const Home = () => {
    const {data: trendin , isLoading, isError} = useQuery({
        queryKey:["trending"],
        queryFn: () => getTrending()
    })
    const {data: latest} = useQuery({
        queryKey:["latest"],
        queryFn: () => getLatest()
    })

    if(isError) {
        return <div className="no-data"><img src="/assets/server-down.svg" alt="" /></div>
    }

    if(trendin) {
        toast.info('Click the movie poster for more options', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
    }

    return ( 
        <>
            < Nav />
            <Carousel />
            <div>
            <h1 className="trending-heading">Trending</h1>
            <hr />
            {isLoading ? (
                <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                <div className="trending-section">
                    < MovieList movies={trendin}/>
                </div>
            )}
            </div>
            <div className="top-rated">
            <h1 className="top-heading">Top rated Movies</h1>
            <hr />
            {isLoading ? (
                <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                <div className="top-section">
                    < MovieList movies={latest}/>
                </div>
            )}
            <button>
                <Link to="/movies" className="more-button">
                    More
                </Link>
            </button>
            </div>
        </>
     );
}
 
export default Home;