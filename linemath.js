// Helper functions
/// Line-Circle Collision Check
// Calculate the Euclidean distance between two points
  // Line-Circle Collision Check
  function isLineCollidingWithCircle(x1, y1, x2, y2, cx, cy, radius) {
	// Get the closest point on the line to the circle center
	const closestPoint = getClosestPointOnLine(x1, y1, x2, y2, cx, cy);
  
	// Check if the closest point is within the line segment
	if (isPointOnLineSegment(x1, y1, x2, y2, closestPoint.x, closestPoint.y)) {
	  // Calculate the distance between the closest point and the circle center
	  const distance = dist(closestPoint.x, closestPoint.y, cx, cy);
  
	  // Check if the distance is less than or equal to the circle radius
	  if (distance <= radius) {
		// Line is colliding with the circle
		return true;
	  }
	}
  
	// Line is not colliding with the circle
	return false;
  }
  
  // Get the closest point on a line to another point
  function getClosestPointOnLine(x1, y1, x2, y2, cx, cy) {
	const lineLengthSquared = (x1 - x2) ** 2 + (y1 - y2) ** 2;
  
	if (lineLengthSquared === 0) {
	  return { x: x1, y: y1 };
	}
  
	const t = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / lineLengthSquared;
	const tClamped = Math.max(0, Math.min(t, 1));
  
	const closestX = x1 + tClamped * (x2 - x1);
	const closestY = y1 + tClamped * (y2 - y1);
  
	return createVector(closestX, closestY);
  }
  
  // Check if a point is on a line segment
  function isPointOnLineSegment(x1, y1, x2, y2, px, py) {
	const d1 = dist(px, py, x1, y1);
	const d2 = dist(px, py, x2, y2);
	const lineLength = dist(x1, y1, x2, y2);
	const threshold = 0.1;
  
	if (Math.abs(d1 + d2 - lineLength) < threshold) {
	  return true;
	}
  
	return false;
  }
  
  function getRelativePositionOnLine(x1, y1, x2, y2, cx, cy) {
	const closestPoint = getClosestPointOnLine(x1, y1, x2, y2, cx, cy);
	const lineLength = dist(x1, y1, x2, y2);
	const pointDistanceFromStart = dist(x1, y1, closestPoint.x, closestPoint.y);
	
	return pointDistanceFromStart / lineLength;
  }


function calculateCombinedLinesLength(points) {
	let length = 0;
	for (let i = 0; i < points.length - 1; i++) {
	  const p1 = points[i];
	  const p2 = points[i + 1];
	  length += p5.Vector.dist(p1, p2);
	}
	return length;
  }
  
  function getPointAtPosition(points, position) {
	let length = 0;
	for (let i = 0; i < points.length - 1; i++) {
	  const p1 = points[i];
	  const p2 = points[i + 1];
	  const segmentLength = p5.Vector.dist(p1, p2);
  
	  if (position >= length && position <= length + segmentLength) {
		const t = (position - length) / segmentLength;
		const point = p5.Vector.lerp(p1, p2, t);
		return point;
	  }
  
	  length += segmentLength;
	}
  
	// If position is beyond the length of combined lines, return null or handle as needed
	return null;
  }

  function determineWindingDirection(vectors, center) {
	let sum = 0;
  
	for (let i = 0; i < vectors.length; i++) {
	  let current = vectors[i];
	  let next = vectors[(i + 1) % vectors.length];
  
	  let a = current.x - center.x;
	  let b = current.y - center.y;
	  let c = next.x - center.x;
	  let d = next.y - center.y;
  
	  sum += (a * d) - (b * c);
	}
  
	if (sum > 0) {
	return true;
	} else if (sum < 0) {
	  return false;
	} else {
	 return null;
	}
  }

