import React, { useEffect, useState } from 'react';

// Bingo call names for numbers 1-90
const bingoCallNames: Record<number, string> = {
  1: "Kelly's Eye", 2: "One Little Duck", 3: "Cup of Tea", 4: "Knock at the Door",
  5: "Man Alive", 6: "Tom Mix", 7: "Lucky Seven", 8: "Garden Gate",
  9: "Doctor's Orders", 10: "Boris's Den", 11: "Legs Eleven", 12: "One Dozen",
  13: "Unlucky for Some", 14: "Valentine's Day", 15: "Young and Keen", 16: "Sweet Sixteen",
  17: "Dancing Queen", 18: "Coming of Age", 19: "Goodbye Teens", 20: "One Score",
  21: "Key of the Door", 22: "Two Little Ducks", 23: "Thee and Me", 24: "Two Dozen",
  25: "Duck and Dive", 26: "Pick and Mix", 27: "Gateway to Heaven", 28: "In a State",
  29: "Rise and Shine", 30: "Dirty Gertie", 31: "Get Up and Run", 32: "Buckle My Shoe",
  33: "All the Threes", 34: "Ask for More", 35: "Jump and Jive", 36: "Three Dozen",
  37: "More than Eleven", 38: "Christmas Cake", 39: "Steps", 40: "Life Begins",
  41: "Time for Fun", 42: "Winnie the Pooh", 43: "Down on Your Knees", 44: "Droopy Drawers",
  45: "Halfway There", 46: "Up to Tricks", 47: "Four and Seven", 48: "Four Dozen",
  49: "PC", 50: "Half a Century", 51: "Tweak of the Thumb", 52: "Danny La Rue",
  53: "Stuck in a Tree", 54: "Clean the Floor", 55: "Snakes Alive", 56: "Shotts Bus",
  57: "Heinz Varieties", 58: "Make Them Wait", 59: "Brighton Line", 60: "Five Dozen",
  61: "Baker's Bun", 62: "Turn on the Screw", 63: "Tickle Me 63", 64: "Red Raw",
  65: "Old Age Pension", 66: "Clickety Click", 67: "Made in Heaven", 68: "Saving Grace",
  69: "Either Way UP", 70: "Three Score and Ten", 71: "Bang on the Drum", 72: "Six Dozen",
  73: "Queen B", 74: "Candy Store", 75: "Strive and Strive", 76: "Trombones",
  77: "Sunset Strip", 78: "Heaven's Gate", 79: "One More Time", 80: "Eight and Blank",
  81: "Stop and Run", 82: "Straight On Through", 83: "Time for Tea", 84: "Seven Dozen",
  85: "Staying Alive", 86: "Between the Sticks", 87: "Torquay in Devon", 88: "Two Fat Ladies",
  89: "Nearly There", 90: "Top of the Shop"
};

const generateNextNumber = (calledNumbers: number[], maxNumber: number): number | null => {
  const availableNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1)
    .filter(num => !calledNumbers.includes(num));

  if (availableNumbers.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  return availableNumbers[randomIndex];
};

const getBingoCallName = (number: number) => bingoCallNames[number] || "";

const NumberDisplay: React.FC<{ currentNumber: number | null, callName: string }> = ({ currentNumber, callName }) => (
  <div className="number-display">
    <div className="number-display-label">Current Number</div>
    {currentNumber ? (
      <React.Fragment>
        <div className="current-number" key={currentNumber}>{currentNumber}</div>
        <div className="call-name" key={`${currentNumber}-name`}>{callName}</div>
      </React.Fragment>
    ) : (
      <div className="placeholder-text">Click "Next Number" to start!</div>
    )}
  </div>
);

const HistoryDisplay: React.FC<{ history: number[] }> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-label">Previous Numbers</div>
      <div className="history-list">
        {history.slice(0, 5).map((num, i) => (
          <div key={`${num}-${i}`} className="history-item">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

const NextButton: React.FC<{ onClick: () => void, disabled: boolean }> = ({ onClick, disabled }) => (
  <button className="next-button" onClick={onClick} disabled={disabled}>
    {disabled ? "All Numbers Called!" : "Next Number"}
  </button>
);

const ResetButton: React.FC<{ onClick: () => void, style?: React.CSSProperties, label?: string }> = ({ onClick, style, label }) => (
  <button className="reset-button" onClick={onClick} style={style}>
    {label || "Reset Game"}
  </button>
);

const NumberGrid: React.FC<{ calledNumbers: number[], maxNumber: number }> = ({ calledNumbers, maxNumber }) => {
  const totalCols = 5;
  const headers = ['B', 'I', 'N', 'G', 'O'];
  const numbersPerCol = Math.ceil(maxNumber / totalCols);

  const getNumber = (row: number, col: number) => {
    const num = col * numbersPerCol + row + 1;
    return num <= maxNumber ? num : null;
  };

  const isRowFilled = (row: number) => {
    for (let col = 0; col < totalCols; col++) {
      const num = getNumber(row, col);
      if (num && !calledNumbers.includes(num)) return false;
    }
    return true;
  };

  return (
    <div className="number-grid-container">
      <h2 className="number-grid-title">Numbers Board</h2>
      <div className="bingo-board">
        <div className="board-headers">
          {headers.map(h => {
            const colIndex = headers.indexOf(h);
            const colStart = colIndex * numbersPerCol + 1;
            const colEnd = Math.min((colIndex + 1) * numbersPerCol, maxNumber);
            const allInColCalled = Array.from({ length: colEnd - colStart + 1 }, (_, i) => colStart + i)
              .every(n => calledNumbers.includes(n));
            return (
              <div key={h} className={`column-header ${allInColCalled ? 'all-called' : ''}`}>
                {h}
              </div>
            );
          })}
        </div>
        <div className="board-body">
          {Array.from({ length: numbersPerCol }).map((_, rowIndex) => {
            const rowFilled = isRowFilled(rowIndex);
            return (
              <div key={rowIndex} className={`board-row ${rowFilled ? 'row-filled' : ''}`}>
                {Array.from({ length: totalCols }).map((_, colIndex) => {
                  const num = getNumber(rowIndex, colIndex);
                  return (
                    <div
                      key={colIndex}
                      className={`number-cell ${num && calledNumbers.includes(num) ? 'called' : ''} ${!num ? 'empty' : ''}`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<{
  maxNumber: number,
  onMaxNumberChange: (newMax: number) => void
}> = ({ maxNumber, onMaxNumberChange }) => {
  const [localValue, setLocalValue] = useState(maxNumber.toString());

  useEffect(() => {
    setLocalValue(maxNumber.toString());
  }, [maxNumber]);

  const handleApply = () => {
    const val = parseInt(localValue);
    if (!isNaN(val)) {
      onMaxNumberChange(val);
    } else {
      setLocalValue(maxNumber.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="settings-panel">
      <label className="settings-label">
        Max Number:
        <input
          type="number"
          min="10"
          max="90"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleApply}
          onKeyDown={handleKeyDown}
          className="settings-input"
        />
      </label>
    </div>
  );
};

const BingoCardGenerator: React.FC<{ maxNumber: number }> = ({ maxNumber }) => {
  const [cardNumbers, setCardNumbers] = useState<(number | string)[][]>([]);
  const rows = Math.max(1, Math.floor(maxNumber / 10));

  const generateColumnNumbers = (min: number, max: number, count: number) => {
    const nums: number[] = [];
    const available = [];
    for (let i = min; i <= max; i++) available.push(i);

    if (available.length < count) {
      return available;
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      nums.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
    return nums.sort((a, b) => a - b);
  };

  const generateCard = () => {
    const totalCols = 5;
    const rangeSize = Math.floor(maxNumber / totalCols);
    const hasFreeSpace = rows % 2 !== 0 && rows >= 3;

    const newCard = [
      generateColumnNumbers(1, rangeSize, rows),
      generateColumnNumbers(rangeSize + 1, rangeSize * 2, rows),
      generateColumnNumbers(rangeSize * 2 + 1, rangeSize * 3, hasFreeSpace ? rows - 1 : rows),
      generateColumnNumbers(rangeSize * 3 + 1, rangeSize * 4, rows),
      generateColumnNumbers(rangeSize * 4 + 1, maxNumber, rows),
    ] as (number | string)[][];

    if (hasFreeSpace) {
      const col3 = newCard[2] as number[];
      const middleIndex = Math.floor(rows / 2);
      const withFree = [
        ...col3.slice(0, middleIndex),
        "FREE",
        ...col3.slice(middleIndex)
      ];
      newCard[2] = withFree;
    }

    setCardNumbers(newCard);
  };

  useEffect(() => {
    generateCard();
  }, [maxNumber]);

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridAutoFlow: 'column' as const
  };

  return (
    <div className="bingo-card-container">
      <div className="bingo-card-header">
        <h2>BINGO (1-{maxNumber})</h2>
      </div>
      <div className="bingo-card-grid" style={gridStyle}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          cardNumbers.length > 0 && cardNumbers.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`bingo-card-cell ${rows % 2 !== 0 && rows >= 3 && rowIndex === Math.floor(rows / 2) && colIndex === 2 ? 'free-space' : ''}`}
            >
              {col ? col[rowIndex] : ''}
            </div>
          ))
        ))}
      </div>

      <div className="bingo-card-actions">
        <ResetButton onClick={generateCard} label="New Card" style={{ background: 'rgba(0,0,0,0.1)', color: 'black', border: '1px solid #ccc' }} />
        <button className="next-button" onClick={() => window.print()} style={{ minWidth: 'auto' }}>
          Print Card
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [maxNumber, setMaxNumber] = useState(50);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [callName, setCallName] = useState("");
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'caller' | 'card'>('caller');

  const handleMaxNumberChange = (newMax: number) => {
    const clamped = Math.max(10, Math.min(90, newMax));
    setMaxNumber(clamped);
    handleReset();
  };

  const handleNextNumber = () => {
    const nextNum = generateNextNumber(calledNumbers, maxNumber);

    if (nextNum !== null) {
      const name = getBingoCallName(nextNum);

      setCurrentNumber(nextNum);
      setCallName(name);
      setCalledNumbers(prev => [...prev, nextNum]);
      setHistory(prev => [nextNum, ...prev]);

      if (calledNumbers.length + 1 === maxNumber) {
        setGameComplete(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentNumber(null);
    setCallName("");
    setCalledNumbers([]);
    setHistory([]);
    setGameComplete(false);
  };

  return (
    <div className="app-container">
      <div className="header-controls">
        <div className="tab-nav">
          <button
            className={`tab-button ${activeTab === 'caller' ? 'active' : ''}`}
            onClick={() => setActiveTab('caller')}
          >
            Number Caller
          </button>
          <button
            className={`tab-button ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            Printable Card
          </button>
        </div>
        <SettingsPanel
          maxNumber={maxNumber}
          onMaxNumberChange={handleMaxNumberChange}
        />
      </div>

      {activeTab === 'caller' ? (
        <div className="game-container">
          <div className="main-area">
            <NumberDisplay currentNumber={currentNumber} callName={callName} />
            <HistoryDisplay history={history.slice(1)} />
            <div className="button-container">
              <NextButton onClick={handleNextNumber} disabled={gameComplete} />
              {calledNumbers.length > 0 && <ResetButton onClick={handleReset} />}
            </div>
            {gameComplete && (
              <div className="game-complete">
                <h2>🎉 All Numbers Called! 🎉</h2>
                <p>Click "Reset Game" to start over</p>
              </div>
            )}
          </div>
          <div className="sidebar" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            <NumberGrid calledNumbers={calledNumbers} maxNumber={maxNumber} />
          </div>
        </div>
      ) : (
        <BingoCardGenerator maxNumber={maxNumber} />
      )}
    </div>
  );
};

export default App;
