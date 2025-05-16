let umboX, umboY; // Starting point (umbo)
let initialRadius = 20;
let growthRate = 1.004;
let angle = 75;
let numLayers = 500; // Increased from 350 to 500
let currentLayer = 0;
let layers = [];
let arcLength = 140;
let radiusVariation = 0.8;
let shellWidthFactor = 0.6;
const oysterColorsStart = [200, 20, 70];
const oysterColorsMid = [210, 30, 60];
const oysterColorsEnd = [220, 10, 80];
let layersPerFrame;

function setup() {
    createCanvas(windowWidth, windowHeight);
    umboX = width / 3;
    umboY = height / 3;
    angleMode(DEGREES);
    noFill();
    strokeWeight(2);
    colorMode(HSB, 360, 100, 100, 1);
    layersPerFrame = int(random(10, 25));
}

function draw() {
    if (currentLayer < numLayers) {
        for (let i = 0; i < layersPerFrame && currentLayer < numLayers; i++) {
            let currentRadius = initialRadius * pow(growthRate, currentLayer);
            let interColor;
            if (currentLayer < numLayers / 3) {
                interColor = lerpColor(color(oysterColorsStart[0], oysterColorsStart[1], oysterColorsStart[2]), color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), currentLayer / (numLayers / 3));
            } else {
                interColor = lerpColor(color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), color(oysterColorsEnd[0], oysterColorsEnd[1], oysterColorsEnd[2]), (currentLayer - numLayers / 3) / (numLayers - numLayers / 3));
            }
            let thickness = random(1, 3);
            strokeWeight(thickness);
            stroke(interColor, 0.9);
            let startAngle = angle - arcLength / 2;
            let endAngle = angle + arcLength / 2;
            arc(umboX, umboY, currentRadius * 2 * shellWidthFactor, currentRadius * 2, startAngle, endAngle);
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
        let thickness = random(1, 3);
        strokeWeight(thickness);
        stroke(interColor, 0.9);
        let startAngle = angle - arcLength / 2;
        let endAngle = angle + arcLength / 2;
        arc(umboX, umboY, variedRadius * 2 * shellWidthFactor, variedRadius * 2, startAngle, endAngle);
    }

    if (currentLayer >= numLayers) {
        noLoop();
    }
    layersPerFrame = int(random(10, 25));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    umboX = width / 4;
    umboY = height / 3;
}