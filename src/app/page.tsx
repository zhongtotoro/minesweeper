'use client';

import { useState } from 'react'; //状態は多分6つ（ユーザー操作、爆弾位置、時間、級選択、盤面サイズ、爆弾数）
import styles from './page.module.css';

let sum: number = 0;
const calcTotalPoint = (arr: number[]) => {
  //userI,bombがくる
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    return sum;
  }
};
//userInputは０か１か 爆弾があるのは０か１か
const calcBoard = (userInputs: number[][], bombMaps: number[][]) => {
  const newBoard = Array.from({ length: userInputs.length }, () =>
    Array.from({ length: userInputs[0].length }, () => 0),
  );
  for (let y = 0; y < userInputs.length; y++) {
    for (let x = 0; x < userInputs[0].length; x++) {
      if (userInputs[y][x] === 1) {
        newBoard[y][x] = 1; //爆弾じゃなかったら開く
      }
      if (userInputs[y][x] === 2) {
        newBoard[y][x] = 2; //フラグ
      }
      if (userInputs[y][x] === 3) {
        newBoard[y][x] = 3; //はてな
      }
      if (userInputs[y][x] === 4) {
        newBoard[y][x] = 4; //透明
      }
      if (bombMaps[y][x] === 1) {
        newBoard[y][x] = 11; //爆弾
      }
      if (1 <= bombMaps[y][x] && bombMaps[y][x] <= 8) {
        newBoard[y][x] = bombMaps[y][x]; //爆弾なし
      }
    }
  }
  return newBoard;

  for (let y = 0; y <= userInput.length; y++) {
    for (let x = 0; x <= userInput[0].length; x++) {
      let count = 0; //周囲の爆弾の数を数える、爆弾があるときは０
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (
            y + dy < 0 ||
            y + dy >= userInput.length ||
            x + dx < 0 ||
            x + dx >= userInput[0].length
          ) {
            continue;
          }
          if (bombMap[y + dy][x + dx] === 1) {
            count += 1;
          }
        }
      }
      newBoard[y][x] = count;
      if (userInput[y] === undefined) {
        return newBoard;
      }
      if (userInput[y][x] === undefined) {
        return newBoard;
      }
      if (userInput[y][x] === 1 && bombMap[y][x] === 1) {
        //newBoard[y][x] = 'background-color:red'; //背景赤にしたい
        //cell全部開く
      }
      if (userInput[y][x] === 1 && bombMap[y][x] === 0) {
        //クリックしたマスと周囲のマスを開く
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (
              y + dy < 0 ||
              y + dy >= userInput.length ||
              x + dx < 0 ||
              x + dx >= userInput[0].length
            ) {
              continue;
            }
            if (bombMap[y + dy][x + dx] === 0) {
              console.log('ok');
            }
          }
        }
      }
    }
  }
  return newBoard;
};

export default function Home() {
  const numberOfBombs: number[] = [10, 40, 99, 0];
  const [newNumberOfBombs, setNumberOfBombs] = useState<number>(numberOfBombs[0]);

  const boardSize: number[][] = [
    [9, 9],
    [16, 16],
    [30, 16],
    [0, 0],
  ];

  function makeMap(size: number[], bombLevel: number): number[][] {
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
      if (testMap[y][x] === 0) {
        testMap[y][x] = 1;
        countBomb += 1;
      }
    }
    return testMap;
  }

  const initialBombMap = makeMap(boardSize[0], numberOfBombs[0]);
  const [bombMap, setBombMap] = useState<number[][]>(initialBombMap);
  const newBombMap = structuredClone(bombMap);

  function makeUserInput(size: number[]): number[][] {
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

  const userInput = makeUserInput(boardSize[0]);

  //講習
  const clickHundler = () => {
    const newBombMap = structuredClone(bombMap);
    setNewBombMap(newBombMap);
  };
  const [bombMaps, setNewBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
  ]);
  //console.log(bombMap);
  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]); //koremo9x9
  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //console.log(samplePoints);
  const [sampleCounter, setSampleCounter] = useState(0);
  //console.log(sampleCounter);
  const hundleClick = () => {
    const newSamplePoint = structuredClone(samplePoints);
    newSamplePoint[sampleCounter] += 1;
    setSamplePoints(newSamplePoint);
    setSampleCounter((sampleCounter + 1) % 14);
  };
  const clickReturn = () => {
    //console.log('クリック！');
  };
  const totalPoint = calcTotalPoint(samplePoints);
  //console.log(totalPoint);
  //ここまで関係ない
  const board = calcBoard(userInputs, bombMap);

  const leftClick = (x: number, y: number) => {
    console.log(x, y);
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = 1;
    setUserInputs(newUserInputs);
    console.log(newUserInputs[y][x]);
  };
  const rightClick = (x: number, y: number, evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    console.log(x, y);
    const newUserInputs = structuredClone(userInputs);
    //newUserInputs[y][x] = (newUserInputs[y][x] + 1) % 3;
    if (newUserInputs[y][x] === 4 || newUserInputs[y][x] === 0) {
      newUserInputs[y][x] = 2;
    } else {
      newUserInputs[y][x] = newUserInputs[y][x] + 1;
    }
    console.log('value=', newUserInputs[y][x]);
    setUserInputs(newUserInputs);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((value, x) => (
            <div
              className={styles.undercell}
              key={`${x}-${y}`}
              style={{ backgroundPosition: `${value * -30}px` }}
            >
              <div
                className={styles.block}
                style={{
                  backgroundPosition: `${value === 2 ? -270 : value === 3 ? -240 : 30}px`,
                  opacity: value === 1 ? 0 : 1,
                }}
                onContextMenu={(evt) => rightClick(x, y, evt)}
                onClick={() => leftClick(x, y)}
              />
            </div>
          )),
        )}
      </div>
      <button onClick={hundleClick}>go</button>
      <button onClick={clickHundler}>retry</button>
      <button onClick={clickReturn}>stop</button>
    </div>
  );
}

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

//ユーザーがクリック→board[useInput][bompmap]
//八方向を調べて（矢印で表せる）爆弾（samplecounter）があったら＋１でー３０Px分動かす

//セルを増殖、座標であつかえるように
//boardの設置
//→八方向調べて爆弾あれ ba 爆弾total?
//→八方向調べて爆弾あれ ba 爆弾total?
//クリックイベントでセルのカバーが外れる←なくすてどうやる？
//再起関数で連鎖
//
