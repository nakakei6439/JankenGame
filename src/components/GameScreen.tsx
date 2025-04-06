import React, { useState, useEffect } from 'react';
import './GameScreen.css';

type Hand = 'グー' | 'チョキ' | 'パー';
type Result = '勝ち' | '負け' | 'あいこ';

interface GameScreenProps {
  onGameOver: (streak: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [message, setMessage] = useState('さいしょはグー・・・・');
  const [showButtons, setShowButtons] = useState(false);
  const [computerChoice, setComputerChoice] = useState<Hand | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [streak, setStreak] = useState(0);
  const [handCounts, setHandCounts] = useState({ 'グー': 0, 'チョキ': 0, 'パー': 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('じゃんけん...ポン！');
      setShowButtons(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getRandomHand = (): Hand => {
    const hands: Hand[] = ['グー', 'チョキ', 'パー'];
    return hands[Math.floor(Math.random() * hands.length)];
  };

  const getHandEmoji = (hand: Hand): string => {
    switch (hand) {
      case 'グー': return '✊';
      case 'チョキ': return '✌️';
      case 'パー': return '🖐️';
    }
  };

  const getHandPercentage = (hand: Hand): number => {
    const total = handCounts['グー'] + handCounts['チョキ'] + handCounts['パー'];
    if (total === 0) return 0;
    return Math.round((handCounts[hand] / total) * 100);
  };

  const determineWinner = (player: Hand, computer: Hand): Result => {
    if (player === computer) return 'あいこ';
    if (
      (player === 'グー' && computer === 'チョキ') ||
      (player === 'チョキ' && computer === 'パー') ||
      (player === 'パー' && computer === 'グー')
    ) {
      return '勝ち';
    }
    return '負け';
  };

  const handleChoice = (playerChoice: Hand) => {
    const computerHand = getRandomHand();
    const gameResult = determineWinner(playerChoice, computerHand);
    
    setComputerChoice(computerHand);
    setResult(gameResult);
    setHandCounts(prev => ({
      ...prev,
      [computerHand]: prev[computerHand] + 1
    }));
    
    if (gameResult === '勝ち') {
      setStreak(prev => prev + 1);
      setMessage(`コンピューター: ${getHandEmoji(computerHand)}\nあなたの勝ち！`);
      setShowButtons(false);
      setTimeout(() => {
        setMessage('じゃんけん...');
        setShowButtons(true);
      }, 2000);
    } else if (gameResult === '負け') {
      setMessage(`コンピューター: ${getHandEmoji(computerHand)}\nあなたの負け...`);
      setShowButtons(false);
      setTimeout(() => {
        onGameOver(streak);
      }, 2000);
    } else {
      setMessage(`コンピューター: ${getHandEmoji(computerHand)}\nあいこで...しょ！！`);
      setShowButtons(false);
      setTimeout(() => {
        setMessage('じゃんけん...');
        setShowButtons(true);
      }, 2000);
    }
  };

  return (
    <div className="game-screen">
      <div className="streak-display">
        <span className="streak-label">連勝記録</span>
        <span className="streak-count">{streak}回</span>
      </div>
      <h2>{message}</h2>
      {showButtons && (
        <div className="choice-buttons">
          <button onClick={() => handleChoice('グー')}>✊</button>
          <button onClick={() => handleChoice('チョキ')}>✌️</button>
          <button onClick={() => handleChoice('パー')}>🖐️</button>
        </div>
      )}
      <div className="hand-stats">
        <div className="hand-stats-label">コンピュータの予想</div>
        <div className="hand-stats-items">
          <div className="hand-stat">
            <span>✊: {getHandPercentage('グー')}%</span>
          </div>
          <div className="hand-stat">
            <span>✌️: {getHandPercentage('チョキ')}%</span>
          </div>
          <div className="hand-stat">
            <span>🖐️: {getHandPercentage('パー')}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen; 