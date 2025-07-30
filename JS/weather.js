import { updateMapWithCity } from "./map.js";
const API_KEY_OPENWEATHER = "48227d58fc841e5b5004ba734aa9725a";

function transliterate(city) {
    const cleanCity = city.replace(/^(г\.?\s*)/i, "").trim();
    const cityMap = {
        "Москва": "Moscow",
        "Санкт-Петербург": "Saint Petersburg",
        "Новосибирск": "Novosibirsk",
        "Екатеринбург": "Yekaterinburg",
        "Нижний Новгород": "Nizhny Novgorod",
        "Казань": "Kazan",
        "Челябинск": "Chelyabinsk",
        "Омск": "Omsk",
        "Самара": "Samara",
        "Ростов-на-Дону": "Rostov-on-Don",
        "Уфа": "Ufa",
        "Красноярск": "Krasnoyarsk",
        "Воронеж": "Voronezh",
        "Пермь": "Perm",
        "Волгоград": "Volgograd",
        "Керчь": "Kerch",
        "Керч": "Kerch",
        "Симферополь": "Simferopol",
        "Севастополь": "Sevastopol",
        "Евпатория": "Evpatoriya",
        "Верхнесадовое": "Verhnesadovoe",
        "Феодосия": "Feodosiya",
        "Ленино": "Lenino"
    };

    if (cityMap[cleanCity]) return cityMap[cleanCity];

    const ruToEn = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya'
    };

    return cleanCity
        .split("")
        .map(char => ruToEn[char.toLowerCase()] || char)
        .join("")
        .replace(/^\w/, c => c.toUpperCase());
}

export async function getWeatherByCity(city) {
    try {
        const englishCity = transliterate(city);
        console.log("Переведенный город:", englishCity);

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(englishCity)}&appid=${API_KEY_OPENWEATHER}&units=metric&lang=ru`;
        console.log("URL запроса:", url);
        const response = await fetch(url);
        if (!response.ok) {
            console.log("Статус ошибки:", response.status);
            throw new Error("Город не найден");
        }
        const data = await response.json();
        updateWeatherData(data);
        updateMapWithCity(city); 
        document.querySelector(".welcome__screen").classList.add("hidden");
        document.querySelector(".header__search").classList.remove("hidden");
        document.querySelector(".loader")?.classList.add("hidden");
    } catch (error) {
        console.error("Ошибка OpenWeather:", error.message);
        alert("Не удалось получить данные о погоде");
        document.querySelector(".loader")?.classList.add("hidden");
    }
}

export async function getWeatherByCoords(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_OPENWEATHER}&units=metric&lang=ru`;
        console.log("URL запроса по координатам:", url);
        const response = await fetch(url);
        if (!response.ok) {
            console.log("Статус ошибки:", response.status);
            throw new Error("Не удалось получить данные по координатам");
        }
        const data = await response.json();
        console.log("Полученные данные от OpenWeather:", data);
        updateWeatherData(data);
        updateMapWithCity(data.name);
        document.querySelector(".welcome__screen").classList.add("hidden");
        document.querySelector(".header__search").classList.remove("hidden");
        document.querySelector(".loader")?.classList.add("hidden");
    } catch (error) {
        console.error("Ошибка OpenWeather по координатам:", error.message);
        alert("Не удалось получить данные о погоде");
        document.querySelector(".loader")?.classList.add("hidden");
    }
}

function updateWeatherData(data) {
    const timeElement = document.querySelector(".weather__information-time");
    const dateElement = document.querySelector(".weather__information-date");
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    dateElement.textContent = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    document.querySelector(".weather__information-city").textContent = data.name;
    document.querySelector(".temperature__title").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".temperature__desc").textContent = `Ощущается как: ${Math.round(data.main.feels_like)}°C`;
    document.querySelector(".weather__text").textContent = data.weather[0].description;
    document.querySelector(".indicator__inf.humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".indicator__inf.wind").textContent = `${data.wind.speed} м/с`;
    document.querySelector(".indicator__inf.pressure").textContent = `${Math.round(data.main.pressure * 0.750062)} мм рт. ст.`;
    document.querySelector(".time__sunrise-desc").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    document.querySelector(".time__sunset-desc").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    document.querySelector(".weather__icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}
