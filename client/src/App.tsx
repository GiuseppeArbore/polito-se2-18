import Console from "./components/Console";
import { Route, Routes } from 'react-router-dom';

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Console />} />
    </Routes>
  );

}

