'use client';

import { useState } from 'react';
import styles from './page.module.css';

let sum: number = 0;
const calcTotalPoint = (arr: number[]) => {
  //userI,bombがくる
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    return sum;
  } //returnの後ろは数字（？）式は前に、
};
//userInputは０か１か 爆弾があるのは０か１か
const calcBoard = (userInput: number[][], bombMap: number[][]) => {
  const newBoard = Array.from({ length: userInput.length }, () =>
    Array.from({ length: userInput[0].length }, () => 0),
  );
  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 9; x++) {
      if (userInput[y] === undefined) {
        return newBoard;
      }
      if (userInput[y][x] === undefined) {
        return newBoard;
      }
      if (userInput[y][x] === 1 && bombMap[y][x] === 1) {
      }
    }
  }
  return newBoard;
};

export default function Home() {
  const firstlevel: string[] = ['初級', '中級', '上級', 'カスタム'];
  const [level, setLevel] = useState(0);
  // setLevel(newLevel[0]);
  const first: (string | number)[] = ['初級', 10]; //練習
  const numberOfBombs: number[] = [10, 40, 99, 0];
  //const [newNumberOfBombs, setNumberOfBombs] = useState<number>(numberOfBombs[0]);

  const boardSize: number[][] = [
    //使ってる
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
      const r = Math.floor(Math.random() * row);
      const c = Math.floor(Math.random() * col);
      if (testMap[r][c] === 0) {
        testMap[r][c] = 1;
        countBomb += 1;
      }
    }
    return testMap; //最後に置く
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

  const board = calcBoard(userInput, bombMap);

  //userInputとbombMapを合体
  //八方向を調べて（矢印で表せる）爆弾（samplecounter）があったら＋１でー３０Px分動かす
  const derection = [
    [0, -1], // 上
    [1, -1], // 右上
    [1, 0], // 右
    [1, 1], // 右下
    [0, 1], // 下
    [-1, 1], // 左下
    [-1, 0], // 左
    [-1, -1], // 左上
  ]; //direction[0][0]とかやるはず

  const count = 0;
  for (let y = 0; y < 9; y++) {
    //newBoardじゃなくてBombMapじゃないの、なにもかえてないんだもん
    //9の部分を変数にしたい
    for (let x = 0; x < 9; x++) {
      let count = 0;

      while (true) {
        //上
        if (bombMap[y][x - 1] === undefined || bombMap[y][x - 1] === 0) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y][x - 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //右上
        if (
          bombMap[y + 1] === undefined ||
          bombMap[y + 1][x - 1] === undefined ||
          bombMap[y + 1][x - 1] === 0
        ) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y + 1][x - 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //→
        if (bombMap[y + 1][x] === undefined || bombMap[y + 1][x] === 0) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y + 1][x] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //右下
        if (
          bombMap[y + 1] === undefined ||
          bombMap[y + 1][x + 1] === undefined ||
          bombMap[y + 1][x + 1] === 0
        ) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y + 1][x + 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //sita
        if (bombMap[y][x + 1] === undefined || bombMap[y][x + 1] === 0) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y][x + 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //hidarisita
        if (
          bombMap[y - 1] === undefined ||
          bombMap[y - 1][x + 1] === undefined ||
          bombMap[y - 1][x + 1] === 0
        ) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y - 1][x + 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //←
        if (bombMap[y - 1][x] === undefined || bombMap[y - 1][x] === 0) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y - 1][x] === 1) {
          //爆弾を表示
          count += 1;
        }
      }

      while (true) {
        //左上
        if (
          bombMap[y - 1] === undefined ||
          bombMap[y - 1][x - 1] === undefined ||
          bombMap[y - 1][x - 1] === 0
        ) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y - 1][x - 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }
      newBombMap[y][x] = count;
    }
    setBombMap(newBombMap);
  }

  // const [board, setBoard] = useState([bombMap, userInputs]); //zahyou
  // console.log(useState);

  const clickHundler = () => {
    const newBombMap = structuredClone(bombMap);
    setNewBombMap(newBombMap);
  };
  console.log(bombMap);
  const [userInputs, setUserInputs] = useState([0]); //koremo9x9
  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  console.log(samplePoints);
  const [sampleCounter, setSampleCounter] = useState(0);
  console.log(sampleCounter);
  const hundleClick = () => {
    const newSamplePoint = structuredClone(samplePoints);
    newSamplePoint[sampleCounter] += 1;
    setSamplePoints(newSamplePoint);
    setSampleCounter((sampleCounter + 1) % 14);
  };
  const clickReturn = () => {
    console.log('クリック！');
  };
  const totalPoint = calcTotalPoint(samplePoints);
  console.log(totalPoint);
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.undercell} key={`${x}-${y}`} onClick={() => clickHundler(x, y)}>
              {bombMap[y][x] !== 0 && (
                <div
                  className={styles.stone}
                  style={{ backgroundPosition: picture === 1 ? `${150}px` : `${count * -30}px` }}
                />
              )}
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
