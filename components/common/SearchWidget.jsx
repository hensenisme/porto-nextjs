'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigasi ke halaman search dengan query sebagai parameter URL
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="widget">
      <h6 className="title-widget">Search Here</h6>
      <div className="search-box">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="search-post"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="icon pe-7s-search"></span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchWidget;
