function setLayout1() {
	pegs = [];
	endPoints = [];
	lines = [];
  
	// Define the positions of pegs for Layout 1
	pegs.push(new Peg(400, 400));
	pegs.push(new Peg(300, 400));
	pegs.push(new Peg(500, 400));
	pegs.push(new Peg(400, 300));
	pegs.push(new Peg(400, 500));
  
	// Define the positions of endpoints for Layout 1
	let centerX = width / 2;
	let centerY = height / 2;
	let radius = 200;
	let numEndpoints = 6;
	let angleIncrement = TWO_PI / numEndpoints;
  
	for (let i = 0; i < numEndpoints; i++) {
	  let angle = i * angleIncrement;
	  let x = centerX + (radius * cos(angle));
	  let y = centerY + (radius * sin(angle));
	  endPoints.push(new EndPoint(x, y));
	}
  }

// Layout functions
function setLayout6() {
  pegs = [];
  endPoints = [];
  lines = [];

  pegs.push(new Peg(200, 200));
  pegs.push(new Peg(400, 200));
  pegs.push(new Peg(400, 400));

  pegs.push(new Peg(600, 200));

  endPoints.push(new EndPoint(400, 600));
}

function setLayout2() {
  pegs = [];
  endPoints = [];
  lines = [];


  pegs.push(new Peg(200, 300));
  pegs.push(new Peg(200, 500));
  pegs.push(new Peg(400, 200));
  pegs.push(new Peg(400, 400));
  pegs.push(new Peg(400, 600));
  pegs.push(new Peg(600, 300));
  pegs.push(new Peg(600, 500));

  endPoints.push(new EndPoint(400, 100));
  endPoints.push(new EndPoint(400, 700));
}

function setLayout3() {
	pegs = [];
	endPoints = [];
  
	// Define the positions of pegs for Layout 5
	pegs.push(new Peg(200, 300));
	pegs.push(new Peg(400, 300));
	pegs.push(new Peg(600, 300));
	pegs.push(new Peg(200, 500));
	pegs.push(new Peg(400, 500));
	pegs.push(new Peg(600, 500));
  
	// Define the positions of endpoints for Layout 5
	let numEndpoints = 6;
	let spacingX = width / (numEndpoints + 1);
	let spacingY = 100;
  
	for (let i = 0; i < numEndpoints; i++) {
	  let x = (i + 1) * spacingX;
	  let y = height - spacingY;
	  endPoints.push(new EndPoint(x, y));
	}
  }
  

  function setLayout4() {
	pegs = [];
	endPoints = [];
	lines = [];
  
	// Define the positions of pegs for Layout 3
	let centerX = width / 2;
	let centerY = height / 2;
	let radius = 200;
	let numPegs = 6;
	let angleIncrement = TWO_PI / numPegs;
  
	for (let i = 0; i < numPegs; i++) {
	  let angle = i * angleIncrement;
	  let x = centerX + radius * cos(angle);
	  let y = centerY + radius * sin(angle);
	  pegs.push(new Peg(x, y));
	}
  
	// Define the positions of endpoints for Layout 3
	let hexagonRadius = radius / 2;
	let numEndpoints = 6;
	let endpointAngleIncrement = TWO_PI / numEndpoints;
  
	for (let i = 0; i < numEndpoints; i++) {
	  let angle = i * endpointAngleIncrement;
	  let x = centerX + hexagonRadius * cos(angle);
	  let y = centerY + hexagonRadius * sin(angle);
	  endPoints.push(new EndPoint(x, y));
	}
  }
  
  function setLayout5() {
	pegs = [];
	endPoints = [];
	lines = [];
  
	// Define the positions of pegs for Layout 4
	pegs.push(new Peg(300, 400));
	pegs.push(new Peg(500, 400));
	pegs.push(new Peg(400, 300));
	pegs.push(new Peg(300, 600));
	pegs.push(new Peg(500, 600));
	pegs.push(new Peg(200, 200));
	pegs.push(new Peg(600, 200));
  
	// Define the positions of endpoints for Layout 4
	let centerX = width / 2;
	let centerY = height / 2;
	let radius = 200;
	let numEndpoints = 4;
	let angleIncrement = TWO_PI / numEndpoints;
  
	for (let i = 0; i < numEndpoints; i++) {
	  let angle = i * angleIncrement;
	  let x = centerX + radius * cos(angle);
	  let y = centerY + radius * sin(angle);
	  endPoints.push(new EndPoint(x, y));
	}
  }
  

function setLayout7() {
	pegs = [];
	endPoints = [];
  
	// Define the positions of pegs for the custom layout
	let numPegsX = 6;
	let numPegsY = 6;
	let spacingX = width / (numPegsX + 1);
	let spacingY = height / (numPegsY + 2);
  
	for (let i = 1; i <= numPegsX; i++) {
	  for (let j = 1; j <= numPegsY; j++) {
		let x = i * spacingX;
		let y = j * spacingY;
		pegs.push(new Peg(x, y));
	  }
	}
  
	// Define the position of the endpoint for the custom layout
	let endpointX = width / 2;
	let endpointY = height - spacingY;
	endPoints.push(new EndPoint(endpointX, endpointY));
  }