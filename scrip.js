const words = [
    "hello", "world", "this", "is", "a", "test",
    "typing", "game", "challenge", "javascript", "random",
    "keyboard", "practice", "speed", "accuracy", "fun",
    "learn", "code", "improve", "skills", "example",
    "words", "sentence", "paragraph", "exercise", "study",
    "quick", "brown", "fox", "jumps", "over",
    "lazy", "dog", "jumps", "high", "huge",
    "giant", "big", "small", "tiny", "large",
    "medium", "extra", "ordinary", "word", "letter",
  ];
  
  let score = 0;
  let timeLeft = 60;
  let timerInterval;
  let gameStarted = false;
  let currentWordIndex = 0; // To track the current word index
  let typedWords = new Set(); // Track correctly typed words
  let incorrectWords = new Set(); // Track incorrectly typed words
  
  // Get references to DOM elements
  const wordsContainer = document.getElementById("wordsContainer");
  const inputElement = document.getElementById("input");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const resetButton = document.getElementById("resetButton"); // Reset button
  const keyboardKeys = document.querySelectorAll("#keyboard .key");
  
  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  }
  
  // Function to start the game
  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    inputElement.disabled = false;
    inputElement.focus();
    shuffleArray(words); // Shuffle words when starting the game
    displayWords();
    startTimer();
  }
  
  // Function to display words in sequence
  function displayWords() {
    wordsContainer.innerHTML = words.map((word, index) => {
      let color = 'black';
      if (index < currentWordIndex) {
        color = 'green'; // Correctly typed word
      } else if (incorrectWords.has(word)) {
        color = 'red'; // Incorrectly typed word
      }
      return `<span class="word" style="color: ${color}">${word}</span>`;
    }).join(" ");
  }
  
  // Function to start the countdown timer
  function startTimer() {
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }
  
  // Function to end the game and show the final score
  function endGame() {
    inputElement.disabled = true;
    wordsContainer.innerHTML = `Game over! Your final score is ${score}.`;
  }
  
  // Function to reset the game
  function resetGame() {
    score = 0;
    timeLeft = 60;
    currentWordIndex = 0;
    typedWords.clear();
    incorrectWords.clear();
    gameStarted = false;
  
    inputElement.disabled = true;
    inputElement.value = "";
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time: ${timeLeft}`;
  
    shuffleArray(words); // Shuffle words array
    displayWords(); // Reset display
  }
  
  // Function to handle key press on virtual keyboard
  function handleKeyboardPress(key) {
    const keyElement = document.querySelector(`#keyboard .key[data-key="${key}"]`);
    if (keyElement) {
      keyElement.classList.add("active");
      setTimeout(() => keyElement.classList.remove("active"), 100);
    }
  }
  
  // Function to handle Backspace action
  function handleBackspace() {
    if (inputElement.value.length > 0) {
      inputElement.value = inputElement.value.slice(0, -1); // Remove last character
    }
  }
  
  // Event listener for typing in the input field
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === " ") { // Check for the Space key
      event.preventDefault(); // Prevent default space action (scrolling the page)
      const currentInput = inputElement.value.trim();
      
      if (currentInput.length > 0) {
        const typedWord = currentInput;
        const expectedWord = words[currentWordIndex];
        
        if (typedWord === expectedWord) {
          if (!typedWords.has(typedWord)) {
            score++;
            typedWords.add(typedWord); // Track the correctly typed word
          }
          currentWordIndex++; // Move to the next word
        } else {
          if (!typedWords.has(typedWord)) {
            incorrectWords.add(typedWord); // Track the incorrectly typed word
          }
        }
        
        // Check if the game should end
        if (currentWordIndex >= words.length) {
          endGame();
          return;
        }
        
        displayWords(); // Update the display with the next words
        scoreElement.textContent = `Score: ${score}`;
        inputElement.value = ""; // Clear the input field
      }
    } else if (event.key === "Backspace") { // Check for the Backspace key
      event.preventDefault(); // Prevent default Backspace action (e.g., navigating back)
      handleBackspace(); // Call the Backspace handler
    }
  });
  
  // Event listener for the reset button
  resetButton.addEventListener("click", resetGame);
  
  // Event listener for key presses to handle virtual keyboard
  document.body.addEventListener("keydown", (event) => {
    startGame(); // Ensure the game starts when any key is pressed
    handleKeyboardPress(event.key.toLowerCase()); // Highlight the pressed key
  });
  
  // Event listener for key releases to handle virtual keyboard
  document.body.addEventListener("keyup", (event) => {
    handleKeyboardPress(event.key.toLowerCase()); // Remove highlight from the pressed key
  });
  