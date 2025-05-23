'use client';

import { useState } from 'react';
import styles from './page.module.css';

let sum: number = 0;
[0];
const calcTotalPoint = (arr: number[]) => {
  //userI,bombがくる
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    return sum;
  } //returnの後ろは数字（？）式は前に、
};
export default function Home() {
  const [bombMap, setBombMap] = useState([
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

  // const [board, setBoard] = useState([bombMap, userInputs]); //zahyou
  // console.log(useState);

  const clickHundler = (x: number, y: number) => {
    const newBombMap = structuredClone(bombMap);
  };
  console.log(newBombMap);
  const [userInputs, setUserInputs] = useState([0]);
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
        {/* {board.map(row.y)} */}
        <div
          className={styles.samplecell}
          style={{ backgroundPosition: `${sampleCounter * -30}px` }}
        >
          <div className={styles.covercell} />
        </div>
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
//二つ合わせてboardにしてｔｓｘに送る
//shokyu-jokyu + custom（状態必要）
//見た目一緒（数字以外）バーいらない、数字フォント簡単なのでＯＫ
//時間 useEffect(状態)
//初回で爆発しない→クリックした後にbombマップを作ればいい

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
