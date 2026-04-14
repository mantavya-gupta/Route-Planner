from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq

# --- DIJKSTRA LOGIC (Moved inside to fix Vercel import error) ---
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
        # cost, current_node, path, total_dist, total_time
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

# Initialize and add data
g = RouteGraph()
g.add_edge('Bhuj', 'Ahmedabad', 330, 70, "NH27")
g.add_edge('Bhuj', 'Rajkot', 230, 65, "SH42")
g.add_edge('Jamnagar', 'Rajkot', 90, 60, "NH151A")
g.add_edge('Rajkot', 'Ahmedabad', 215, 70, "NH47")
g.add_edge('Rajkot', 'Bhavnagar', 175, 65, "SH")
g.add_edge('Ahmedabad', 'Gandhinagar', 30, 50, "G-Road")
g.add_edge('Ahmedabad', 'Vadodara', 110, 90, "Expressway")
g.add_edge('Ahmedabad', 'Bhavnagar', 170, 60, "NH51")
g.add_edge('Vadodara', 'Surat', 150, 80, "NH48")
g.add_edge('Surat', 'Vapi', 110, 75, "NH48")
g.add_edge('Vapi', 'Daman', 12, 40, "Coastal")

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

# Vercel needs this "app" variable