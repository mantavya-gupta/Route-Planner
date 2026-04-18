from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq
import json
import os

class RouteGraph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, u, v, dist, speed, name="Unknown Road"):
        if u not in self.graph: self.graph[u] = []
        if v not in self.graph: self.graph[v] = []
        time = dist / speed
        self.graph[u].append((v, dist, time, name))
        self.graph[v].append((u, dist, time, name))

    def find_optimal_path(self, start, end, optimize_by='time'):
        pq = [(0, start, [start], 0, 0)]
        visited = set()
        while pq:
            cost, current, path, tot_dist, tot_time = heapq.heappop(pq)
            if current == end:
                return {
                    "path": path, 
                    "totalDistance": round(tot_dist, 2), 
                    "totalTime": round(tot_time, 2)
                }
            if current in visited: continue
            visited.add(current)
            for neighbor, d, t, road_name in self.graph.get(current, []):
                if neighbor not in visited:
                    next_cost = t if optimize_by == 'time' else d
                    heapq.heappush(pq, (cost + next_cost, neighbor, path + [neighbor], tot_dist + d, tot_time + t))
        return None

app = Flask(__name__)
CORS(app)

# Initialize graph and load data from JSON
g = RouteGraph()
try:
    data_path = os.path.join(os.path.dirname(__file__), 'cities.json')
    with open(data_path, 'r') as f:
        city_data = json.load(f)
        for entry in city_data:
            g.add_edge(*entry)
except Exception as e:
    print(f"Error loading city data: {e}")

@app.route('/api/route', methods=['GET'])
def get_route():
    source = request.args.get('source')
    dest = request.args.get('destination')
    opt = request.args.get('optimize', 'time')
    
    if not source or not dest:
        return jsonify({"error": "Missing params"}), 400
        
    result = g.find_optimal_path(source, dest, opt)
    if result:
        return jsonify(result)
    return jsonify({"error": "No route found"}), 404