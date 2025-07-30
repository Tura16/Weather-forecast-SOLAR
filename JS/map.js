let map = null;
let placemark = null;

export function initMap() {
    if (map) return;

    ymaps.ready(() => {
        map = new ymaps.Map("map", {
            center: [55.7558, 37.6173],
            zoom: 10,
            controls: ["zoomControl"]
        });
    });
}

export function updateMapWithCoords(lat, lon) {
    const coords = [lat, lon];
    console.log("Установка карты на координаты:", coords);
    map.setCenter(coords, 10);

    if (placemark) {
        map.geoObjects.remove(placemark);
    }

    placemark = new ymaps.Placemark(coords, {
        hintContent: "Ваше местоположение",
        balloonContent: "<strong>Ваше местоположение</strong>"
    }, {
        preset: "islands#blueDotIcon"
    });

    map.geoObjects.add(placemark);
}

export function updateMapWithCity(city) {
    ymaps.geocode(city, { results: 1 }).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (!firstGeoObject) {
            console.error("Город не найден:", city);
            return;
        }

        const coords = firstGeoObject.geometry.getCoordinates();
        map.setCenter(coords, 10);

        if (placemark) {
            map.geoObjects.remove(placemark);
        }

        placemark = new ymaps.Placemark(coords, {
            hintContent: city,
            balloonContent: `<strong>${city}</strong>`
        }, {
            preset: "islands#blueDotIcon"
        });

        map.geoObjects.add(placemark);
    }).catch((err) => {
        console.error("Ошибка геокодирования:", err);
    });
}

initMap();