// Объект для хранения активности по каждой дате
let activityData = {};
// Множество для хранения всех используемых языков программирования
let allLanguages = new Set();
// Общее количество часов за все время
let totalHours = 0;
// Общее количество часов за текущий день
let dailyHours = 0;
// Переменная для хранения объекта Chart
let chart;

// Проверяем, есть ли сохраненные данные в локальном хранилище и загружаем их
if (localStorage.getItem('activityData')) {
    activityData = JSON.parse(localStorage.getItem('activityData'));
    totalHours = parseInt(localStorage.getItem('totalHours')) || 0;
    dailyHours = parseInt(localStorage.getItem('dailyHours')) || 0;

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
function addActivity() {
    const language = document.getElementById('language').value;
    let hours = parseInt(document.getElementById('hours').value);
    const today = new Date().toLocaleDateString();

    if (!isNaN(hours) && hours >= 0) {
        if (dailyHours + hours <= 24) {
            if (!activityData[today]) {
                activityData[today] = {};
            }
            if (!activityData[today][language]) {
                activityData[today][language] = 0;
            }
            activityData[today][language] += hours;
            totalHours += hours;
            dailyHours += hours;
            allLanguages.add(language);

            // Сохраняем обновленные данные в локальное хранилище
            localStorage.setItem('activityData', JSON.stringify(activityData));
            localStorage.setItem('totalHours', totalHours);
            localStorage.setItem('dailyHours', dailyHours);
            localStorage.setItem('allLanguages', JSON.stringify(Array.from(allLanguages)));

            // Обновляем график и счетчики
            updateChart();
            updateTotalCounter();
            updateDailyCounter();
            updateLanguageTime();
        } else {
            alert("Ой, не пизди, кодер хуев, у тебя в сутках сколько часов?");
        }
    } else {
        alert("Неверное количество часов! Введите число не меньше 0.");
    }
}

// Функция для обновления времени для каждого языка программирования
function updateLanguageTime() {
    const languageTimeElement = document.getElementById('languageTime');
    languageTimeElement.innerHTML = ''; // Очищаем содержимое элемента

    for (const language of allLanguages) {
        const languageHours = activityData[Object.keys(activityData)[0]][language] || 0; // Получаем время для первой даты
        const languageParagraph = document.createElement('p');
        languageParagraph.textContent = `Time spent on ${language}: ${languageHours} hours`;
        languageTimeElement.appendChild(languageParagraph);
    }
}

// Функция для обновления общего количества часов
function updateTotalCounter() {
    document.getElementById('totalHours').innerText = totalHours;
}

// Функция для обновления количества часов за текущий день
function updateDailyCounter() {
    document.getElementById('dailyHours').innerText = dailyHours;
}

// Функция для обновления графика
function updateChart() {
    const dates = Object.keys(activityData);
    const languages = Array.from(allLanguages); // Преобразуем множество всех языков в массив
    const ctx = document.getElementById('activityChart').getContext('2d');

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

// Функция для сброса прогресса
function resetProgress() {
    // Очищаем данные в JavaScript переменных
    activityData = {};
    allLanguages.clear();
    totalHours = 0;
    dailyHours = 0;
    // Обновляем отображение данных на странице
    updateChart();
    updateTotalCounter();
    updateDailyCounter();
    updateLanguageTime();

    // Очищаем данные в localStorage
    localStorage.removeItem('activityData');
    localStorage.removeItem('allLanguages');
    localStorage.removeItem('totalHours');
    localStorage.removeItem('dailyHours');
}
