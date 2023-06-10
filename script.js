// globale variabelen
const SPELEN = 1;
const GAMEOVER = 2;
const UITLEG = 8;
var spelStatus = SPELEN;

var spelerX;
var spelerY;
var vijanden = [];
var kogels = [];
var score = 0;
var levens = 3;

// instellingen
var aantalVijanden = 10;
var vijandSnelheid = 2;
var kogelSnelheid = 5;
var spelerSnelheid = 5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    spelerX = width / 2;
    spelerY = height - 50;
    
    for (var i = 0; i < aantalVijanden; i++) {
        vijanden.push(createVector(random(width), random(height / 2)));
    }
}

function draw() {
    background(0);
    
    if (spelStatus === SPELEN) {
        beweegSpeler();
        beweegVijanden();
        beweegKogels();
        tekenSpeler();
        tekenVijanden();
        tekenKogels();
        controleerBotsingen();
        tekenUI();
        
        if (levens <= 0) {
            spelStatus = GAMEOVER;
        }
    } else if (spelStatus === GAMEOVER) {
        tekenGameOverScherm();
    }
}

function beweegSpeler() {
    if (keyIsDown(65) && spelerX > 0) { // 'A' toets
        spelerX -= spelerSnelheid;
    } else if (keyIsDown(68) && spelerX < width) { // 'D' toets
        spelerX += spelerSnelheid;
    } else if (keyIsDown(87) && spelerY > 0) { // 'W' toets
        spelerY -= spelerSnelheid;
    } else if (keyIsDown(83) && spelerY < height) { // 'S' toets
        spelerY += spelerSnelheid;
    }
}

function beweegVijanden() {
    for (var i = 0; i < vijanden.length; i++) {
        vijanden[i].y += vijandSnelheid;
        
        if (vijanden[i].y > height) {
            vijanden[i].y = random(-200, -100);
            vijanden[i].x = random(width);
        }
    }
}

function beweegKogels() {
    for (var i = kogels.length - 1; i >= 0; i--) {
        kogels[i].y -= kogelSnelheid;
        
        if (kogels[i].y < 0) {
            kogels.splice(i, 1);
        }
    }
}

function tekenSpeler() {
    fill(255);
    rect(spelerX - 25, spelerY - 25, 50, 50);
    fill(0);
    ellipse(spelerX, spelerY, 10, 10);
}

function tekenVijanden() {
    for (var i = 0; i < vijanden.length; i++) {
        fill(255, 0, 0);
        rect(vijanden[i].x - 25, vijanden[i].y - 25, 50, 50);
    }
}

function tekenKogels() {
    for (var i = 0; i < kogels.length; i++) {
        fill(0, 255, 0);
        rect(kogels[i].x - 5, kogels[i].y - 15, 10, 30);
    }
}

function controleerBotsingen() {
    for (var i = vijanden.length - 1; i >= 0; i--) {
        for (var j = kogels.length - 1; j >= 0; j--) {
            if (dist(vijanden[i].x, vijanden[i].y, kogels[j].x, kogels[j].y) < 25) {
                vijanden.splice(i, 1);
                kogels.splice(j, 1);
                score++;
            }
        }
        
        if (dist(vijanden[i].x, vijanden[i].y, spelerX, spelerY) < 25) {
            vijanden.splice(i, 1);
            levens--;
        }
    }
}

function tekenUI() {
    fill(255);
    textSize(24);
    text("Score: " + score, 10, 30);
    text("Levens: " + levens, 10, 60);
}

function tekenGameOverScherm() {
    background(0);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(24);
    text("Score: " + score, width / 2, height / 2 + 50);
}
