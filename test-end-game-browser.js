// Quick end-to-end test to verify game completion
// Navigate to localhost:3000 and run this in browser console

console.log('Starting end-game test...');

// Function to send a message
async function sendMessage(text) {
  const input = document.querySelector('[data-testid="message-input"]');
  const button = document.querySelector('[data-testid="send-button"]');
  
  if (input && button) {
    input.value = text;
    // Trigger input event to update Vue model
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Wait a bit for Vue to process
    await new Promise(resolve => setTimeout(resolve, 100));
    button.click();
    // Wait for API response
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Function to check game state
function checkGameState() {
  const gameStore = window.$nuxt.$store;
  console.log('Game Status:', gameStore?.gameStatus);
  console.log('Remaining Messages:', gameStore?.remainingMessages);
  console.log('Progress:', gameStore?.objectiveProgress);
  
  // Also check if end game screen is visible
  const endGameScreen = document.querySelector('[data-testid="end-game-screen"]');
  console.log('End Game Screen Visible:', !!endGameScreen);
}

// Main test function
async function runEndGameTest() {
  console.log('Initial state:');
  checkGameState();
  
  console.log('Sending 5 messages...');
  
  for (let i = 1; i <= 5; i++) {
    console.log(`Sending message ${i}...`);
    await sendMessage(`Test message ${i} - trying to change history!`);
    checkGameState();
  }
  
  console.log('Final state:');
  checkGameState();
  
  // Final check for end game screen
  setTimeout(() => {
    console.log('Final check after delay:');
    checkGameState();
  }, 3000);
}

// Run the test
runEndGameTest();
