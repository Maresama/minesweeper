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
const numberBoard = (minesBoard: number[][]): number[][] => {
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

const falseBoard = (board: boolean[][]): number => {
  let falseCount = 0;
  const falseBoardFill = structuredClone(Array(9).fill(false));
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board[y][x] === false) {
        falseCount++;
      }
    }
  }
  return falseCount;
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
  //タイマー
  const [time, setTime] = useState(0); // 経過時間（秒）
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  //ユーザーがクリックしたとき
  const clickHandler = (x: number, y: number) => {
    const newOpened = opened.map((row) => [...row]);
    if (!started) {
      // 最初のクリック時にランダムに爆弾設置を表示
      const newMinesBoard = randomMinesBoard([...minesBoard.map((row) => [...row])], x, y);
      const allBoard = numberBoard(newMinesBoard);
      setMinesBoard(newMinesBoard);
      setBoard(allBoard);
      setStarted(true);
      console.log(board);
      //タイム1000秒まで
      const id = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      setTimerId(id);
      openCell(x, y, allBoard, newOpened);
    } else {
      openCell(x, y, board, newOpened); // 2回目以降は `board` を使う
    }
    console.log(board);
    if (board[y][x] === MINES) {
      alert('ゲームオーバー');
      if (timerId) clearInterval(timerId); // タイマー停止
      for (let i = 0; i < 9; i++) {
        for (let k = 0; k < 9; k++) {
          if (minesBoard[i][k] === MINES) {
            newOpened[i][k] = true;
          }
        }
      }
      console.log(newOpened);
      setOpened(newOpened); // 全爆弾を開く
      return; // 処理終了
    } else {
      const reman = falseBoard(newOpened); //開いてないところをカウント
      if (reman === MINE_COUNT) {
        //numberにして比較
        alert('勝利！！！');
        if (timerId) clearInterval(timerId); // タイマー停止
      }
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
      <div className={styles.bigBoard}>
        <div className={styles.states}>
          <div className={styles.mineCountBoard} />
          <div className={styles.timeBoard}>
            <div
              className={styles.timeDigit}
              style={{ backgroundPosition: `${-70 * Math.floor(time / 100)}px ` }}
            />
            <div
              className={styles.timeDigit}
              style={{ backgroundPosition: `${-70 * Math.floor((time % 100) / 10)}px ` }}
            />
            <div
              className={styles.timeDigit}
              style={{ backgroundPosition: `${-70 * (time % 10)}px ` }}
            />
          </div>
        </div>

        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${cell === MINES ? styles.mine : ''}
                ${opened[y][x] && cell === MINES ? styles.overCell : ''}`}
                onClick={() => clickHandler(x, y)}
              >
                {cell !== MINES && opened[y][x] && (
                  <div
                    className={styles.cellCount}
                    style={{ backgroundPosition: `${-30 * (cell - 1)}px ` }}
                  />
                )}

                {!opened[y][x] && (
                  <div
                    className={styles.coverCell}
                    onContextMenu={(e) => rightClickHandler(e, x, y)}
                  >
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
    </div>
  );
}
