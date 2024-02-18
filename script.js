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

// Проверяем, есть ли сохраненные данные в локальном хранилище
if (localStorage.getItem('activityData')) {
    // Если данные есть, загружаем их и обновляем переменные
    activityData = JSON.parse(localStorage.getItem('activityData'));
    totalHours = parseInt(localStorage.getItem('totalHours')) || 0;
    dailyHours = parseInt(localStorage.getItem('dailyHours')) || 0;
    allLanguages = new Set(Object.keys(activityData).reduce((acc, date) => {
        return acc.concat(Object.keys(activityData[date]));
    }, []));
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
    const today = new Date().toLocaleDateString(); // Получаем текущую дату в формате "дд.мм.гггг"

    // Проверяем, что количество часов находится в допустимом диапазоне от 0 до 24
    if (!isNaN(hours) && hours >= 0) {
        // Проверяем, не превышает ли суммарное количество часов за текущий день 24
        if (dailyHours + hours <= 24) {
            if (!activityData[today]) {
                activityData[today] = {}; // Создаем объект для данной даты, если его еще нет
            }
            if (!activityData[today][language]) {
                activityData[today][language] = 0; // Инициализируем активность по данному языку программирования, если ее еще нет
            }
            activityData[today][language] += hours; // Добавляем активность
            totalHours += hours; // Увеличиваем общее количество часов за все время
            dailyHours += hours; // Увеличиваем общее количество часов за текущий день
            allLanguages.add(language); // Добавляем язык программирования в множество всех языков
            if (chart) {
                chart.destroy(); // Уничтожаем существующий график перед созданием нового
            }
            updateChart();
            updateTotalCounter();
            updateDailyCounter();
            updateLanguageTime(); // Обновляем время для каждого языка программирования
        } else {
            alert("Не пизди!"); // Выводим сообщение об ошибке, если превышено максимальное количество часов за день (24)
        }
    } else {
        alert("Неверное количество часов! Введи число не меньше 0.");
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
// Функция для обновления графика
function updateChart() {
    const dates = Object.keys(activityData);
    const languages = Array.from(allLanguages); // Преобразуем множество всех языков в массив
    const ctx = document.getElementById('activityChart').getContext('2d');

    // Добавляем проверку на существование графика
    if (chart) {
        chart.destroy(); // Уничтожаем существующий график перед созданием нового
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
    activityData = {}; // Сбрасываем данные активности
    allLanguages.clear(); // Очищаем множество языков
    totalHours = 0; // Обнуляем общее количество часов
    dailyHours = 0; // Обнуляем количество часов за текущий день
    updateChart(); // Обновляем график
    updateTotalCounter(); // Обновляем общее количество часов
    updateDailyCounter(); // Обновляем количество часов за текущий день
    updateLanguageTime(); // Обновляем время для каждого языка программирования
}

// Обработчик события для кнопки "Обнулить прогресс"
document.getElementById('resetButton').addEventListener('click', resetProgress);
