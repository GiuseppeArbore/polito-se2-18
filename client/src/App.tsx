import Console from "./components/Console";
import Document from "./components/Document";
import { Route, Routes } from 'react-router-dom';

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Console />} />
      <Route path="/documents/:id" element={<Document />} />
    </Routes>
  );

}

