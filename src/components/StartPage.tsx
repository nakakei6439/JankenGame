import React from 'react';
import './StartPage.css';

interface RankingItem {
  name: string;
  score: number;
}

interface StartPageProps {
  onStart: () => void;
  ranking: RankingItem[];
}

const StartPage: React.FC<StartPageProps> = ({ onStart, ranking }) => {
  // 同じスコアの場合は同じ順位を計算
  const getRank = (index: number): number => {
    if (index === 0) return 1;
    if (ranking[index].score === ranking[index - 1].score) {
      return getRank(index - 1);
    }
    return index + 1;
  };

  return (
    <div className="start-page">
      <h1>じゃんけん連勝チャレンジ</h1>
      <p>コンピューターに何回連続で勝てるか挑戦しよう！</p>
      <button className="start-button" onClick={onStart}>
        スタート
      </button>
      <div className="ranking-container">
        <h2>ランキング</h2>
        <div className="ranking-list">
          {ranking.length > 0 ? (
            ranking.map((item, index) => (
              <div key={index} className="ranking-item">
                <span className="rank">{getRank(index)}位</span>
                <span className="name">{item.name}</span>
                <span className="score">{item.score}回</span>
              </div>
            ))
          ) : (
            <p className="no-ranking">まだ記録がありません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartPage; 