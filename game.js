/* 似是而非 - Game Logic */

const TF_TIME = 10;       // seconds for True/False
const MC_TIME = 15;       // seconds for multiple choice
const QUESTIONS_PER_GAME = 10;

let state = {
  playerName: '',
  score: 0,
  currentIndex: 0,
  questions: [],
  phase: 'tf',            // 'tf' | 'mc'
  timer: null,
  timeLeft: 0,
  totalTime: 0,
  startTimestamp: 0,
  correctCount: 0,
  totalAnswered: 0,       // for accuracy (TF + MC attempts)
  answered: false
};

// DOM refs
const $ = id => document.getElementById(id);
const screens = {
  start: $('start-screen'),
  howto: $('howto-screen'),
  game: $('game-screen'),
  feedback: $('feedback-screen'),
  result: $('result-screen')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampScore(s) {
  return Math.max(0, s);
}

/* ---------- Leaderboard (localStorage) ---------- */
function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('sser_leaderboard') || '[]');
  } catch {
    return [];
  }
}

function saveScore(name, score, time, accuracy) {
  const board = loadLeaderboard();
  board.push({ name, score, time, accuracy, date: Date.now() });
  board.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.time !== b.time) return a.time - b.time;
    return b.accuracy - a.accuracy;
  });
  const top = board.slice(0, 20);
  localStorage.setItem('sser_leaderboard', JSON.stringify(top));
  return top;
}

function renderLeaderboard(list) {
  const ol = $('leaderboard-list');
  if (!list.length) {
    ol.innerHTML = '<li style="text-align:center;color:var(--muted)">還沒有紀錄，來拿第一名吧！</li>';
    return;
  }
  ol.innerHTML = list.slice(0, 10).map((e, i) =>
    `<li><span class="rank">${i + 1}</span><span class="name">${escapeHtml(e.name)}</span><span class="pts">${e.score}分</span></li>`
  ).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ---------- Timer ---------- */
function startTimer(seconds, onTimeout) {
  clearInterval(state.timer);
  state.timeLeft = seconds;
  updateTimerUI(seconds, seconds);

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerUI(state.timeLeft, seconds);
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      onTimeout();
    }
  }, 1000);
}

function updateTimerUI(left, total) {
  $('timer-text').textContent = left;
  const pct = (left / total) * 100;
  $('timer-path').style.strokeDasharray = `${pct}, 100`;
  $('timer-path').style.stroke = left <= 3 ? '#ff5252' : '#e94560';
}

function stopTimer() {
  clearInterval(state.timer);
}

/* ---------- Game flow ---------- */
function startGame() {
  const name = $('player-name').value.trim() || '玩家';
  state = {
    playerName: name,
    score: 0,
    currentIndex: 0,
    questions: shuffle(QUESTIONS).slice(0, QUESTIONS_PER_GAME),
    phase: 'tf',
    timer: null,
    timeLeft: 0,
    totalTime: 0,
    startTimestamp: Date.now(),
    correctCount: 0,
    totalAnswered: 0,
    answered: false
  };
  $('score').textContent = '0';
  $('q-total').textContent = state.questions.length;
  showScreen('game');
  loadQuestion();
}

function loadQuestion() {
  state.answered = false;
  state.phase = 'tf';
  const q = state.questions[state.currentIndex];

  $('q-num').textContent = state.currentIndex + 1;
  $('category').textContent = q.category;
  $('statement').textContent = q.statement;

  // Reset buttons
  $('tf-buttons').classList.remove('hidden');
  $('mc-buttons').classList.add('hidden');
  document.querySelectorAll('.true-btn, .false-btn').forEach(b => b.disabled = false);

  startTimer(TF_TIME, () => handleTFAnswer(null)); // timeout = wrong
}

function handleTFAnswer(choice) { // choice: true | false | null (timeout)
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.questions[state.currentIndex];
  const isCorrect = choice !== null && choice === q.isTrue;

  state.totalAnswered++;
  if (isCorrect) {
    state.score = clampScore(state.score + 10);
    state.correctCount++;
  } else {
    state.score = clampScore(state.score - 10);
  }
  $('score').textContent = state.score;

  // Disable buttons
  document.querySelectorAll('.true-btn, .false-btn').forEach(b => b.disabled = true);

  // If correctly identified a myth (False), go to advanced MC
  if (isCorrect && !q.isTrue && q.advanced) {
    setTimeout(() => startAdvanced(q), 400);
  } else {
    // Show feedback immediately
    showFeedback({
      correct: isCorrect,
      delta: isCorrect ? 10 : -10,
      title: isCorrect ? (q.isTrue ? '答對！驚人真相' : '成功識破迷思！') : (choice === null ? '時間到！' : '答錯了'),
      explanation: q.explanation,
      funFact: q.funFact
    });
  }
}

function startAdvanced(q) {
  state.phase = 'mc';
  state.answered = false;

  $('tf-buttons').classList.add('hidden');
  $('mc-buttons').classList.remove('hidden');
  $('mc-prompt').textContent = q.advanced.prompt;

  const opts = ['A', 'B', 'C', 'D'];
  opts.forEach(key => {
    const btn = document.querySelector(`.mc-opt[data-opt="${key}"]`);
    btn.textContent = `${key}. ${q.advanced.options[key]}`;
    btn.disabled = false;
    btn.onclick = () => handleMCAnswer(key);
  });

  startTimer(MC_TIME, () => handleMCAnswer(null));
}

function handleMCAnswer(choice) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.questions[state.currentIndex];
  const isCorrect = choice !== null && choice === q.advanced.correct;

  state.totalAnswered++;
  let delta = 0;
  if (isCorrect) {
    state.score = clampScore(state.score + 10);
    state.correctCount++;
    delta = 10;
  }
  $('score').textContent = state.score;

  document.querySelectorAll('.mc-opt').forEach(b => b.disabled = true);

  showFeedback({
    correct: isCorrect,
    delta: delta,
    title: isCorrect ? '進階答對！+10' : (choice === null ? '時間到，沒有加分' : '進階答錯，不扣分'),
    explanation: q.explanation,
    funFact: q.funFact,
    alreadyHadTF: true
  });
}

function showFeedback({ correct, delta, title, explanation, funFact }) {
  const icon = correct ? '✅' : (delta < 0 ? '❌' : '⏰');
  $('result-icon').textContent = icon;
  $('result-title').textContent = title;

  const deltaEl = $('score-delta');
  if (delta > 0) {
    deltaEl.textContent = `+${delta} 分`;
    deltaEl.className = 'score-delta plus';
  } else if (delta < 0) {
    deltaEl.textContent = `${delta} 分`;
    deltaEl.className = 'score-delta minus';
  } else {
    deltaEl.textContent = '+0 分';
    deltaEl.className = 'score-delta zero';
  }

  $('explanation').textContent = explanation;
  $('fun-fact').textContent = funFact;

  showScreen('feedback');
}

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex >= state.questions.length) {
    endGame();
  } else {
    showScreen('game');
    loadQuestion();
  }
}

function endGame() {
  state.totalTime = Math.round((Date.now() - state.startTimestamp) / 1000);
  const accuracy = state.totalAnswered ? Math.round((state.correctCount / state.totalAnswered) * 100) : 0;

  $('final-score').textContent = state.score;
  $('final-time').textContent = state.totalTime;
  $('final-acc').textContent = accuracy;
  $('final-correct').textContent = state.correctCount;

  const board = saveScore(state.playerName, state.score, state.totalTime, accuracy);
  renderLeaderboard(board);

  showScreen('result');
}

/* ---------- Event listeners ---------- */
$('btn-start').addEventListener('click', startGame);
$('btn-howto').addEventListener('click', () => showScreen('howto'));
$('btn-back').addEventListener('click', () => showScreen('start'));
$('btn-next').addEventListener('click', nextQuestion);
$('btn-restart').addEventListener('click', startGame);
$('btn-home').addEventListener('click', () => showScreen('start'));

document.querySelectorAll('.true-btn, .false-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans = btn.dataset.answer === 'true';
    handleTFAnswer(ans);
  });
});

// Enter key on name input
$('player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') startGame();
});

// Show last score hint
(function init() {
  const board = loadLeaderboard();
  if (board.length) {
    $('last-score').textContent = `最高紀錄：${board[0].name} ${board[0].score} 分`;
  }
})();