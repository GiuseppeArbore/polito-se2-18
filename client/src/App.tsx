import React, { useState, useEffect, useRef } from 'react';
import Home from "./components/landing/Home";
import Document from "./components/documents/Document";
import { NotFound } from "./components/NotFound";
import { Route, Routes, useNavigate } from "react-router-dom";
import Console from "./components/Console";
import API from "./API";
import { Stakeholders } from "./enum";
import { toast } from './utils/toaster';
import Layout from './components/Layout';



export default function App() {

    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<{ msg: string; type: string }>({ msg: '', type: '' });
    const user = useRef<{ email: string; role: Stakeholders } | null>(null);
    const [error, setError] = useState<boolean | undefined>(false);

    const login = async (credentials: { username: string; password: string }) => {
        try {
            const usr = await API.login(credentials);
            setLoggedIn(true);
            toast({
                title: "Success",
                description: `Welcome ${usr.email}!`,
                variant: "success",
                duration: 3000,
            });
            user.current = usr;
        } catch (err) {
            setError(true);
            if ((err as Error).message === 'Incorrect email and/or password')
                setErrorMessage({ msg: (err as Error).message, type: 'error' });
            else
                setErrorMessage({ msg: 'Username must be a valide email address', type: 'error' });
            throw err;

        }
    };

    useEffect(() => {
        API.getUserInfo()
            .then(usr => {
                setLoggedIn(true);
                user.current = usr;
            }).catch(e => {
                if (loggedIn)
                    toast({
                        title: "Danger",
                        description: e.message,
                        variant: "error",
                        duration: 3000,
                    });
                setLoggedIn(false);
                user.current = null
            });
    }, []);

    const logout = async () => {
        try {
            await API.logout();
            setLoggedIn(false);
            user.current = null;
            toast({
                title: "Success",
                description: `You have been logged out!`,
                variant: "success",
                duration: 3000,
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Danger",
                description: (err as Error).message,
                variant: "error",
                duration: 3000,
            });
        }
    };

    return (
        <Layout
            login={login}
            logout={logout}
            loginErrorMessage={errorMessage}
            error={error}
            setError={setError}
            user={user}>
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/dashboard" element={<Console user={user} />} />
                <Route path="/documents/:id" element={<Document user={user} />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}
