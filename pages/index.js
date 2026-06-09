import { CURRENT, EMPTY_EVEN, EMPTY_ODD, END, EXPLORED, NEXT, PATH, POINT, START, WALL, clearGrid, getNeighbors, toggleBackdrop, updateRunning } from "@/algorithms/utils/constants";
import { biDirectionalBFS } from "@/algorithms/bi-bfs";
import { greedyBFS } from "@/algorithms/greedy-bfs";
import { dijkstraAlgorithm } from "@/algorithms/dijkstra";
import { useEffect, useRef, useState } from "react";
import { aStar } from "@/algorithms/astar";
import { depthFirstSearch } from "@/algorithms/dfs";

export default function Home() {
  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);
  const [status, setStatus] = useState('start');
  const [running, setRunning] = useState(false);
  const [lastOp, setLastOp] = useState("");
  const [checkpoints, setCheckpoints] = useState([]);
  const [result, setResult] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [focused, setFocused] = useState(null);
  const [costs, setCosts] = useState({});
  const [focusNeighbors, setFocusNeighbors] = useState([]);

  const gridRef = useRef(null);
  const intervalRef = useRef(null);

  const onHoldDown = () => {
    if (intervalRef.current || running || (status != 'wall' && status != 'eraser')) return;
    intervalRef.current = true;
  }

  const onMove = (e) => {
    if (!intervalRef.current || running || (status != 'wall' && status != 'eraser')) return;
    clickSquare(e);
  }

  const onRelease = () => {
    intervalRef.current = null;
  }

  const runAlgorithm = (algo) => {
    if (endPos == null || startPos == null || running) return;
    setFocused(null);
    setFocusNeighbors([]);
    toggleBackdrop(width, height, false);
    updateRunning(true);
    setResult('');
    setRunning(true);
    const positions = [startPos, ...checkpoints, endPos];
    const func = algo == 'dijkstra' ? dijkstraAlgorithm : algo == 'bi' ? biDirectionalBFS 
      : algo == 'greedy' ? greedyBFS : algo == 'aStar' ? aStar : depthFirstSearch;

    func(positions, width, height, costs).then(res => {
      setResult(res);
      setRunning(false);
      setLastOp('algorithm');
    });
  }

  const clearSquare = (el) => {
    el.classList.remove(NEXT)
    el.classList.remove(EXPLORED);
    el.classList.remove(PATH);
    el.classList.remove(WALL);
    el.classList.remove(EMPTY_EVEN);
    el.classList.remove(EMPTY_ODD);
    el.classList.remove(CURRENT);
  }

  const gridClear = () => {
    setStartPos(null);
    setEndPos(null);
    setCheckpoints([]);
    clearGrid(width, height, false);
    setLastOp('clear');
  }

  const clearCompleteGrid = () => {
    if (running) return;
    gridClear();
  }

  const stopRunning = () => {
    if (!running) return;
    updateRunning(false);
    setRunning(false);
  }

  const clickSquare = (e) => {
    if (running) return;
    if (lastOp == 'algorithm') clearGrid(width, height, true);
    setLastOp('click');

    let el = e.target.id == '' ? e.target.parentElement : e.target;
    let newPos = parseInt(el.id);

    if (status == 'start') {
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
    else if (status == 'end') {
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
    else if (status == 'wall' || status == 'eraser') {
      const newNode = status == 'wall' ? WALL : newPos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD;

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
    else if (status == 'checkpoint') {
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
        const prev = [...checkpoints];
        prev.push(newPos);
        setCheckpoints(prev);
      }
    }
    else if (status == 'changeCost') {
      if (el.classList.contains(WALL)) return;
      if (focused == newPos) {
        setFocused(null);
        setFocusNeighbors([]);
        toggleBackdrop(width, height, false);
        return;
      }

      if (focusNeighbors.includes(newPos)) {
        const costsCopy = { ...costs };
        const key = focused < newPos ? `${focused}-${newPos}` : `${newPos}-${focused}`;
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

  const changeStatus = (value) => {
    if (status == value) return;
    setFocused(null);
    setFocusNeighbors([]);
    toggleBackdrop(width, height, false);
    setStatus(value);
  }

  useEffect(() => {
    const onResize = (onStart=false) => {
      let newWidth = Math.floor(window.innerWidth / 20);
      let newHeight = Math.floor(window.innerHeight / 24);
      newWidth = newWidth % 2 == 0 ? newWidth - 1 : newWidth;
      newHeight = newHeight % 2 == 0 ? newHeight - 1 : newHeight;

      if (onStart) {
        setWidth(newWidth);
        setHeight(newHeight);
      }
      
      updateRunning(false);
      setRunning(false);
      setStartPos(null);
      setEndPos(null);
      setCheckpoints([]);
      setFocused(null);
      setFocusNeighbors([]);
      toggleBackdrop(newWidth, newHeight, false);
      setCosts({});
      setWidth(newWidth);
      setHeight(newHeight);
      clearGrid(newWidth, newHeight, false);
    }

    onResize(true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])

  return (
    <div className="my-4">
      <div className="mx-4 lg:flex lg:flex-row lg:space-x-6 items-stretch justify-center mb-4">
        <div className="flex-1 flex flex-col space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Node Tools</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => changeStatus('start')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'start' ? 'opacity-50 cursor-not-allowed ring-2 ring-white/30' : 'cursor-pointer hover:opacity-80 hover:scale-105'} ${START} text-black`}
              >
                Start
              </button>
              <button
                onClick={() => changeStatus('end')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'end' ? 'opacity-50 cursor-not-allowed ring-2 ring-white/30' : 'cursor-pointer hover:opacity-80 hover:scale-105'} ${END} text-black`}
              >
                End
              </button>
              <button
                onClick={() => changeStatus('wall')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'wall' ? 'bg-slate-700 ring-2 ring-white/30' : 'bg-slate-500 cursor-pointer hover:bg-slate-600 hover:scale-105'} text-white`}
              >
                Wall
              </button>
              <button
                onClick={() => changeStatus('checkpoint')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'checkpoint' ? 'opacity-50 cursor-not-allowed ring-2 ring-white/30' : 'cursor-pointer hover:opacity-80 hover:scale-105'} ${POINT} text-black`}
              >
                Checkpoint
              </button>
              <button
                onClick={() => changeStatus('eraser')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'eraser' ? 'bg-slate-700 ring-2 ring-white/30' : 'bg-slate-500 cursor-pointer hover:bg-slate-600 hover:scale-105'} text-white`}
              >
                Eraser
              </button>
              <button
                onClick={() => changeStatus('changeCost')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${status === 'changeCost' ? 'bg-slate-700 ring-2 ring-white/30' : 'bg-slate-500 cursor-pointer hover:bg-slate-600 hover:scale-105'} text-white`}
              >
                Cost
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Grid Actions</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCosts({})}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-pink-600 bg-pink-500 transition-all hover:scale-105 text-white"
              >
                Reset Costs
              </button>
              <button
                onClick={() => !running && clearGrid(width, height, true)}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-red-500 bg-red-400 transition-all hover:scale-105 text-black"
              >
                Clear Path
              </button>
              <button
                onClick={clearCompleteGrid}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-red-600 bg-red-500 transition-all hover:scale-105 text-white"
              >
                Clear All
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Algorithms</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => runAlgorithm('dijkstra')}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-lime-600 bg-lime-500 transition-all hover:scale-105 text-black"
              >
                Dijkstra
              </button>
              <button
                onClick={() => runAlgorithm('bi')}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-lime-600 bg-lime-500 transition-all hover:scale-105 text-black"
              >
                Bi-BFS
              </button>
              <button
                onClick={() => runAlgorithm('dfs')}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-lime-600 bg-lime-500 transition-all hover:scale-105 text-black"
              >
                DFS
              </button>
              <button
                onClick={() => runAlgorithm('greedy')}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-lime-600 bg-lime-500 transition-all hover:scale-105 text-black"
              >
                Greedy BFS
              </button>
              <button
                onClick={() => runAlgorithm('aStar')}
                className="px-3 py-2 rounded text-sm font-medium cursor-pointer hover:bg-lime-600 bg-lime-500 transition-all hover:scale-105 text-black"
              >
                A*
              </button>
              {running && (
                <button
                  onClick={stopRunning}
                  className="px-4 py-2 rounded text-sm font-medium cursor-pointer hover:bg-red-800 bg-red-700 transition-all hover:scale-105 text-white animate-pulse"
                >
                  ■ Stop
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2 mt-4 lg:mt-0">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Results</p>

          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Algorithm</p>
            <p className="text-xl font-bold text-white">
              {result?.algorithm || '-'}
            </p>
          </div>

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
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Nodes Visited</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {result?.nodesTraversed ?? '-'}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1"># of Moves</p>
                <p className="text-2xl font-bold text-amber-400">
                  {result?.moves ?? '-'}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Path Cost</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {result?.totalCost ?? '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <center>
        <div
          onMouseDown={onHoldDown}
          onMouseUp={onRelease}
          onMouseLeave={onRelease}
          onMouseMove={onMove}
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
                  const key = focused != null ? focused < uniqPos ? `${focused}-${uniqPos}` : `${uniqPos}-${focused}` : '';
                  const currentCost = focusNeighbors.includes(uniqPos) ? key in costs ? costs[key] : 1 : '';

                  return (
                    <div onClick={clickSquare} className={className} id={`${uniqPos}`} key={`${uniqPos}`}>
                      <div className="text-center">{currentCost != '' ? currentCost : index != -1 ? index : ''}</div>
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