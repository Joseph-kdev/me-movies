import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./config/firebase-config";

const userAuthContext = createContext()

export function useUserAuth() {
    return useContext(userAuthContext)
}

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
          // console.log("Auth", currentuser);
          setUser(currentuser);
        });
    
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <userAuthContext.Provider
            value={{ user}}
        >
            {children}
        </userAuthContext.Provider>
        )
}