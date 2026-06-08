import { EXPLORED, NEXT, sleep, changeElColor, clearGrid, drawPath, getNeighbors, reconstructPath, removeNextColors, continueRunning, CURRENT, removeExploredNodes, getPathCost, getKey } from "./utils/constants";
import { PriorityQueue } from "./utils/PriorityQueue";

const getXAndY = (pos, width) => {
    const row = Math.floor(pos / width);
    const col = pos - (row * width);
    return [row, col];
}

const getHeuristic = (current, target, width) => {
    const currentXY = getXAndY(current, width);
    const targetXY = getXAndY(target, width);
    const movesFrom = Math.abs(currentXY[0] - targetXY[0]) + Math.abs(currentXY[1] - targetXY[1]);
    return movesFrom;
}

const getNextValue = (positions, target, width) => {
    let nextIndex = 0;
    let [currentPos, movesMade] = positions.at(nextIndex);
    let heuristicValue = movesMade + getHeuristic(currentPos, target, width);

    for (let i = 1; i < positions.length; i++) {
        [currentPos, movesMade] = positions.at(i);
        let curHeuristicVal = movesMade + getHeuristic(currentPos, target, width);
        if (curHeuristicVal < heuristicValue) {
            heuristicValue = curHeuristicVal;
            nextIndex = i;
        } 
        else if (curHeuristicVal == heuristicValue) {
            const [topPos, _] = positions.at(nextIndex);
            if (getHeuristic(currentPos, target, width) < getHeuristic(topPos, target, width)) {
                heuristicValue = curHeuristicVal;
                nextIndex = i;
            }
        }
    }

    return nextIndex;
}

/**
 * A*
 * @param {Array<number>} positions 
 * @param {number} width 
 * @param {number} height 
 * @param {Object} costs
 */
export const aStar = async (positions, width, height, costs) => {
    clearGrid(width, height, true);
    let index = 0;
    let traversed = 0;
    let moveCount = 0;
    let totalCost = 0;
    
    while (index < positions.length - 1) {
        let startNode = positions.at(index);
        let targetNode = positions.at(index + 1);
        index += 1;

        let frontier = new PriorityQueue();
        frontier.enqueue(startNode, 0);
        let cameFrom = new Map();
        let costSoFar = new Map();
        let done = false;
        let path = null;
        let prevPos = null;

        cameFrom.set(startNode, null);
        costSoFar.set(startNode, 0);

        while (frontier.size() > 0 && continueRunning) {
            traversed += 1;
            let currentPos = frontier.dequeue();
            changeElColor(prevPos, EXPLORED);
            changeElColor(currentPos, CURRENT);

            if (currentPos == targetNode) {
                done = true;
                break;
            }

            for (const nextPos of getNeighbors(currentPos, width, height)) {
                const key = getKey(currentPos, nextPos);
                const newCost = costSoFar.get(currentPos) + (key in costs ? costs[key] : 1);
                if (!costSoFar.has(nextPos) || newCost < costSoFar.get(nextPos)) {
                    costSoFar.set(nextPos, newCost);
                    const priority = newCost + getHeuristic(nextPos, targetNode, width);
                    frontier.enqueue(nextPos, priority);
                    cameFrom.set(nextPos, currentPos);
                    changeElColor(nextPos, NEXT);
                }
            }

            prevPos = currentPos;
            if (!continueRunning) break;
            await sleep(20);
        }

        if (!continueRunning) return '';
        if (!done) {
            return {
                algorithm: 'A* Search',
                pathExists: false,
                message: `Unable to find path from Node #${index-1} to Node #${index}`
            }
        }
        
        path = reconstructPath(cameFrom, targetNode, true);
        removeNextColors(frontier.heap.map((val) => val.element));
        moveCount += path.length - 1;
        totalCost += getPathCost(path, costs);
        // moveCount += getPathCost(path, costs);
        await drawPath(path, startNode, targetNode);
        index < positions.length - 1 && removeExploredNodes(costSoFar.keys());
    }

    return {
        algorithm: 'A* Search',
        pathExists: true,
        nodesTraversed: traversed - 1,
        moves: moveCount,
        totalCost
    }
}