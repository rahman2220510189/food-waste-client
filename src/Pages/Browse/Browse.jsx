import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Browse = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const postsPerPage = 10;
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Animation variants
  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  const cardVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0 } 
  };

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(null)
    );
  }, []);

  // Fetch posts (initial)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : {};
        const res = await axios.get("http://localhost:5000/api/posts", { params });
        setPosts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [userLocation]);

  // 🟡 Debounced suggestion search
  const handleSearch = (query) => {
    setSearch(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts/search", { 
          params: { q: query } 
        });
        setSuggestions(res.data.slice(0, 5));
      } catch (err) {
        console.error("Suggestion Fetch Error:", err);
        setSuggestions([]);
      }
    }, 300);
  };

  // 🟢 Submit full search (button or suggestion click)
  const handleSearchSubmit = async (e, query = null) => {
    e?.preventDefault();
    const q = query || search.trim();
    if (!q) return;

    try {
      const res = await axios.get("http://localhost:5000/api/posts/search", { 
        params: { q } 
      });
      setFiltered(res.data);
      setSuggestions([]);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search Submit Error:", err);
    }
  };

  // 🟢 Handle suggestion click
  const handleSuggestionClick = (sug) => {
    handleSearchSubmit(null, sug.title || sug.restaurantName || sug.area);
    setSearch(sug.title || sug.restaurantName || sug.area);
  };

  // Filter free/paid/all
  useEffect(() => {
    let data = [...posts];
    if (filterType === "free") data = data.filter((p) => p.isFree);
    else if (filterType === "paid") data = data.filter((p) => !p.isFree);
    setFiltered(data);
    setCurrentPage(1);
  }, [filterType, posts]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <section className="p-10 bg-gradient-to-br from-slate-700 to-slate-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-yellow-300 text-center tracking-wide">
        🍽 Browse Delicious Food
      </h2>

      {/* 🔍 Search and Filters */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 relative"
      >
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, restaurant, or area..."
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 shadow-md"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
          >
            Search
          </button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full rounded-xl mt-1 shadow-lg z-50">
              {suggestions.map((sug) => (
                <li
                  key={sug._id}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-4 py-2 hover:bg-yellow-100 cursor-pointer flex justify-between items-center"
                >
                  <span>{sug.title || sug.restaurantName || sug.area}</span>
                  {sug.isFree ? (
                    <span className="text-green-600 text-sm font-semibold">Free</span>
                  ) : (
                    <span className="text-orange-600 text-sm font-semibold">৳ {sug.price}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("free")}
            type="button"
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filterType === "free"
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-green-100"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setFilterType("paid")}
            type="button"
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filterType === "paid"
                ? "bg-orange-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-orange-100"
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilterType("all")}
            type="button"
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filterType === "all"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            All
          </button>
        </div>
      </form>

      {/* Food Cards */}
      {!userLocation ? (
        <p className="text-gray-200 text-center">Fetching your location...</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {currentPosts.map((post) => (
              <motion.div
                key={post._id}
                variants={cardVariants}
                transition={{ duration: 0.4 }}
                layout
                whileHover={{ scale: 1.03 }}
                className="relative bg-white/10 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden border border-white/20 hover:shadow-yellow-400/30 transition-all"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 bg-slate-900/80">
                  <h3 className="text-lg font-semibold text-yellow-200 hover:brightness-125">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400">{post.location?.address}</p>
                  <p className="text-xs text-gray-400">
                    {post.distance?.toFixed(1)} km away
                  </p>
                  
                  {post.isFree ? (
                    <span className="inline-block mt-1 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                      Free
                    </span>
                  ) : (
                    <span className="inline-block mt-1 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                      ৳ {post.price}
                    </span>
                  )}

                  {post.status === "booked" ? (
                    <button className="mt-3 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
                      Booked
                    </button>
                  ) : post.isFree ? (
                    <button
                      onClick={() => navigate(`/order/${post._id}`)}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                    >
                      Book Now
                    </button>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/order/${post._id}`)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                      >
                        Order
                      </button>
                      <button
                        onClick={() => console.log("Added to cart", post)}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Posted:{" "}
                    {new Date(post.createdAt).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-3">
        {Array.from({ length: Math.ceil(filtered.length / postsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-yellow-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-yellow-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
};