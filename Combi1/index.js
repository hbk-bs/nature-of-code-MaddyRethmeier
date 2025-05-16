let umboX, umboY; // Starting point (umbo)
let initialRadius = 10; // Smaller initial radius for finer detail at umbo
let growthRate = 1.008; // Slightly increased growth rate for visual spread
let angleOffset = 75; // Central angle for the fan (renamed from 'angle' for clarity)
let arcAperture = 140; // Angular width of the fan
let numLayers = 500;
let currentLayer = 0;
// let layers = []; // Not strictly needed if we draw and persist

// Oyster shell appearance parameters
let radiusVariation = 0.05; // Percentage variation (0.05 = +/- 5%). Original 0.8 was very high.
let shellWidthFactor = 0.7; // How much wider vs taller the growth is (ellipse factor)
const oysterColorsStart = [200, 20, 70]; // HSB: Hue, Saturation, Brightness
const oysterColorsMid = [210, 30, 60];
const oysterColorsEnd = [220, 10, 80];

let layersPerFrame;

// Parameters for edge deformation
let numLobesOnEdge = 5; // Number of larger waves/lobes on the shell edge
let noiseMagnitudeFactor = 0.1; // How strong the Perlin noise deformation is (as fraction of radius)
let noiseSmoothness = 0.05; // How smooth/detailed the Perlin noise along the edge is

function setup() {
    createCanvas(windowWidth, windowHeight);
    umboX = width / 3;
    umboY = height / 3;
    angleMode(DEGREES); // Using degrees for angle inputs
    colorMode(HSB, 360, 100, 100, 1); // HSB mode with alpha
    
    // noiseDetail(4, 0.5); // Optional: Adjust Perlin noise characteristics

    layersPerFrame = int(random(5, 15)); // Adjusted for more detailed drawing
    // No background call in setup if we draw progressively in draw() without clearing
}

function draw() {
    // No background call here if we want layers to accumulate visually
    // If you wanted to redraw everything (e.g., if umboX/Y changed dynamically),
    // you would call background() and loop through stored layer data.

    if (currentLayer < numLayers) {
        for (let k = 0; k < layersPerFrame && currentLayer < numLayers; k++) {
            let layerIndex = currentLayer;

            // Calculate base radius with some overall variation
            let baseRadiusVariation = random(1 - radiusVariation, 1 + radiusVariation);
            let r_base = initialRadius * pow(growthRate, layerIndex) * baseRadiusVariation;
            
            let t_norm = layerIndex / numLayers; // Normalized growth progress (0 to 1)

            // Color interpolation
            let interColor;
            if (layerIndex < numLayers / 3) {
                interColor = lerpColor(color(oysterColorsStart[0], oysterColorsStart[1], oysterColorsStart[2]), 
                                      color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), 
                                      layerIndex / (numLayers / 3));
            } else {
                interColor = lerpColor(color(oysterColorsMid[0], oysterColorsMid[1], oysterColorsMid[2]), 
                                      color(oysterColorsEnd[0], oysterColorsEnd[1], oysterColorsEnd[2]), 
                                      (layerIndex - numLayers / 3) / (numLayers - numLayers / 3));
            }
            
            let thickness = random(1, 2.5);
            strokeWeight(thickness);
            stroke(hue(interColor), saturation(interColor), brightness(interColor), 0.7); // Stroke with some transparency
            fill(hue(interColor), saturation(interColor), brightness(interColor), 0.05); // Very transparent fill

            // Define the angular range for this layer's fan
            let startAngle = angleOffset - arcAperture / 2;
            let endAngle = angleOffset + arcAperture / 2;
            
            // Adjust noise magnitude based on growth (e.g., more pronounced on outer layers)
            let currentNoiseMagnitude = r_base * noiseMagnitudeFactor * lerp(0.5, 1.5, t_norm);

            beginShape();
            vertex(umboX, umboY); // Start each shape at the umbo

            let angleStep = 1; // Degrees per step for drawing the arc

            for (let ang = startAngle; ang <= endAngle; ang += angleStep) {
                // Normalized angle across the current arc (0 to 1) for consistent deformation patterns
                let ang_norm_across_arc = map(ang, startAngle, endAngle, 0, 1);

                // Deformation 1: Larger lobes/waves using a sine wave
                let lobeDeformation = sin(ang_norm_across_arc * numLobesOnEdge * 180) * currentNoiseMagnitude * 0.5; // 180 for degrees in sin for full waves
                
                // Deformation 2: Finer, random variations using Perlin noise
                // Noise input uses normalized angle and layer index to vary pattern
                let perlinDeformation = (noise(ang_norm_across_arc * 5, layerIndex * noiseSmoothness) - 0.5) * currentNoiseMagnitude;

                let totalDeformation = lobeDeformation + perlinDeformation;
                let radiusWithDeformation = r_base + totalDeformation;

                // Convert polar (angle, radius) to Cartesian, applying shellWidthFactor for elliptical shape
                let x = umboX + radiusWithDeformation * shellWidthFactor * cos(ang);
                let y = umboY + radiusWithDeformation * sin(ang);
                
                vertex(x, y);
            }
            endShape(CLOSE); // Connects the last point on the arc back to the umbo (the first vertex)

            currentLayer++;
        }
    } else {
        noLoop(); // Stop drawing when all layers are done
        console.log("Finished drawing oyster shell.");
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Recalculate umbo position if needed, or keep it proportional
    umboX = width / (frameCount > 1 ? 4 : 3); // Initial position vs. resized position
    umboY = height / 3;
    
    // If you want the shell to redraw on resize:
    // currentLayer = 0;
    // background(255); // Or your chosen background color
    // loop(); 
}