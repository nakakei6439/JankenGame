import React, { useState, useEffect } from 'react';
import StartPage from './components/StartPage';
import GameScreen from './components/GameScreen';
import NameInputModal from './components/NameInputModal';
import './App.css';

interface RankingItem {
  name: string;
  score: number;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // ローカルストレージからランキングを読み込む
    const savedRanking = localStorage.getItem('jankenRanking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleGameOver = (streak: number) => {
    setCurrentStreak(streak);
    // ランキングに入る可能性があるかチェック
    const wouldRankIn = ranking.length < 10 || streak > ranking[ranking.length - 1].score;
    if (wouldRankIn) {
      setShowNameInput(true);
    } else {
      setGameStarted(false);
    }
  };

  const handleSaveName = (name: string) => {
    const newRanking = [...ranking, { name, score: currentStreak }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
    setRanking(newRanking);
    localStorage.setItem('jankenRanking', JSON.stringify(newRanking));
    setShowNameInput(false);
    setGameStarted(false);
  };

  const handleResetRanking = () => {
    const password = window.prompt('ランキングをリセットするにはパスワードを入力してください');
    if (password === '12345') {
      if (window.confirm('ランキングをリセットしますか？')) {
        setRanking([]);
        localStorage.removeItem('jankenRanking');
      }
    } else if (password !== null) {
      alert('パスワードが間違っています');
    }
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <StartPage 
          onStart={handleStart} 
          ranking={ranking}
          onReset={handleResetRanking}
        />
      ) : (
        <GameScreen onGameOver={handleGameOver} />
      )}
      {showNameInput && (
        <NameInputModal streak={currentStreak} onSave={handleSaveName} />
      )}
    </div>
  );
}

export default App;
