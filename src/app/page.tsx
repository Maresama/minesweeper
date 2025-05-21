'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾の設定
const MINES = -1;
const MINE_COUNT = 10;

const randomMinesBoard = (minesBoard: number[][]) => {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const x = Math.floor(Math.random() * 9);
    const y = Math.floor(Math.random() * 9);
    if (minesBoard[y][x] !== MINES) {
      minesBoard[y][x] = MINES;
      placed++;
    }
  }
  return minesBoard;
};

//爆弾の数をカウント
const checkMines = (minesBoard: number[][], x: number, y: number) => {
  //8方向
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
  //盤面内で8方向確認して爆弾(-1)があれば、カウント+1
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
const generateBoard = (minesBoard: number[][]): number[][] => {
  return minesBoard.map((row, y) =>
    row.map((cell, x) => {
      if (cell === MINES) return MINES;
      return checkMines(minesBoard, x, y);
    }),
  );
};

export default function Home() {
  const [sanpleCounter, setSanpleCounter] = useState(0);

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
  //ゲーム開始判定
  const [started, setStarted] = useState(false);
  //クリックしたらsetNumbersにnewNumbersを代入
  const clickHandler = (x: number, y: number) => {
    if (!started) {
      // 最初のクリック時にランダムに爆弾設置
      setMinesBoard(randomMinesBoard);

      setStarted(true);
    }
  };

  return (
    <div className={styles.container}>
      <p>Mine</p>

      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.cell} ${cell === MINES ? styles.mine : ''}`}
              onClick={() => clickHandler(x, y)}
            >
              {cell !== MINES ? cell || '' : ''}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
