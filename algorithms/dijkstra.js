import { changeElColor, clearGrid, continueRunning, CURRENT, drawPath, EXPLORED, getKey, getNeighbors, getPathCost, NEXT, reconstructPath, removeExploredNodes, removeNextColors, sleep } from "./utils/constants";
import { PriorityQueue } from "./utils/PriorityQueue";

/**
 * Dijkstra's algorithm implementation
 * @param {Array<int>} nodePositions 
 */
export const dijkstraAlgorithm = async (nodePositions, width, height, costs) => {
    clearGrid(width, height, true);
    let index = 0;
    let traversed = 0;
    let moveCount = 0;
    let totalCost = 0;

    while (index < nodePositions.length - 1) {
        let beginNode = nodePositions.at(index);
        let targetNode = nodePositions.at(index+1);
        index += 1;

        const parentMap = new Map();
        const dist = new Map();
        const queue = new PriorityQueue();
        let passed = new Set();
        passed.add(beginNode);
        queue.enqueue(beginNode, 0);
        dist.set(beginNode, 0);
        
        let pathFound = null;
        let prevPos = null;

        while (queue.size() > 0 && continueRunning) {
            traversed += 1;
            const currentPos = queue.dequeue();
            changeElColor(prevPos, EXPLORED);
            changeElColor(currentPos, CURRENT);
            if (currentPos == targetNode) {
                pathFound = reconstructPath(parentMap, targetNode);
                break;
            }

            const neighbors = getNeighbors(currentPos, width, height, false);
            for (const nextPos of neighbors) {
                const key = getKey(currentPos, nextPos);
                const score = dist.get(currentPos) + (key in costs ? costs[key] : 1);
                if (!dist.has(nextPos) || score < dist.get(nextPos)) {
                    parentMap.set(nextPos, currentPos);
                    dist.set(nextPos, score);
                    queue.enqueue(nextPos, score);
                    changeElColor(nextPos, NEXT);
                }
            }

            prevPos = currentPos;
            await sleep(1);
        }

        if (!continueRunning) return '';
        if (!pathFound) {
            return {
                algorithm: 'Dijkstra',
                pathExists: false,
                message: `Unable to find path from Node #${index-1} to Node #${index}`
            }
        }

        removeNextColors(queue.heap.map((val) => val.element));
        moveCount += pathFound.length - 1;
        totalCost += getPathCost(pathFound, costs);
        await drawPath(pathFound, beginNode, targetNode);
        index < nodePositions.length - 1 && removeExploredNodes(dist.keys());
    }

    return {
        algorithm: 'Dijkstra',
        pathExists: true,
        nodesTraversed: traversed - 1,
        moves: moveCount,
        totalCost
    }
}


        // while (queue.length > 0 && continueRunning) {
        //     traversed += 1;
        //     let currentPos = queue.shift();
        //     changeElColor(prevPos, EXPLORED);
        //     changeElColor(currentPos, CURRENT);

        //     if (currentPos == targetNode) {
        //         pathFound = reconstructPath(parentMap, targetNode);
        //         break;
        //     }

        //     const neighbors = getNeighbors(currentPos, width, height, true);
        //     for (const nextPos of neighbors) {
        //         if (passed.has(nextPos)) continue;
        //         passed.add(nextPos);
        //         parentMap.set(nextPos, currentPos);
        //         queue.push(nextPos);
        //         nextPos !== targetNode && changeElColor(nextPos, NEXT);
        //     }

        //     prevPos = currentPos;
        //     await sleep(1);
        // }