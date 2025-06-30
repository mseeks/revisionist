// Simple browser console script to force game end
// Open browser console at localhost:3000 and paste this

console.log('=== FORCING GAME END FOR DEBUG ===');

// Access the game store through Nuxt
const nuxtApp = window.$nuxt;
if (nuxtApp) {
  const gameStore = nuxtApp.$pinia._s.get('game'); // Pinia store access
  
  if (gameStore) {
    console.log('Current game state:', {
      status: gameStore.gameStatus,
      remaining: gameStore.remainingMessages,
      progress: gameStore.objectiveProgress
    });
    
    // Force game end for testing
    console.log('Forcing game to end...');
    gameStore.remainingMessages = 0;
    gameStore.objectiveProgress = 50; // Below 100 = defeat
    gameStore.checkGameOver();
    
    console.log('New game state:', {
      status: gameStore.gameStatus,
      remaining: gameStore.remainingMessages,
      progress: gameStore.objectiveProgress
    });
    
    console.log('End game screen should be visible now!');
  } else {
    console.error('Could not find game store');
  }
} else {
  console.error('Could not find Nuxt app');
}
