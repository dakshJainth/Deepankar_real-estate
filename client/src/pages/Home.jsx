import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/listing/listings'); // Replace with your actual API endpoint
                const data = await response.data
                console.log(data)
                setListings(data)
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
<div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6 text-center">Available Listings</h1>
    {listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings available. Please check back later.</p>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
                <div
                    key={listing._id}
                    className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <img
                        src={listing.imageUrls[0] || "https://via.placeholder.com/300"}
                        alt={listing.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800">{listing.name}</h2>
                        <p className="text-gray-600 mt-2">{listing.description}</p>
                        <p className="text-gray-500 text-sm mt-2">Address: {listing.address}</p>
                        <div className="mt-4">
                            <p className="text-lg text-green-600 font-semibold">
                                ${listing.discountedPrice || listing.regularPrice}
                            </p>
                            {listing.offer && (
                                <p className="text-sm text-gray-500 line-through">
                                    ${listing.regularPrice}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-500">
                                {listing.bedrooms} Bed{listing.bedrooms > 1 ? "s" : ""}, {listing.bathrooms} Bath
                            </p>
                            <p className={`text-sm ${listing.furnished ? "text-green-500" : "text-gray-500"}`}>
                                {listing.furnished ? "Furnished" : "Unfurnished"}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Parking: {listing.parking ? "Yes" : "No"}</p>
                        <p className="text-sm text-gray-500 mt-2">Type: {listing.type}</p>
                        <p className="text-xs text-gray-400 mt-2">Listed by User ID: {listing.userRef}</p>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>
    );
};

export default Home;