import React from "react";
import Header from "../components/Header";
import FeaturedNewsCard from "../components/FeaturedNewsCard";
import TrendingNewsHeader from "../components/TrendingNewsHeader";
import TrendingNewsCard from "../components/TrendingNewsCard";
import PressReleaseCard from "../components/PressReleaseCard";
import FeaturedNewsHeader from "../components/FeaturedNewsHeader";

const Home = () => {
  return (
    <>
      <Header />

      {/* Featured News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeaturedNewsCard />
          <FeaturedNewsCard />
          <FeaturedNewsCard />
          <FeaturedNewsCard />
        </div>
      </div>

      {/* Trending News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrendingNewsHeader />

        <div className="grid lg:grid-cols-2 gap-8 mb-3">
          {/* Left Side - 3 Trending Cards */}
          <div className="space-y-4">
            <TrendingNewsCard />
            <TrendingNewsCard />
            <TrendingNewsCard />
          </div>

          {/* Right Side - Press Release */}
          <PressReleaseCard />
        </div>
        {/* Featured News Section */}

        <FeaturedNewsHeader className="mt-2"/>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - 3 Featured Cards */}
          <div className="space-y-4">
            <FeaturedNewsCard />
            <FeaturedNewsCard />
            <FeaturedNewsCard />
          </div>

          {/* Right Side - 3 Featured Cards */}
          <div className="space-y-4">
            <FeaturedNewsCard />
            <FeaturedNewsCard />
            <FeaturedNewsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
