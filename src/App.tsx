import React, { useState, useEffect } from 'react';
import StartPage from './components/StartPage';
import GameScreen from './components/GameScreen';
import NameInputModal from './components/NameInputModal';
import { RankingItem, getTopRanking, addRankingEntry, resetRanking } from './lib/ranking';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    setRanking(getTopRanking());
  }, []);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleGameOver = (streak: number) => {
    setCurrentStreak(streak);
    const wouldRankIn = ranking.length < 100 || streak > ranking[ranking.length - 1].score;
    if (wouldRankIn) {
      setShowNameInput(true);
    } else {
      setGameStarted(false);
    }
  };

  const handleSaveName = (name: string) => {
    addRankingEntry(name, currentStreak);
    setRanking(getTopRanking());
    setShowNameInput(false);
    setGameStarted(false);
  };

  const handleResetRanking = () => {
    const password = window.prompt('ランキングをリセットするにはパスワードを入力してください(生年月日)');
    if (password === '19820427') {
      if (window.confirm('ランキングをリセットしますか？')) {
        resetRanking();
        setRanking([]);
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
