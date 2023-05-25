const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');
let map;

search.addEventListener('click', searchWeather);
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchWeather();
  }
});

function searchWeather() {
  const APIKey = 'eb85ca24862fa88710cfacfe280511e5';
  const city = input.value;

  if (city === '') {
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
      if (json.cod === '404') {
        // Если локация не найдена, отобразить сообщение об ошибке
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;
      } else {
        const latitude = json.coord.lat;
        const longitude = json.coord.lon;

        initMap(latitude, longitude, city);
      }

      error404.style.display = 'none';
      error404.classList.remove('fadeIn');

      const image = document.querySelector('.weather-box img');
      const temperature = document.querySelector('.weather-box .temperature');
      const description = document.querySelector('.weather-box .description');
      const humidity = document.querySelector('.weather-details .humidity span');
      const wind = document.querySelector('.weather-details .wind span');

      switch (json.weather[0].main) {
        case 'Clear':
          image.src = '/images/clear.png';
          break;
        case 'Rain':
          image.src = '/images/rain.png';
          break;
        case 'Snow':
          image.src = '/images/snow.png';
          break;
        case 'Clouds':
          image.src = '/images/clouds.png';
          break;
        case 'Haze':
          image.src = '/images/mist.png';
          break;
        default:
          image.src = '';
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      weatherBox.style.display = '';
      weatherDetails.style.display = '';
      weatherBox.classList.add('fadeIn');
      weatherDetails.classList.add('fadeIn');
      container.style.height = '590px';
    });
}

function initMap(latitude, longitude, city) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitude, lng: longitude },
    zoom: 12,
  });

  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    title: city,
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showMap);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showMap(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  initMap(latitude, longitude, "Your Location");
}

document.addEventListener("DOMContentLoaded", () => {
  getLocation();

  const apiUrl = 'https://api.binance.com/api/v3/ticker/price';

  const btcValue = document.querySelector('#btc-value');
  const ethValue = document.querySelector('#eth-value');
  const bnbValue = document.querySelector('#bnb-value');

  function fetchCurrencyPrice(symbol, element) {
    const url = `${apiUrl}?symbol=${symbol}USDT`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const price = parseFloat(data.price).toFixed(2);
        element.textContent = price;
      })
      .catch(error => {
        console.log(error);
        element.textContent = 'Ошибка';
      });
  }

  setInterval(() => {
    fetchCurrencyPrice('BTC', btcValue);
    fetchCurrencyPrice('ETH', ethValue);
    fetchCurrencyPrice('BNB', bnbValue);
  }, 5000); // Обновление каждые 5 секунд
});

function showTasks() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Очистить список задач

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  for (let i = 0; i < tasks.length; i++) {
    let li = document.createElement("li");
    li.textContent = tasks[i];

    let editButton = document.createElement("button");
    editButton.classList.add('buttonedit');
    editButton.textContent = "Изменить";
    editButton.onclick = (function(index) {
      return function() {
        editTask(index);
      };
    })(i);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add('buttondelet');
    deleteButton.textContent = "Удалить";
    deleteButton.onclick = (function(index) {
      return function() {
        deleteTask(index);
      };
    })(i);

    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  }
}

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let task = taskInput.value.trim();

  if (task !== "") {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    showTasks();
  }
}

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (index >= 0 && index < tasks.length) {
    let newTask = prompt("Введите новую задачу", tasks[index]);

    if (newTask !== null) {
      tasks[index] = newTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      showTasks();
    }
  }
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
  }
}

showTasks();



