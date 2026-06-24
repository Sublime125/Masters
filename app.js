// NAV
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// FADE-IN
const fiObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fi').forEach(el => fiObs.observe(el));

// GLASS TILT
document.querySelectorAll('.glass').forEach(c => {
    c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

// QUIZ
const quizData = [
    {
        q: 'Какой тип камер чаще всего используется в профессиональных системах видеонаблюдения?',
        opts: ['USB-веб-камеры', 'IP-камеры', 'Аналоговые камеры', 'Polaroid'],
        correct: 1
    },
    {
        q: 'Что такое СКУД?',
        opts: ['Система контроля качества данных', 'Система контроля и управления доступом', 'Сертификат качества деталей', 'Система командования дронами'],
        correct: 1
    },
    {
        q: 'Какой первый шаг при проектировании системы безопасности?',
        opts: ['Купить камеры', 'Нанять охранников', 'Установить сигнализацию', 'Провести анализ угроз и уязвимостей'],
        correct: 3
    },
    {
        q: 'Какой протокол используется для передачи видео по сети?',
        opts: ['RTSP / ONVIF', 'SMTP', 'FTP', 'DHCP'],
        correct: 0
    },
    {
        q: 'Какое качество важнее всего для специалиста по безопасности?',
        opts: ['Умение продавать', 'Внимание к деталям', 'Креативность', 'Физическая сила'],
        correct: 1
    },
    {
        q: 'Что делает специалист при поступлении сигнала тревоги?',
        opts: ['Ждёт утра', 'Выключает систему', 'Анализирует видео и координирует реагирование', 'Игнорирует его'],
        correct: 2
    }
];

let currentQ = 0, score = 0;

function renderQuiz() {
    const prog = document.getElementById('quizProgress');
    const qEl = document.getElementById('quizQ');
    const oEl = document.getElementById('quizOpts');
    const scoreEl = document.getElementById('quizScore');
    const nextBtn = document.getElementById('quizNext');

    if (currentQ >= quizData.length) {
        showResult();
        return;
    }

    const d = quizData[currentQ];
    prog.innerHTML = quizData.map((_, i) =>
        `<div class="quiz-bar ${i < currentQ ? 'done' : i === currentQ ? 'active' : ''}"></div>`
    ).join('');

    qEl.textContent = `${currentQ + 1}. ${d.q}`;
    scoreEl.textContent = `Счёт: ${score}/${quizData.length}`;
    nextBtn.style.display = 'none';

    const letters = ['A', 'B', 'C', 'D'];
    oEl.innerHTML = d.opts.map((opt, i) =>
        `<button class="quiz-opt" data-i="${i}">
            <span class="quiz-letter">${letters[i]}</span>
            <span>${opt}</span>
        </button>`
    ).join('');

    oEl.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.i)));
    });
}

function handleAnswer(idx) {
    const d = quizData[currentQ];
    const btns = document.querySelectorAll('.quiz-opt');

    btns.forEach((b, i) => {
        b.classList.add('disabled');
        if (i === d.correct) b.classList.add('correct');
        if (i === idx && idx !== d.correct) b.classList.add('wrong');
    });

    if (idx === d.correct) score++;

    document.getElementById('quizNext').style.display = 'inline-flex';
    document.getElementById('quizNext').onclick = () => { currentQ++; renderQuiz(); };
    document.getElementById('quizScore').textContent = `Счёт: ${score}/${quizData.length}`;
}

function showResult() {
    document.getElementById('quizCard').style.display = 'none';
    const r = document.getElementById('quizResult');
    r.style.display = 'block';

    const pct = score / quizData.length;
    let emoji, title, text;

    if (pct >= 0.8) {
        emoji = '🏆';
        title = 'Отлично! Ты настоящий кандидат!';
        text = `Ты набрал ${score} из ${quizData.length}. У тебя отличные знания и интуиция для этой профессии.`;
    } else if (pct >= 0.5) {
        emoji = '💪';
        title = 'Неплохо! Есть потенциал!';
        text = `Ты набрал ${score} из ${quizData.length}. С дополнительным обучением ты точно сможешь стать отличным специалистом.`;
    } else {
        emoji = '🌱';
        title = 'Только начинаешь — это нормально!';
        text = `Ты набрал ${score} из ${quizData.length}. Изучи основы и попробуй снова — эта профессия доступна каждому!`;
    }

    document.getElementById('resEmoji').textContent = emoji;
    document.getElementById('resTitle').textContent = title;
    document.getElementById('resText').textContent = text;
}

function resetQuiz() {
    currentQ = 0;
    score = 0;
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    renderQuiz();
}

renderQuiz();
