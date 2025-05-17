'use client';

import { useState } from 'react';
import styles from './page.module.css';
//爆弾の数をカウント
const chackMines = (board: number[][], x: number, y: number) => {
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

const randomMines = (minesBoard: number[][], minesCount: number) => {
  const MINES = -1;
  const MINE_COUNT = 10;
  let placed = 0;
  while (placed < MINE_COUNT) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    if (minesBoard[y][x] !== MINES) {
      minesBoard[y][x] = MINES;
      placed++;
    }
  }
};

export default function Home() {
  const [sanpleConuter, setSanpleCounter] = useState(0);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  console.log(numbers);

  //爆弾を設置するボード
  const [minesBoard, setMinesBoard] = useState([
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
  //爆弾があれば個数を返すボード
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
  ]);
  //クリックしたらsetNumbersにnewNumbersを代入
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
            />
          )),
        )}
      </div>
    </div>
  );
}
