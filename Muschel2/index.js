let umboX, umboY;
        let initialRadius = 20;
        let growthRate = 1.0035;
        let angle = 120;
        let numLayers = 200;
        let currentLayer = 0;
        let layers = [];
        let arcLength = 140;
        let radiusVariation = 0.3;
        let shellWidthFactor = 0.85;
        const oysterColorsStart = [220, 30, 85];
        const oysterColorsMid = [210, 20, 75];
        const oysterColorsEnd = [200, 10, 65];
        let layersPerFrame;
        let disruptionStartLayer = 350;
        let disruptionEndLayer = 450;
        let disruptionMagnitude = 30;
        let isOval = 1;
        let shapeChangeCounter = 0;
        let isTeardrop = 0;
        let curveFactor = 0.15;
        let noiseFactor = 0.8;
        let ridgeFrequency = 0.1;
        let ridgeHeight = 2;

        function setup() {
            const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.9;
    createCanvas(canvasWidth, canvasHeight);
            umboX = width / 3;
            umboY = height / 3;
            angleMode(DEGREES);
            noFill();
            strokeWeight(0.8);
            colorMode(HSB, 360, 100, 100, 1);
            layersPerFrame = int(random(10, 15));
        }

        function draw() {
            background(240);
            if (currentLayer < numLayers) {
                for (let i = 0; i < layersPerFrame && currentLayer < numLayers; i++) {
                    let currentRadius = initialRadius * pow(growthRate, currentLayer);
                    let interColor;
                    if (currentLayer < numLayers / 3) {
                        interColor = lerpColor(color(oysterColorsStart[0], oysterColorsStart[1], oysterColorsStart[2]), color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), currentLayer / (numLayers / 3));
                    } else {
                        interColor = lerpColor(color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), color(oysterColorsEnd[0], oysterColorsEnd[1], oysterColorsEnd[2]), (currentLayer - numLayers / 3) / (numLayers - numLayers / 3));
                    }
                    let thickness = random(0.6, 1.2);
                    strokeWeight(thickness);
                    stroke(interColor, 0.5);
                    let startAngle = angle - arcLength / 2;
                    let endAngle = angle + arcLength / 2;
                    let xRadius = currentRadius * shellWidthFactor;
                    let yRadius = currentRadius;

                    for (let a = startAngle; a <= endAngle; a += 1) {
                        let currentAngle = a - angle;
                        let xOffset = cos(a) * xRadius;
                        let yOffset = sin(a) * yRadius;
                        let noiseValue = noise(currentLayer * 0.05, a * 0.02) * noiseFactor;
                        let ridgeValue = sin(a * ridgeFrequency + currentLayer * 0.1) * ridgeHeight;
                        xOffset *= (1 + curveFactor * pow(currentAngle / (arcLength / 2), 2) + noiseValue + ridgeValue);
                        yOffset *= (1 + curveFactor * pow(currentAngle / (arcLength / 2), 3) + noiseValue + ridgeValue);
                        if (umboX + xOffset > 0 && umboX + xOffset < width && umboY + yOffset > 0 && umboY + yOffset < height) {
                            point(umboX + xOffset, umboY + yOffset);
                        }
                    }
                    currentLayer++;
                }
            }

            for (let i = 0; i < currentLayer; i++) {
                let variedRadius = initialRadius * pow(growthRate, i);
                variedRadius = variedRadius * (1 + (random(-radiusVariation, radiusVariation)));
                let interColor;
                if (i < numLayers / 3) {
                    interColor = lerpColor(color(oysterColorsStart[0], oysterColorsStart[1], oysterColorsStart[2]), color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), i / (numLayers / 3));
                } else {
                    interColor = lerpColor(color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), color(oysterColorsEnd[0], oysterColorsEnd[1], oysterColorsEnd[2]), (i - numLayers / 3) / (numLayers - numLayers / 3));
                }
                let thickness = random(0.6, 1.2);
                strokeWeight(thickness);
                stroke(interColor, 0.4);
                let startAngle = angle - arcLength / 2;
                let endAngle = angle + arcLength / 2;
                let xRadius = variedRadius * shellWidthFactor;
                let yRadius = variedRadius;
                for (let a = startAngle; a <= endAngle; a += 1) {
                    let currentAngle = a - angle;
                    let xOffset = cos(a) * xRadius;
                    let yOffset = sin(a) * yRadius;
                     if (umboX + xOffset > 0 && umboX + xOffset < width && umboY + yOffset > 0 && umboY + yOffset < height) {
                         point(umboX + xOffset, umboY + yOffset);
                     }
                }
            }

            if (currentLayer >= numLayers) {
                noLoop();
            }
            layersPerFrame = int(random(10, 15));
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
            umboX = width / 3;
            umboY = height / 3;
        }