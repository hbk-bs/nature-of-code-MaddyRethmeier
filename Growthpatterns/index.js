// --- Umbo and Growth Parameters ---
let umboX, umboY; // Starting point (umbo)
let initialRadius = 30; // Initial size of the first growth layer
let growthRate = 1.006; // How much the radius multiplies by for each new layer (controls spacing)
let segmentAngle = 95;  // Central angle (in degrees) around which segments are drawn
let numLayers = 500;    // Total number of growth layers
let currentLayer = 0;   // Tracks how many layers have been drawn

// --- Segment Shape Parameters ---
let arcLengthDeg = 200; // Angular width of each growth segment (in degrees)
let radiusVariationFactor = 0.03; // How much radius can vary randomly (e.g., 0.05 for 5%)
let shellWidthFactor = 0.6; // Makes segments wider (if >1) or narrower (if <1) than they are "tall"
let segmentSpiralTightness = 0.005; // Controls the curvature of individual segments. 
                                 // 0 = circular arc, small positive = gentle spiral.

// --- Color Parameters ---
const oysterColorsStartHSB = [30, 20, 85]; // Hue, Saturation, Brightness for start
const oysterColorsMidHSB =   [40, 30, 80]; // Midpoint color
const oysterColorsEndHSB =   [50, 15, 90]; // End color

// --- Animation Parameters ---
let layersPerFrame; // How many new layers to add each frame (randomized)
let pointsPerSegment = 20; // Number of vertices to draw each spiral segment (smoothness)

function setup() {
    createCanvas(windowWidth, windowHeight);
    umboX = width / 3; // Position the umbo
    umboY = height / 2.5;
    angleMode(DEGREES); // Use degrees for angles in p5.js functions like arc, rotate
    noFill();           // Segments will be lines, not filled shapes
    colorMode(HSB, 360, 100, 100, 1); // HSB color mode for easier interpolation
    layersPerFrame = int(random(5, 15)); // Initial random layers per frame
    
    // console.log("Oyster Shell Simulation Started");
    // console.log(`Umbo: (${umboX.toFixed(2)}, ${umboY.toFixed(2)})`);
    // console.log(`Colors (HSB): Start=${oysterColorsStartHSB}, Mid=${oysterColorsMidHSB}, End=${oysterColorsEndHSB}`);
}

function draw() {
    background(20, 5, 95); // Light background, HSB (subtle off-white/cream)

    // Translate to umbo for all drawing operations
    push();
    translate(umboX, umboY);

    // --- Part 1: Add new layers if not complete ---
    if (currentLayer < numLayers) {
        for (let i = 0; i < layersPerFrame && currentLayer < numLayers; i++) {
            // Calculate the characteristic radius for this new layer
            let R_layer = initialRadius * pow(growthRate, currentLayer);
            
            // Determine color based on progress
            let interColor;
            if (currentLayer < numLayers / 3) {
                interColor = lerpColor(
                    color(oysterColorsStartHSB[0], oysterColorsStartHSB[1], oysterColorsStartHSB[2]),
                    color(oysterColorsMidHSB[0], oysterColorsMidHSB[1], oysterColorsMidHSB[2]),
                    currentLayer / (numLayers / 3)
                );
            } else {
                interColor = lerpColor(
                    color(oysterColorsMidHSB[0], oysterColorsMidHSB[1], oysterColorsMidHSB[2]),
                    color(oysterColorsEndHSB[0], oysterColorsEndHSB[1], oysterColorsEndHSB[2]),
                    (currentLayer - numLayers / 3) / (numLayers - numLayers / 3)
                );
            }
            
            let thickness = random(1, 2.5); // Random stroke weight for this layer

            // Draw the new spiral segment (without additional variation yet)
            drawSpiralGrowthSegment(R_layer, segmentAngle, arcLengthDeg, interColor, thickness, shellWidthFactor, segmentSpiralTightness);
            currentLayer++;
        }
    }

    // --- Part 2: Redraw all existing layers with variation ---
    // This creates the shimmering/organic effect as older layers are subtly changed each frame.
    for (let i = 0; i < currentLayer; i++) {
        let baseR_layer = initialRadius * pow(growthRate, i);
        // Apply radius variation for this redraw
        let variedRadius = baseR_layer * (1 + random(-radiusVariationFactor, radiusVariationFactor)); 
        
        let interColor; // Recalculate color
        if (i < numLayers / 3) {
            interColor = lerpColor(
                color(oysterColorsStartHSB[0], oysterColorsStartHSB[1], oysterColorsStartHSB[2]),
                color(oysterColorsMidHSB[0], oysterColorsMidHSB[1], oysterColorsMidHSB[2]),
                i / (numLayers / 3)
            );
        } else {
            interColor = lerpColor(
                color(oysterColorsMidHSB[0], oysterColorsMidHSB[1], oysterColorsMidHSB[2]),
                color(oysterColorsEndHSB[0], oysterColorsEndHSB[1], oysterColorsEndHSB[2]),
                (i - numLayers / 3) / (numLayers - numLayers / 3)
            );
        }
        
        let thickness = random(1, 2.5); // Re-randomize thickness

        drawSpiralGrowthSegment(variedRadius, segmentAngle, arcLengthDeg, interColor, thickness, shellWidthFactor, segmentSpiralTightness);
    }

    pop(); // Restore original transformation matrix

    // Stop looping when all layers are drawn
    if (currentLayer >= numLayers) {
        // console.log("All layers drawn.");
        noLoop(); 
    }
    // Update layersPerFrame for next draw cycle if still looping
    layersPerFrame = int(random(5, 15)); 
}

/**
 * Draws a single growth segment as a piece of a logarithmic spiral.
 * @param {number} R_center - The characteristic radius of this segment at its central angle.
 * @param {number} centerAngleDeg - The central angle of the segment (in degrees).
 * @param {number} segmentArcLengthDeg - The angular width of the segment (in degrees).
 * @param {p5.Color} strokeCol - The color of the segment.
 * @param {number} weight - The stroke weight of the segment.
 * @param {number} widthFactor - Factor to scale the x-dimension (width) of the segment.
 * @param {number} bSpiral - The 'b' coefficient for the logarithmic spiral r = A*e^(b*theta_relative).
 */
function drawSpiralGrowthSegment(R_center, centerAngleDeg, segmentArcLengthDeg, strokeCol, weight, widthFactor, bSpiral) {
    stroke(strokeCol);
    strokeWeight(weight);
    
    const startAngleDeg = centerAngleDeg - segmentArcLengthDeg / 2;
    const endAngleDeg = centerAngleDeg + segmentArcLengthDeg / 2;
    const centerAngleRad = radians(centerAngleDeg);

    beginShape();
    for (let i = 0; i <= pointsPerSegment; i++) {
        let t = i / pointsPerSegment; // Normalized step (0 to 1)
        let currentAngleDeg = lerp(startAngleDeg, endAngleDeg, t);
        let currentAngleRad = radians(currentAngleDeg);

        // Calculate radius 'r' for the spiral segment:
        // r = R_center * e^(b * (current_angle_rad - center_angle_rad))
        // This ensures that at currentAngleRad = centerAngleRad, r = R_center.
        let r = R_center * exp(bSpiral * (currentAngleRad - centerAngleRad));
        
        // Convert polar (r, currentAngleRad) to Cartesian (x,y)
        // Apply shellWidthFactor to the x-coordinate to create elliptical shaping
        let x = (r * cos(currentAngleRad)) * widthFactor; 
        let y = r * sin(currentAngleRad);
        
        vertex(x, y);
    }
    endShape();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Adjust umbo position on resize to keep it somewhat proportional
    umboX = width / 2; 
    umboY = height / 8.5;
    // Redraw if noLoop() was called, to adapt to new size
    if (!isLooping()) {
        currentLayer = 0; // Reset to redraw
        loop(); 
    }
}