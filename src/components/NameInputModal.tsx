import React, { useState } from 'react';
import './NameInputModal.css';

interface NameInputModalProps {
  streak: number;
  onSave: (name: string) => void;
}

const NameInputModal: React.FC<NameInputModalProps> = ({ streak, onSave }) => {
  const [name, setName] = useState('AAA');
  const [isInitialClick, setIsInitialClick] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  const handleInputClick = () => {
    if (isInitialClick) {
      setName('');
      setIsInitialClick(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>おめでとうございます！</h2>
        <p>連勝記録: {streak}回</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={handleInputClick}
            maxLength={10}
            required
          />
          <button type="submit">記録を保存</button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal; 