import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import NewsArticlePage from "./pages/NewsArticlePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsArticlePage />} />
      </Routes>
    </Router>
  );
};

export default App;
