'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾の設定
const MINES = -1;
const MINE_COUNT = 10;

const randomMinesBoard = (minesBoard: number[][], safeX: number, safeY: number) => {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const x = Math.floor(Math.random() * 9);
    const y = Math.floor(Math.random() * 9);
    if ((x === safeX && y === safeY) || minesBoard[y][x] === MINES) {
      continue;
    }
    minesBoard[y][x] = MINES;
    placed++;
  }
  return minesBoard;
};
console.log(randomMinesBoard);

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
  for (const [dy, dx] of directions) {
    const cy = y + dy;
    const cx = x + dx;
    if (cy >= 0 && cy < minesBoard.length && cx >= 0 && cx < minesBoard[0].length) {
      if (minesBoard[cy][cx] === -1) {
        count++;
      }
    }
  }

  return count;
};
//盤面全体を処理し、各マスにその周囲の爆弾数を設定
const generateBoard = (minesBoard: number[][]): number[][] => {
  return minesBoard.map((row, y) =>
    row.map((cell, x) => {
      if (cell === MINES) return MINES;
      return checkMines(minesBoard, x, y);
    }),
  );
};

export default function Home() {
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
  //旗を設置するボード
  const [flagBoard, setflagBoard] = useState([
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
  //視覚可能ボード
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
  //開いているマスか開いていないマスかをuseStateで管理
  const [opened, setOpened] = useState<boolean[][]>(
    Array.from({ length: 9 }, (): boolean[] => {
      return Array(9).fill(false) as boolean[];
    }),
  );
  //ユーザーがクリックしたとき
  const clickHandler = (x: number, y: number) => {
    if (!started) {
      // 最初のクリック時にランダムに爆弾設置を表示
      const newMinesBoard = randomMinesBoard([...minesBoard.map((row) => [...row])], x, y);
      const numberBoard = generateBoard(newMinesBoard);
      setMinesBoard(newMinesBoard);
      setBoard(numberBoard);
      setStarted(true);
    }
    //useStateで管理されている関数のボードをコピーし、選択したマスにTrueをいれて開いたことにする
    const newOpened = opened.map((row) => [...row]);
    newOpened[y][x] = true;
    setOpened(newOpened);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.cell} ${cell === MINES ? styles.mine : ''}`}
              onClick={() => clickHandler(x, y)}
            >
              {cell !== MINES ? cell || '' : ''}
              {!opened[y][x] && <div className={styles.coverCell} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
