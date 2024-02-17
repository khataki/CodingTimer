let activityData = {}; // Объект для хранения активности по каждой дате
let allLanguages = new Set(); // Множество для хранения всех используемых языков программирования
let totalHours = 0; // Общее количество часов за все время
let dailyHours = 0; // Общее количество часов за текущий день
let chart; // Переменная для хранения объекта Chart

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
        } else {
            alert("Не пизди!"); // Выводим сообщение об ошибке, если превышено максимальное количество часов за день (24)
        }
    } else {
        alert("Неверное количество часов! Введи число не меньше 0.");
    }
}



function updateTotalCounter() {
    document.getElementById('totalHours').innerText = totalHours;
}

function updateDailyCounter() {
    document.getElementById('dailyHours').innerText = dailyHours;
}

function updateChart() {
    const dates = Object.keys(activityData);
    const languages = Array.from(allLanguages); // Преобразуем множество всех языков в массив
    const ctx = document.getElementById('activityChart').getContext('2d');

    const datasets = [];

    for (const date of dates) {
        const activities = activityData[date];
        const data = languages.map(language => activities[language] || 0); // Создаем массив данных для каждой даты
        datasets.push({
            label: date,
            data: data,
            // backgroundColor: getRandomColor(),
            // borderColor: getRandomColor(),
            // borderWidth: 1
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Остальной JavaScript код

function updateTotalCounter() {
    document.getElementById('totalHours').innerText = totalHours;
}

function updateDailyCounter() {
    document.getElementById('dailyHours').innerText = dailyHours;
}
