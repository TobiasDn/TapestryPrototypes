let lines = [];
let pegs = [];
let endPoints = [];

// Define the buttons
let buttonLayout1;
let buttonLayout2;
let buttonLayout3;
let buttonLayout4;
let buttonLayout5;
let buttonLayout6;
let buttonLayout7;

let interpolationSpeed;

let testGlyph; 
let targetLine;

let pegTimer = 0;
let showInteractionMarkers = true;

var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var dt = 0;
var drawing;

function tick() {
    var now = Date.now();
    dt = (now - lastUpdate) * 0.001;
    lastUpdate = now;
}

function setup() {
  createCanvas(800, 800);
  colorMode(HSB);

  document.querySelector('canvas').style.height = `${innerHeight - 150}px`;
  document.querySelector('canvas').style.width = `${innerHeight - 150}px`;

  // Initialize the buttons
  buttonLayout1 = new ButtonLayout(50, height - 50, "Layout 1");
  buttonLayout2 = new ButtonLayout(150, height - 50, "Layout 2");
  buttonLayout3 = new ButtonLayout(250, height - 50, "Layout 3");
  buttonLayout4 = new ButtonLayout(350, height - 50, "Layout 4");
  buttonLayout5 = new ButtonLayout(450, height - 50, "Layout 5");
  buttonLayout6 = new ButtonLayout(550, height - 50, "Layout 6");
  buttonLayout7 = new ButtonLayout(650, height - 50, "Layout 7");

  testGlyph = new Glyph();
  targetLine = loadRandomLine([houseGlyph, rampGlyph, wave, other]);
  testGlyph.setFromLine(targetLine);

  // Create a slider
  slider = createSlider(0, 1, 0.25, 0.01);
  interpolationSpeed = slider.value();
  slider.position(10, 40);
  slider.style('width', '200px');

  // Create a label for the slider
  let label = createP("Interpolation speed");
  label.position(10, 10);

  // Initialize the initial layout of pegs and endpoints
  setLayout1();
}


function draw() {
  background(150);

  interpolationSpeed = slider.value();

  // Render the buttons
  buttonLayout1.render();
  buttonLayout2.render();
  buttonLayout3.render();
  buttonLayout4.render();
  buttonLayout5.render();
  buttonLayout6.render();
  buttonLayout7.render();

  for (let i = 0; i < endPoints.length; i++) {
    if (endPoints[i].isMouseOver()) {
      showInteractionMarkers = false;
    }
  }

  if (!drawing)
  {
    showInteractionMarkers = true;

    for (let i = 0; i < endPoints.length; i++) {
      if (endPoints[i].isMouseOver()) {
        showInteractionMarkers = false;
      }
    }
  }
  else
  {
        showInteractionMarkers = false;

  }

  if (targetLine)
    drawLineMiniature(targetLine, 800, 800, 200);


  for (let i = 0; i < lines.length; i++) {
    lines[i].update();
    lines[i].render();
  }

  for (let i = 0; i < pegs.length; i++) {
    pegs[i].render();
  }

  for (let i = 0; i < endPoints.length; i++) {
    endPoints[i].render();
  }

}

function mousePressed() {
  // Check if a button is clicked
  if (buttonLayout1.isClicked()) {
    setLayout1();
  } else if (buttonLayout2.isClicked()) {
    setLayout2();
  } else if (buttonLayout3.isClicked()) {
    setLayout3();
  } else if (buttonLayout4.isClicked()) {
    setLayout4();
  } else if (buttonLayout5.isClicked()) {
    setLayout5();
  } else if (buttonLayout6.isClicked()) {
    setLayout6();
  } else if (buttonLayout7.isClicked()) {
    setLayout7();
  }

  // Check if an endpoint is clicked to create a line
  for (let i = 0; i < endPoints.length; i++) {
    if (endPoints[i].isMouseOver()) {
      let line = new Line(endPoints[i].position.x, endPoints[i].position.y);
      line.endPoints.push(i);
      lines.push(line);
      drawing = true;
      return;
    }
  }
}

function loadRandomLine(lines) {
  return loadedLine = loadLineFromJSON(lines[Math.floor(Math.random() * lines.length)]);
}

// Function to draw the loaded line in miniature in the top right corner of the canvas
function drawLineMiniature(line, canvasWidth, canvasHeight, miniatureSize) {
  const startX = canvasWidth - miniatureSize - 10;
  const startY = 10;

  push();
  translate(startX, startY);
  const scaleFactor = miniatureSize / canvasWidth;
  scale(scaleFactor);
  line.renderBasePoints();
  for (let i = 0; i < pegs.length; i++) {
    pegs[i].render();
  }

  for (let i = 0; i < endPoints.length; i++) {
    endPoints[i].render();
  }
  pop();
}

function mouseReleased() {

  let line = lines[lines.length - 1]; 

  for (let i = 0; i < lines.length; i++) {
    lines[i].active = false;
  }

  let lineWasValid = false;

  drawing = false;

  for (let i = 0; i < endPoints.length; i++) {
    if (endPoints[i].isMouseOver()) {
      lineWasValid = true;
      line.endPoints.push(i);

      if (testGlyph.compareSymbol(line))
      {
        oldline = targetLine;

        while (oldline == targetLine)
        {
        targetLine = loadRandomLine([houseGlyph, rampGlyph, wave, other]);
        }
        testGlyph.setFromLine(targetLine);

      }

      //saveLineToFile(line);

      lines[lines.length - 1].lastPointToPosition(
        endPoints[i].position.x,
        endPoints[i].position.y
      );
    }
  }

  if (!lineWasValid && lines.length > 0) {
    lines.pop();
  }

  for (let i = 0; i < pegs.length; i++) {
    pegs[i].pegCollisionSize = 30;
  }
}

class Peg {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.pegSize = 30;
    this.pegCollisionSize = 30;
    this.fill = 255;
    
  }

  render() {
    stroke(0);
    strokeWeight(5);

    fill(this.fill, this.fill, this.fill);
    circle(this.position.x, this.position.y, this.pegSize);

  }

  isLineColliding(x, y, x1, y1) {
    if (dist(mouseX, mouseY, this.position.x, this.position.y) < (this.pegSize / 2)) {
      return false;
    }

    let colliding = isLineCollidingWithCircle(
      x,
      y,
      x1,
      y1,
      this.position.x,
      this.position.y,
      this.pegSize / 2
    );

    if (colliding) {
      return true;
    }

    return false;
  }

  getClosestPoint(x, y, x1, y1) {
    let closestPoint = getClosestPointOnLine(
      x,
      y,
      x1,
      y1,
      this.position.x,
      this.position.y
    );

    let direction = closestPoint.sub(this.position);
    direction.normalize();
    let pos = this.position.copy();

    let point = pos.add(direction.mult(0.2 + (this.pegSize / 2)));
    point = createVector(point.x, point.y);

    return point;


  }
}

class EndPoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.pegSize = 20;
    this.pegCollisionSize = 30;
    this.interactionMarkerSize = 70;
    this.interactionMarkerGrowSpeed = 50;
    this.animationTimer = 0;

  }

  render() {
    strokeWeight(5);
    this.animationTimer += dt;

    let animationProgression = ((this.animationTimer * this.interactionMarkerGrowSpeed) % this.interactionMarkerSize) / this.interactionMarkerSize;
    let currentMarkerSize = this.interactionMarkerSize * animationProgression;


    if (showInteractionMarkers || this.isMouseOver())
    {
    noFill();
    stroke(0,0,0, 0.5 - (animationProgression * 0.5));
    circle(this.position.x, this.position.y, currentMarkerSize);
    }

    fill(200, 100, 100);
    stroke(0);


    if (this.isMouseOver()) {
      circle(this.position.x, this.position.y, this.pegSize * 2);
      
    } else {
      circle(this.position.x, this.position.y, this.pegSize);
      
    }
  }

  isMouseOver() {
    return dist(mouseX, mouseY, this.position.x, this.position.y) < this.pegCollisionSize;
  }
}

class Glyph
{
  constructor() {
    this.endPoints = [3, 4]; 
    this.pegs = [{peg: 3, direction: true}, {peg: 0, direction: true}];
  }

  setFromLine(line)
  {
    this.endPoints = line.endPoints;
    this.pegs = line.pegs;
  }

  compareSymbol(line)
  {
    print("Checking line");
    print(line.endPoints);
    print(line.pegs);

    print("Target");
    print(this.endPoints);
    print(this.pegs);

    let match = true;

    if (line.pegs.length != this.pegs.length)
    {
      print("No match!");
      return false;

    }

    //check clockwise
    if (this.endPoints[0] == line.endPoints[0])
    {
      for (let i = 0; i < this.pegs.length; i++)
      {
        if (this.pegs[i].peg != line.pegs[i].peg || this.pegs[i].direction != line.pegs[i].direction)
        {
          match = false;
          break;
        }
      }

      if (this.endPoints[1] == line.endPoints[1] && match == true)
      {
      print("Match!");

      return true
      }
    }

    match = true;

    if (this.endPoints[0] == line.endPoints[1])
    {
      for (let i = 0; i < this.pegs.length; i++)
      {
        if (this.pegs[i].peg != line.pegs[(line.pegs.length-i)-1].peg ||
        this.pegs[i].direction == line.pegs[i].direction)
        {
          match = false;
          break;
        }
      }

      if (this.endPoints[1] == line.endPoints[0] && match)
      {
      print("Match!");

      return true
      }
    }

    print("No match!");

    return false;
  }

}

// Function to save a Line object locally
async function saveLineToFile(lineObj) {

  lineObj.threadPoints = [];
  const lineData = JSON.stringify(lineObj);
  const fileHandle = await window.showSaveFilePicker();
  const writable = await fileHandle.createWritable();
  await writable.write(lineData);
  await writable.close();
  console.log('Line object saved to file.');
}

// Function to load a Line object from a local file with a specific path
function loadLineFromJSON(lineObj) {

      if (lineObj) {
        // Create a new Line object using the loaded data
        const loadedLine = new Line(lineObj.points[0].x, lineObj.points[0].y);
        loadedLine.previousMousePos = lineObj.previousMousePos;
        loadedLine.pointsToRemove = lineObj.pointsToRemove;
        loadedLine.endPoints = lineObj.endPoints;
        loadedLine.pegs = lineObj.pegs;
        loadedLine.points = lineObj.points;
        loadedLine.active = lineObj.active;
        loadedLine.lineColor = lineObj.lineColor;

        print(loadedLine);
        return loadedLine;
      }
}


class Line {

  constructor(x, y) {
    this.threadPoints = []; // Array to store thread points
    this.previousMousePos = createVector(mouseX, mouseY);
    this.pointsToRemove = [];

    this.endPoints = [];

    this.pegs = [];

    this.points = [];
    this.points.push(createVector(x, y));
    this.points.push(createVector(x, y));
    this.threadPoints.push(new ThreadPoint(mouseX, mouseY, this, 0));
    this.threadPoints.push(new ThreadPoint(mouseX, mouseY, this, 2000));


    this.active = true;
    this.lineColor = color(random(255), 255, 255);
  }

  lastPointToPosition(x, y) {
    this.points[this.points.length - 1] = createVector(x, y);
  }

  

  addPeg(peg, direction, pointIndex)
  {
      if (this.pegs.length < 1 || peg !== this.pegs[this.pegs.length-1].peg)
      {
        this.pegs.push({peg: peg, direction: direction, pointIndex});
        print(this.pegs);

      }
  }
  
  removePegPoint(pointIndex)
  {
    return;
      let index = -1;

      for (let i = 0; i < this.pegs.length; i++)
      {
          if (this.pegs[i].pointIndex == pointIndex)
          {
            index = i;
            break;
          }
      }

      this.pegs.splice(index, 1);

  }

  update()
  {
    if (this.active) {
      this.points[this.points.length - 1] = createVector(mouseX, mouseY);

      let pointA = this.points[this.points.length - 2];
      let pointB = this.points[this.points.length - 1];

      let collisions = []; // List to store all the collisions

      for (let i = 0; i < pegs.length; i++) {
        let peg = pegs[i];
        if (peg.isLineColliding(pointA.x, pointA.y, pointB.x, pointB.y)) {
          let closestPoint = peg.getClosestPoint(pointA.x, pointA.y, pointB.x, pointB.y);

          let clockWise = determineWindingDirection([pointA, closestPoint, pointB], peg.position);

          collisions.push({
            peg: peg,
            pegIndex: i,
            distance: dist(pointA.x, pointA.y, closestPoint.x, closestPoint.y),
            direction: clockWise
          });
        }
      }

      // Sort collisions by distance from pointA
      collisions.sort((a, b) => a.distance - b.distance);

      for (let collision of collisions) {
        let peg = collision.peg;
        print(collision);
        this.addPeg(collision.pegIndex, collision.direction, this.points.length - 1);
        let closestPoint = peg.getClosestPoint(pointA.x, pointA.y, pointB.x, pointB.y);
        this.points[this.points.length - 1] = createVector(closestPoint.x, closestPoint.y);
        this.points.push(createVector(mouseX, mouseY));
      }

      if (!collisions.length && this.points.length > 2) {
        pointA = this.points[this.points.length - 3];

        for (let i = 0; i < pegs.length; i++) {
          let peg = pegs[i];
          if (peg.isLineColliding(pointA.x, pointA.y, pointB.x, pointB.y)) {
            collisions.push({
              peg: peg,
              distance: 0 // Assign a default distance if collision occurred
            });
          }
        }

        if (!collisions.length) {
          this.removePegPoint(this.points.length - 2)
          this.points.splice(-2, 1);
        }
      }
    }


    // Calculate the distance between the previous and current mouse positions
    let distance = dist(this.previousMousePos.x, this.previousMousePos.y, mouseX, mouseY);

    // Add new thread point to the array if the distance is greater than or equal to 20
    if (distance >= 5) {
      let currentLength = calculateCombinedLinesLength(this.points);
      let targetPoint = getPointAtPosition(this.points, currentLength);

      if (targetPoint) {
        let tp = new ThreadPoint(targetPoint.x, targetPoint.y, this, currentLength);
        this.threadPoints.splice(this.threadPoints.length - 1, 0, tp);
        this.previousMousePos = createVector(mouseX, mouseY); // Update previous mouse position
      }
    }


    for (let i = 0; i < this.threadPoints.length; i++) {
      let threadPoint = this.threadPoints[i];

      threadPoint.updatePosition(interpolationSpeed, i); // Adjust the interpolation factor for desired speed of interpolation

      if (i < this.threadPoints.length - 1 && i > 0) {
        for (let j = i + 1; j < this.threadPoints.length; j++) {
          let nextThreadPoint = this.threadPoints[j];
          if (Math.abs(threadPoint.lenghtPosition - nextThreadPoint.lenghtPosition) < 2) {
            this.pointsToRemove.push(threadPoint);
            break; // No need to check further consecutive points
          }
        }
      }
    }
  }

  render() {
    strokeWeight(5);
    for (let i = 0; i < this.pointsToRemove.length; i++) {
      const index = this.threadPoints.indexOf(this.pointsToRemove[i]);

      if (index > -1) {
        this.threadPoints.splice(index, 1);
      }
    }

    this.pointsToRemove = [];
    stroke(this.lineColor);

    // Draw lines between thread points
    for (let i = 1; i < this.threadPoints.length; i++) {
      let previousPoint = this.threadPoints[i - 1].getPosition();
      let currentPoint = this.threadPoints[i].getPosition();
      line(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y);
    }

  }

  renderBasePoints()
  {
    stroke(0, 0, 0);
    for (let i = 1; i < this.points.length; i++) {
      let previousPoint = this.points[i - 1];
      let currentPoint = this.points[i];
      line(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y);
    }

  }

  
}


class ThreadPoint {
  constructor(x, y, line, lenghtPosition) {
    this.x = x;
    this.y = y;
    this.line = line;
    this.lenghtPosition = lenghtPosition;

  }

  getPosition() {
    return createVector(this.x, this.y);

  }

  updatePosition(interpolationFactor, index) {
    if (this.line) {

      var targetPoint;

      if (index == 0)
        targetPoint = this.line.points[0];
      else if (index == this.line.threadPoints.length - 1) {
        targetPoint = this.line.points[this.line.threadPoints.length - 1];
        interpolationFactor = 0.5;
      }
      else
        targetPoint = getPointAtPosition(this.line.points, this.lenghtPosition);

      if (!targetPoint || targetPoint === null) {
        targetPoint = this.line.points[this.line.points.length - 1];

        if (this.lenghtPosition > calculateCombinedLinesLength(this.line.points) + 5)
          this.line.pointsToRemove.push(this);


      }

      this.x = lerp(this.x, targetPoint.x, interpolationFactor);
      this.y = lerp(this.y, targetPoint.y, interpolationFactor);

    }
  }

}


class ButtonLayout {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 30;
    this.label = label;
  }

  render() {
    stroke(0)
    fill(200);
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    noStroke()

    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }

  isClicked() {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height &&
      mouseIsPressed
    );
  }
}




