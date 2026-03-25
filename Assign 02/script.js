// Questions (5 randomized on load)
let questions = [
    {
        q: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        correct: 0
    },
    {
        q: "Which CSS property controls the text size?",
        options: ["font-size", "text-size", "font-style", "text-style"],
        correct: 0
    },
    {
        q: "What is the correct way to declare a JavaScript variable?",
        options: ["var x;", "variable x;", "v x;", "let x = ;"],
        correct: 0
    },
    {
        q: "Bootstrap is primarily used for?",
        options: ["Backend development", "Responsive front-end design", "Database management", "Server deployment"],
        correct: 1
    },
    {
        q: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Object"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;
let answers = []; // store user answers for PDF
let isDark = localStorage.getItem('darkMode') === 'true';

// Shuffle questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Theme
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
    document.getElementById('themeToggle').textContent = isDark ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('darkMode', isDark);
}

// Timer
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('timer').classList.remove('low-time');

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 10) document.getElementById('timer').classList.add('low-time');
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    answers.push({ q: questions[currentQuestion].q, selected: -1, correct: questions[currentQuestion].correct });
    highlightAnswers(-1);
    document.getElementById('nextBtn').disabled = false;
}

// Load Question
function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById('questionText').textContent = q.q;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'list-group-item list-group-item-action option';
        div.textContent = opt;
        div.onclick = () => selectAnswer(i);
        optionsDiv.appendChild(div);
    });

    document.getElementById('nextBtn').disabled = true;
    startTimer();
}

// Answer Selection
function selectAnswer(selectedIndex) {
    clearInterval(timerInterval);
    const q = questions[currentQuestion];
    answers.push({ q: q.q, selected: selectedIndex, correct: q.correct });

    if (selectedIndex === q.correct) score++;

    highlightAnswers(selectedIndex);
    document.getElementById('nextBtn').disabled = false;

    // Update segmented progress
    updateProgress();
}

function highlightAnswers(selected) {
    const options = document.querySelectorAll('#options .option');
    options.forEach((opt, i) => {
        opt.style.pointerEvents = 'none';
        if (i === questions[currentQuestion].correct) {
            opt.classList.add('correct');
        }
        if (i === selected && selected !== questions[currentQuestion].correct) {
            opt.classList.add('incorrect');
        }
    });
}

function updateProgress() {
    const container = document.querySelector('.progress-stacked');
    container.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const segment = document.createElement('div');
        segment.className = `progress`;
        segment.style.width = `${100 / questions.length}%`;
        const bar = document.createElement('div');
        bar.className = `progress-bar ${i < currentQuestion + 1 ? (answers[i] && answers[i].selected === answers[i].correct ? 'bg-success' : 'bg-danger') : 'bg-secondary'}`;
        segment.appendChild(bar);
        container.appendChild(segment);
    }
}

// Next Question
document.getElementById('nextBtn').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    clearInterval(timerInterval);
    const percentage = Math.round((score / questions.length) * 100);

    document.getElementById('scoreText').textContent = `${score}/${questions.length} (${percentage}%)`;
    document.getElementById('scoreDetail').innerHTML = `
        <strong>Great job!</strong><br>
        You answered ${score} questions correctly.
    `;

    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("WebQuiz - Your Results", 20, 20);

    doc.setFontSize(12);
    doc.text(`Score: ${score} / ${questions.length} (${Math.round((score / questions.length) * 100)}%)`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);

    const tableColumn = ["Question", "Your Answer", "Correct Answer", "Result"];
    const tableRows = [];

    answers.forEach((ans, i) => {
        const q = questions[i];
        const userAns = ans.selected === -1 ? "Time Out" : q.options[ans.selected];
        const correctAns = q.options[q.correct];
        const result = ans.selected === q.correct ? "Correct" : "Incorrect";

        tableRows.push([q.q, userAns, correctAns, result]);
    });

    doc.autoTable({
        startY: 55,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 123, 255] }
    });

    doc.save(`WebQuiz_Results_${new Date().toISOString().slice(0,10)}.pdf`);
}

// Restart
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    shuffle(questions);
    document.querySelector('.progress-stacked').innerHTML = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('resultModal'));
    if (modal) modal.hide();
    loadQuestion();
}

// Init
window.onload = () => {
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️ Light';
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    shuffle(questions);
    loadQuestion();
    updateProgress();
};