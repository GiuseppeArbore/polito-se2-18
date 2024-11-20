import Home from "./components/landing/Home";
import Document from "./components/documents/Document";
import { NotFound } from "./components/NotFound";
import { Route, Routes } from "react-router-dom";
import Console from "./components/Console";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Console />} />
      <Route path="/documents/:id" element={<Document />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
