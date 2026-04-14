from flask import Flask, request, jsonify
from flask_cors import CORS
from dijkstra import RouteGraph

app = Flask(__name__)
CORS(app)

# Initialize the Graph
g = RouteGraph()

# --- GEOGRAPHIC DATA (Road Network) ---

# Saurashtra & Kutch Region
g.add_edge('Bhuj', 'Ahmedabad', 330, 70, "NH27")
g.add_edge('Bhuj', 'Rajkot', 230, 65, "SH42")
g.add_edge('Jamnagar', 'Rajkot', 90, 60, "NH151A")
g.add_edge('Rajkot', 'Ahmedabad', 215, 70, "NH47")
g.add_edge('Rajkot', 'Bhavnagar', 175, 65, "State Hwy")

# Central & North Gujarat
g.add_edge('Ahmedabad', 'Gandhinagar', 30, 50, "G-Road")
g.add_edge('Ahmedabad', 'Vadodara', 110, 90, "Expressway")
g.add_edge('Ahmedabad', 'Bhavnagar', 170, 60, "NH51")

# South Gujarat
g.add_edge('Vadodara', 'Surat', 150, 80, "NH48")
g.add_edge('Surat', 'Vapi', 110, 75, "NH48")
g.add_edge('Vapi', 'Daman', 12, 40, "Coastal Rd")

@app.route('/api/route', methods=['GET'])
def get_route():
    source = request.args.get('source')
    dest = request.args.get('destination')
    optimize = request.args.get('optimize', 'time') # 'time' or 'distance'
    
    # Validation
    if not source or not dest:
        return jsonify({"error": "Missing source or destination"}), 400
    
    if source == dest:
        return jsonify({"error": "Source and destination are the same"}), 400

    # Run Dijkstra's Algorithm
    result = g.find_optimal_path(source, dest, optimize)
    
    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "No route found between selected cities"}), 404

if __name__ == '__main__':
    # Running on port 5328 to match your frontend fetch calls
    app.run(port=5328, debug=True)