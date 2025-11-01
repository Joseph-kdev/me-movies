import { auth, provider } from "../config/firebase-config";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./stylesheets/login.css";
import { Flip, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        });
        navigate("/home");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  const toggleMode = () => {
    setIsSignUp((prevState) => !prevState);
  };

  return (
    <div className="bg-[url(/images/collage1.jpg)] h-screen flex flex-col items-center justify-center">
      <div className="bg-background max-w-md p-8 rounded-lg text-text">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="me-logo">
            <img src="/images/Me Movies.svg" alt="" className="logo" />
          </div>
          <p className="leading-relaxed text-center">
            Tired of losing track of what you're watching? Can't find your
            watchlist? Don't have a clue what your favorite shows are any more?{" "}
            <br />
            Let's fix that. <br />
            Join <span className="me-movies">Me-Movies</span>, the ultimate
            personal database for your movies and TV shows.
          </p>
        </div>
        <div className="">
          <form onSubmit={handleLogin} className="flex flex-col w-full">
            <input
              type="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full my-2 border border-accent p-2 rounded-lg"
            />
            <input
              type="password"
              placeholder="password  :)"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full my-2 border border-accent p-2 rounded-lg"
            />
            <button type="submit" className="bg-accent w-full p-1 rounded-2xl my-2 text-background hover:bg-accent/80">{isSignUp ? "Sign Up" : "Login"}</button>
          </form>
          <div>
            <button onClick={signInWithGoogle} className="bg-gray-600 w-full py-1 rounded-2xl mb-1 hover:bg-gray-500">
              Sign in with Google
            </button>
            <p className="text-center my-8">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <button onClick={toggleMode} className="text-gray-400">
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
