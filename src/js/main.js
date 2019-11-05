// Canvas JS
(() => {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
        return
    }
    canvas.width = 600;
    canvas.height = 200;
    stage = new createjs.Stage(canvas);



    canvas.style.backgroundColor = "#87ceeb";

    class Shapes {
        constructor(x, y, stroke, strokeColor, fillColor) {
            this.x = x;
            this.y = y;
            this.stroke = stroke;
            this.strokeColor = strokeColor;
            this.fillColor = fillColor;
        }
    };

    class Circle extends Shapes {
        constructor(radius, x, y, stroke, strokeColor, fillColor, appendTo) {
            super(x, y, stroke, strokeColor, fillColor);
            this.radius = radius;
            this.appendTo = appendTo

        }

        createCircle() {
            const circleObj = new createjs.Shape();
            circleObj.graphics.setStrokeStyle(this.stroke, "round").beginStroke(`${this.strokeColor}`).beginFill(`${this.fillColor}`).drawCircle(0, 0, this.radius);
            this.appendTo.addChild(circleObj);
            circleObj.x = this.x;
            circleObj.y = this.y;
        }
    }

    class Line extends Shapes {
        constructor(x, xTo, y, yTo, stroke, strokeColor, fillColor) {
            super(x, y, stroke, strokeColor, fillColor);
            this.xTo = xTo;
            this.yTo = yTo;
        }

        createLine() {
            const sunlight = new createjs.Shape();
            sunlight.graphics.setStrokeStyle(this.stroke, "round").beginStroke(`${this.strokeColor}`).beginFill(`${this.fillColor}`);
            sunlight.graphics.moveTo(this.x, this.y);
            sunlight.graphics.lineTo(this.xTo, this.yTo);
            sunlight.graphics.endStroke();
            stage.addChild(sunlight);
        }
        get getStroke() {
            return this.stroke;
        }
        set changeStroke(n) {
            this.stroke = n;
        }
    }

    class Text extends Shapes {
        constructor(text, baseline, font, x, y, fillColor) {
            super(x, y, fillColor);
            this.text = text;
            this.baseline = baseline;
            this.font = font;
        }
        textCreate() {
            const text = new createjs.Text(`${this.text}`, `${this.font}`, `${this.fillColor}`);
            text.x = this.x;
            text.y = this.y;
            text.textBaseline = this.baseline;
            text.textAlign = "center";
            stage.addChild(text);
        }
    }

    class Cloud {
        constructor(containerX, containerY) {
            this.containerX = containerX;
            this.containerY = containerY;
        }

        createCloud() {
            const container = new createjs.Container();

            let cloudCoordinates = [
                [25, 90, 25, 3],
                [25, 60, 25, 3],
                [25, 30, 25, 3],
                [25, 40, 0, 3],
                [25, 75, 0, 3],
            ];

            let lines = new Array(cloudCoordinates);

            for (let i = 0; i < cloudCoordinates.length; ++i) {
                lines[i] = new Circle(cloudCoordinates[i][0], cloudCoordinates[i][1], cloudCoordinates[i][2], cloudCoordinates[i][3], "#202547", "#dde7ee", container);
            }
            lines.map(eachCircle => {
                eachCircle.createCircle();
            });

            const cloudCenter = new Circle(25, 55, 15, 5, "#dde7ee", "#dde7ee", container);
            cloudCenter.createCircle();

            container.x = this.containerX;
            container.y = this.containerY;
            stage.addChild(container);
        }
    }

    // x xTo y yTo
    let coordinates = [
        [95, 95, 175, 15, 15],
        [15, 175, 90, 90, 10],
        [156, 35, 39, 150, 15],
        [35, 157, 35, 148, 10]
    ];


    function makeLines(n, strokeColor, fillColor) {
        lines = new Array(n);

        for (let i = 0; i < n.length; ++i) {
            lines[i] = new Line(n[i][0], n[i][1], n[i][2], n[i][3], n[i][4], strokeColor, fillColor);
        }

        return lines.map(i => {
            i.createLine();
        });
    }

    makeLines(coordinates, "#d8b806", "#e3c832");

    createjs.Ticker.setInterval(70);
    createjs.Ticker.addEventListener("tick", handleTick);
    const mainWeatherCondition = document.getElementById("main").innerText;

    function handleTick() {

        lines.map(eachLine => {
            if (eachLine.getStroke <= 18) {
                eachLine.changeStroke = eachLine.getStroke + 0.5;


            } else if (eachLine.getStroke >= 18) {
                eachLine.changeStroke = eachLine.getStroke - 5;

            }
            eachLine.createLine();
        });

        const sunSkyBackground = new Circle(70, 95, 95, 1, "#87ceeb", "#87ceeb", stage);
        sunSkyBackground.createCircle();

        const sun = new Circle(60, 95, 95, 8, "#F38235", "#f9d71c", stage);
        sun.createCircle();

        if (mainWeatherCondition === "Clouds") {
            const cloud1 = new Cloud(2, 133);
            cloud1.createCloud();

            const cloud2 = new Cloud(100, 133);
            cloud2.createCloud();


        } else if (mainWeatherCondition === "Clear") {
            console.log("Clear");
        } else if (mainWeatherCondition === "Snow") {
            console.log("Snow");
        } else if (mainWeatherCondition === "Rain" || mainWeatherCondition === "Drizzle") {
            const cloud1 = new Cloud(2, 113);
            cloud1.createCloud();
            const cloud2 = new Cloud(100, 113);
            cloud2.createCloud();


            const rainDrop = new Line(50, 100, 100, 100, 3, "#000000", "#000000");
            rainDrop.createLine()
            console.log("Rain");
        } else if (mainWeatherCondition === "Thunderstorm") {
            console.log("Thunder");
        }

        const nameOfLocation = document.getElementById("townname").innerText;
        const temperatureResults = document.getElementById("weather").innerText;
        const descriptionResults = document.getElementById("desc").innerText;


        const locations = new Text(`${nameOfLocation}`, "alphabetic", "25px Arial", 470, 50, "#212529");
        locations.textCreate();

        const temperature = new Text(`${temperatureResults}` + "°C", "alphabetic", "25px Arial", 470, 100, "#212529");
        temperature.textCreate();

        const description = new Text(`${descriptionResults}`, "alphabetic", "25px Arial", 470, 150, "#ff7700");
        description.textCreate();

        stage.update();
        stage.removeAllChildren();
    }


})();

// CSS based Animations
(() => {

    const toAppearImage = document.querySelector(".image");
    const toAppearText = document.querySelector(".text");

    const appear = (element, classToAdd) => {

        const pos = element.getBoundingClientRect().top
        if (pos < window.innerHeight / 1.2) {
            element.classList.add(`${classToAdd}`)
        }

    };

    if (toAppearText) {
        window.addEventListener("scroll", () => {
            appear(toAppearImage, "appear");
            appear(toAppearText, "appear");
        });
    }

})();

// Maping 
(() => {

    if (document.getElementById("bodyResult")) {

        const getMap = (mapi, lat, lng) => {
            let latLoc = Number(document.getElementById(lat).innerHTML);
            let lngLoc = Number(document.getElementById(lng).innerHTML);

            const map = L.map(mapi);
            const attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: attrib }).addTo(map);
            map.setView([latLoc, lngLoc], 16);
            document.getElementById(mapi).style.height = "500px";

            const marker = L.marker([latLoc, lngLoc]).addTo(map);
            const currentLocation = L.circle([latLoc, lngLoc], { radius: 100 }).addTo(map);
            currentLocation.bindPopup("Your Locations");

            currentLocation.on("click", e => {
                alert(`Marker Placed at your Location which is Latitude ${e.latlng.lat} and Longitude ${e.latlng.lng}`);
            });
        }


        getMap("map", "lat", "lng");
        getMap("map2", "latCurrent", "lngCurrent");

    }

})();