import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "./stylesheets/filtercomp.css";
import OtherMovieList from "./othermovielist";
import { motion } from "motion/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const FilterComponent = ({ genres, mediaType }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = "https://api.themoviedb.org/3";

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const maxDrag = Math.max(0, contentWidth - containerWidth);
        setDragConstraints({ left: -maxDrag, right: 0 });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [genres]);

  const fetchData = async (page) => {
    const genresQuery =
      selectedGenres.length > 0
        ? `&with_genres=${selectedGenres.join(",")}`
        : "";
    let apiUrl;
    if (mediaType === "movie") {
      apiUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc${genresQuery}&page=${page}`;
    } else if (mediaType === "tv") {
      apiUrl = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc${genresQuery}&page=${page}`;
    } else {
      console.log("error");
    }
    const response = await axios.get(apiUrl);
    return response.data;
  };

  const {
    data: movieData,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["results", selectedGenres, mediaType, page],
    queryFn: () => fetchData(page),
    placeholderData: keepPreviousData,
  });

  const handleGenreChange = (genreId) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((g) => g !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updatedGenres);
    setPage(1);
  };

  const getPaginationNumbers = (
    currentPage,
    totalPages,
    visiblePages = 5
  ) => {
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const results = movieData?.results || [];
  const totalPages = movieData ? movieData.total_pages : 5;

  if (isError) {
    return (
      <div className="no-data">
        <img src="/images/server-down.svg" alt="" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 2xl:p-0 min-h-screen mb-12">
      <div className="flex gap-2 mt-2 items-center sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="">
          <p className="min-w-[120px] text-[#efe4ef]">Pick by genres:</p>
        </div>
        <div
          className="flex-1 gap-2 overflow-hidden py-2 no-scrollbar cursor-grab active:cursor-grabbing"
          ref={containerRef}
        >
          <motion.div
            ref={contentRef}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            dragMomentum={true}
            whileDrag={{ cursor: "grabbing" }}
            className="flex gap-2 w-fit"
          >
            {genres?.map((genre, index) => (
              <button
                type="button"
                key={genre.id}
                onClick={() => handleGenreChange(genre.id)}
                style={{
                  "--genreIndex": index + 1,
                  backgroundColor: selectedGenres.includes(genre.id)
                    ? "#a3dcbc"
                    : "transparent",
                  color: selectedGenres.includes(genre.id)
                    ? "#160d15"
                    : "#efe4ef",
                  borderColor: selectedGenres.includes(genre.id)
                    ? "transparent"
                    : "#efe4ef"
                }}
                className={`wavy-fade font-TiltNeon rounded-2xl px-4 text-sm py-1 border whitespace-nowrap transition-colors ${selectedGenres.includes(genre.id) ? 'font-medium' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-4">
        {isFetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 justify-items-center min-h-[800px] md:min-h-[760px] px-1">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="w-full h-auto">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800 animate-pulse">
                  <div className="absolute top-2 left-2">
                    <div className="h-6 w-12 rounded-md bg-zinc-700" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-4 w-3/4 bg-zinc-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="">
            <OtherMovieList movieResults={results} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-12 mb-4">
        <button
          type="button"
          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-800 disabled:opacity-50 text-[#efe4ef]"
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
          disabled={page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {getPaginationNumbers(page, totalPages).map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors ${
              pageNumber === page
                ? "bg-[#efe4ef] text-[#160d15] font-medium"
                : "text-[#efe4ef] hover:bg-zinc-800"
            }`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-800 disabled:opacity-50 text-[#efe4ef]"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isFetching || page === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
      {movieData && movieData.results && movieData.results.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, movieData.total_results || 20)} of{" "}
          {movieData.total_results || "??"} movies
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
