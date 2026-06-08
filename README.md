# Pathfinding Visualizer

A web-based interactive visualization tool for popular search algorithms including Dijkstra's Algorithm, A*, Bi-directional BFS, DFS, and Greedy Best-First Search.

**https://visualizer-path.vercel.app**

## Features

- **Multiple Algorithms**: Visualize and compare different pathfinding algorithms
  - Dijkstra's Algorithm
  - A* (A-Star)
  - Bi-directional BFS
  - Depth First Search (DFS)
  - Greedy Best-First Search (Greedy BFS)

- **Interactive Grid Manipulation**
  - Place and move **Start** and **End** nodes
  - Add **Walls** to create obstacles
  - Set **Checkpoints** for multi-destination pathfinding
  - Modify **Edge Costs** between adjacent nodes
  - Use **Eraser** to remove cells

- **Real-time Visualization**
  - Watch algorithms explore nodes in real-time
  - Color-coded cells for different states (start, end, walls, explored, path)
  - Visual feedback with different colors for even/odd grid positions

- **Detailed Results**
  - Nodes visited count
  - Number of moves/steps
  - Total path cost
  - Path existence indicator

- **Responsive Design**
  - Automatically resizes grid based on window dimensions
  - Clean, modern UI with intuitive controls

## Getting Started

### Prerequisites
- Node.js installed on your system
- A modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/omarabdiwali/pathfinding-visualizer.git

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

### Setting Up the Grid
1. **Start Node**: Click the "Start" button, then click on a grid cell to place the start position
2. **End Node**: Click the "End" button, then click on a grid cell to place the end position
3. **Walls**: Click the "Wall" button, then click and drag to add/remove obstacles
4. **Checkpoints**: Click the "Checkpoint" button to add intermediate destinations
5. **Edge Costs**: Click the "Cost" button to modify traversal costs between adjacent nodes (click a cell, then click a neighbor to adjust cost with Shift to decrease)

### Running Algorithms
1. Set up your grid with start, end, and optional walls/checkpoints
2. Click any algorithm button (Dijkstra, Bi-BFS, DFS, Greedy BFS, or A*)
3. Watch the visualization run in real-time
4. Press the red "Stop" button to halt execution if needed

### Clearing the Grid
- **Clear Path**: Removes visualization markings but keeps walls and nodes
- **Clear All**: Resets the entire grid to its initial state
- **Reset Costs**: Resets all edge costs to default values (1)

## Algorithm Descriptions

### Dijkstra's Algorithm
Finds the shortest path from start to end by exploring all neighbors at the present depth before moving to nodes at the next depth level. Guarantees the optimal solution.

### A* (A-Star)
An informed search algorithm that uses heuristics to guide the search toward the goal. More efficient than Dijkstra as it prioritizes paths that appear to lead closer to the target.

### Bi-directional BFS
Runs two simultaneous breadth-first searches - one from the start node and one from the end node - until they meet. Can be faster than standard BFS in some cases.

### Depth First Search (DFS)
Explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.

### Greedy Best-First Search
Uses only the heuristic function to determine which node to explore next, without considering the cost so far. Not guaranteed to find the optimal path.

## Tech Stack

- **Frontend**: Next.js
- **Styling**: Tailwind CSS
- **Algorithms**: Custom implementations in JavaScript

## Project Structure

```
search-algorithms/
├── pages/
│   └── index.js          # Main application component
├── algorithms/
│   ├── utils/
│   │   └── constants.js  # Constants and utility functions
│   ├── di-bfs.js         # Bi-directional BFS implementation
│   ├── greedy-bfs.js     # Greedy BFS implementation
│   ├── dijkstra.js       # Dijkstra's algorithm
│   ├── astar.js          # A* algorithm
│   └── dfs.js            # Depth First Search
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bug fixes and feature enhancements.

## License

This project is open source and available under the MIT License.