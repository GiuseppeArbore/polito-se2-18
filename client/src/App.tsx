import Console from "./components/Console";
import { Route, Routes, useRoutes} from 'react-router-dom';
import React from 'react';

export default function App() {
 
  return (
     <Routes>
          <Route path="/" element={ <Console /> }/> 
     </Routes>   
  );

}

