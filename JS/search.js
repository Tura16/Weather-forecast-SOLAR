import { getWeatherByCity, getWeatherByCoords } from "./weather.js";

const API_KEY_DADATA = "3294e406f60cf9e868909527120ba9de9ada26b8";
const input = document.getElementById("welcome__input-search");
const suggestionList = document.getElementById("input__list-id");
const searchButton = document.querySelector(".button__search");
const locationButton = document.getElementById("welcome__button-location");

async function getSuggestions(query) {
    if (query.length < 3) {
        suggestionList.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${API_KEY_DADATA}`,
            },
            body: JSON.stringify({
                query: query,
                count: 5,
                locations: [{ country: "Россия" }],
                from_bound: { value: "city" },
                to_bound: { value: "settlement" },
            }),
        });

        const data = await response.json();
        showSuggestions(data.suggestions);
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

function showSuggestions(suggestions) {
    suggestionList.innerHTML = "";
    if (!suggestions || suggestions.length === 0) {
        suggestionList.classList.add("hidden");
        return;
    }

    suggestions.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.value;
        li.addEventListener("click", () => {
            input.value = item.value;
            suggestionList.classList.add("hidden");
            showLoader();
            const cleanCity = item.value
                .replace(/^(г\.?|город\s|Респ\s[^,]+,\s)/i, "")
                .trim();
            console.log("Отправляем в OpenWeather (автокомплит):", cleanCity);
            console.log("Исходные данные item.value:", item.value); 
            getWeatherByCity(cleanCity).then(() => {
                import("./map.js").then(({ updateMapWithCity }) => {
                    updateMapWithCity(cleanCity);
                });
            });
        });
        suggestionList.appendChild(li);
    });
    suggestionList.classList.remove("hidden");
}

input.addEventListener("input", () => {
    getSuggestions(input.value.trim());
});

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = input.value.trim();
        if (city) {
            showLoader();
            const cleanCity = city
                .replace(/^(г\.?|город\s|Респ\s[^,]+,\s)/i, "")
                .trim();
            console.log("Отправляем в OpenWeather (ручной ввод):", cleanCity);
            getWeatherByCity(cleanCity).then(() => {
                import("./map.js").then(({ updateMapWithCity }) => {
                    updateMapWithCity(cleanCity);
                });
            });
        }
    }
});

searchButton.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) {
        showLoader();
        const cleanCity = city
            .replace(/^(г\.?|город\s|Респ\s[^,]+,\s)/i, "")
            .trim();
        console.log("Отправляем в OpenWeather (кнопка):", cleanCity);
        getWeatherByCity(cleanCity).then(() => {
            import("./map.js").then(({ updateMapWithCity }) => {
                updateMapWithCity(cleanCity);
            });
        });
    }
});



//Геолокация
locationButton.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Координаты:", latitude, longitude);
                getWeatherByCoords(latitude, longitude).then(() => {
                    import("./map.js").then(({ updateMapWithCoords }) => {
                        updateMapWithCoords(latitude, longitude);
                    });
                });
            },
            (error) => {
                console.error("Ошибка геолокации:", error.message);
                alert("Не удалось определить местоположение");
                hideLoader();
            }
        );
    } else {
        alert("Геолокация не поддерживается вашим браузером");
        hideLoader();
    }
});

export function showLoader() {
    document.querySelector(".loader")?.classList.remove("hidden");
}

export function hideLoader() {
    document.querySelector(".loader")?.classList.add("hidden");
}