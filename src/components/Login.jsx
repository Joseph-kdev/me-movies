import { auth, provider } from "../config/firebase-config"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import './stylesheets/login.css'

const Login = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async() => {
      try {
        if(isSignUp) {
            await createUserWithEmailAndPassword(auth, name, password)
        } else {
            await signInWithEmailAndPassword(auth, name, password)
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

    function logOut() {
        return signOut(auth);
    }

    return ( 
        <section id="login-page">
            <div id="login-contents">
            <div id="intro">
                <div className="me-logo">
                    <img src="/assets/Me Movies.svg" alt="" className="logo" />
                </div>
                <p>
                    Tired of losing track of what you're binge-watching? Let's fix that for you.
                    Join <span>Me-Movies</span>
                </p>
            </div>
            <div id="login">
                <form onSubmit={handleLogin} id="login-form">
                <input type="text" placeholder="email" 
                    onChange={(e) => setName(e.target.value)}
                />
                <input type="password" placeholder="password" 
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