'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

//爆弾の設定
const MINES = -1;

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

//爆弾配置関数（width, heightを引数で受け取るように変更）
const randomMinesBoard = (
  minesBoard: number[][],
  safeX: number,
  safeY: number,
  width: number,
  height: number,
  mineCount: number,
) => {
  let placed = 0;
  while (placed < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if ((x === safeX && y === safeY) || minesBoard[y][x] === MINES) {
      continue;
    }
    minesBoard[y][x] = MINES;
    placed++;
  }
  return minesBoard;
};

//爆弾の数をカウント
const checkMines = (minesBoard: number[][], x: number, y: number): number => {
  let count = 0;
  for (const [dx, dy] of directions) {
    const cy = y + dy;
    const cx = x + dx;
    if (cy >= 0 && cy < minesBoard.length && cx >= 0 && cx < minesBoard[0].length) {
      if (minesBoard[cy][cx] === MINES) {
        count++;
      }
    }
  }
  return count;
};

//盤面全体の数字盤を作成
const numberBoard = (minesBoard: number[][]): number[][] => {
  return minesBoard.map((row, y) =>
    row.map((cell, x) => {
      if (cell === MINES) return MINES;
      return checkMines(minesBoard, x, y);
    }),
  );
};

//再帰的に空白セルを開く
const openCell = (
  x: number,
  y: number,
  board: number[][],
  newOpened: boolean[][],
  width: number,
  height: number,
) => {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  if (newOpened[y][x]) return;
  newOpened[y][x] = true;
  if (board[y][x] !== 0) {
    return;
  } else {
    for (const [dx, dy] of directions) {
      openCell(x + dx, y + dy, board, newOpened, width, height);
    }
  }
};

//未開封セルの数をカウント
const falseBoard = (board: boolean[][]): number => {
  let falseCount = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (!board[y][x]) {
        falseCount++;
      }
    }
  }
  return falseCount;
};

//初期化用空盤面作成
const resetBoard = (rows: number, cols: number): number[][] => {
  return Array.from({ length: rows }, () => Array<number>(cols).fill(0));
};

//旗の数を数える
const countFlags = (userInput: number[][]): number => {
  let count = 0;
  for (let y = 0; y < userInput.length; y++) {
    for (let x = 0; x < userInput[y].length; x++) {
      if (userInput[y][x] === 1) {
        count++;
      }
    }
  }
  return count;
};

//盤面サイズをリサイズ
const resizeBoard = (width: number, height: number): number[][] => {
  return Array.from({ length: height }, () => Array<number>(width).fill(0));
};

export default function Home() {
  //状態管理により盤面サイズと爆弾数を保持
  const [widthCustom, setWidthCustom] = useState(9);
  const [lengthCustom, setLengthCustom] = useState(9);
  const [mineCount, setMineCount] = useState(10);

  const setLevel = (level: 'easy' | 'medium' | 'hard') => {
    let w = 9,
      l = 9,
      b = 10;
    if (level === 'medium') {
      w = 16;
      l = 16;
      b = 40;
    } else if (level === 'hard') {
      w = 30;
      l = 16;
      b = 99;
    }

    setWidthCustom(w);
    setLengthCustom(l);
    setMineCount(b);
    resetGame();
    setUserInput(resizeBoard(w, l));
    setMinesBoard(resizeBoard(w, l));
    setBoard(resizeBoard(w, l));
    setOpened(Array.from({ length: l }, () => Array<boolean>(w).fill(false)));
  };

  //ユーザーボード（旗・？マーク管理）
  const [userInput, setUserInput] = useState<number[][]>(resizeBoard(widthCustom, lengthCustom));
  //爆弾ボード
  const [minesBoard, setMinesBoard] = useState<number[][]>(resizeBoard(widthCustom, lengthCustom));
  //数字ボード
  const [board, setBoard] = useState<number[][]>(resizeBoard(widthCustom, lengthCustom));

  //開いているかどうか
  const [opened, setOpened] = useState<boolean[][]>(
    Array.from({ length: lengthCustom }, () => Array<boolean>(widthCustom).fill(false)),
  );

  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);

  //タイマー管理
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (started) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [started]);

  //セルクリック処理
  const clickHandler = (x: number, y: number) => {
    if (opened[y][x]) return; //すでに開いているなら何もしない

    const newOpened = opened.map((row) => [...row]);
    if (!started) {
      //ゲーム開始時に爆弾設置
      const newMinesBoard = randomMinesBoard(
        minesBoard.map((row) => [...row]),
        x,
        y,
        widthCustom,
        lengthCustom,
        mineCount,
      );
      const allBoard = numberBoard(newMinesBoard);
      setMinesBoard(newMinesBoard);
      setBoard(allBoard);
      setStarted(true);
      openCell(x, y, allBoard, newOpened, widthCustom, lengthCustom);
    } else {
      openCell(x, y, board, newOpened, widthCustom, lengthCustom);
    }

    if (board[y][x] === MINES) {
      const newUserInput = userInput.map((row) => [...row]);
      newUserInput[y][x] = 4; //爆弾クリックマーク
      setUserInput(newUserInput);
      alert('ゲームオーバー');
      for (let i = 0; i < lengthCustom; i++) {
        for (let k = 0; k < widthCustom; k++) {
          if (minesBoard[i][k] === MINES) {
            newOpened[i][k] = true;
          }
        }
      }
      setOpened(newOpened);
      setStarted(false);
      return;
    } else {
      const reman = falseBoard(newOpened);
      if (reman === mineCount) {
        alert('勝利！！！');
        setStarted(false);
      }
    }

    setOpened(newOpened);
  };

  //右クリック処理（旗・？マーク）
  const rightClickHandler = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (opened[y][x]) return;

    const newUserInput = structuredClone(userInput);
    const current = newUserInput[y][x];
    const currentFlags = countFlags(userInput);

    if (current === 0) {
      if (currentFlags >= mineCount) return;
      newUserInput[y][x] = 1; //旗
    } else if (current === 1) {
      newUserInput[y][x] = 2; //？マーク
    } else if (current === 2) {
      newUserInput[y][x] = 0; //何もなし
    }

    setUserInput(newUserInput);
  };

  const flagCount = countFlags(userInput);
  const remainingMines = mineCount - flagCount;

  //ゲームリセット
  const resetGame = () => {
    setMinesBoard(resetBoard(lengthCustom, widthCustom));
    setUserInput(resetBoard(lengthCustom, widthCustom));
    setBoard(resetBoard(lengthCustom, widthCustom));
    setOpened(Array.from({ length: lengthCustom }, () => Array<boolean>(widthCustom).fill(false)));
    setTime(0);
    setStarted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.customBoard}>
        <form
          style={{ marginBottom: `20px` }}
          onSubmit={(e) => {
            e.preventDefault();
            const from = e.target as HTMLFormElement;
            const w = Number((from.elements.namedItem('width') as HTMLInputElement).value);
            const l = Number((from.elements.namedItem('length') as HTMLInputElement).value);
            const b = Number((from.elements.namedItem('bomb') as HTMLInputElement).value);
            if (w > 0 && l > 0 && b > 0 && b < w * l) {
              setWidthCustom(w);
              setLengthCustom(l);
              setMineCount(b);
              resetGame();
              setUserInput(resizeBoard(w, l));
              setMinesBoard(resizeBoard(w, l));
              setBoard(resizeBoard(w, l));
              setOpened(Array.from({ length: l }, () => Array<boolean>(w).fill(false)));
            } else {
              alert('正しい値を入力してください');
            }
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={() => setLevel('easy')}>
              初級
            </button>
            <button type="button" onClick={() => setLevel('medium')}>
              中級
            </button>
            <button type="button" onClick={() => setLevel('hard')}>
              上級
            </button>
          </div>
          <span>
            <label>
              幅
              <input type="number" name="width" defaultValue={widthCustom} min={1} max={100} />
            </label>
            <label>
              高さ
              <input type="number" name="length" defaultValue={lengthCustom} min={1} max={100} />
            </label>
            <label>
              爆弾数
              <input type="number" name="bomb" defaultValue={mineCount} min={1} max={10000} />
            </label>
            <button type="submit">更新</button>
          </span>
        </form>
      </div>
      <div
        className={styles.bigMamBoard}
        style={{ width: `${40 + 30 * widthCustom}px`, height: `${130 + 30 * lengthCustom}px` }}
      >
        <div
          className={styles.bigBoard}
          style={{ width: `${10 + 30 * widthCustom}px`, height: `${90 + 30 * lengthCustom}px` }}
        >
          <div
            className={styles.states}
            style={{
              width: `${10 + 30 * widthCustom}px`,
              height: `70px`,
            }}
          >
            <div className={styles.mineCountBoard}>
              <div
                className={styles.bombDigit}
                style={{
                  backgroundPosition: `${-20.7 * Math.floor(Number(remainingMines) / 100)}px`,
                }}
              />
              <div
                className={styles.bombDigit}
                style={{
                  backgroundPosition: `${
                    -20.7 *
                    Math.floor(
                      (Number(remainingMines) - Math.floor(Number(remainingMines) / 100) * 100) /
                        10,
                    )
                  }px`,
                }}
              />
              <div
                className={styles.bombDigit}
                style={{
                  backgroundPosition: `${
                    -20.7 * (Number(remainingMines) - Math.floor(Number(remainingMines) / 10) * 10)
                  }px`,
                }}
              />
            </div>
            <div className={styles.resetBoard}>
              <div
                className={styles.button}
                style={{
                  backgroundPosition: `-330px`,
                }}
                onClick={resetGame}
              />
            </div>
            <div className={styles.timeBoard}>
              <div
                className={styles.timeNumber1}
                style={{
                  backgroundPosition: `${-20.7 * Math.floor(time / 100)}px`,
                }}
              />
              <div
                className={styles.timeNumber2}
                style={{
                  backgroundPosition: `${-20.7 * Math.floor((time - Math.floor(time / 100) * 100) / 10)}px`,
                }}
              />
              <div
                className={styles.timeNumber3}
                style={{
                  backgroundPosition: `${-20.7 * (time - Math.floor(time / 10) * 10)}px`,
                }}
              />
            </div>
          </div>
          <div
            className={styles.gameBoard}
            style={{ width: `${10 + 30 * widthCustom}px`, height: `${10 + 30 * lengthCustom}px` }}
          >
            <div
              className={styles.board}
              style={{
                gridTemplateColumns: `repeat(${widthCustom}, 30px)`,
                width: `${30 * widthCustom}px`,
                height: `${30 * lengthCustom}px`,
              }}
            >
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`${styles.cell} ${cell === MINES ? styles.mine : ''} ${
                      opened[y][x] && userInput[y][x] === 4 ? styles.overCell : ''
                    }`}
                    onClick={() => clickHandler(x, y)}
                    onContextMenu={(e) => rightClickHandler(e, x, y)}
                  >
                    {cell !== MINES && opened[y][x] && cell > 0 && (
                      <div
                        className={styles.cellCount}
                        style={{ backgroundPosition: `${-30 * (cell - 1)}px` }}
                      />
                    )}

                    {!opened[y][x] && (
                      <div className={styles.coverCell}>
                        <div
                          className={`${userInput[y][x] === 1 ? styles.flag : ''} ${
                            userInput[y][x] === 2 ? styles.questionmark : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
