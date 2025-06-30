// Quick debug script to test end game functionality
// Run this in browser console when the game is running

console.log('=== DEBUG END GAME ===');

// Simulate game ending
const gameData = {
  gameStatus: 'victory',
  objectiveProgress: 100,
  remainingMessages: 0,
  currentObjective: { title: 'Test Objective' },
  messageHistory: [
    {
      text: 'Test message 1',
      sender: 'user',
      timestamp: new Date(),
      diceRoll: 20,
      diceOutcome: 'Critical Success',
      progressChange: 25
    },
    {
      text: 'Test message 2', 
      sender: 'user',
      timestamp: new Date(),
      diceRoll: 1,
      diceOutcome: 'Critical Failure',
      progressChange: -5
    },
    {
      text: 'Test message 3',
      sender: 'user', 
      timestamp: new Date(),
      diceRoll: 18,
      diceOutcome: 'Great Success',
      progressChange: 30
    }
  ]
};

console.log('Game Data:', gameData);

// Check if summary generation works
try {
  const { generateGameSummary } = await import('./utils/game-summary.ts');
  const summary = generateGameSummary(gameData);
  console.log('Generated Summary:', summary);
} catch (error) {
  console.error('Error generating summary:', error);
}
