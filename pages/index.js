import { ALT_EXPLORED, ALT_NEXT, CURRENT, EMPTY_EVEN, EMPTY_ODD, END, EXPLORED, NEXT, PATH, POINT, START, WALL, clearGrid, getKey, getNeighbors, toggleBackdrop, updateRunning } from "@/algorithms/utils/constants";
import { useEffect, useRef, useState } from "react";
import HelpModal from "@/algorithms/utils/HelpModal";

import { dijkstraAlgorithm } from "@/algorithms/pathfinding/dijkstra";
import { biDirectionalBFS } from "@/algorithms/pathfinding/bi-bfs";
import { depthFirstSearch } from "@/algorithms/pathfinding/dfs";
import { greedyBFS } from "@/algorithms/pathfinding/greedy-bfs";
import { aStar } from "@/algorithms/pathfinding/astar";

import { recursiveBacktracking, imperfectMaze } from "@/algorithms/maze/recursiveBacktracking";
import { primsAlgorithm } from "@/algorithms/maze/primsAlgorithm";
import { kruskalsAlgorithm } from "@/algorithms/maze/kruskalsAlgorithm";
import { recursiveDivision } from "@/algorithms/maze/recursiveDivision";

const classes = {
  maze: "px-3 py-2 rounded text-sm font-medium cursor-pointer transition-all text-black",
  algorithms: "px-3 py-2 rounded text-sm font-medium cursor-pointer transition-all text-black",
  nodes: "px-3 py-2 rounded text-sm font-medium transition-all",
  stop: "px-4 py-2 rounded text-sm font-medium cursor-pointer hover:bg-red-800 bg-red-700 transition-all hover:scale-105 text-white animate-pulse",
  
  nodeSelectedCl: 'opacity-50 cursor-not-allowed text-black',
  nodeNormalCl: 'cursor-pointer hover:opacity-80 hover:scale-105 text-black',
  nodeAltSelectedCl: 'bg-slate-700 cursor-not-allowed text-white',
  nodeAltNormalCl: 'bg-slate-500 cursor-pointer hover:bg-slate-600 hover:scale-105 text-white',
  
  mazeNormalCl: "hover:bg-blue-400 bg-blue-300 hover:scale-105 transition-all",
  mazeSelectedCl: "bg-blue-400 opacity-50",
  
  algorithmsNormalCl: "hover:bg-lime-600 bg-lime-500 hover:scale-105 transition-all",
  algorithmsSelectedCl: "bg-lime-600 opacity-50",
}

const getGridActionsClass = (bgColor, textColor) => {
  return `px-3 py-2 rounded text-sm font-medium cursor-pointer ${bgColor} transition-all hover:scale-105 text-${textColor}`
}

export default function Home() {
  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);
  const [tool, setTool] = useState('start');
  const [running, setRunning] = useState(null);
  const [maze, setMaze] = useState(null);
  const [lastOp, setLastOp] = useState("");
  const [checkpoints, setCheckpoints] = useState([]);
  const [result, setResult] = useState({});
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [focused, setFocused] = useState(null);
  const [costs, setCosts] = useState({});
  const [focusNeighbors, setFocusNeighbors] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [currentSection, setCurrentSection] = useState("overview");
  const prevWidth = useRef(0);

  const gridRef = useRef(null);
  const intervalRef = useRef(null);

  const getActiveButtonClass = (variable, target) => {
    if (variable == 'maze') {
      return maze == target ? classes.mazeSelectedCl : classes.mazeNormalCl;
    } else if (variable == 'algorithms') {
      return running == target ? classes.algorithmsSelectedCl : classes.algorithmsNormalCl;
    } else if (variable == 'tool' || variable == 'tool-alt') {
      const normal = variable == 'tool' ? classes.nodeNormalCl : classes.nodeAltNormalCl;
      const selected = variable == 'tool' ? classes.nodeSelectedCl : classes.nodeAltSelectedCl;
      return tool == target ? selected : normal;
    }
  }

  const onHoldDown = () => {
    if (intervalRef.current || running || (tool != 'wall' && tool != 'eraser')) return;
    intervalRef.current = true;
  }

  const onMove = (e) => {
    if (!intervalRef.current || running || (tool != 'wall' && tool != 'eraser')) return;
    clickSquare(e);
  }

  const onRelease = () => {
    intervalRef.current = null;
  }

  const stopFocused = () => {
    if (focused != null) {
      setFocused(null);
      setFocusNeighbors([]);
      toggleBackdrop(width, height, false);
    }
  }

  const runAlgorithm = (algo) => {
    if (endPos == null || startPos == null || running || maze) return;

    stopFocused();
    updateRunning(true);
    setResult('');
    setRunning(algo);
    
    const positions = [startPos, ...checkpoints, endPos];
    const func = algo == 'dijkstra' ? dijkstraAlgorithm : algo == 'bi' ? biDirectionalBFS 
      : algo == 'greedy' ? greedyBFS : algo == 'aStar' ? aStar : depthFirstSearch;

    func(positions, width, height, costs).then(res => {
      setResult(res);
      setRunning(null);
      setLastOp('algorithm');
    });
  }

  const generateMaze = (algo) => {
    if (running || maze) return;

    stopFocused();
    updateRunning(true);
    setMaze(algo);

    const func = algo == 'imperfect' ? imperfectMaze : algo == 'prims' ? primsAlgorithm 
    : algo == 'kruskals' ? kruskalsAlgorithm : algo == 'division' ? recursiveDivision : recursiveBacktracking;
    func(width, height).then(() => {
      setMaze(null);
      setLastOp("maze");
    })
  }

  const clearSquare = (el) => {
    el.classList.remove(NEXT)
    el.classList.remove(EXPLORED);
    el.classList.remove(PATH);
    el.classList.remove(WALL);
    el.classList.remove(EMPTY_EVEN);
    el.classList.remove(EMPTY_ODD);
    el.classList.remove(CURRENT);
    el.classList.remove(ALT_EXPLORED);
    el.classList.remove(ALT_NEXT);
  }

  const clearWalls = () => {
    const squares = width * height;
    for (let pos = 0; pos < squares; pos++) {
      const el = document.getElementById(`${pos}`);
      if (el == null || !el.classList.contains(WALL)) continue;
      el.classList.replace(WALL, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
    } 
  }

  const clearAllWalls = () => {
    if (running || maze) return;
    stopFocused();
    clearWalls();
    setLastOp('clearWalls');
  }

  const gridClear = () => {
    setStartPos(null);
    setEndPos(null);
    setCheckpoints([]);
    clearGrid(width, height, false);
    setLastOp('clear');
  }

  const clearCompleteGrid = () => {
    if (running || maze) return;
    stopFocused();
    gridClear();
  }

  const stopMaze = () => {
    if (!maze) return;
    updateRunning(false);
    setMaze(false);
  }

  const stopRunning = () => {
    if (!running) return;
    updateRunning(false);
    setRunning(null);
  }

  const clickSquare = (e) => {
    if (running || maze) return;
    if (lastOp == 'algorithm' || lastOp == 'clearWalls') clearGrid(width, height, true);
    setLastOp('click');

    let el = e.target.id == '' ? e.target.parentElement : e.target;
    let newPos = parseInt(el.id);

    if (tool == 'start') {
      if (startPos == newPos) return;

      if (startPos != null) {
        document.getElementById(startPos).classList.replace(START, startPos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
      }
      
      if (newPos == endPos) {
        el.classList.replace(END, START);
        setEndPos(null);
      } else if (checkpoints.includes(newPos)) {
        el.classList.replace(POINT, START);
        const prev = [...checkpoints];
        const index = prev.indexOf(newPos);
        if (index != -1) {
          prev.splice(index, 1);
          setCheckpoints(prev);
        }
      } else {
        clearSquare(el);
        el.classList.add(START);
      }
      setStartPos(newPos);
    } 
    else if (tool == 'end') {
      if (endPos == newPos) return;

      if (endPos != null) {
        document.getElementById(endPos).classList.replace(END, endPos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
      }

      if (newPos == startPos) {
        el.classList.replace(START, END);
        setStartPos(null);
      } else if (checkpoints.includes(newPos)) {
        el.classList.replace(POINT, END);
        const prev = [...checkpoints];
        const index = prev.indexOf(newPos);
        if (index != -1) {
          prev.splice(index, 1);
          setCheckpoints(prev);
        }
      } else {
        clearSquare(el);
        el.classList.add(END);
      }
      setEndPos(newPos);
    }
    else if (tool == 'wall' || tool == 'eraser') {
      const newNode = tool == 'wall' ? WALL : newPos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD;

      if (startPos == newPos) {
        el.classList.replace(START, newNode);
        setStartPos(null);
      } else if (endPos == newPos) {
        el.classList.replace(END, newNode);
        setEndPos(null);
      } else if (checkpoints.includes(newPos)) {
        el.classList.replace(POINT, newNode);
        const prev = [...checkpoints];
        const index = prev.indexOf(newPos);
        if (index != -1) {
          prev.splice(index, 1);
          setCheckpoints(prev);
        }
      } else {
        clearSquare(el);
        el.classList.add(newNode);
      }
    }
    else if (tool == 'checkpoint') {
      if (checkpoints.includes(newPos)) return;

      if (newPos == startPos) {
        el.classList.replace(START, POINT);
        setStartPos(null);
      } else if (newPos == endPos) {
        el.classList.replace(END, POINT);
        setEndPos(null);
      } else {
        clearSquare(el);
        el.classList.add(POINT);
      }

      const prev = [...checkpoints];
      prev.push(newPos);
      setCheckpoints(prev);
    }
    else if (tool == 'changeCost') {
      if (el.classList.contains(WALL)) return;
      if (focused == newPos) {
        stopFocused();
        return;
      }

      if (focusNeighbors.includes(newPos)) {
        const costsCopy = { ...costs };
        const key = getKey(focused, newPos);
        const currentCost = key in costsCopy ? costsCopy[key] : 1;
        costsCopy[key] = e.shiftKey ? Math.max(1, currentCost - 1) : currentCost + 1;
        setCosts(costsCopy);
      } else {
        const neighbors = getNeighbors(newPos, width, height);
        const neighborsSet = new Set(neighbors);
        neighborsSet.add(newPos);

        setFocused(newPos);
        setFocusNeighbors(neighbors);
        toggleBackdrop(width, height, true, neighborsSet);
      }
    }
  }

  const changeTool = (value) => {
    if (tool == value) return;
    stopFocused();
    setTool(value);
  }

  useEffect(() => {
    let timeoutId = null;
    const onResize = (onStart=false) => {
      const docWidth = document.documentElement.clientWidth;
      const docHeight = document.documentElement.clientHeight;
      if (prevWidth.current == docWidth) return;
      
      const resizeFunction = () => {
        let newWidth = Math.floor(docWidth / 20);
        let newHeight = Math.floor(docHeight / 24);
        newWidth = newWidth % 2 == 0 ? newWidth - 1 : newWidth;
        newHeight = newHeight % 2 == 0 ? newHeight - 1 : newHeight;

        if (newWidth * newHeight > 10000) {
          newHeight = Math.min(newHeight, 99);
          if (newWidth * newHeight > 10000) {
            newWidth = Math.min(newWidth, 99);
          }
        }

        updateRunning(false);  
        setRunning(null);
        setStartPos(null);
        setEndPos(null);
        setCheckpoints([]);
        setFocused(null);
        setFocusNeighbors([]);
        setLastOp("resize");
        
        toggleBackdrop(newWidth, newHeight, false);
        setCosts({});
        setWidth(newWidth);
        setHeight(newHeight);
        clearGrid(newWidth, newHeight, false);
        prevWidth.current = docWidth;
      }

      if (onStart) {
        resizeFunction();
        return;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(resizeFunction, 150)
    }

    onResize(true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])

  return (
    <div className="my-4">
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        currentSection={currentSection}
        onSectionChange={(section) => setCurrentSection(section)}
      />
      <div className="mx-4 lg:flex lg:flex-row lg:space-x-6 items-stretch justify-center mb-4">
        <div className="flex-1 flex flex-col space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Node Tools</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => changeTool('start')} className={`${START} ${classes.nodes} ${getActiveButtonClass('tool', 'start')}`}>Start</button>
              <button onClick={() => changeTool('end')} className={`${END} ${classes.nodes} ${getActiveButtonClass('tool', 'end')}`}>End</button>
              <button onClick={() => changeTool('wall')} className={`${classes.nodes} ${getActiveButtonClass('tool-alt', 'wall')}`}>Wall</button>
              <button onClick={() => changeTool('checkpoint')} className={`${POINT} ${classes.nodes} ${getActiveButtonClass('tool', 'checkpoint')}`}>Checkpoint</button>
              <button onClick={() => changeTool('eraser')} className={`${classes.nodes} ${getActiveButtonClass('tool-alt', 'eraser')}`}>Eraser</button>
              <button onClick={() => changeTool('changeCost')} className={`${classes.nodes} ${getActiveButtonClass('tool-alt', 'changeCost')}`}>Cost</button>
              <button
                onClick={() => setShowHelp(true)}
                className={`${classes.nodes} bg-transparent border border-slate-600 hover:scale-105 text-white cursor-pointer`}
              >
                Help
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Maze Generation</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => generateMaze('recursive')} className={`${classes.maze} ${getActiveButtonClass('maze', 'recursive')}`}
              >
                Recursive Backtracking
              </button>
              <button
                onClick={() => generateMaze('imperfect')} className={`${classes.maze} ${getActiveButtonClass('maze', 'imperfect')}`}
              >
                Imperfect Maze
              </button>
              <button
                onClick={() => generateMaze('prims')} className={`${classes.maze} ${getActiveButtonClass('maze', 'prims')}`}
              >
                Prim&#39;s Algorithm
              </button>
              <button
                onClick={() => generateMaze('kruskals')} className={`${classes.maze} ${getActiveButtonClass('maze', 'kruskals')}`}
              >
                Kruskal&#39;s Algorithm
              </button>
              <button
                onClick={() => generateMaze('division')} className={`${classes.maze} ${getActiveButtonClass('maze', 'division')}`}
              >
                Recursive Division
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Grid Actions</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCosts({})} className={getGridActionsClass('bg-pink-500', 'white')}>Reset Costs</button>
              <button onClick={() => !running && clearGrid(width, height, true)} className={getGridActionsClass('bg-red-300', 'black')}>Clear Path</button>
              <button onClick={clearAllWalls} className={getGridActionsClass('bg-red-400', 'black')}>Clear Walls</button>
              <button onClick={clearCompleteGrid} className={getGridActionsClass('bg-red-500', 'white')}>Clear All</button>
              {(maze || running) && (
                <button onClick={maze ? stopMaze : stopRunning} className={classes.stop}>Stop</button>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Algorithms</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => runAlgorithm('dijkstra')} className={`${classes.algorithms} ${getActiveButtonClass('algorithms', 'dijkstra')}`}
              >
                Dijkstra
              </button>
              <button
                onClick={() => runAlgorithm('bi')} className={`${classes.algorithms} ${getActiveButtonClass('algorithms', 'bi')}`}
              >
                Bi-BFS
              </button>
              <button
                onClick={() => runAlgorithm('dfs')} className={`${classes.algorithms} ${getActiveButtonClass('algorithms', 'dfs')}`}
              >
                DFS
              </button>
              <button
                onClick={() => runAlgorithm('greedy')} className={`${classes.algorithms} ${getActiveButtonClass('algorithms', 'greedy')}`}
              >
                Greedy BFS
              </button>
              <button
                onClick={() => runAlgorithm('aStar')} className={`${classes.algorithms} ${getActiveButtonClass('algorithms', 'aStar')}`}
              >
                A*
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2 mt-4 lg:mt-0">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Results</p>
          <div className="bg-slate-800 content-center flex-1 border border-slate-600 rounded-lg p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Algorithm</p>
            <p className="text-xl font-bold text-white">
              {result?.algorithm || '-'}
            </p>
          </div>
          
          <div className="flex-1 content-center">
          {result?.pathExists === false ? (
            <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-red-400">
                No path found
              </p>
              <p className="text-sm text-red-400/70 mt-1">
                {result?.message || 'There is no valid path from start to end.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-800 border flex flex-col justify-center border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Visited</p>
                <p title={result?.nodesTraversed ?? ''} className="text-2xl font-bold text-cyan-400 truncate overflow-hidden whitespace-nowrap">
                  {result?.nodesTraversed ?? '-'}
                </p>
              </div>

              <div className="bg-slate-800 border flex flex-col justify-center border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Moves</p>
                <p title={result?.moves ?? ''} className="text-2xl font-bold text-amber-400 truncate overflow-hidden whitespace-nowrap">
                  {result?.moves ?? '-'}
                </p>
              </div>

              <div className="bg-slate-800 border flex flex-col justify-center border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Cost</p>
                <p title={result?.totalCost ?? ''} className="text-2xl font-bold text-emerald-400 truncate overflow-hidden whitespace-nowrap">
                  {result?.totalCost ?? '-'}
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
      
      <center>
        <div
          onMouseDown={onHoldDown} onMouseUp={onRelease} onMouseLeave={onRelease} onMouseMove={onMove}
          ref={gridRef}
          id="grid"
          className="border border-slate-600 rounded-lg overflow-hidden inline-block"
        >
          {new Array(height).fill(new Array(width).fill(0)).map((row, idx) => {
            let counterStart = width * idx;
            return (
              <div className="flex" key={`row-${idx}`}>
                {row.map((_, col) => {
                  const uniqPos = counterStart + col;
                  const index = checkpoints.indexOf(counterStart + col);
                  const className = `min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] flex items-center justify-center text-xs select-none cursor-default border border-slate-700 ${uniqPos % 2 === 0 ? EMPTY_EVEN : EMPTY_ODD}`;
                  const key = focused != null ? getKey(focused, uniqPos) : '';
                  const currentCost = focusNeighbors.includes(uniqPos) ? key in costs ? costs[key] : 1 : '';

                  return (
                    <div onClick={clickSquare} className={className} id={`${uniqPos}`} key={`${uniqPos}`}>
                      <div className="text-center">{currentCost != '' ? currentCost : index != -1 ? index + 1 : ''}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </center>
    </div>
  );
}