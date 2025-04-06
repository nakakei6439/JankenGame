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
      console.log('ランキング取得開始');
      
      const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);

      if (error) {
        console.error('ランキング取得エラー:', error);
        alert(`ランキングの取得に失敗しました: ${error.message}`);
        return;
      }

      if (!data) {
        console.error('データが取得できませんでした');
        return;
      }

      console.log('取得したランキングデータ:', data);
      setRanking(data);
    } catch (error) {
      console.error('ランキング取得エラー:', error);
      alert('ランキングの取得中にエラーが発生しました');
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
      console.log('ランキング保存開始:', { name, score: currentStreak });
      
      const { data, error } = await supabase
        .from('ranking')
        .insert([{ name, score: currentStreak }])
        .select();

      if (error) {
        console.error('ランキング保存エラー:', error);
        alert(`ランキングの保存に失敗しました: ${error.message}`);
        throw error;
      }

      console.log('保存されたデータ:', data);
      
      if (data) {
        await fetchRanking();
      }
    } catch (error) {
      console.error('ランキング保存エラー:', error);
      alert('ランキングの保存中にエラーが発生しました');
    }

    setShowNameInput(false);
    setGameStarted(false);
  };

  const handleResetRanking = async () => {
    const password = window.prompt('ランキングをリセットするにはパスワードを入力してください(生年月日)');
    if (password === '19820427') {
      if (window.confirm('ランキングをリセットしますか？')) {
        try {
          // 全てのレコードを削除
          const { error: deleteError } = await supabase
            .from('ranking')
            .delete()
            .neq('id', 0);

          if (deleteError) throw deleteError;

          // IDシーケンスをリセット
          const { error: resetError } = await supabase
            .rpc('reset_ranking_id_sequence');

          if (resetError) {
            console.error('シーケンスリセットエラー:', resetError);
            alert('ランキングIDのリセットに失敗しました');
          }

          setRanking([]);
        } catch (error) {
          console.error('ランキングリセットエラー:', error);
          alert('ランキングのリセット中にエラーが発生しました');
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
      {ranking.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">ランキング</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              {ranking.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{index + 1}位</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.score}連勝</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
