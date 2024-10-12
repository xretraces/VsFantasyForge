import React, { useState } from 'react';
import './App.css';
import { calculateRankingScore } from './utils/RankingService';
import { generateCombinations, selectBestCombination, generateCombinationSummary } from './utils/PlayerCombinationOptimizer';

function App() {
    const [totalBetAmount, setTotalBetAmount] = useState(100);
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerOdds, setPlayerOdds] = useState('');
    const [playerPropLine, setPlayerPropLine] = useState('');
    const [playerHitRate, setPlayerHitRate] = useState('');
    const [playerMatchup, setPlayerMatchup] = useState('');
    const [playerInsights, setPlayerInsights] = useState('');
    const [scaleFactor, setScaleFactor] = useState(3); // State for Scale Factor (1-5)
    const [starPlayer, setStarPlayer] = useState(false); // State for Star Player (Yes/No)
    const [bestCombination, setBestCombination] = useState(null); // Store the best combination

    // Function to add player and calculate ranking
    const addPlayer = () => {
        if (!playerName || !playerOdds || !playerPropLine || !playerHitRate || !playerMatchup) {
            alert("Please fill out all fields before adding a player.");
            return;
        }

        // Calculate the player's ranking score
        const rankingScore = calculateRankingScore({
            playerName,
            playerOdds: parseInt(playerOdds),
            propLine: playerPropLine,
            hitRate: playerHitRate,
            scaleFactor: parseInt(scaleFactor), // Pass scale factor
            consideredStar: starPlayer ? 'y' : 'n', // Pass star player as 'y' or 'n'
            hasEstimatedValue: false,
            estimatedValue: 0,
            matchup: playerMatchup,
            insights: playerInsights
        });

        const newPlayer = {
            playerName,
            playerOdds: parseInt(playerOdds),
            playerPropLine,
            playerHitRate,
            playerMatchup,
            playerInsights,
            scaleFactor, // Add scale factor to player object
            consideredStar: starPlayer ? 'Yes' : 'No', // Add star player status to player object
            rankingScore
        };

        // Add player to the list and reset form fields
        setPlayers([...players, newPlayer]);
        setPlayerName('');
        setPlayerOdds('');
        setPlayerPropLine('');
        setPlayerHitRate('');
        setPlayerMatchup('');
        setPlayerInsights('');
        setScaleFactor(3); // Reset scale factor to default
        setStarPlayer(false); // Reset star player checkbox

        // Generate best combination after adding a player
        const combinations = generateCombinations([...players, newPlayer], 2); // Example with group size 2
        const bestCombo = selectBestCombination(combinations);
        const summary = generateCombinationSummary(bestCombo);

        setBestCombination(summary); // Store the best combination summary
    };

    return (
        <div className="App">
            <h1>Fantasy Forge</h1>

            {/* Total Bet Amount Input */}
            <div className="bet-amount-container">
                <label>Total Bet Amount: </label>
                <input
                    type="number"
                    value={totalBetAmount}
                    onChange={(e) => setTotalBetAmount(parseFloat(e.target.value))}
                />
                <p>Total Bet Amount is: {totalBetAmount}</p>
            </div>

            {/* Player Input Form */}
            <div className="player-form">
                <h2>Add a Player</h2>
                <input
                    type="text"
                    placeholder="Player Name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Player Odds"
                    value={playerOdds}
                    onChange={(e) => setPlayerOdds(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Player Prop Line"
                    value={playerPropLine}
                    onChange={(e) => setPlayerPropLine(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Hit Rate (%)"
                    value={playerHitRate}
                    onChange={(e) => setPlayerHitRate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Matchup"
                    value={playerMatchup}
                    onChange={(e) => setPlayerMatchup(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Player Insights"
                    value={playerInsights}
                    onChange={(e) => setPlayerInsights(e.target.value)}
                />

                {/* Star Player Checkbox */}
                <div className="form-field">
                    <label>
                        Star Player:
                        <input
                            type="checkbox"
                            checked={starPlayer}
                            onChange={(e) => setStarPlayer(e.target.checked)}
                        />
                    </label>
                </div>

                {/* Scale Factor Slider */}
                <div className="form-field">
                    <label>
                        Scale Factor:
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={scaleFactor}
                            onChange={(e) => setScaleFactor(e.target.value)}
                        />
                        <span>{scaleFactor}</span>
                    </label>
                </div>

                <button className="add-player-btn" onClick={addPlayer}>Add Player</button>
            </div>

            {/* Display Players with Rankings */}
            <div>
                <h2>Players List with Rankings</h2>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            {player.playerName} - Odds: {player.playerOdds} - Prop Line: {player.playerPropLine} - Hit Rate: {player.playerHitRate}% - Matchup: {player.playerMatchup} - Star Player: {player.consideredStar} - Scale Factor: {player.scaleFactor} - Insights: {player.playerInsights} - Ranking Score: {player.rankingScore.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display Best Combination */}
            {bestCombination && (
                <div className="combination-card">
                    <p className="combination-title">{bestCombination}</p>
                </div>
            )}
        </div>
    );
}

export default App;
