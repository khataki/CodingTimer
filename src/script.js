// Объект для хранения активности по каждой дате
let activityData = {};
// Множество для хранения всех используемых языков программирования
let allLanguages = new Set();
// Общее количество часов за все время
let totalHours = parseFloat(localStorage.getItem('totalHours')) || 0; // Используем parseFloat, чтобы преобразовать строку в число
// Общее количество часов за текущий день
let dailyHours = parseFloat(localStorage.getItem('dailyHours')) || 0; // Используем parseFloat, чтобы преобразовать строку в число
// Переменная для хранения объекта Chart
let chart;

let timerRunning = false;
let startTime;
let timerInterval;

const levels = [
    { name: "Никто", hoursRequired: 0 }, // Начальный уровень
    { name: "Стажер", hoursRequired: 50 },
    { name: "Джун", hoursRequired: 150 }, // 50 + 100
    { name: "Миддл", hoursRequired: 350 }, // 150 + 200
    { name: "Сеньор", hoursRequired: 850 } // 350 + 500
];

document.getElementById('toggleStatsBtn').addEventListener('click', toggleStats);
document.getElementById('toggleManualInputBtn').addEventListener('click', toggleManualInput);

// Проверяем, есть ли сохраненные данные в локальном хранилище и загружаем их
if (localStorage.getItem('activityData')) {
    activityData = JSON.parse(localStorage.getItem('activityData'));

    // Проверяем, является ли значение из локального хранилища числом, если нет - устанавливаем значение по умолчанию
    totalHours = !isNaN(parseFloat(localStorage.getItem('totalHours'))) ? parseFloat(localStorage.getItem('totalHours')) : 0;
    dailyHours = !isNaN(parseFloat(localStorage.getItem('dailyHours'))) ? parseFloat(localStorage.getItem('dailyHours')) : 0;

    // Загружаем сохраненные языки из localStorage
    const savedLanguages = JSON.parse(localStorage.getItem('allLanguages'));
    allLanguages = new Set(savedLanguages);
}

// Вызываем функции для обновления графика и счетчиков
updateChart();
updateTotalCounter();
updateDailyCounter();
updateLanguageTime();


// Функция для добавления активности
function addActivity(hours = null, minutes = null) {
    let language = document.getElementById('language').value;
    let hoursInput = hours !== null ? hours : parseFloat(document.getElementById('hours').value);
    let minutesInput = minutes !== null ? minutes : parseFloat(document.getElementById('minutes').value);

    // Преобразуем минуты в часы для универсальности
    let totalActivityHours = hoursInput + (minutesInput / 60);

    // Проверка на корректность ввода
    if (isNaN(totalActivityHours) || totalActivityHours <= 0) {
        alert("Пожалуйста, введите корректное количество часов.");
        return; // Выход из функции, если ввод некорректен
    }

    let today = new Date().toLocaleDateString();

    if (!isNaN(totalActivityHours) && totalActivityHours > 0) {
        if (!activityData[today]) {
            activityData[today] = {};
        }
        if (!activityData[today][language]) {
            activityData[today][language] = 0;
        }

        // Исправляем использование переменной на totalActivityHours
        activityData[today][language] += totalActivityHours;
        totalHours += totalActivityHours;
        dailyHours += totalActivityHours; // Это должно быть скорректировано, если вы хотите сбрасывать dailyHours каждый день
        allLanguages.add(language);

        // Сохраняем обновленные данные в локальное хранилище
        localStorage.setItem('activityData', JSON.stringify(activityData));
        localStorage.setItem('totalHours', totalHours.toString());
        localStorage.setItem('dailyHours', dailyHours.toString());
        localStorage.setItem('allLanguages', JSON.stringify(Array.from(allLanguages)));

        // Обновляем график и счетчики
        updateChart();
        updateTotalCounter();
        updateDailyCounter();
        updateLanguageTime();
        updateProgressBars()
    } else {
        alert("Пожалуйста, введите корректное количество часов.");
    }
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
}


// Функция для обновления времени для каждого языка программирования
function updateLanguageTime() {
    const languageTimeElement = document.getElementById('languageTime');
    languageTimeElement.innerHTML = ''; // Очищаем содержимое элемента

    for (const language of allLanguages) {
        const languageData = activityData[Object.keys(activityData)[0]][language]; // Получаем данные о времени для первой даты
        const hours = Math.floor(languageData);
        const minutes = Math.floor((languageData - hours) * 60);
        const languageParagraph = document.createElement('p');
        languageParagraph.textContent = `Time spent on ${language}: ${hours} часов ${minutes} минут`;
        languageTimeElement.appendChild(languageParagraph);
    }
}

// Функция для обновления общего количества часов с учетом минут
function updateTotalCounter() {
    const totalHoursElement = document.getElementById('totalHours');
    const formattedTotalHours = formatTimeWithMinutes(totalHours);
    totalHoursElement.innerText = formattedTotalHours;
}

// Функция для обновления количества часов за текущий день с учетом минут
function updateDailyCounter() {
    const dailyHoursElement = document.getElementById('dailyHours');
    const formattedDailyHours = formatTimeWithMinutes(dailyHours);
    dailyHoursElement.innerText = formattedDailyHours;
}

// Функция для обновления времени для каждого языка программирования с учетом минут
function updateLanguageTime() {
    const languageTimeElement = document.getElementById('languageTime');
    languageTimeElement.innerHTML = ''; // Очищаем содержимое элемента

    allLanguages.forEach(language => {
        let totalLanguageTime = 0; // Объявляем переменную здесь, чтобы она была доступна внутри цикла

        Object.keys(activityData).forEach(date => {
            if (activityData[date][language]) { // Проверяем, существуют ли данные для данного языка в эту дату
                totalLanguageTime += activityData[date][language]; // Суммируем время по всем датам
            }
        });

        const formattedTime = formatTimeWithMinutes(totalLanguageTime); // Форматируем общее время
        const languageParagraph = document.createElement('p');
        languageParagraph.textContent = `Time spent on ${language}: ${formattedTime}`;
        languageTimeElement.appendChild(languageParagraph);
        
    });
}



// Функция для форматирования времени с учетом минут
function formatTimeWithMinutes(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60); // Используем Math.round для правильного округления минут
    return `${hours} часов ${minutes} минут`;
}


// Функция для обновления графика
function updateChart() {
    const dates = Object.keys(activityData);
    const languages = Array.from(allLanguages); // Преобразуем множество всех языков в массив
    const ctx = document.getElementById('activityChart').getContext('2d');
    const chartContainer = document.getElementById('activityChartContainer'); // Убедитесь, что у контейнера графика есть id="activityChartContainer"
    
    if (Object.keys(activityData).length === 0) {
            chartContainer.style.display = 'none';
        } else {
            chartContainer.style.display = 'block';
    

    // Уничтожаем существующий график, если он есть
    if (chart) {
        chart.destroy();
    }

    const datasets = [];

    for (const date of dates) {
        const activities = activityData[date];
        const data = languages.map(language => activities[language] || 0); // Создаем массив данных для каждой даты
        datasets.push({
            label: date,
            data: data,
        });
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: languages, // Используем массив языков как метки на графике
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
}
// Функция для сброса прогресса
function resetProgress() {
    // Очищаем данные в JavaScript переменных
    activityData = {};
    allLanguages.clear();
    totalHours = 0;
    dailyHours = 0;

    // Очищаем данные в localStorage
    localStorage.removeItem('activityData');
    localStorage.removeItem('allLanguages');
    localStorage.removeItem('totalHours');
    localStorage.removeItem('dailyHours');

    // Обновляем отображение данных на странице
    updateChart();
    updateTotalCounter();
    updateDailyCounter();
    updateLanguageTime();

    // Добавляем вызов updateProgressBars для обновления шкал прогресса
    updateProgressBars();
}

function pad(number) {
    return number.toString().padStart(2, '0');
}


function toggleTimer() {
    if (!timerRunning) {
        // Запуск таймера
        startTime = Date.now();
        document.getElementById('toggleTimer').innerText = 'Stop Learning';
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
            
            document.getElementById('timer').innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }, 1000);
        timerRunning = true;
    } else {
        // Остановка таймера
        clearInterval(timerInterval);
        document.getElementById('toggleTimer').innerText = 'Start Learning';
        
        let elapsedSeconds = (Date.now() - startTime) / 1000;
        let hours = Math.floor(elapsedSeconds / 3600);
        let minutes = Math.floor((elapsedSeconds % 3600) / 60);
        
        // Обновляем поля ввода перед вызовом addActivity
        // Это нужно, если где-то еще используются значения из полей ввода
        document.getElementById('hours').value = hours;
        document.getElementById('minutes').value = minutes;
        
        // Теперь вызываем addActivity с явно переданными параметрами
        addActivity(hours, minutes);
        
        
        document.getElementById('timer').innerText = '00:00:00';
        timerRunning = false;
    }
}


function getCurrentLevel(hours) {
    let currentLevel = levels[0].name; // Начальный уровень
    for (let level of levels) {
        if (hours >= level.hoursRequired) {
            currentLevel = level.name;
        } else {
            break; // После достижения текущего уровня выходим из цикла
        }
    }
    return currentLevel;
}



function updateProgressBars() {
    const progressBarsContainer = document.getElementById('progressBarsContainer');
    progressBarsContainer.innerHTML = ''; // Очищаем текущее содержимое контейнера

    // Если нет языков программирования, выходим из функции
    if (allLanguages.size === 0) {
        return;
    }

    allLanguages.forEach(language => {
        let totalLanguageTime = 0; // Общее время на язык
        Object.keys(activityData).forEach(date => {
            if (activityData[date][language]) {
                totalLanguageTime += activityData[date][language];
            }
        });

        const currentLevel = getCurrentLevel(totalLanguageTime);
        const nextLevel = getNextLevelInfo(totalLanguageTime); // Функция для получения информации о следующем уровне
        
        // Создаем элементы для отображения шкалы прогресса
        const languageDiv = document.createElement('div');
        languageDiv.className = 'language-progress';

        const title = document.createElement('h4');
        title.textContent = `${language} - ${currentLevel}`;
        languageDiv.appendChild(title);

        const progressBar = document.createElement('progress');
        progressBar.max = nextLevel.hoursRequired;
        progressBar.value = totalLanguageTime;
        progressBar.textContent = `${totalLanguageTime} / ${nextLevel.hoursRequired} часов до ${nextLevel.name}`;
        languageDiv.appendChild(progressBar);

        progressBarsContainer.appendChild(languageDiv);
    });
}

// Дополнительная функция для получения информации о следующем уровне
function getNextLevelInfo(hours) {
    for (let i = 0; i < levels.length - 1; i++) {
        if (hours < levels[i + 1].hoursRequired) {
            return levels[i + 1];
        }
    }
    return { name: "Максимальный уровень", hoursRequired: hours }; // Возвращаем текущий уровень, если максимальный
}

function toggleStats() {
    const statsSection = document.getElementById('statsSection');
    if (statsSection.style.display === "none") {
        statsSection.style.display = "block";
        document.getElementById('toggleStatsBtn').textContent = 'Hide stats';
    } else {
        statsSection.style.display = "none";
        document.getElementById('toggleStatsBtn').textContent = 'Check stats';
    }
}

function toggleManualInput() {
    const manualInputContainer = document.getElementById('manualInputContainer');
    if (manualInputContainer.style.display === "none") {
        manualInputContainer.style.display = "block";
    } else {
        manualInputContainer.style.display = "none";
    }
}