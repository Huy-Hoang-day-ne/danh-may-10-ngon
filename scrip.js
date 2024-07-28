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
let currentWordIndex = 0; // Để theo dõi chỉ số từ hiện tại
let typedWords = new Set(); // Theo dõi các từ đã gõ đúng
let incorrectWords = new Set(); // Theo dõi các từ đã gõ sai

// Lấy tham chiếu đến các phần tử DOM
const wordsContainer = document.getElementById("wordsContainer");
const inputElement = document.getElementById("input");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const resetButton = document.getElementById("resetButton"); // Nút đặt lại
const keyboardKeys = document.querySelectorAll("#keyboard .key");

// Hàm để xáo trộn một mảng
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi phần tử
  }
}

// Hàm để bắt đầu trò chơi
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  inputElement.disabled = false;
  inputElement.focus();
  shuffleArray(words); // Xáo trộn từ khi bắt đầu trò chơi
  displayWords();
  startTimer();
}

// Hàm hiển thị các từ theo trình tự
function displayWords() {
  wordsContainer.innerHTML = words
    .map((word, index) => {
      let color = "black";
      if (index < currentWordIndex) {
        color = "green"; // Từ đã gõ đúng
      } else if (incorrectWords.has(word)) {
        color = "red"; // Từ đã gõ sai
      }
      return `<span class="word" style="color: ${color}">${word}</span>`;
    })
    .join(" ");
}

// Hàm để bắt đầu đồng hồ đếm ngược
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

// Hàm để kết thúc trò chơi và hiển thị điểm cuối cùng
function endGame() {
  inputElement.disabled = true;
  wordsContainer.innerHTML = `Game over! Your final score is ${score}.`;
}

// Hàm để đặt lại trò chơi
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

  shuffleArray(words); // Xáo trộn mảng từ
  displayWords(); // Đặt lại hiển thị
}

// Hàm để xử lý nhấn phím trên bàn phím ảo
function handleKeyboardPress(key) {
  const keyElement = document.querySelector(`#keyboard .key[data-key="${key}"]`);
  if (keyElement) {
    keyElement.classList.add("active");
    setTimeout(() => keyElement.classList.remove("active"), 100);
  }
}

// Hàm xử lý Backspace
function handleBackspace() {
  if (inputElement.value.length > 0) {
    inputElement.value = inputElement.value.slice(0, -1); // Xóa ký tự cuối cùng
  }
}

// Trình lắng nghe sự kiện cho việc gõ trong trường nhập
inputElement.addEventListener("keydown", (event) => {
  if (event.key === " ") { // Kiểm tra phím Space
    event.preventDefault(); // Ngăn chặn hành động mặc định của phím Space (cuộn trang)
    const currentInput = inputElement.value.trim();

    if (currentInput.length > 0) {
      const typedWord = currentInput;
      const expectedWord = words[currentWordIndex];

      if (typedWord === expectedWord) {
        if (!typedWords.has(typedWord)) {
          score++;
          typedWords.add(typedWord); // Theo dõi từ đã gõ đúng
        }
        currentWordIndex++; // Chuyển đến từ tiếp theo
      } else {
        if (!typedWords.has(typedWord)) {
          incorrectWords.add(typedWord); // Theo dõi từ đã gõ sai
        }
      }

      // Kiểm tra xem trò chơi có kết thúc không
      if (currentWordIndex >= words.length) {
        endGame();
        return;
      }

      displayWords(); // Cập nhật hiển thị với các từ tiếp theo
      scoreElement.textContent = `Score: ${score}`;
      inputElement.value = ""; // Xóa trường nhập
    }
  } else if (event.key === "Backspace") { // Kiểm tra phím Backspace
    event.preventDefault(); // Ngăn chặn hành động mặc định của Backspace (ví dụ: điều hướng quay lại)
    handleBackspace(); // Gọi trình xử lý Backspace
  }
});

// Trình lắng nghe sự kiện cho nút đặt lại
resetButton.addEventListener("click", resetGame);

// Trình lắng nghe sự kiện cho việc nhấn phím để xử lý bàn phím ảo
document.body.addEventListener("keydown", (event) => {
  startGame(); // Đảm bảo trò chơi bắt đầu khi bất kỳ phím nào được nhấn
  handleKeyboardPress(event.key.toLowerCase()); // Làm nổi bật phím đã nhấn
});

// Trình lắng nghe sự kiện cho việc nhả phím để xử lý bàn phím ảo
document.body.addEventListener("keyup", (event) => {
  handleKeyboardPress(event.key.toLowerCase()); // Xóa nổi bật khỏi phím đã nhấn
});
