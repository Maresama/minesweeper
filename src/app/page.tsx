'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾の設定
const MINES = -1;
const MINE_COUNT = 10;

//8方向
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

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
const checkMines = (minesBoard: number[][], x: number, y: number): number => {
  //盤面内で8方向確認して爆弾(-1)があれば、カウント+1
  let count = 0;
  for (const [dx, dy] of directions) {
    const cy: number = y + dy;
    const cx: number = x + dx;
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

//再帰関数 空白を連続で開ける
const openCell = (x: number, y: number, board: number[][], newOpened: boolean[][]) => {
  if (x < 0 || x >= 9 || y < 0 || y >= 9) return;
  if (newOpened[y][x]) return;
  newOpened[y][x] = true;
  if (board[y][x] !== 0) {
    return;
  } else {
    for (const [dx, dy] of directions) {
      openCell(x + dx, y + dy, board, newOpened);
    }
  }
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
  //ユーザーが入力するボード
  const [userInput, setUserInput] = useState([
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
    const newOpened = opened.map((row) => [...row]);
    if (!started) {
      // 最初のクリック時にランダムに爆弾設置を表示
      const newMinesBoard = randomMinesBoard([...minesBoard.map((row) => [...row])], x, y);
      const numberBoard = generateBoard(newMinesBoard);
      setMinesBoard(newMinesBoard);
      setBoard(numberBoard);
      setStarted(true);

      openCell(x, y, numberBoard, newOpened);
    } else {
      openCell(x, y, board, newOpened); // 2回目以降は `board` を使う
    }

    setOpened(newOpened);
  };

  //右クリック操作（旗、はてな、空白）
  const rightClickHandler = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault(); // ブラウザのデフォルトの右クリックメニューを無効化
    const newUserInput = structuredClone(userInput);
    newUserInput[y][x]++;
    newUserInput[y][x] = newUserInput[y][x] % 3;
    setUserInput(newUserInput);
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
              {cell !== MINES && opened[y][x] && (
                <div
                  className={styles.cellCount}
                  style={{ backgroundPosition: `${-30 * (cell - 1)}px ` }}
                />
              )}

              {!opened[y][x] && (
                <div className={styles.coverCell} onContextMenu={(e) => rightClickHandler(e, x, y)}>
                  <div
                    className={`${userInput[y][x] === 1 ? styles.flag : ''} ${userInput[y][x] === 2 ? styles.questionmark : ''}`}
                  />
                </div>
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
