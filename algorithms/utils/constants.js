export const START = 'bg-amber-500';
export const END = 'bg-purple-500';
export const EMPTY_EVEN = 'bg-slate-600';
export const EMPTY_ODD = 'bg-slate-500';
export const WALL = 'bg-black';
export const PATH = 'bg-yellow-200';
export const NEXT = 'bg-green-500';
export const EXPLORED = 'bg-red-500';
export const POINT = 'bg-blue-500';
export const CURRENT = 'bg-blue-800';
export const ALT_EXPLORED = 'bg-teal-500';
export const ALT_NEXT = 'bg-blue-300';
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export let continueRunning = true;

const sleepTime = 5;

export const updateRunning = (val) => {
    continueRunning = val;
}

const verifyNeighbor = (pos) => {
    const el = document.getElementById(`${pos}`);
    if (!el || el.classList.contains(WALL)) return false;
    return true;
}

const removePreviousColor = (el) => {
    el.classList.remove(NEXT);
    el.classList.remove(EMPTY_EVEN);
    el.classList.remove(EMPTY_ODD);
    el.classList.remove(EXPLORED);
    el.classList.remove(PATH);
    el.classList.remove(START);
    el.classList.remove(END);
    el.classList.remove(WALL);
    el.classList.remove(POINT);
    el.classList.remove(CURRENT);
    el.classList.remove(ALT_EXPLORED);
    el.classList.remove(ALT_NEXT);
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const getKey = (a, b) => {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export const toggleBackdrop = (width, height, backdropStatus, neighbors=null) => {
    for (let i = 0; i < width * height; i++) {
        const el = document.getElementById(`${i}`);
        if (el == null) continue;
        if (backdropStatus == false) {
            el.classList.remove('opacity-20');
        } else {
            const isNeighbor = neighbors.has(i);
            if (!isNeighbor) {
                el.classList.add('opacity-20');
            } else {
                el.classList.remove('opacity-20');
            }
        }
    }
}

export const getPathCost = (path, costs) => {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const curPos = path.at(i);
        const nxtPos = path.at(i + 1);
        if (curPos == null || nxtPos == null) continue;
        const key = curPos < nxtPos ? `${curPos}-${nxtPos}` : `${nxtPos}-${curPos}`;
        const moveCost = key in costs ? costs[key] : 1;
        cost += moveCost;
    }

    return cost;
}

export const clearGrid = (width, height, keepNodes) => {
    for (let i = 0; i < width * height; i++) {
        const el = document.getElementById(`${i}`);
        if (el == null) continue;

        if (keepNodes) {
            const classes = el.classList;
            if (classes.contains(EXPLORED) || classes.contains(NEXT) || classes.contains(ALT_EXPLORED) 
                || classes.contains(ALT_NEXT) || classes.contains(PATH) || classes.contains(CURRENT)) {
                removePreviousColor(el);
                i % 2 == 0 ? el.classList.add(EMPTY_EVEN) : el.classList.add(EMPTY_ODD);
            }
        } else {
            removePreviousColor(el);
            i % 2 == 0 ? el.classList.add(EMPTY_EVEN) : el.classList.add(EMPTY_ODD);
        }
    }
}

export const getNeighbors = (pos, width, height, randomize=false) => {
    let neighbors = [];
    pos = parseInt(pos);
    width = parseInt(width);
    height = parseInt(height);
    
    let left = pos - 1;
    let right = pos + 1;
    let up = pos - width;
    let down = pos + width;

    let posMod = pos % width;
    let leftMod = left % width;
    let rightMod = right % width;
    
    if (up >= 0) neighbors.push(up);
    if (posMod + 1 == rightMod) neighbors.push(right);
    if (down < width * height) neighbors.push(down);
    if (posMod - 1 == leftMod) neighbors.push(left);

    neighbors = neighbors.filter((val) => verifyNeighbor(val));
    return randomize ? shuffle(neighbors) : neighbors;
}

export const reconstructPath = (parentMap, targetNode, reverse=true) => {
    const path = [];
    let passed = new Set();
    let current = targetNode;
    let previous = null;

    while (current !== undefined && current !== null) {
        if (passed.has(current)) {
            console.log(parentMap);
            throw Error(`Cycle: ${previous} -> ${current}`);
        }

        path.push(current);
        passed.add(current);
        previous = current;
        current = parentMap.get(current);
    }

    return reverse ? path.reverse() : path;
}

export const drawPath = async (path, start, end) => {
    for (const node of path) {
        if (node == start || node == end) continue;
        changeElColor(node, PATH);
        await sleep(sleepTime);
    }
}

export const changeElColor = (pos, color, allowPath=false) => {
    if (pos == null) return false;
    const el = document.getElementById(`${pos}`);
    if (el == null) return false;
    if (el.classList.contains(START) || el.classList.contains(POINT) || el.classList.contains(END) || (!allowPath && el.classList.contains(PATH))) return false;

    const isPath = el.classList.contains(PATH);
    removePreviousColor(el);
    el.classList.add(color);
    return allowPath && isPath;
}

export const removeNextColors = (remaining, color=EXPLORED) => {
    for (const pos of remaining) {
        const el = document.getElementById(`${pos}`);
        if (!el.classList.contains(NEXT) && !el.classList.contains(ALT_NEXT)) continue;
        el.classList.replace(NEXT, color);
        el.classList.replace(ALT_NEXT, color);
    }
}

export const removeExploredNodes = (nodes) => {
    for (const pos of nodes) {
        if (pos == null) continue;
        const el = document.getElementById(`${pos}`);
        if (!el.classList.contains(EXPLORED) && !el.classList.contains(ALT_EXPLORED)) continue;
        el.classList.replace(EXPLORED, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
        el.classList.replace(ALT_EXPLORED, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD)
    }
}

export const redrawPathNodes = (prevPos) => {
    for (const key of prevPos.keys()) {
        const el = document.getElementById(`${key}`);
        removePreviousColor(el);
        el.classList.add(PATH);
    }
}

export const addCommas = (num) => {
    if (num < 1000) return num;
    let str = num.toString();
    let chars = [];
    let count = 0;

    for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
            chars.push(',');
            count = 0;
        }

        chars.push(str.at(i));
        count += 1;
    }

    return chars.reverse().join("");
}

export const clearWalls = (width, height) => {
    for (let i = 0; i < width * height; i++) {
        const el = document.getElementById(`${i}`);
        if (!el.classList.contains(WALL)) continue;
        el.classList.replace(WALL, i % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
    }
}

export const makeAllWalls = (width, height) => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const pos = i * width + j;
            changeElColor(pos, WALL);
        }
    }
}