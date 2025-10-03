import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOrOrderModel } from "../Pages/BookOrOrderModel";


const getDistance = (userLoc, postLoc) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(postLoc.lat - userLoc.lat);
  const dLon = toRad(postLoc.lng - userLoc.lng);
  const lat1 = toRad(userLoc.lat);
  const lat2 = toRad(postLoc.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export const RecentPost = () => {
  const [posts, setPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecenetPost();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
    const interval = setInterval(() => {
      fetchRecenetPost();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecenetPost = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recent-posts");
      const fixedData = res.data.map(p =>({
        ...p,
        isFree:  p.isFree === true || p.isFree === "true"
      }));
      setPosts(fixedData)
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (post) => {
    console.log("Added to cart:", post.title);
    // Future cart logic here
  };

  const sortedPosts =
    userLocation &&
    [...posts].sort(
      (a, b) =>
        getDistance(userLocation, a.location) -
        getDistance(userLocation, b.location)
    );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts?.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil((sortedPosts?.length || 0) / postsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <section className="p-10 bg-slate-500 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Recent Posts (last 2 hrs)
      </h2>

      {!userLocation ? (
        <p className="text-gray-200">Fetching your location...</p>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {currentPosts?.map((post) => {
                const distance = getDistance(userLocation, post.location);
                return (
                  <motion.div
                    key={post._id}
                    variants={cardVariants}
                    transition={{ duration: 0.4 }}
                    layout
                    className="bg-white shadow-md rounded-xl overflow-hidden"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 bg-slate-900">
                      <h3 className="text-lg font-semibold text-yellow-100">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {post.location.address}
                      </p>
                      <p className="text-xs text-gray-400">
                        {distance} km away
                      </p>

                      {post.isFree ? (
                        <p className="text-green-500 font-medium">Free</p>
                      ) : (
                        <p className="text-orange-500 font-medium">
                          ৳ {post.price}
                        </p>
                      )}

                      {post.status === "booked" ? (
                        <button className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
                          Booked
                        </button>
                      ) : post.isFree ? (
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                        >
                          Book
                        </button>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => navigate(`/order/${post._id}`)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                          >
                            Order
                          </button>
                          <button
                            onClick={() => handleAddToCart(post)}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg"
                          >
                            Add to Cart
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Posted: {new Date(post.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-white font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* ✅ Modal only for free items */}
          {selectedPost && (
           <BookOrOrderModel>
            post={selectedPost}
              onClose={() => setSelectedPost(null)}
              refresh={fetchRecenetPost}
           </BookOrOrderModel>
          )}
        </>
      )}
    </section>
  );
};
