# Pathfinding Visualizer

A web-based interactive visualization tool for popular search algorithms including Dijkstra's Algorithm, A*, Bi-directional BFS, DFS, and Greedy Best-First Search, with maze generation built in.

**https://visualizer-path.vercel.app**

![Home Page](https://i.imgur.com/g0pfUBg.png)

## Features

- **Multiple Algorithms**: Visualize and compare different pathfinding algorithms
  - Dijkstra's Algorithm
  - A* (A-Star)
  - Bi-directional BFS
  - Depth First Search (DFS)
  - Greedy Best-First Search (Greedy BFS)

- **Maze Generation**: Automatically generate mazes using different algorithms
  - Recursive Backtracking
  - Imperfect Maze
  - Prim's Algorithm
  - Kruskal's Algorithm
  - Recursive Division

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

![Visualization](https://i.imgur.com/u7VFidW.png)

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
5. **Edge Costs**: Click the "Cost" button to modify traversal costs between adjacent nodes (click a cell, then click a neighbor to adjust cost with `Shift` to decrease)

![Edge Costs](https://i.imgur.com/U2JJqyN.png)

### Generating Mazes
1. Select one of the available maze generation algorithms
2. Watch the maze being generated in real-time on the grid

### Running Algorithms
1. Set up your grid with start, end, and optional walls/checkpoints
2. Click any algorithm button (Dijkstra, Bi-BFS, DFS, Greedy BFS, or A*)
3. Watch the visualization run in real-time
4. Press the red "Stop" button to halt execution if needed

### Clearing the Grid
- **Clear Path**: Removes visualization markings but keeps walls and nodes
- **Clear Walls**: Removes all walls but keeps nodes and visualization markings
- **Clear All**: Resets the entire grid to its initial state
- **Reset Costs**: Resets all edge costs to default values (1)

## Pathfinding Algorithms

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

## Maze Generation Algorithms

### Recursive Backtracking
Uses a depth-first approach with a stack. Carves passages by visiting random unvisited neighbors, backtracking when stuck. Produces long winding corridors with few dead ends.

### Imperfect Maze
Based on recursive backtracking but randomly removes some walls during rendering. Creates a maze with multiple paths and loops, making it less perfect and more complex.

### Prim's Algorithm
Begins with a single cell and grows the maze by randomly adding frontier cells. Creates a more organic, branching maze with many short dead ends.

### Kruskal's Algorithm
Treats each cell as a separate set and randomly connects them by removing walls between disjoint sets. Results in a uniform, evenly distributed maze.

### Recursive Division
Starts with an open grid and repeatedly divides it with walls containing random passages. Produces a structured maze with clear horizontal and vertical divisions.

## Tech Stack

- **Frontend**: Next.js
- **Styling**: Tailwind CSS
- **Algorithms**: Custom implementations in JavaScript

## Project Structure

```
search-algorithms/
├── pages/
│   └── index.js                        # Main application component
├── algorithms/
│   ├── utils/
│   │   ├── constants.js                # Constants and utility functions
│   │   ├── PriorityQueue.js            # Custom Priority Queue class 
│   │   └── HelpModal.js                # Help modal with usage instructions
|   ├── maze/
│   │   ├── primsAlgorithm.js           # Prim's algorithm implementation
│   │   ├── kruskalsAlgorithm.js        # Kruskal's algorithm implementation
│   │   ├── recursiveDivision.js        # Recursive division implementation
│   │   └── recursiveBacktracking.js    # Recursive backtracking & imperfect maze
|   └── pathfinding/
│       ├── di-bfs.js                   # Bi-directional BFS implementation
│       ├── greedy-bfs.js               # Greedy BFS implementation
│       ├── dijkstra.js                 # Dijkstra's algorithm
│       ├── astar.js                    # A* algorithm
│       └── dfs.js                      # Depth First Search
└── README.md
```

## License

This project is open source and available under the MIT License.