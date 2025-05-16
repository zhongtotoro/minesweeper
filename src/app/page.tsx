'use client';

import { useState } from 'react';
import styles from './page.module.css';
const calcTotalPoint = (arr: number[]) => {//userI,bombがくる
  return for(let i = 0; i<arr.length);
};
export default function Home() {
  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  console.log(samplePoints);
  const [sampleCounter, setSampleCounter] = useState(0);
  console.log(sampleCounter);
  const clickHundler = () => {
    const newSamplePoint = structuredClone(samplePoints);
    newSamplePoint[sampleCounter] += 1;
    setSamplePoints(newSamplePoint);
    setSampleCounter((sampleCounter + 1) % 14);
  };
  const totalPoint = calcTotalPoint(samplePoints);
  console.log(totalPoint);
  return (
    <div className={styles.container}>
      <div
        className={styles.samplecell}
        style={{ backgroundPosition: `${sampleCounter * -30}px` }}
      />
      <button onClick={clickHundler}>Click</button>
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
