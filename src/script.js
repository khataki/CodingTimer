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
// Функция для добавления активности
function addActivity() {
    let language = document.getElementById('language').value;
    // Получаем значения часов и минут из полей ввода
    let hoursInput = parseFloat(document.getElementById('hours').value) || 0; // Предполагаем, что это поле для часов
    let minutesInput = parseFloat(document.getElementById('minutes').value) || 0; // Предполагаем, что это поле для минут

    // Преобразуем минуты в десятичную долю часа и исправляем переменную на totalActivityHours для избежания путаницы
    let totalActivityHours = hoursInput + (minutesInput / 60);

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
    } else {
        alert("Пожалуйста, введите корректное количество часов.");
    }
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
