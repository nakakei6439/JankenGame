import React, { useState, useEffect } from 'react';
import StartPage from './components/StartPage';
import GameScreen from './components/GameScreen';
import NameInputModal from './components/NameInputModal';
import { supabase } from './lib/supabase';
import './App.css';

interface RankingItem {
  id?: number;
  name: string;
  score: number;
  created_at?: string;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (data) setRanking(data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    }
  };

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

  const handleSaveName = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('ranking')
        .insert([{ name, score: currentStreak }])
        .select();

      if (error) throw error;
      if (data) {
        await fetchRanking();
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }

    setShowNameInput(false);
    setGameStarted(false);
  };

  const handleResetRanking = async () => {
    const password = window.prompt('ランキングをリセットするにはパスワードを入力してください');
    if (password === '12345') {
      if (window.confirm('ランキングをリセットしますか？')) {
        try {
          const { error } = await supabase
            .from('ranking')
            .delete()
            .neq('id', 0); // 全てのレコードを削除

          if (error) throw error;
          setRanking([]);
        } catch (error) {
          console.error('Error resetting ranking:', error);
        }
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
