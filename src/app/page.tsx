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

export default function Home() {
  const level: string[] = ['初級', '中級', '上級', 'カスタム'];
  const [newLevel, setLevel] = useState(level[0]);
  // setLevel(newLevel[0]);
  const first: (string | number)[] = ['初級', 10];
  const numberOfBombs: number[] = [10, 40, 99, 0];
  const [newNumberOfBombs, setNumberOfBombs] = useState<number>(numberOfBombs[0]);

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

  const bombMap = makeMap(boardSize[0], numberOfBombs[0]);
  const bombMap = useState<number>(0);
  const newBombMap = structuredClone(bombMap);

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

  for (let y = 0; y < 9; y++) {
    //newBoardじゃなくてBombMapじゃないの、なにもかえてないんだもん
    //9の部分を変数にしたい
    for (let x = 0; x < 9; x++) {
      console.log(bombMap[y][x - 1]);
      let count = 0;
      // const place = newBombMap[y][x - 1];
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
        if (bombMap[y + 1][x - 1] === undefined || bombMap[y + 1][x - 1] === 0) {
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
        if (bombMap[y + 1][x + 1] === undefined || bombMap[y + 1][x + 1] === 0) {
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
        if (bombMap[y - 1][x + 1] === undefined || bombMap[y - 1][x + 1] === 0) {
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
        if (bombMap[y - 1][x - 1] === undefined || bombMap[y - 1][x - 1] === 0) {
          break; //空きますか盤外ならなにもしない
        }
        if (bombMap[y - 1][x - 1] === 1) {
          //爆弾を表示
          count += 1;
        }
      }
      newBombMap[y][x];
    }
  }

  // const [board, setBoard] = useState([bombMap, userInputs]); //zahyou
  // console.log(useState);

  const clickHundler = () => {
    const newBombMap = structuredClone(bombMap[0]);
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
        {newBombMap.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.samplecell}
              key={`${x}-${y}`}
              style={{ backgroundPosition: `${sampleCounter * -30}px` }}
            />
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
