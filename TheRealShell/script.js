let umboX, umboY;

const config = {
    initialRadius: 10,
    growthRateBase: 1.008,
    growthRateVariation: 0.0005,
    angleOffsetBase: 90,
    angleOffsetVariation: 15,
    arcApertureBase: 160,
    arcApertureVariation: 30,
    numLayers: 500,
    radiusVariationBase: 0.05,
    radiusVariationAmount: 0.02,
    shellWidthFactorBase: 0.7,
    shellWidthFactorVariation: 0.1,
    oysterColorsStart: [160, 20, 70],
    oysterColorsMid: [200, 30, 60],
    oysterColorsEnd: [240, 10, 80],
    layersPerFrameMin: 5,
    layersPerFrameMax: 15,
    numLobesOnEdgeBase: 5,
    numLobesOnEdgeVariation: 2,
    noiseMagnitudeFactorBase: 0.105,
    noiseMagnitudeFactorVariation: 0.04,
    noiseSmoothnessBase: 0.06,
    noiseSmoothnessVariation: 0.02,
    angleStep: 2,
    pauseDurationFrames: 200,
    strokeWeightMin: 0.3,
    strokeWeightMax: 2,
    alpha: 0.9
};

let currentLayer = 0;
let layersPerFrame;
let pauseCounter = 0;
let p5Colors;

function setup() {
    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.9;
    createCanvas(canvasWidth, canvasHeight);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 1);

    p5Colors = {
        start: color(...config.oysterColorsStart),
        mid: color(...config.oysterColorsMid),
        end: color(...config.oysterColorsEnd)
    };

    initializeShellParameters();
    noFill();
    background(255);
}

function initializeShellParameters() {
    umboX = width / 2;
    umboY = height * 0.15;
    layersPerFrame = int(random(config.layersPerFrameMin, config.layersPerFrameMax));

    config.growthRate = config.growthRateBase + random(-config.growthRateVariation, config.growthRateVariation);
    config.angleOffset = config.angleOffsetBase + random(-config.angleOffsetVariation, config.angleOffsetVariation);
    config.arcAperture = config.arcApertureBase + random(-config.arcApertureVariation, config.arcApertureVariation);
    config.radiusVariation = config.radiusVariationBase + random(-config.radiusVariationAmount, config.radiusVariationAmount);
    config.shellWidthFactor = config.shellWidthFactorBase + random(-config.shellWidthFactorVariation, config.shellWidthFactorVariation);
    config.numLobesOnEdge = int(config.numLobesOnEdgeBase + random(-config.numLobesOnEdgeVariation, config.numLobesOnEdgeVariation));
    config.noiseMagnitudeFactor = config.noiseMagnitudeFactorBase + random(-config.noiseMagnitudeFactorVariation, config.noiseMagnitudeFactorVariation);
    config.noiseSmoothness = config.noiseSmoothnessBase + random(-config.noiseSmoothnessVariation, config.noiseSmoothnessVariation);

    noiseSeed(millis());

    console.log("New shell parameters:", {
        growthRate: config.growthRate,
        angleOffset: config.angleOffset,
        arcAperture: config.arcAperture,
        radiusVariation: config.radiusVariation,
        shellWidthFactor: config.shellWidthFactor,
        numLobesOnEdge: config.numLobesOnEdge,
        noiseMagnitudeFactor: config.noiseMagnitudeFactor,
        noiseSmoothness: config.noiseSmoothness
    });
}

function draw() {
    if (currentLayer < config.numLayers) {
        for (let k = 0; k < layersPerFrame && currentLayer < config.numLayers; k++) {
            drawSingleLayer(currentLayer);
            currentLayer++;
        }
    } else {
        pauseCounter++;
        if (pauseCounter > config.pauseDurationFrames) {
            resetShell();
        }
    }
}

function drawSingleLayer(layerIndex) {
    let baseRadiusVariation = random(1 - config.radiusVariation, 1 + config.radiusVariation);
    let r_base = config.initialRadius * pow(config.growthRate, layerIndex) * baseRadiusVariation;

    let t_norm = layerIndex / config.numLayers;

    let interColor;
    const transitionPoint = 1 / 3;
    if (t_norm < transitionPoint) {
        let amt = map(t_norm, 0, transitionPoint, 0, 3);
        interColor = lerpColor(p5Colors.start, p5Colors.mid, amt);
    } else {
        let amt = map(t_norm, transitionPoint, 1, -2, 1);
        interColor = lerpColor(p5Colors.mid, p5Colors.end, amt);
    }

    let thickness = random(config.strokeWeightMin, config.strokeWeightMax);
    strokeWeight(thickness);
    stroke(hue(interColor), saturation(interColor), brightness(interColor), config.alpha);

    let startAngle = config.angleOffset - config.arcAperture / 2;
    let endAngle = config.angleOffset + config.arcAperture / 2;
    let currentNoiseMagnitude = r_base * config.noiseMagnitudeFactor * lerp(0.5, 1.5, t_norm);

    let points = [];

    for (let ang = startAngle; ang <= endAngle; ang += config.angleStep) {
        let ang_norm = map(ang, startAngle, endAngle, 0, 1);

        let lobeDeformation = sin(ang_norm * config.numLobesOnEdge * 180) * currentNoiseMagnitude * 0.5;
        let perlinDeformation = (noise(ang_norm * 5, layerIndex * config.noiseSmoothness) - 0.5) * currentNoiseMagnitude;

        let totalDeformation = lobeDeformation + perlinDeformation;
        let radiusWithDeformation = r_base + totalDeformation;

        let x = umboX + radiusWithDeformation * config.shellWidthFactor * cos(ang);
        let y = umboY + radiusWithDeformation * sin(ang);

        points.push(createVector(x, y));
    }

    // Draw the return arc (inner curve)
    for (let ang = endAngle; ang >= startAngle; ang -= config.angleStep) {
        let backRadius = r_base * 0.85;
        let x = umboX + backRadius * config.shellWidthFactor * cos(ang);
        let y = umboY + backRadius * sin(ang);
        points.push(createVector(x, y));
    }

    beginShape();
    for (let pt of points) {
        vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
}

function resetShell() {
    currentLayer = 0;
    pauseCounter = 0;
    background(255);
    initializeShellParameters();
    console.log("Finished drawing oyster shell. Resetting with new parameters.");
}

function windowResized() {
    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.9;
    resizeCanvas(canvasWidth, canvasHeight);
    umboX = width / 2;
    umboY = height * 0.15;
    resetShell();
}
