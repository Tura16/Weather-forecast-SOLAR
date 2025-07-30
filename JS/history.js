import { getWeatherByCity } from "./weather.js";

document.addEventListener("DOMContentLoaded", () => {
    const historyToggle = document.querySelector(".history__toggle");
    const historyList = document.querySelector(".history__list");
    const saveLink = document.querySelector(".save__link");
    const cityNameElement = document.querySelector(".weather__information-city");
    const welcomeScreen = document.querySelector(".welcome__screen");
    const headerSearch = document.querySelector(".header__search");

    
    let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

    
    function updateHistoryList() {
        historyList.innerHTML = "";
        savedCities.forEach(city => {
            const li = document.createElement("li");
            li.classList.add("history__item");
            li.textContent = city;
            li.addEventListener("click", () => {
                getWeatherByCity(city);              // Использую функцию из weather.js
                historyList.classList.add("hidden");
                welcomeScreen.classList.add("hidden");
                headerSearch.classList.remove("hidden");
            });
            historyList.appendChild(li);
        });
    }

    function updateSaveIcon() {
    const cityName = cityNameElement.textContent;
    if (savedCities.includes(cityName)) {
        saveLink.classList.add("saved");
    } else {
        saveLink.classList.remove("saved");
    }
    }
    // Показываем или скрываем список сохраненных мест
    historyToggle.addEventListener("click", () => {
        historyList.classList.toggle("hidden");
    });

    saveLink.addEventListener("click", (e) => {
    e.preventDefault();
    const cityName = cityNameElement.textContent;
    

    if (!cityName) return;

    const index = savedCities.indexOf(cityName);

    if (index === -1) {
        savedCities.push(cityName);
        saveLink.classList.add("saved");
    } else {
        savedCities.splice(index, 1); // Удаляем населенный пункт
        saveLink.classList.remove("saved");
    }

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    updateHistoryList();
});

    updateHistoryList();
    updateSaveIcon();

});