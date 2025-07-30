const welcomeScreen = document.getElementById("welcome-screen-id");
const headerSearch = document.querySelector(".header__search");
const autocompleteList = document.getElementById("input__list-id");
const buttonSearch = document.querySelector(".input__search-wrapper .button__search");
const inputSearch = document.getElementById("welcome__input-search");

// Переключение экранов
function switchToWeatherScreen() {
    welcomeScreen.classList.add("hidden");
    headerSearch.classList.remove("hidden");
}

// Клик "Искать"
buttonSearch?.addEventListener("click", () => {
    if (buttonSearch && inputSearch.value.trim() !== "") {
        autocompleteList.classList.add("hidden");
        switchToWeatherScreen();
        import("./weather.js").then(({ getWeatherByCity }) => {
            import("./search.js").then(({ showLoader, hideLoader }) => {
                showLoader();
                const cleanCity = inputSearch.value.replace(/^(г\.?|город\s)/i, "").trim();
                console.log("Отправляем в OpenWeather:", cleanCity);
                getWeatherByCity(cleanCity).then(() => {
                    import("./map.js").then(({ updateMapWithCity }) => {
                        updateMapWithCity(cleanCity);
                    });
                }).finally(() => {
                    hideLoader();
                });
            });
        });
    }
});

// Нажатие Enter
inputSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && inputSearch.value.trim() !== "") {
        autocompleteList.classList.add("hidden");
        switchToWeatherScreen();
        import("./weather.js").then(({ getWeatherByCity }) => {
            import("./search.js").then(({ showLoader, hideLoader }) => {
                showLoader();
                const cleanCity = inputSearch.value.replace(/^(г\.?|город\s)/i, "").trim();
                console.log("Отправляем в OpenWeather:", cleanCity);
                getWeatherByCity(cleanCity).then(() => {
                    import("./map.js").then(({ updateMapWithCity }) => {
                        updateMapWithCity(cleanCity);
                    });
                }).finally(() => {
                    hideLoader();
                });
            });
        });
    }
});