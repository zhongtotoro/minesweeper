'use client';

import { useEffect, useState } from 'react'; //状態は多分6つ（ユーザー操作、爆弾位置、時間、級選択、盤面サイズ、爆弾数）
import styles from './page.module.css';

let face = 'default';
let nokoriBomb = 10;
let flag: number = 10;
let stopTime: number | null = null;
let firstClick = true;

function openCells(y: number, x: number, newBoard: number[][], checked: number[][]) {
  const height = newBoard.length;
  const width = newBoard[0].length;

  // 範囲外チェック
  if (y < 0 || y >= height || x < 0 || x >= width) return;

  // すでにチェック済みか？
  for (let i = 0; i < checked.length; i++) {
    if (checked[i][0] === y && checked[i][1] === x) {
      return;
    }
  }

  checked.push([y, x]); // チェック済みとして追加

  const cell = newBoard[y][x];

  // すでに開いてる・爆発済み・空白マスで開いた後などは終了
  if (
    cell % 100 === 4 || // 開いてる
    cell % 100 === 7 || // 爆発
    cell >= 10004 // 空白マス＋4（開いたあと）
  ) {
    return;
  }

  // 爆弾マス（開けない）
  if (cell >= 1000 && cell < 10000) return;

  // 数字マス（連鎖しない）
  if (cell >= 0 && cell <= 700) {
    newBoard[y][x] += 4;
    return;
  }

  // 空白マス（連鎖する）
  if (cell >= 10000 && cell < 10004) {
    newBoard[y][x] += 4;

    // 周囲8方向を再帰的に開く
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        openCells(y + dy, x + dx, newBoard, checked);
      }
    }
  }
}

//userInputは０か１か 爆弾があるのは０か１か

// ← ここで global に宣言
let newBoard: number[][] = [];
function calcBoard(
  userInputs: number[][],
  bombMaps: number[][],
  setTimer: (timer: number) => void,
  timer: number,
): number[][] {
  if (newBoard.length === 0) {
    newBoard = Array.from({ length: userInputs.length }, () =>
      Array.from({ length: userInputs[0].length }, () => 0),
    );
  }

  //console.log('opencellnewBoard86', newBoard[8][6]);
  flag = 0;
  for (let y = 0; y < userInputs.length; y++) {
    for (let x = 0; x < userInputs[0].length; x++) {
      if (userInputs[y][x] === 1) {
        flag += 1;
      }
    }
  }
  flag = 10 - flag;
  console.log('flag', flag);

  let opendCell = 0;
  let safeCell = 0;
  for (let y = 0; y < userInputs.length; y++) {
    for (let x = 0; x < userInputs[0].length; x++) {
      if (newBoard[y][x] % 100 === 4 || newBoard[y][x] % 100 === 7 || newBoard[y][x] >= 10004) {
        continue;
      }

      if (bombMaps[y][x] === 0) {
        safeCell += 1;
        if (userInputs[y][x] === 4) {
          opendCell += 1;
        }
      }
      console.log('opencellnewBoard1calc', newBoard[1][1]);
      //周囲の爆弾の数を数える、爆弾があるときは０
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (
            y + dy < 0 ||
            y + dy >= userInputs.length ||
            x + dx < 0 ||
            x + dx >= userInputs[0].length
          ) {
            continue;
          }
          if (bombMaps[y + dy][x + dx] === 1) {
            count += 1;
          }
        }
      }
      if (count > 0) {
        newBoard[y][x] = (count - 1) * 100;
      } else {
        newBoard[y][x] = 10000; //空
      }

      if (bombMaps[y][x] === 1) {
        newBoard[y][x] = newBoard[y][x] + 1000; //爆弾
      }

      if (userInputs[y] === undefined) {
        return newBoard; ///いる？？
      }
      if (userInputs[y][x] === undefined) {
        return newBoard; //いる？？
      }

      if (userInputs[y][x] === 1 && bombMaps[y][x] === 0) {
        console.log('111');
        newBoard[y][x] = newBoard[y][x] + 1;

        //フラグ
      }

      if (userInputs[y][x] === 1 && bombMaps[y][x] === 1) {
        //フラグを立てたところが爆弾
        newBoard[y][x] = newBoard[y][x] + 1;
        nokoriBomb = nokoriBomb - 1;
        console.log('222');
      }

      if (userInputs[y][x] === 2) {
        console.log('333');
        newBoard[y][x] = newBoard[y][x] + 2; //はてな
      }

      if (userInputs[y][x] === 4 && bombMaps[y][x] === 1) {
        console.log('4&&1cell1', newBoard[1][1]);
        console.log('4&&1cell86', newBoard[8][6]);
        newBoard[y][x] = 1007;
        for (let y2 = 0; y2 < userInputs.length; y2++) {
          for (let x2 = 0; x2 < userInputs[0].length; x2++) {
            if (bombMaps[y2][x2] === 1 && !(y2 === y && x2 === x)) {
              newBoard[y2][x2] = 1004; // 他の爆弾
            }
          }
        }
        face = 'fail';
        stopTime = timer;
        setTimer(-1);
        //どっかで＋４されてる

        console.log('lastcell1', newBoard[1][1]);
        console.log('lastcell86', newBoard[8][6]);
        return newBoard;
      }

      if (userInputs[y][x] === 4 && bombMaps[y][x] === 0) {
        const checked: number[][] = [];
        openCells(y, x, newBoard, checked);
      }
    }
    // return newBoard;
  } //セル表示の管理
  if (opendCell === safeCell && face !== 'clear') {
    face = 'clear';
    stopTime = timer;
    setTimer(-1);
  }
  return newBoard;
}

function Home() {
  const numberOfBombs: number[] = [10, 40, 99, 0];
  const [newNumberOfBombs, setNumberOfBombs] = useState<number>(numberOfBombs[0]);

  const boardSize: number[][] = [
    [9, 9],
    [16, 16],
    [30, 16],
    [0, 0],
  ];

  function makeBombMaps(
    size: number[],
    bombLevel: number,
    firstClickX: number,
    firstClickY: number,
  ): number[][] {
    //変数名、（引数）、変数はどんな形で出力されるか
    //mapを作る
    const row: number = size[0];
    const col: number = size[1];
    const testMap: number[][] = [];

    for (let i = 0; i < row; i++) {
      const rowList: number[] = [];
      for (let i = 0; i < col; i++) {
        rowList.push(0);
      }
      testMap.push(rowList);
    }

    let countBomb = 0;
    while (countBomb < bombLevel) {
      const y = Math.floor(Math.random() * row);
      const x = Math.floor(Math.random() * col);
      if (x === firstClickX && y === firstClickY) {
        continue;
      }
      if (testMap[y][x] === 0) {
        testMap[y][x] = 1;
        countBomb += 1;
      }
    }
    return testMap;
  }

  const [bombMaps, setBombMaps] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)), //saishokara
  );

  function makeUserInputs(size: number[]): number[][] {
    const row: number = size[0];
    const col: number = size[1];
    const testMap: number[][] = [];

    for (let i = 0; i < row; i++) {
      const rowList: number[] = [];
      for (let i = 0; i < col; i++) {
        rowList.push(0);
      }
      testMap.push(rowList);
    }
    return testMap;
  }

  const [userInputs, setUserInputs] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)), // 初期値：未操作マス
  );

  //講習
  // const clickHundler = () => {
  //   const newBombMap = structuredClone(bombMap);
  //   setNewBombMap(newBombMap);
  // };

  //console.log(bombMap);
  //koremo9x9
  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //console.log(samplePoints);
  const [sampleCounter, setSampleCounter] = useState(0);
  //console.log(sampleCounter);
  // const hundleClick = () => {
  //   const newSamplePoint = structuredClone(samplePoints);
  //   newSamplePoint[sampleCounter] += 1;
  //   setSamplePoints(newSamplePoint);
  //   setSampleCounter((sampleCounter + 1) % 14);
  // };

  // const totalPoint = calcTotalPoint(samplePoints);
  //console.log(totalPoint);
  //ここまで関係ない

  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (timer <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const board = calcBoard(userInputs, bombMaps, setTimer, timer);

  const leftClick = (x: number, y: number) => {
    if (face === 'fail' || face === 'clear') {
      return;
    }
    if (firstClick) {
      const bombMaps = makeBombMaps(boardSize[0], newNumberOfBombs, x, y);
      setBombMaps(bombMaps);
      firstClick = false;
      return;
    }

    if (timer === 0) {
      setTimer(1);
    }
    setUserInputs((prev) => {
      const next = structuredClone(prev);
      next[y][x] = 4;
      return next;
    });

    console.log('leftnewUserInputs', userInputs[y][x]);
  };
  const rightClick = (x: number, y: number, evt: React.MouseEvent<HTMLDivElement>) => {
    if (face === 'fail' || face === 'clear') {
      return;
    }
    evt.preventDefault();
    if (firstClick) {
      const bombMaps = makeBombMaps(boardSize[0], newNumberOfBombs, x, y);
      setBombMaps(bombMaps);
      firstClick = false;
      return;
    }

    if (timer === 0) {
      setTimer(1);
    }

    setUserInputs((prev) => {
      const next = structuredClone(prev);
      next[y][x] = (next[y][x] + 1) % 3;
      return next;
    });

    console.log('rightnewUserInputs', userInputs[y][x]);
  };
  return (
    <div className={styles.container}>
      <div className={styles.foundation}>
        <div className={styles.upperboard}>
          <div
            className={styles.bombcounter}
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
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((value, x) => (
              <div
                className={styles.undercell}
                key={`${x}-${y}`}
                style={{
                  backgroundPosition: `${(value > 10000 ? -1 : value / 100) * -30}px`,
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

//    再起関数 ｆｎ（）
//joutai userInputs[0-4]右クリック左クリック？ユーザーがどのマスで『なにしたか
//joutai bombmap[0,1]爆弾あるかどうか
//import rondomで配置
//多分 clickevent if(bombmap[y][x] === 1) covercell   を外す
//
//二つ合わせてboardにしてｔｓｘに送る
//shokyu-jokyu + custom（状態必要）
//見た目一緒（数字以外）バーいらない、数字フォント簡単なのでＯＫ
//時間 useEffect(状態)
//bomb
//初回で爆発しない→クリックした後にbombマップを作ればいい cliclevent board[y][x] = () => {bombmap作成}

//計算値 状態＋計算
