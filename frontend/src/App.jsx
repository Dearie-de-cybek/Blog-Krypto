import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Pages
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NewsArticlePage from "./pages/NewsArticlePage";
import ComingSoon from "./pages/ComingSoon";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/article/:slug" element={<NewsArticlePage />} />
        
        {/* Your Navigation Categories */}
        <Route path="/education" element={<ComingSoon />} />
        <Route path="/events" element={<ComingSoon />} />
        <Route path="/interviews" element={<ComingSoon />} />
        <Route path="/market-analysis" element={<ComingSoon />} />
        <Route path="/press-release" element={<ComingSoon />} />
        
        {/* Category Pages (when they have content) */}
        <Route path="/category/education" element={<ComingSoon />} />
        <Route path="/category/events" element={<ComingSoon />} />
        <Route path="/category/interviews" element={<ComingSoon />} />
        <Route path="/category/market-analysis" element={<ComingSoon />} />
        <Route path="/category/press-release" element={<ComingSoon />} />
        
        {/* Tag Pages */}
        <Route path="/tag/:tag" element={<ComingSoon />} />
        
        {/* Search Results */}
        <Route path="/search" element={<ComingSoon />} />
        
        {/* General Coming Soon */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Router>
  );
};

export default App;