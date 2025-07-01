import React from 'react'
import Header from '../components/Header'
import FeaturedNewsCard from '../components/FeaturedNewsCard'
import TrendingNews from '../components/TrendingNews'

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

        <TrendingNews 
  smallCards={[...]} 
  featuredArticle={{...}} 
/>
      </div>
    </>
  )
}

export default Home