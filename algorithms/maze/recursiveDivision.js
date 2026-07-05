import { changeElColor, clearGrid, continueRunning, sleep, WALL } from "../utils/constants";

const getRandom = (lower, upper) => {
    if (lower >= upper) return lower;
    const randomUpper = upper - lower + 1;
    let random = Math.floor(Math.random() * randomUpper) + lower;
    
    if (lower % 2 == 0) {
        random = random % 2 == 0 ? random : random + 1;
    } else {
        random = random % 2 != 0 ? random : random + 1;
    }
    
    return random > upper ? random - 2 : random;
};

const recursion = async (r1, r2, c1, c2, orientation, totalWidth) => {
    if (!continueRunning) return;
    if (r2 < r1 || c2 < c1) return;
    if (r2 - r1 < 2 || c2 - c1 < 2) return;

    if (orientation === 'h') {
        const currentRow = getRandom(r1 + 1, r2 - 1);
        const passageCol = getRandom(c1 + 1, c2 - 1);
        const passageColEven = passageCol % 2 === 0 ? passageCol : passageCol + 1;

        for (let x = c1; x <= c2; x++) {
            if (x !== passageColEven) {
                const pos = currentRow * totalWidth + x;
                changeElColor(pos, WALL);
                await sleep(3);
            }
        }

        const newOrientationTop = (currentRow - 1 - r1) > (c2 - c1) ? 'h' : 'v';
        const newOrientationBot = (r2 - (currentRow + 1)) > (c2 - c1) ? 'h' : 'v';
        await recursion(r1, currentRow - 1, c1, c2, newOrientationTop, totalWidth);
        await recursion(currentRow + 1, r2, c1, c2, newOrientationBot, totalWidth);
    } 
    else {
        const currentCol = getRandom(c1 + 1, c2 - 1);
        const passageRow = getRandom(r1 + 1, r2 - 1);
        const passageRowEven = passageRow % 2 === 0 ? passageRow : passageRow + 1;

        for (let y = r1; y <= r2; y++) {
            if (y !== passageRowEven) {
                const pos = y * totalWidth + currentCol;
                changeElColor(pos, WALL);
                await sleep(3);
            }
        }

        const newOrientationLeft = (currentCol - 1 - c1) > (r2 - r1) ? 'v' : 'h';
        const newOrientationRight = (c2 - (currentCol + 1)) > (r2 - r1) ? 'v' : 'h';
        await recursion(r1, r2, c1, currentCol - 1, newOrientationLeft, totalWidth);
        await recursion(r1, r2, currentCol + 1, c2, newOrientationRight, totalWidth);
    }
};

export const recursiveDivision = async (width, height) => {
    clearGrid(width, height, true, true);
    const orientation = width > height ? 'v' : 'h';
    await recursion(0, height - 1, 0, width - 1, orientation, width);
};