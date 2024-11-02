import Console from "./components/Console";
import { Route, Routes, useRoutes} from 'react-router-dom';
import React from 'react';
import { SelectedInsertProvider } from "./components/map/insertContext";

export default function App() {
 
  return (
    <SelectedInsertProvider>
     <Routes>
          <Route path="/" element={ <Console /> }/> 
     </Routes>   
    </SelectedInsertProvider>
  );

}

