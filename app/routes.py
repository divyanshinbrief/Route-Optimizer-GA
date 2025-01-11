from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from app.genetic_algorithm import run_genetic_algorithm
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/optimize', methods=['POST'])
def optimize_route():
    # Receive delivery points as JSON
    data = request.get_json()

    # Get the delivery points from the request, expected as a list of coordinates
    delivery_points = np.array(data.get('delivery_points', []))

    if len(delivery_points) == 0:
        return jsonify({"error": "No delivery points provided"}), 400

    # Run genetic algorithm with the dynamic delivery points
    best_route = run_genetic_algorithm(delivery_points)

    # Generate output as a list of coordinates for the best route
    optimized_route = [delivery_points[i].tolist() for i in best_route]

    return jsonify({"optimized_route": optimized_route})

if __name__ == "__main__":
    app.run(debug=True)
