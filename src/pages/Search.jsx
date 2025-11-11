import { useState } from "react";
import "./stylesheets/search.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { MovieList } from "../components/movieList";
import { Nav } from "../components/Nav";
import { MoonLoader } from "react-spinners";
import OtherMovieList from "../components/othermovielist";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const baseUrl = `https://api.themoviedb.org/3/search/multi?api_key=${
    import.meta.env.VITE_API_KEY
  }`;

  const debouncedSearch = useDebounce(searchQuery, 1000);

  const searchOnline = async () => {
    const response = await axios.get(`${baseUrl}&query=${searchQuery}`);
    const results = response.data.results ? response.data.results : [];
    const filteredResults = results.filter(
      (result) => result.media_type === "tv" || result.media_type === "movie"
    );
    return filteredResults;
  };

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchOnline(),
    refetchOnWindowFocus: false,
    placeholderData: []
  });

  if (isError) {
    return (
      <div className="no-data">
        <img src="/images/server-down.svg" alt="" />
      </div>
    );
  }

  return (
    <div className="search p-2 max-w-5xl mx-auto">
      <Nav />
      <h2 className="search-head pt-20">Search</h2>
      <div className="max-w-6xl mx-auto">
        <form>
          <input
            type="text"
            className="border-primary border w-full py-2 px-4 rounded-2xl text-text focus:border-accent"
            onChange={(event) => setSearchQuery(event.target.value)}
            value={searchQuery}
            placeholder="enter movie/show name ; )"
          />
        </form>
      </div>
      {searchQuery != "" ? (
        <div className="">
          <p className="my-2 text-[#ffbef7]">
            Showing results for {searchQuery}
          </p>
          <div>
            {isLoading ? (
              <div className="loading">
                <MoonLoader size={70} color="#efe4ef" speedMultiplier={2} />
              </div>
            ) : (
              <div className="">
                <OtherMovieList movieResults={results} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="search-holding">
          <img src="/images/search.svg" alt="" />
          <h4>Let's find it</h4>
        </div>
      )}
    </div>
  );
};
