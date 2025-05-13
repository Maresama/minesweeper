'use client';

import { useState } from 'react';
import styles from './page.module.css';

const down = (n: number) => {
  console.log(n);
  if (n === 0) {
    return;
  } else {
    return down(n - 1);
  }
};
down(10);
const sum1 = (n: number): number => {
  if (n === 0) {
    return 0;
  } else {
    return n + sum1(n - 1);
  }
};
console.log(sum1(10));

const sum2 = (n: number, m: number): number => {
  if (m === n - 1) {
    return 0;
  } else {
    return n + sum2(n + 1, m);
  }
};
console.log(sum2(4, 10));

const sum3 = (n: number, m: number) => {
  return ((m - n + 1) * (n + m)) / 2;
};
console.log(sum3(4, 10));

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
    const calculateTotal = (arr: number[], counter: number) => {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += arr[i] + counter;
      }
      return total + counter;
    };
    const total = calculateTotal(numbers, sanpleConuter);
    console.log(total);
  };

  return (
    <div className={styles.container}>
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
