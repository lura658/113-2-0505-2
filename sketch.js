// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize;
let previousX = null;
let previousY = null;
let trajectory = []; // 儲存手指移動路徑

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
  fill(0, 255, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        let indexFinger = hand.keypoints[8];
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        if (d < circleSize / 2) {
          // 手指在圓形內 -> 移動圓形並儲存軌跡
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          trajectory.push({ x: indexFinger.x, y: indexFinger.y });

          // 畫出軌跡線條
          stroke(255, 0, 0);
          strokeWeight(2);
          noFill();
          beginShape();
          for (let pt of trajectory) {
            vertex(pt.x, pt.y);
          }
          endShape();
        } else {
          // 離開圓形 -> 清除軌跡
          trajectory = [];
        }

        // 畫出手指點
        if (hand.handedness == "Left") {
          fill(255, 0, 255);
        } else {
          fill(255, 255, 0);
        }
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);
      }
    }
  }
}
