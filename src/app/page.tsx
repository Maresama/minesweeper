'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾の設定
const MINES = -1;
const MINE_COUNT = 10;
//爆弾の数をカウント
const chackMines = (minesBoard: number[][], x: number, y: number) => {
  const directions = [
    [1, 0], //下
    [-1, 0], //上
    [0, -1], //左
    [1, -1], //左下
    [-1, -1], //左上
    [1, 1], //右上
    [0, 1], //右
    [-1, 1], //右下
  ];
  let count = 0;
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (minesBoard[y][x] !== 0) continue;
      for (let i = 0; i < directions.length; i++) {
        const [dy, dx] = directions[i];
        const cy = y + dy;
        const cx = x + dx;
        if (cy >= 0 && cy < 9 && cx >= 0 && cx < 9 && minesBoard[cy][cx] === -1) {
          count++;
        }
      }
    }
  }
  return count;
};

const randomMines = (minesBoard: number[][], minesCount: number) => {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    if (minesBoard[y][x] !== MINES) {
      minesBoard[y][x] = MINES;
      placed++;
    }
  }
  return minesBoard;
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
