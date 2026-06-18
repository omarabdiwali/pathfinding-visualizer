import { changeElColor, clearGrid, clearWalls, removePreviousColor, sleep, WALL } from "../utils/constants"

const recursiveBacktracking = async (width, height) => {    
    clearGrid(width, height, true);
    clearWalls(width, height);

    let maze = Array.from({ length: height }, () => Array(width).fill(1));
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    let stack = [[1, 1]];
    maze[1][1] = 0;

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
            maze[cy + Math.floor(dy / 2)][cx + Math.floor(dx / 2)] = 0;
            maze[ny][nx] = 0;
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }

    let pos = 0;
    for (const row of maze) {
        for (const item of row) {
            if (item == 1) {
                changeElColor(pos, WALL);
                await sleep(1);
            }
            pos += 1;
        }
    }
}

export default recursiveBacktracking;