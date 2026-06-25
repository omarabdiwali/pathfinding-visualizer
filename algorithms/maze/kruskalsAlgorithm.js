import { changeElColor, continueRunning, EMPTY_EVEN, EMPTY_ODD, makeAllWalls, shuffle, sleep } from "../utils/constants";

class DisjointSet {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, index) => index);
    }

    find(i) {
        if (this.parent.at(i) == i) return i;
        
        let root = i;
        while (root != this.parent[root]) {
            root = this.parent[root];
        }
        
        let curr = i
        while (curr != root) {
            let nxt = this.parent[curr];
            this.parent[curr] = root;
            curr = nxt;
        }

        return root;
    }

    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI != rootJ) {
            this.parent[rootI] = rootJ;
            return true;
        }

        return false;
    }
}

export const kruskalsAlgorithm = async (width, height) => {
    makeAllWalls(width, height);
    const cellWidth = Math.floor((width - 1) / 2);
    const cellHeight = Math.floor((height - 1) / 2);

    const getPos = (x, y) => {
        return y * width + x;
    }

    const getCellPos = (x, y) => {
        return y * cellWidth + x;
    }
    
    for (let cy = 0; cy < cellHeight; cy++) {
        for (let cx = 0; cx < cellWidth; cx++) {
            const pos = getPos(2 * cx + 1, 2 * cy + 1);
            changeElColor(pos, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
        }
    }

    if (!continueRunning) return;
    
    const ds = new DisjointSet(width * height);
    let walls = [];

    for (let y = 0; y < cellHeight; y++) {
        for (let x = 0; x < cellWidth; x++) {
            if (!continueRunning) return;
            if (x < cellWidth - 1) {
                walls.push([[x, y], [x+1, y], [2 * x + 2, 2 * y + 1]]);
            }
            if (y < cellHeight - 1) {
                walls.push([[x, y], [x, y+1], [2 * x + 1, 2 * y + 2]]);
            }
        }
    }

    walls = shuffle(walls);

    for (const [cell1, cell2, gridCoords] of walls) {
        if (!continueRunning) return;
        const id1 = getCellPos(cell1[0], cell1[1]);
        const id2 = getCellPos(cell2[0], cell2[1]);

        if (ds.union(id1, id2)) {
            if (!continueRunning) return;
            const pos = getPos(gridCoords[0], gridCoords[1]);
            changeElColor(pos, pos % 2 == 0 ? EMPTY_EVEN : EMPTY_ODD);
            await sleep(1);
        }
    }
}