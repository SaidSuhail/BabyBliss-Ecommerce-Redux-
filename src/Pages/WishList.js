import { useSelector, useDispatch } from "react-redux";
import { removeItemFromWishlist } from "../Features/userSlice";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.cart.wishlistItems);

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeItemFromWishlist(itemId));
  };
  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-rose-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-2xl text-gray-500 mb-4">
              Your wishlist is empty
            </p>
            <p className="text-gray-400">
              Start adding items to your wishlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="relative group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-pink-50 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-rose-500 hover:text-rose-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="overflow-hidden rounded-t-3xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-rose-600">
                      ₹{item.price}
                    </span>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-600 text-white rounded-lg transition-colors duration-200">
                      <span>Add to Cart</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default WishlistPage;
