// Configuration for tree rings
const configRings = {
    numRings: 300,
    startRadius: 5,
    radiusIncrementBase: 7,
    radiusIncrementVariation: 5,
    colorStart: [30, 70, 90],   // Initial HSB
    colorEnd: [190, 70, 90],  // Initial HSB
    alpha: 0.7,
    lineWidthMin: 0.7,
    lineWidthMax: 2.5,
    resetIntervalSeconds: 3 // Time in seconds before resetting
};

let centerRingsX, centerRingsY;
let p5ColorsRings;
let lastResetTime;

function setup() {
    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.9;
    createCanvas(canvasWidth, canvasHeight);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 1);
    centerRingsX = width / 2;
    centerRingsY = height / 2;
    p5ColorsRings = {
        start: color(configRings.colorStart[0], configRings.colorStart[1], configRings.colorStart[2]),
        end: color(configRings.colorEnd[0], configRings.colorEnd[1], configRings.colorEnd[2])
    };
    noFill();
    lastResetTime = millis();
    resetRings();
}

function draw() {
    if (millis() - lastResetTime > configRings.resetIntervalSeconds * 1000) {
        resetRings();
        lastResetTime = millis();
    }
}

function drawRings() {
    background(240);
    for (let i = 0; i < configRings.numRings; i++) {
        const radius = configRings.startRadius + i * (configRings.radiusIncrementBase + random(-configRings.radiusIncrementVariation, configRings.radiusIncrementVariation));
        const t = i / (configRings.numRings - 1);
        const interColor = lerpColor(p5ColorsRings.start, p5ColorsRings.end, t);
        stroke(hue(interColor), saturation(interColor), brightness(interColor), configRings.alpha);
        const weight = map(t, 0, 1, configRings.lineWidthMin, configRings.lineWidthMax);
        strokeWeight(weight);
        ellipse(centerRingsX, centerRingsY, radius * 2.8, radius * 2.);
    }
}

function resetRings() {
    // Introduce random variations for each new set of rings
    configRings.radiusIncrementBase += random(-0.9, 0.9);
    configRings.radiusIncrementBase = Math.max(1, configRings.radiusIncrementBase);

    configRings.radiusIncrementVariation += random(-0.5, 0.7);
    configRings.radiusIncrementVariation = Math.max(0, configRings.radiusIncrementVariation);

    // Assign completely new random hues for start and end colors
    configRings.colorStart[0] = random(0, 360);
    configRings.colorEnd[0] = random(0, 360);

    // Optional: Vary saturation and brightness as well
    // configRings.colorStart[1] = random(50, 100);
    // configRings.colorEnd[1] = random(50, 100);
    // configRings.colorStart[2] = random(50, 100);
    // configRings.colorEnd[2] = random(50, 100);

    // Update p5 color objects
    p5ColorsRings.start = color(configRings.colorStart[0], configRings.colorStart[1], configRings.colorStart[2]);
    p5ColorsRings.end = color(configRings.colorEnd[0], configRings.colorEnd[1], configRings.colorEnd[2]);

    configRings.alpha = constrain(configRings.alpha + random(-0.05, 0.05), 0.1, 1);

    drawRings();
}

function windowResized() {
    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.9;
    resizeCanvas(canvasWidth, canvasHeight);
    centerRingsX = width / 2;
    centerRingsY = height / 2;
    resetRings();
}