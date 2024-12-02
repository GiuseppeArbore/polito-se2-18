import React, { useState, useEffect } from 'react';
import  Home  from "./components/landing/Home";
import Document from "./components/documents/Document";
import { NotFound } from "./components/NotFound";
import { Route, Routes, useNavigate } from "react-router-dom";
import Console from "./components/Console";
import API from "./API";

export default function App() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ msg: string; type: string }>({ msg: '', type: '' });
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState< boolean | undefined >(false);


  const login = async (credentials: { username: string; password: string }) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setErrorMessage({ msg: `Welcome ${user.username}!`, type: `success` });
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(true);
      if (err instanceof Error) {
        setErrorMessage({ msg: err.message, type: 'danger' });
      } else {
        setErrorMessage({ msg: 'An unknown error occurred', type: 'danger' });
      }
    }
  };

  useEffect(() => {
    API.getUserInfo()
      .then(user => {
        setLoggedIn(true);
        setUser(user);
      }).catch(e => {
        if (loggedIn)
          setErrorMessage({ msg: e.message, type: 'danger' });
        setLoggedIn(false);
        setUser(null);
      });
  }, []);

  const logout = async () => {
    try {
      await API.logout();
      setLoggedIn(false);
      setUser(null);
      setErrorMessage({ msg: 'You have been logged out.', type: 'info' });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage({ msg: err.message, type: 'danger' });
      } else {
        setErrorMessage({ msg: 'An unknown error occurred', type: 'danger' });
      }
    }
  };

  return (
    
    <Routes>
      <Route path="/" element={<Home  login={login} loginErrorMessage={errorMessage} error={error} user={user}/>} />
      <Route path="/dashboard" element={<Console user={user}/>} />
      <Route path="/documents/:id" element={<Document user={user} />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
