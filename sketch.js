const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

let engine, world;
let balls = [];
let gravitySlider, massSlider;
let camX = 0, camY = 0;
let thrustPower = 0.05; // adjustable thrust strength

function setup() {
    createCanvas(800, 600);

    engine = Engine.create();
    world = engine.world;

    gravitySlider = select('#gravitySlider');
    massSlider = select('#massSlider');

    select('#addBall').mousePressed(addBall);

    // Ground
    let ground = Bodies.rectangle(0, 600, 4000, 50, { isStatic: true });
    World.add(world, ground);
}

function addBall() {
    let mass = parseFloat(massSlider.value());
    let ball = Bodies.circle(400 + camX, 300 + camY, 20, {
        mass: mass,
        frictionAir: 0.02
    });
    World.add(world, ball);
    balls.push(ball);
}

function draw() {
    background(0);
    Engine.update(engine);

    // Update gravity
    engine.world.gravity.y = parseFloat(gravitySlider.value());

    // Camera controls
    if (keyIsDown(65)) camX -= 5; // A = left
    if (keyIsDown(68)) camX += 5; // D = right
    if (keyIsDown(87)) camY -= 5; // W = up
    if (keyIsDown(83)) camY += 5; // S = down

    translate(-camX, -camY);

    fill(255);
    noStroke();
    for (let b of balls) {
        ellipse(b.position.x, b.position.y, 40);

        // Apply thrust with arrow keys
        let tx = 0;
        let ty = 0;
        if (keyIsDown(LEFT_ARROW)) tx -= thrustPower;
        if (keyIsDown(RIGHT_ARROW)) tx += thrustPower;
        if (keyIsDown(UP_ARROW)) ty -= thrustPower;
        if (keyIsDown(DOWN_ARROW)) ty += thrustPower;

        Body.applyForce(b, b.position, { x: tx, y: ty });

        // Draw thrust vector
        if (tx !== 0 || ty !== 0) {
            stroke(0, 255, 0);
            strokeWeight(2);
            line(b.position.x, b.position.y, b.position.x + tx * 200, b.position.y + ty * 200);
            noStroke();
        }
    }

    // Draw ground
    fill(100);
    rect(-2000, 575, 4000, 50);
}
