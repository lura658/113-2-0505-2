// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize;
let previousX = null;
let previousY = null;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position and size
  circleX = width / 2;
  circleY = height / 2;
  circleSize = 100;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0, 150); // Semi-transparent green
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the position of the index finger tip (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // Check if the index finger is touching the circle
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Move the circle to follow the index finger
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // Draw the trajectory line
          stroke(255, 0, 0); // Red color for the line
          strokeWeight(2);
          if (previousX !== null && previousY !== null) {
            line(previousX, previousY, indexFinger.x, indexFinger.y);
          }
          previousX = indexFinger.x;
          previousY = indexFinger.y;
        } else {
          // Reset previous coordinates when the finger leaves the circle
          previousX = null;
          previousY = null;
        }

        // Draw the index finger tip
        if (hand.handedness == "Left") {
          fill(255, 0, 255); // Left hand color
        } else {
          fill(255, 255, 0); // Right hand color
        }
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);
      }
    }
  }
}
