const helpSections = {
  overview: {
    tab: "Overview",
    title: "Welcome to the Pathfinding Visualizer",
    content: `This is an interactive web-based visualization tool for popular search algorithms including Dijkstra's Algorithm, A*, Bi-directional BFS, DFS, and Greedy Best-First Search. You can create custom mazes, set checkpoints, modify edge costs, and watch algorithms find paths in real-time.\n\n
    Want to explore more? Check out the project on <a href="https://github.com/omarabdiwali/pathfinding-visualizer" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline">GitHub</a>!`
  },
  gridSetup: {
    tab: "Controls",
    title: "Grid Setup & Controls",
    content: `• **Start Node**: Click a cell to place the starting position
    • **End Node**: Click a cell to place the destination
    • **Walls**: Click and drag to add obstacles
    • **Checkpoints**: Add intermediate destinations (visited in order)
    • **Edge Costs**: Modify traversal costs between adjacent nodes (click to increase neighbour costs, hold **Shift** to decrease)
    • **Eraser**: Remove cells and reset them to default state
    \n\nGrid size auto-adjusts to your window dimensions`
  },
  algorithms: {
    tab: "Pathfinding",
    title: "Pathfinding Algorithms",
    content: `**Dijkstra's Algorithm**
    Explores all neighbors at present depth before moving deeper. Guarantees the shortest path.
    **A* (A-Star)**
    Uses heuristics to guide search toward the goal. More efficient than Dijkstra while still optimal.
    **Bi-directional BFS**
    Runs two simultaneous breadth-first searches from start and end until they meet. Can be faster than standard BFS.
    **Depth First Search (DFS)**
    Explores as far as possible along each branch before backtracking. Does not guarantee shortest path.
    **Greedy Best-First Search**
    Uses only heuristic to determine next node. Fast but not guaranteed to find optimal path.`
  },
  maze: {
    tab: "Maze",
    title: "Maze Generation Algorithms",
    content: `**Recursive Backtracking**
    Uses a depth-first approach with a stack. Carves passages by visiting random unvisited neighbors, backtracking when stuck. Produces long winding corridors with few dead ends.
    **Imperfect Maze**
    Based on recursive backtracking but randomly removes some walls during rendering. Creates a maze with multiple paths and loops, making it less perfect and more complex.
    **Prim's Algorithm**
    Begins with a single cell and grows the maze by randomly adding frontier cells. Creates a more organic, branching maze with many short dead ends.
    **Kruskal's Algorithm**
    Treats each cell as a separate set and randomly connects them by removing walls between disjoint sets. Results in a uniform, evenly distributed maze.
    **Recursive Division**
    Starts with an open grid and repeatedly divides it with walls containing random passages. Produces a structured maze with clear horizontal and vertical divisions.`
  },
  visualization: {
    tab: "Animation",
    title: "Visualization & Results",
    content: `
    **Real-time Animation**
    Watch algorithms explore nodes with color-coded visualization
    \n\n
    **Color-coded Cells**
    **Start/End**: Distinct colors for identification (Orange/Purple)
    **Walls**: Obstacles that cannot be traversed (Black)
    **Next**: Nodes that have been added to the queue, but not yet visited (Green/Light Blue)
    **Current**: The current node being explored (Dark Blue)
    **Explored**: Nodes visited during search (Red/Teal)
    **Path**: Final route from start to end (Yellow)
    **Checkpoints**: Intermediate destinations (Sky Blue)
    \n\n
    **Results Display**
    **Visited**: Total count of nodes visited to find the path
    **Moves**: The amount of nodes traveled to complete the path
    **Cost**: Cummulative edge cost of the path
    \n\n    
    **Stop Button**: Press the red "Stop" button to halt execution at any time`
  },
  clearing: {
    tab: "Reset",
    title: "Clearing & Resetting",
    content: `**Clear Path**: Removes visualization markings (explored nodes and path) but keeps walls, nodes, and checkpoints
    **Clear Walls**: Removes all walls, but keeps visualization markings, nodes, and checkpoints
    **Clear All**: Resets the entire grid to its initial empty state
    **Reset Costs**: Resets all edge costs back to default value (1)`
  },
  edgeCosts: {
    tab: "Costs",
    title: "Edge Costs Explained",
    content: `Edge costs represent the "difficulty" or "distance" of moving between adjacent cells:
    • **Default Cost**: 1 (standard movement)
    • **Higher Costs**: Represent difficult terrain (e.g., mud, hills)
    • **Lower Costs**: Represent easy paths (e.g., highways)
    \n\n
    Algorithms will prefer paths with lower total cost, where Dijkstra and A* guarantee optimal paths considering costs, and DFS and Greedy BFS may not consider costs optimally`
  },
};

export default function HelpModal({
  isOpen,
  onClose,
  currentSection,
  onSectionChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-[600px] h-[600px] max-w-[95vw] max-h-[95vh] flex flex-col">
        <div className="flex border-b border-gray-700 overflow-auto overscroll-contain">
          {Object.keys(helpSections).map((section) => (
            <button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`px-4 py-2 text-sm ${currentSection === section
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              {helpSections[section].tab}
            </button>
          ))}
        </div>
        <div className="p-6 flex-1 overscroll-contain overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">{helpSections[currentSection].title}</h2>
          <div className="prose prose-invert prose-sm">
            {helpSections[currentSection].content.split('\n\n').map((paragraph, index) => (
              <div key={index}>
                {paragraph.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-2" dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                ))}
                {index < helpSections[currentSection].content.split('\n\n').length - 1 && (
                  <hr className="my-4 border-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};