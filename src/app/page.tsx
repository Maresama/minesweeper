'use client';

import { useState } from 'react';
import styles from './page.module.css';

const countMines = (board: number[][], x: number, y: number) => {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (ny >= 0 && ny < board.length && nx >= 0 && nx < board[0].length) {
        if (board[ny][nx] === 1) count++;
      }
    }
  }
  return count;
};
export default function Home() {
  const [sanpleConuter, setSanpleCounter] = useState(0);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  console.log(numbers);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const clickHandler = (x: number, y: number) => {
    setSanpleCounter((sanpleConuter + 1) % 14); //余り
    console.log(sanpleConuter);
    const newNumbers = structuredClone(numbers);
    newNumbers[sanpleConuter % 5] += 1;
    setNumbers(newNumbers);
  };

  return (
    <div className={styles.container}>
      <p>Mine</p>
      <span />
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              style={{ backgroundPosition: ` ${-30 * sanpleConuter}px` }}
            >
              <div className={styles.cover} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
