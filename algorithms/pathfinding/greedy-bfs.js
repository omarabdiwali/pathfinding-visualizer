import { EXPLORED, NEXT, sleep, changeElColor, clearGrid, drawPath, getNeighbors, reconstructPath, removeNextColors, continueRunning, CURRENT, removeExploredNodes, getPathCost, addCommas, PATH, redrawPathNodes } from "../utils/constants";
import { PriorityQueue } from "../utils/PriorityQueue";

const getXAndY = (pos, width) => {
    const row = Math.floor(pos / width);
    const col = pos - (row * width);
    return [row, col];
}

const getHeuristic = (current, target, width) => {
    const currentXY = getXAndY(current, width);
    const targetXY = getXAndY(target, width);
    return Math.abs(currentXY[0] - targetXY[0]) + Math.abs(currentXY[1] - targetXY[1]);
}

/**
 * greedyBFS
 * @param {Array<number>} positions 
 * @param {number} width 
 * @param {number} height 
 */
export const greedyBFS = async (positions, width, height, costs) => {
    clearGrid(width, height, true);
    let index = 0;
    let traversed = 0;
    let moveCount = 0;
    let totalCost = 0;
    
    while (index < positions.length - 1) {
        let startNode = positions.at(index);
        let targetNode = positions.at(index + 1);
        index += 1;

        const visited = new Set();
        const parentMap = new Map();
        const wasPath = new Map();
        const queue = new PriorityQueue();

        queue.enqueue(startNode, 0);
        visited.add(startNode);

        let done = false;
        let path = null;
        let prevPos = null;

        while (queue.size() > 0 && continueRunning) {
            traversed += 1;
            const currentPos = queue.dequeue();
            changeElColor(prevPos, EXPLORED);
            if (changeElColor(currentPos, CURRENT, true)) {
                wasPath.set(currentPos, PATH);
            }

            if (currentPos == targetNode) {
                path = reconstructPath(parentMap, targetNode);
                done = true;
                break;
            }

            const neighbors = getNeighbors(currentPos, width, height);
            for (const nextPos of neighbors) {
                if (visited.has(nextPos)) continue;
                const heuristic = getHeuristic(nextPos, targetNode, width);
                visited.add(nextPos);
                parentMap.set(nextPos, currentPos);
                queue.enqueue(nextPos, heuristic);
                if (changeElColor(nextPos, NEXT, true)) {
                    wasPath.set(nextPos, PATH);
                }
            }

            prevPos = currentPos;
            if (!continueRunning) break;
            await sleep(20);
        }

        if (!continueRunning) return '';
        if (!done) {
            return {
                algorithm: 'Greedy BFS',
                pathExists: false,
                message: `Unable to find path from Node #${index-1} to Node #${index}`
            }
        }
        
        removeNextColors(queue.heap.map((val) => val.element));
        moveCount += path.length - 1;
        totalCost += getPathCost(path, costs);
        await drawPath(path, startNode, targetNode);
        index < positions.length - 1 && removeExploredNodes(visited);
        redrawPathNodes(wasPath);
    }

    return {
        algorithm: 'Greedy BFS',
        pathExists: true,
        nodesTraversed: addCommas(traversed - 1),
        moves: addCommas(moveCount),
        totalCost: addCommas(totalCost)
    }
}