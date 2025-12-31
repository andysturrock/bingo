// Bingo call names for numbers 1-50
const bingoCallNames: Record<number, string> = {
    1: "Kelly's Eye",
    2: "One Little Duck",
    3: "Cup of Tea",
    4: "Knock at the Door",
    5: "Man Alive",
    6: "Tom Mix",
    7: "Lucky Seven",
    8: "Garden Gate",
    9: "Doctor's Orders",
    10: "Boris's Den",
    11: "Legs Eleven",
    12: "One Dozen",
    13: "Unlucky for Some",
    14: "Valentine's Day",
    15: "Young and Keen",
    16: "Sweet Sixteen",
    17: "Dancing Queen",
    18: "Coming of Age",
    19: "Goodbye Teens",
    20: "One Score",
    21: "Key of the Door",
    22: "Two Little Ducks",
    23: "Thee and Me",
    24: "Two Dozen",
    25: "Duck and Dive",
    26: "Pick and Mix",
    27: "Gateway to Heaven",
    28: "In a State",
    29: "Rise and Shine",
    30: "Dirty Gertie",
    31: "Get Up and Run",
    32: "Buckle My Shoe",
    33: "All the Threes",
    34: "Ask for More",
    35: "Jump and Jive",
    36: "Three Dozen",
    37: "More than Eleven",
    38: "Christmas Cake",
    39: "Steps",
    40: "Life Begins",
    41: "Time for Fun",
    42: "Winnie the Pooh",
    43: "Down on Your Knees",
    44: "Droopy Drawers",
    45: "Halfway There",
    46: "Up to Tricks",
    47: "Four and Seven",
    48: "Four Dozen",
    49: "PC",
    50: "Half a Century"
};

// Generate next random number that hasn't been called
const generateNextNumber = (calledNumbers: number[]): number | null => {
    const availableNumbers = Array.from({ length: 50 }, (_, i) => i + 1)
        .filter(num => !calledNumbers.includes(num));
    
    if (availableNumbers.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
};

// Get bingo call name for a number
const getBingoCallName = (number: number): string => {
    return bingoCallNames[number] || "";
};

// React Components
const { useState } = React;

// NumberDisplay Component
interface NumberDisplayProps {
    currentNumber: number | null;
    callName: string;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ currentNumber, callName }) => {
    return (
        <div className="number-display">
            <div className="number-display-label">Current Number</div>
            {currentNumber ? (
                <>
                    <div className="current-number" key={currentNumber}>{currentNumber}</div>
                    <div className="call-name" key={`${currentNumber}-name`}>{callName}</div>
                </>
            ) : (
                <div className="placeholder-text">Click "Next Number" to start!</div>
            )}
        </div>
    );
};

// NextButton Component
interface NextButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, disabled }) => {
    return (
        <button 
            className="next-button" 
            onClick={onClick} 
            disabled={disabled}
        >
            {disabled ? "All Numbers Called!" : "Next Number"}
        </button>
    );
};

// ResetButton Component
interface ResetButtonProps {
    onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
    return (
        <button className="reset-button" onClick={onClick}>
            Reset Game
        </button>
    );
};

// NumberGrid Component
interface NumberGridProps {
    calledNumbers: number[];
}

const NumberGrid: React.FC<NumberGridProps> = ({ calledNumbers }) => {
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    
    return (
        <div className="number-grid-container">
            <h2 className="number-grid-title">Numbers Board</h2>
            <div className="number-grid">
                {numbers.map(num => (
                    <div 
                        key={num} 
                        className={`number-cell ${calledNumbers.includes(num) ? 'called' : ''}`}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [callName, setCallName] = useState<string>("");
    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [gameComplete, setGameComplete] = useState<boolean>(false);

    const handleNextNumber = () => {
        const nextNum = generateNextNumber(calledNumbers);
        
        if (nextNum !== null) {
            setCurrentNumber(nextNum);
            setCallName(getBingoCallName(nextNum));
            setCalledNumbers([...calledNumbers, nextNum]);
            
            if (calledNumbers.length + 1 === 50) {
                setGameComplete(true);
            }
        }
    };

    const handleReset = () => {
        setCurrentNumber(null);
        setCallName("");
        setCalledNumbers([]);
        setGameComplete(false);
    };

    return (
        <div className="app-container">
            <div className="main-area">
                <NumberDisplay currentNumber={currentNumber} callName={callName} />
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
            <div className="sidebar">
                <NumberGrid calledNumbers={calledNumbers} />
            </div>
        </div>
    );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
