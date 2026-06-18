import { EXPLORED, NEXT, sleep, changeElColor, clearGrid, drawPath, getNeighbors, reconstructPath, removeNextColors, continueRunning, removeExploredNodes, getPathCost, addCommas } from "../utils/constants";

/**
 * Bi-directional BFS
 * @param {Array<number>} positions 
 * @param {number} width 
 * @param {number} height 
 */
export const biDirectionalBFS = async (positions, width, height, costs) => {
    clearGrid(width, height, true);
    let index = 0;
    let traversed = 0;
    let moveCount = 0;
    let totalCost = 0;

    while (index < positions.length - 1) {
        let startNode = positions.at(index);
        let targetNode = positions.at(index + 1);
        
        let startQueue = [startNode];
        let targetQueue = [targetNode];
        let startMap = new Map();
        let targetMap = new Map();
        let startPassed = new Set();
        let targetPassed = new Set();

        startPassed.add(startNode);
        targetPassed.add(targetNode);
        let done = false;
        let path = null;
        
        index += 1;

        while (!done && continueRunning) {
            let startQueueLen = startQueue.length;
            let targetQueueLen = targetQueue.length;
            if (startQueueLen == 0 || targetQueueLen == 0) break;

            for (let i = 0; i < startQueueLen; i++) {
                traversed += 1;
                const currentPos = startQueue.shift();
                changeElColor(currentPos, EXPLORED);

                if (targetMap.has(currentPos)) {
                    let fromStart = reconstructPath(startMap, currentPos);
                    let fromEnd = reconstructPath(targetMap, currentPos, false);
                    if (fromStart.at(-1) == fromEnd.at(0)) fromStart.pop();
                    path = fromStart.concat(fromEnd);
                    done = true;
                    break;
                }

                const neighbors = getNeighbors(currentPos, width, height);
                for (const nextPos of neighbors) {
                    if (startPassed.has(nextPos)) continue;
                    startPassed.add(nextPos);
                    startMap.set(nextPos, currentPos);
                    startQueue.push(nextPos);
                    changeElColor(nextPos, NEXT)
                }
            }

            if (done) break;

            for (let i = 0; i < targetQueueLen; i++) {
                traversed += 1;
                const currentPos = targetQueue.shift();
                changeElColor(currentPos, EXPLORED);
                
                if (startMap.has(currentPos)) {
                    let fromStart = reconstructPath(startMap, currentPos);
                    let fromEnd = reconstructPath(targetMap, currentPos, false);
                    if (fromStart.at(-1) == fromEnd.at(0)) fromStart.pop();
                    path = fromStart.concat(fromEnd);
                    done = true;
                    break;
                }
                
                const neighbors = getNeighbors(currentPos, width, height);

                for (const nextPos of neighbors) {
                    if (targetPassed.has(nextPos)) continue;
                    targetPassed.add(nextPos);
                    targetMap.set(nextPos, currentPos);
                    targetQueue.push(nextPos);
                    changeElColor(nextPos, NEXT);
                }
            }

            if (done) break;
            await sleep(100);
        }

        if (!continueRunning) return '';
        if (!done) {
            return {
                algorithm: 'Bi-Directional BFS',
                pathExists: false,
                message: `Unable to find path from Node #${index-1} to Node #${index}`
            }
        }

        removeNextColors(startQueue);
        removeNextColors(targetQueue);
        moveCount += new Set(path).size - 1;
        totalCost += getPathCost(path, costs);
        await drawPath(path, startNode, targetNode);
        index < positions.length - 1 && removeExploredNodes(startPassed);
        index < positions.length - 1 && removeExploredNodes(targetPassed);
    }

    return {
        algorithm: 'Bi-Directional BFS',
        pathExists: true,
        nodesTraversed: addCommas(traversed - 1),
        moves: addCommas(moveCount),
        totalCost: addCommas(totalCost)
    }
}