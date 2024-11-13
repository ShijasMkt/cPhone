import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        const checkUser = () => {
            const userKey = Cookies.get('userKey');
            setIsUser(userKey ? true : false);
        };

        checkUser();
            
    }, []);
    
    const logoutFunc = () => {
        if (Cookies.get("userKey")) {
          Cookies.remove("userKey");
          Cookies.remove('userID');
          Cookies.remove('userName');
          setIsUser(false);
          window.location="/"
        }
      };

    return (
        <UserContext.Provider value={{ isUser, setIsUser, logoutFunc }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
