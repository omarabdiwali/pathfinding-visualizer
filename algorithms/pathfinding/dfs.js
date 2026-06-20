import { addCommas, changeElColor, clearGrid, continueRunning, CURRENT, drawPath, EXPLORED, getNeighbors, getPathCost, NEXT, PATH, reconstructPath, redrawPathNodes, removeExploredNodes, removeNextColors, sleep } from "../utils/constants";

/**
 * Depth-first search
 * @param {Array<number>} positions 
 * @param {number} width 
 * @param {number} height 
 */
export const depthFirstSearch = async (positions, width, height, costs) => {
    clearGrid(width, height, true);
    let index = 0;
    let traversed = 0;
    let moveCount = 0;
    let totalCost = 0;

    while (index < positions.length - 1) {
        let startNode = positions.at(index);
        let targetNode = positions.at(index + 1);
        index += 1;

        const parentMap = new Map();
        const passed = new Set();
        const prevSqColor = new Map();

        let queue = [startNode];
        let pathFound = null;
        let prevPos = null;

        passed.add(startNode);

        while (queue.length > 0 && continueRunning) {
            traversed += 1;
            let currentPos = queue.pop();
            changeElColor(prevPos, EXPLORED, true);
            if (changeElColor(currentPos, CURRENT, true)) {
                prevSqColor.set(currentPos, PATH);
            }

            if (currentPos == targetNode) {
                pathFound = reconstructPath(parentMap, targetNode);
                break;
            }

            const neighbors = getNeighbors(currentPos, width, height, true);
            for (const nextPos of neighbors) {
                if (passed.has(nextPos)) continue;
                passed.add(nextPos);
                parentMap.set(nextPos, currentPos);
                queue.push(nextPos);
                if (changeElColor(nextPos, NEXT, true)) {
                    prevSqColor.set(nextPos, PATH);
                }
            }

            prevPos = currentPos;
            if (!continueRunning) break;
            await sleep(30);
        }

        if (!continueRunning) return '';
        if (!pathFound) {
            return {
                algorithm: 'Depth-First Search',
                pathExists: false,
                message: `Unable to find path from Node #${index-1} to Node #${index}`
            }
        }

        removeNextColors(queue);
        moveCount += pathFound.length - 1;
        totalCost += getPathCost(pathFound, costs);
        await drawPath(pathFound, startNode, targetNode);
        index < positions.length - 1 && removeExploredNodes(passed);
        redrawPathNodes(prevSqColor);
    }

    return {
        algorithm: 'Depth-First Search',
        pathExists: true,
        nodesTraversed: addCommas(traversed - 1),
        moves: addCommas(moveCount),
        totalCost: addCommas(totalCost)
    }
}