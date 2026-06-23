import { changeElColor, continueRunning, EMPTY_EVEN, EMPTY_ODD, makeAllWalls, sleep } from "../utils/constants";

export const primsAlgorithm = async (width, height) => {
    makeAllWalls(width, height);
    let maze = Array.from({ length: height }, () => Array(width).fill(1));
    let startX = Math.floor(Math.random() * width);
    let startY = Math.floor(Math.random() * height);

    startX = startX % 2 == 0 ? Math.max(1, startX - 1) : startX;
    startY = startY % 2 == 0 ? Math.max(1, startY - 1) : startY;
    maze[startY][startX] = 0;

    let frontier = [];

    const addFrotier = (cx, cy) => {
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        for (const [dx, dy] of directions) {
            let nx = cx + dx;
            let ny = cy + dy;

            if (nx > 0 && nx < width && ny > 0 && ny < height) {
                if (maze[ny][nx] == 1) {
                    let wx = cx + Math.floor(dx / 2);
                    let wy = cy + Math.floor(dy / 2);
                    frontier.push([wx, wy, nx, ny])
                }
            }
        }
    }

    const startPos = startY * width + startX;
    changeElColor(startPos, startPos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
    addFrotier(startX, startY);
    
    while (frontier.length > 0) {
        if (!continueRunning) break;
        const randIndex = Math.floor(Math.random() * frontier.length);
        const [wx, wy, nx, ny] = frontier.splice(randIndex, 1)[0];

        if (maze[ny][nx] == 1) {
            maze[wy][wx] = 0;
            maze[ny][nx] = 0;
            
            const pos = wy * width + wx;
            const pos1 = ny * width + nx;
            changeElColor(pos, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
            changeElColor(pos1, pos1 % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
            addFrotier(nx, ny);

            await sleep(1);
        }
    }
}