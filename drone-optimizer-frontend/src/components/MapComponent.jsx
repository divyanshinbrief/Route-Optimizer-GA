import React, { useState } from "react";
import axios from "axios";

// Function to calculate distance between two points using the Haversine formula
const calculateDistance = (point1, point2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = point1[0] * (Math.PI / 180); // Convert latitude from degrees to radians
  const lon1 = point1[1] * (Math.PI / 180); // Convert longitude from degrees to radians
  const lat2 = point2[0] * (Math.PI / 180); // Convert latitude from degrees to radians
  const lon2 = point2[1] * (Math.PI / 180); // Convert longitude from degrees to radians

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Return the distance in kilometers
};

const MapComponent = () => {
  const [deliveryPoints, setDeliveryPoints] = useState([]); // State to hold input delivery points
  const [optimizedRoute, setOptimizedRoute] = useState([]); // State to hold optimized route
  const [newPoint, setNewPoint] = useState({ lat: "", lng: "" }); // State for a single input point
  const [loading, setLoading] = useState(false); // Loading state for async request

  // Function to add delivery point
  const handleAddPoint = (e) => {
    e.preventDefault();
    if (newPoint.lat && newPoint.lng) {
      setDeliveryPoints([
        ...deliveryPoints,
        [parseFloat(newPoint.lat), parseFloat(newPoint.lng)],
      ]);
      setNewPoint({ lat: "", lng: "" }); // Clear input fields after adding
    } else {
      alert("Please enter both latitude and longitude.");
    }
  };

  // Function to call the Flask API to get the optimized route
  const fetchOptimizedRoute = async () => {
    if (deliveryPoints.length < 2) {
      alert("Please add at least 2 delivery points.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/optimize", {
        delivery_points: deliveryPoints,
      });
      setOptimizedRoute(response.data.optimized_route);
    } catch (error) {
      console.error("Error fetching optimized route:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 h-screen transition-all duration-300 ease-linear text-white p-4 flex flex-col justify-center items-center">
      <h2 className="text-2xl w-full text-center font-bold mb-4">
        Drone Delivery Route Optimization
      </h2>

      <div className="flex flex-col gap-4 justify-center items-center font-semibold ">
        <h3 className="text-xl">Enter Delivery Points:</h3>
        <form onSubmit={handleAddPoint} className="flex justify-between w-full">
          <input
            type="text"
            placeholder="Latitude"
            value={newPoint.lat}
            className="bg-gray-800 p-2 rounded-lg focus:outline-none"
            onChange={(e) => setNewPoint({ ...newPoint, lat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="bg-gray-800 p-2 rounded-lg focus:outline-none"
            value={newPoint.lng}
            onChange={(e) => setNewPoint({ ...newPoint, lng: e.target.value })}
          />
          <button
            type="submit"
            className="bg-white text-black/70 rounded-lg px-3 py-1.5 hover:bg-green-500 hover:text-white transition-all duration-150 ease-in-out "
          >
            Add Point
          </button>
        </form>
        <div className="flex gap-4 ">
          <div className="flex flex-col gap-2">
            <h4>Delivery Points:</h4>
            <ul>
              {deliveryPoints.map((point, index) => (
                <li key={index}>{`Point ${index + 1}: Lat ${point[0]}, Lng ${
                  point[1]
                }`}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col min-w-[400px] gap-4">
            <div>Optimized Route:</div>
            <ol
              className={`${
                optimizedRoute.length > 0 &&
                "border-2 border-black rounded-lg p-4 "
              }`}
            >
              {optimizedRoute.length > 0 &&
                optimizedRoute.map((point, index) => {
                  const distance =
                    index > 0
                      ? calculateDistance(optimizedRoute[index - 1], point)
                      : 0;
                  return (
                    <li key={index}>
                      {`Point ${index + 1}: Lat ${point[0]}, Lng ${point[1]}`}{" "}
                      {index > 0 &&
                        `- Distance from previous point: ${distance.toFixed(
                          2
                        )} km`}
                    </li>
                  );
                })}
            </ol>
            <button
              onClick={fetchOptimizedRoute}
              className="bg-white w-[180px] text-black/70 rounded-lg px-3 py-1.5 hover:bg-green-500 hover:text-white transition-all duration-150 ease-in-out "
              disabled={loading}
            >
              {loading ? "Optimizing..." : "Get Optimized Route"}
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
