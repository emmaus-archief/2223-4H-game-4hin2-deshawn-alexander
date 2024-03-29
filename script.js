/* Game opdracht
    Informatica - Emmauscollege Rotterdam
    Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
*/

/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */
const SPELEN = 1;
const GAMEOVER = 2;
const UITLEG = 8;
var spelStatus = UITLEG; // Beginnen met de uitleg

var spelerX;
var spelerY;
var vijanden = [];
var kogels = [];
var score = 0;
var levens = 3;

// Instellingen
var startAantalVijanden = 10;
var maxAantalVijanden = 30; // Maximale limiet voor het aantal vijanden
var vijandSnelheid = 2;
var kogelSnelheid = 5;
var spelerSnelheid = 5;
var vijandVerhogingPerScore = 2;
var vijandSnelheidVerhoging = 0.5;
var kogelSnelheidVerhoging = 0.5;

var achtergrondAfbeelding;
var spelerAfbeelding;
var vijandAfbeelding;

var knopStatus = KLAAR;
const KLAAR = 0;
const INGEDRUKT = 1;

function preload() {
  achtergrondAfbeelding = loadImage('Galaxy.jpg');
  spelerAfbeelding = loadImage('vliegtuig1.png');
  vijandAfbeelding = loadImage('pplane.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  spelerX = width / 2;
  spelerY = height - 50;

  for (var i = 0; i < startAantalVijanden; i++) {
    vijanden.push(createVector(random(width), random(height / 2)));
  }
}

function draw() {
  background(achtergrondAfbeelding);

  if (spelStatus === UITLEG) {
    tekenUitlegScherm();
  } else if (spelStatus === SPELEN) {
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
    tekenSpeelOpnieuwKnop();
  }
}

function beweegSpeler() {
  if (keyIsDown(65) && spelerX > 0) {
    spelerX -= spelerSnelheid;
  } else if (keyIsDown(68) && spelerX < width) {
    spelerX += spelerSnelheid;
  } else if (keyIsDown(87) && spelerY > 0) {
    spelerY -= spelerSnelheid;
  } else if (keyIsDown(83) && spelerY < height) {
    spelerY += spelerSnelheid;
  }
  
  if (keyIsDown(32)) {
    schietKogel();
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
  image(spelerAfbeelding, spelerX - 25, spelerY - 25, 50, 50);
}

function tekenVijanden() {
  for (var i = 0; i < vijanden.length; i++) {
    image(vijandAfbeelding, vijanden[i].x - 25, vijanden[i].y - 25, 50, 50);
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
        vijandSnelheid += vijandSnelheidVerhoging;
        kogelSnelheid += kogelSnelheidVerhoging;
      }
    }

    if (dist(vijanden[i].x, vijanden[i].y, spelerX, spelerY) < 25) {
      vijanden.splice(i, 1);
      levens--;
    }
  }

  if (score > 0 && score % vijandVerhogingPerScore === 0 && vijanden.length < maxAantalVijanden) {
    startAantalVijanden += 2; // Voeg 2 extra vijanden toe na behalen van punten
    vijanden.push(createVector(random(width), random(height / 2)));
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

function tekenUitlegScherm() {
  background(0);
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Spel Uitleg", width / 2, height / 2 - 100);
  textSize(24);
  text("Gebruik de toetsen WASD om de speler te bewegen.", width / 2, height / 2);
  text("Schiet met de spatiebalk.", width / 2, height / 2 + 50);
  text("Vernietig rode vliegtuigjes en vermijd botsingen.", width / 2, height / 2 + 100);
  text("Druk op ENTER om te starten.", width / 2, height / 2 + 200);
}

function tekenSpeelOpnieuwKnop() {
  fill(255);
  rect(width / 2 - 100, height / 2 + 150, 200, 50);
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Speel opnieuw", width / 2, height / 2 + 175);
}

function mousePressed() {
  if (spelStatus === GAMEOVER && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 150 && mouseY < height / 2 + 200) {
    spelStatus = UITLEG;
    resetSpel();
  }
}

function resetSpel() {
  score = 0;
  levens = 3;
  vijanden = [];
  kogels = [];

  for (var i = 0; i < startAantalVijanden; i++) {
    vijanden.push(createVector(random(width), random(height / 2)));
  }
}

function keyPressed() {
  if (spelStatus === UITLEG && keyCode === 13) {
    spelStatus = SPELEN;
  }
}

function schietKogel() {
  if (frameCount % 10 === 0) {
    kogels.push(createVector(spelerX, spelerY));
  }
}
