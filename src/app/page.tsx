'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

let face = 'default';
let flag: number = 10;
let maxFlag: number = 10;
let stopTime: number | null = null;
let firstClick = true;
let alertOnce = false;

function openCells(y: number, x: number, newBoard: number[][], checked: number[][]) {
  const height = newBoard.length;
  if (height === 0) return; // 空の盤面の場合はreturn
  const width = newBoard[0].length;
  if (width === 0) return; // 空の盤面の場合はreturn

  // 範囲外チェック
  if (y < 0 || y >= height || x < 0 || x >= width) return;

  // すでにチェック済みか？
  for (let i = 0; i < checked.length; i++) {
    if (checked[i][0] === y && checked[i][1] === x) {
      return;
    }
  }

  checked.push([y, x]); // チェック済みは追加

  const cell = newBoard[y][x];

  // 開いてる爆発済み空白マスで開いた後終わり
  if (
    cell % 100 === 4 || // 開いてる
    cell % 100 === 7 || // 爆発
    cell >= 10004 // 空白マス＋4）
  ) {
    return;
  }

  if (cell === 1000 || cell === 1001) return;

  if (cell >= 0 && cell <= 800 && cell % 100 === 0) {
    newBoard[y][x] += 4;
    return;
  }

  if (cell >= 10000 && cell < 10004) {
    newBoard[y][x] += 4;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        openCells(y + dy, x + dx, newBoard, checked);
      }
    }
  }
}

function calcBoard(
  userInputs: number[][],
  bombMaps: number[][],
  currentTimer: number,
  setTimer: (timer: number) => void,
  maxBombs: number,
  previouslyOpened: boolean[][] | undefined,
): number[][] {
  const height = userInputs.length;

  if (height === 0) {
    return [];
  }
  const width = userInputs[0].length;

  if (width === 0) {
    return Array.from({ length: height }, () => []);
  }

  const newBoard = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

  const alreadyOpenedCells: number[][] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (previouslyOpened?.[y]?.[x]) {
        openCells(y, x, newBoard, alreadyOpenedCells);
      }
      if (userInputs[y][x] === 4) {
        openCells(y, x, newBoard, alreadyOpenedCells);
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!bombMaps[y] || bombMaps[y][x] === undefined) {
        continue;
      }

      if (bombMaps[y][x] === 1) {
        newBoard[y][x] = 1000; // 地雷
      } else {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            if (
              y + dy >= 0 &&
              y + dy < height &&
              x + dx >= 0 &&
              x + dx < width &&
              bombMaps[y + dy] &&
              bombMaps[y + dy][x + dx] === 1
            ) {
              count += 1;
            }
          }
        }
        newBoard[y][x] = count * 100; // 数字マス
        if (count === 0) {
          newBoard[y][x] = 10000; // 空白マス
        }
      }
    }
  }

  let opendCell = 0;
  let safeCell = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (
        !userInputs[y] ||
        userInputs[y][x] === undefined ||
        !bombMaps[y] ||
        bombMaps[y][x] === undefined
      ) {
        continue;
      }

      if (bombMaps[y][x] === 0) {
        safeCell += 1;
      }

      const userInput = userInputs[y][x];

      if (userInput === 1) {
        // フラグ
        newBoard[y][x] = newBoard[y][x] + 1;
      } else if (userInput === 2) {
        newBoard[y][x] = newBoard[y][x] + 2;
      } else if (userInput === 4) {
        if (bombMaps[y][x] === 1) {
          newBoard[y][x] = 1007;

          for (let y2 = 0; y2 < height; y2++) {
            for (let x2 = 0; x2 < width; x2++) {
              if (
                !bombMaps[y2] ||
                bombMaps[y2][x2] === undefined ||
                !userInputs[y2] ||
                userInputs[y2][x2] === undefined
              ) {
                continue;
              }
              if (bombMaps[y2][x2] === 1 && !(y2 === y && x2 === x)) {
                if (userInputs[y2][x2] !== 1) {
                  // 旗が立っていない爆弾
                  newBoard[y2][x2] = 1004; // 開かれた爆弾
                }
              } else if (bombMaps[y2][x2] === 0 && userInputs[y2][x2] === 1) {
                // 地雷じゃないのに旗が立っていた場合（誤爆）
                newBoard[y2][x2] = newBoard[y2][x2] + 8; // 誤った旗表示
              }
            }
          }

          if (face !== 'fail') {
            face = 'fail';
            stopTime = currentTimer;
            if (!alertOnce && currentTimer !== -1) {
              setTimer(-1);
              alertOnce = true;
              alert('Game Over');
            }
          }
        } else {
          const checked: number[][] = [];
          openCells(y, x, newBoard, checked);
        }
      }
    }
  }

  opendCell = 0;
  let currentFlagCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (
        !newBoard[y] ||
        newBoard[y][x] === undefined ||
        !bombMaps[y] ||
        bombMaps[y][x] === undefined ||
        !userInputs[y] ||
        userInputs[y][x] === undefined
      ) {
        continue;
      }

      const cellValue = newBoard[y][x];
      const userInput = userInputs[y][x];

      if (bombMaps[y][x] === 0) {
        if (
          (cellValue % 100 === 4 && cellValue < 1000) ||
          (cellValue >= 10004 && cellValue < 10007)
        ) {
          opendCell += 1;
        }
      }

      if (userInput === 1) {
        currentFlagCount += 1;
      }
    }
  }
  flag = maxBombs - currentFlagCount;

  if (opendCell === safeCell && face !== 'clear') {
    face = 'clear';
    stopTime = currentTimer;
    if (!alertOnce && currentTimer !== -1) {
      setTimer(-1);
      alertOnce = true;
      alert('Game Clear');
    }
  }
  return newBoard;
}

function Home() {
  const [numberOfBombs, setNumberOfBombs] = useState<number>(10);
  const [level, setLevel] = useState('easy');
  const [size, setSize] = useState<[number, number]>([9, 9]);

  const [customWidth, setCustomWidth] = useState<string>('30');
  const [customHeight, setCustomHeight] = useState<string>('30');
  const [customBombs, setCustomBombs] = useState<string>('10');

  const [bombMaps, setBombMaps] = useState<number[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)),
  );
  const [userInputs, setUserInputs] = useState<number[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)),
  );
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)),
  );
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const intervalId: NodeJS.Timeout = setInterval(() => {
      if (face === 'fail' || face === 'clear') {
        setTimer(-1);
        clearInterval(intervalId);
        return;
      }
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const makeBombMaps = (
    size: [number, number],
    bombLevel: number,
    firstClickX: number,
    firstClickY: number,
  ): number[][] => {
    const [width, height] = size;

    const newMap: number[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0),
    );

    let countBomb = 0;
    while (countBomb < bombLevel) {
      const y = Math.floor(Math.random() * height);
      const x = Math.floor(Math.random() * width);

      if (
        x >= firstClickX - 1 &&
        x <= firstClickX + 1 &&
        y >= firstClickY - 1 &&
        y <= firstClickY + 1
      ) {
        continue;
      }
      if (newMap[y][x] === 0) {
        newMap[y][x] = 1;
        countBomb += 1;
      }
    }
    return newMap;
  };

  function changeLevel(selectedLevel: 'easy' | 'normal' | 'hard' | 'custom') {
    let newSize: [number, number];
    let newBombs: number;

    if (selectedLevel === 'easy') {
      newSize = [9, 9];
      newBombs = 10;
    } else if (selectedLevel === 'normal') {
      newSize = [16, 16];
      newBombs = 40;
    } else if (selectedLevel === 'hard') {
      newSize = [30, 16];
      newBombs = 99;
    } else {
      const parsedWidth = parseInt(customWidth, 10);
      const parsedHeight = parseInt(customHeight, 10);
      const parsedBombs = parseInt(customBombs, 10);

      if (isNaN(parsedWidth) || parsedWidth < 1 || parsedWidth > 500) {
        alert('幅は1から500の間の数字を入力してください');
        return;
      }
      if (isNaN(parsedHeight) || parsedHeight < 1 || parsedHeight > 500) {
        alert('高さは1から500の間の数字を入力してください');
        return;
      }
      newSize = [parsedWidth, parsedHeight];

      const maxPossibleBombs = parsedWidth * parsedHeight * 0.3;
      if (isNaN(parsedBombs) || parsedBombs < 1 || parsedBombs > Math.min(2500, maxPossibleBombs)) {
        alert(`爆弾の数は1から${Math.min(2500, maxPossibleBombs)}の間の数字を入力してください。`);
        return;
      }
      newBombs = parsedBombs;
    }

    setLevel(selectedLevel);
    setSize(newSize);
    setNumberOfBombs(newBombs);

    const newInputs = Array.from({ length: newSize[1] }, () =>
      Array.from({ length: newSize[0] }, () => 0),
    );
    setUserInputs(newInputs);

    const newBombMaps = Array.from({ length: newSize[1] }, () =>
      Array.from({ length: newSize[0] }, () => 0),
    );
    setBombMaps(newBombMaps);

    const newBoard = Array.from({ length: newSize[1] }, () =>
      Array.from({ length: newSize[0] }, () => 0),
    );
    setBoard(newBoard);

    face = 'default';
    firstClick = true;
    alertOnce = false;
    stopTime = null;
    flag = newBombs;
    maxFlag = newBombs;

    setTimer(0);
  }

  const leftClick = (x: number, y: number) => {
    if (face === 'fail' || face === 'clear') return;

    const currentHeight = userInputs.length;
    const currentWidth = userInputs[0]?.length || 0;

    if (y < 0 || y >= currentHeight || x < 0 || x >= currentWidth) {
      return;
    }

    const openedHistory = board.map((row) =>
      row.map((value) => {
        const openNumber = value % 100 === 4 && value < 1000;
        const openEmpty = value >= 10000 && value < 10007;
        const exploded = value === 1007 || value === 1004;
        return openNumber || openEmpty || exploded;
      }),
    );

    if (firstClick) {
      if (timer === 0) setTimer(1);

      const newBombs = makeBombMaps(size, numberOfBombs, x, y);
      setBombMaps(newBombs);

      const newInputs = Array.from({ length: size[1] }, () =>
        Array.from({ length: size[0] }, () => 0),
      );
      newInputs[y][x] = 4;

      setUserInputs(newInputs);
      setBoard(calcBoard(newInputs, newBombs, timer, setTimer, numberOfBombs, openedHistory));

      firstClick = false;
      return;
    }

    const newInputs = structuredClone(userInputs);
    const currentBoardCell = board[y][x];

    if (
      newInputs[y][x] === 1 ||
      newInputs[y][x] === 2 ||
      (currentBoardCell % 100 === 4 && currentBoardCell < 1000) ||
      currentBoardCell >= 10004 ||
      currentBoardCell === 1007 ||
      currentBoardCell === 1004
    ) {
      return;
    }

    newInputs[y][x] = 4;

    setUserInputs(newInputs);
    setBoard(calcBoard(newInputs, bombMaps, timer, setTimer, numberOfBombs, openedHistory));
  };

  const rightClick = (x: number, y: number, evt: React.MouseEvent<HTMLDivElement>) => {
    if (face === 'fail' || face === 'clear') return;

    evt.preventDefault();

    const currentHeight = userInputs.length;
    const currentWidth = userInputs[0]?.length || 0;

    if (y < 0 || y >= currentHeight || x < 0 || x >= currentWidth) {
      return;
    }

    if (timer === 0 && !firstClick) {
      setTimer(1);
    }

    const openedHistory = board.map((row) =>
      row.map((value) => {
        const openNumber = value % 100 === 4 && value < 1000;
        const openEmpty = value >= 10000 && value < 10007;
        const exploded = value === 1007 || value === 1004;
        return openNumber || openEmpty || exploded;
      }),
    );

    const newInputs = structuredClone(userInputs);
    const currentBoardCell = board[y][x];

    if (
      (currentBoardCell % 100 === 4 && currentBoardCell < 1000) ||
      currentBoardCell >= 10004 ||
      currentBoardCell === 1007 ||
      currentBoardCell === 1004
    ) {
      return;
    }

    newInputs[y][x] = (newInputs[y][x] + 1) % 3;

    setUserInputs(newInputs);
    setBoard(calcBoard(newInputs, bombMaps, timer, setTimer, numberOfBombs, openedHistory));
  };

  return (
    <div className={styles.container}>
      {level === 'custom' && (
        <div className={styles.customSettings}>
          <div>
            <label htmlFor="customWidth">幅: </label>
            <input
              id="customWidth"
              type="number"
              min="1"
              max="500"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="customHeight">高さ: </label>
            <input
              id="customHeight"
              type="number"
              min="1"
              max="500"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="customBombs">爆弾の数: </label>
            <input
              id="customBombs"
              type="number"
              min="1"
              max="2500"
              value={customBombs}
              onChange={(e) => setCustomBombs(e.target.value)}
            />
          </div>
          <button onClick={() => changeLevel('custom')} className={styles.applyCustomSettings}>
            設定適用
          </button>
        </div>
      )}
      <div className={styles.button}>
        <button onClick={() => changeLevel('easy')}>初級</button>
        <button onClick={() => changeLevel('normal')}>中級</button>
        <button onClick={() => changeLevel('hard')}>上級</button>
        <button onClick={() => changeLevel('custom')}>カスタム</button>
      </div>
      <div
        className={styles.foundation}
        style={{
          width: `${size[0] * 35}px`,
          height: `${size[1] * 50}px`,
        }}
      >
        <div
          className={styles.upperboard}
          style={{
            width: `${size[0] * 30}px`,
          }}
        >
          <div
            className={styles.flagcounter}
            style={{
              backgroundPosition: `${flag === 0 ? 0 : flag * -70}px`,
            }}
          />

          <div
            className={styles.changeface}
            style={{
              backgroundPosition: `${face === 'default' ? -330 : face === 'clear' ? -360 : -390}px`,
            }}
          />
          <div
            className={styles.timer}
            style={{
              backgroundPosition: `${timer === -1 ? (stopTime ?? 0) * -70 : timer * -70}px`,
            }}
          />
        </div>
        <div
          className={styles.board}
          style={{
            width: `${size[0] * 30}px`,
            height: `${size[1] * 30}px`,
          }}
        >
          {board.map((row, y) =>
            row.map((value, x) => (
              <div
                className={styles.undercell}
                key={`${x}-${y}`}
                style={{
                  backgroundPosition: `${(value > 10000 ? -1 : 10000 > value && value >= 1000 ? 10 : (value - 100) / 100) * -30}px`,
                  backgroundColor: `${value === 1007 ? 'red' : '#c6c6c6'}`,
                }}
              >
                <div
                  className={styles.block}
                  style={{
                    backgroundPosition: `${value % 100 === 1 ? -270 : value % 100 === 2 ? -240 : 30}px`,
                    opacity: `${value === 1007 ? 0 : value % 100 === 4 ? 0 : 1}`,
                  }}
                  onContextMenu={(evt) => rightClick(x, y, evt)}
                  onClick={() => leftClick(x, y)}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

//計算値 状態＋計算
