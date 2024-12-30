import { brickColumnCount, brickRowCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft } from './script.js';

export function getBricks(modelNumber) {
    if (modelNumber === 1) {
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickType = Math.floor(Math.random() * 3) + 1;
                bricks[c][r] = { x: 0, y: 0, status: brickType };
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
        }
        return bricks;
    } else if (modelNumber === 2) {
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickType = 1;
                bricks[c][r] = { x: 0, y: 0, status: brickType };
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
        }
        return bricks;
    } else if (modelNumber === 3) {
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickType = 2;
                bricks[c][r] = { x: 0, y: 0, status: brickType };
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
        }
        return bricks;
    } else if (modelNumber === 4) {
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickType = 3;
                bricks[c][r] = { x: 0, y: 0, status: brickType };
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
        }
        return bricks;
    } else if (modelNumber === 5) {
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickType = 1;
                bricks[c][r] = { x: 0, y: 0, status: brickType };
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
        }
    }
}
