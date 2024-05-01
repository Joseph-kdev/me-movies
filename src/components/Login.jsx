import { auth, provider } from "../config/firebase-config"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth"
import { useNavigate } from "react-router-dom"
import './stylesheets/login.css'
import { Flip, toast } from "react-toastify"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
      try {
        if(isSignUp) {
            await createUserWithEmailAndPassword(auth, email, password)
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
                    })
            navigate('/home')
        } else {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/home')
        }
      } catch (error) {
        console.log(error);
      }
    }
    const signInWithGoogle = async() => {
        try {
            await signInWithPopup(auth, provider)
            navigate('/home')
        } catch (error) {
            console.error(error);
        }
    }
    const toggleMode = () => {
        setIsSignUp(prevState => !prevState)
    }

    return ( 
        <section id="login-page">
            <div id="login-contents">
            <div id="intro">
                <div className="me-logo">
                    <img src="/images/Me Movies.svg" alt="" className="logo" />
                </div>
                <p>
                    Tired of losing track of what you're watching? Can't find your watchlist?
                    Don't have a clue what your favorite shows are any more? <br />
                    Let's fix that. <br />
                    Join <span className="me-movies">Me-Movies</span>
                </p>
            </div>
            <div id="login">
                <form onSubmit={handleLogin} id="login-form">
                <input type="email" placeholder="enter email" 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password" placeholder="add password  :)" 
                    onChange={e => setPassword(e.target.value)}    
                />
                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
                </form>
                <div>
                <button onClick={signInWithGoogle} id="google-button">Sign in with Google</button>
                <p>{isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
                    <button onClick={toggleMode} className="sign">{isSignUp ? "Login" : "Sign Up"}</button>
                </p>
                </div>
            </div>
            </div>
        </section>

     );
}
 
export default Login;