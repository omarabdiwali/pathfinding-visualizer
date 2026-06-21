import { changeElColor, clearGrid, clearWalls, EMPTY_EVEN, EMPTY_ODD, makeAllWalls, removePreviousColor, sleep, WALL } from "../utils/constants"

const recursiveBacktrackingAlgorithm = async (width, height, fillWalls) => {
    let maze = Array.from({ length: height }, () => Array(width).fill(1));
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    let stack = [[1, 1]];
    maze[1][1] = 0;
    
    const pos = width + 1;
    fillWalls && changeElColor(pos, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);

    while (stack.length > 0) {
        let [cx, cy] = stack.at(-1);
        let unvisited = [];

        for (let [dx, dy] of directions) {
            let nx = cx + dx;
            let ny = cy + dy;

            if (0 < nx && nx < width - 1 && 0 < ny && ny < height - 1) {
                if (maze[ny][nx] == 1) {
                    unvisited.push([nx, ny, dx, dy]);
                }
            }
        }

        if (unvisited.length > 0) {
            let randomIdx = Math.floor(Math.random() * unvisited.length);
            let [nx, ny, dx, dy] = unvisited.at(randomIdx);
            let wx = cx + Math.floor(dx / 2);
            let wy = cy + Math.floor(dy / 2);

            maze[wy][wx] = 0;
            maze[ny][nx] = 0;
            
            if (fillWalls) {
                const pos = wy * width + wx;
                const pos1 = ny * width + nx;
                changeElColor(pos, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
                changeElColor(pos1, pos1 % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
                await sleep(10);
            }

            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }

    return maze;
}

export const recursiveBacktracking = async (width, height) => {    
    clearGrid(width, height, true);
    makeAllWalls(width, height);
    await recursiveBacktrackingAlgorithm(width, height, true);
}

export const imperfectMaze = async (width, height) => {
    clearGrid(width, height, true);
    clearWalls(width, height);
    const maze = await recursiveBacktrackingAlgorithm(width, height, false);

    let pos = 0;
    for (const row of maze) {
        for (const item of row) {
            const rand = Math.random() < 0.25;
            if (item == 1 && !rand) {
                changeElColor(pos, WALL);
            }
            pos += 1;
        }
        await sleep(10);
    }
}