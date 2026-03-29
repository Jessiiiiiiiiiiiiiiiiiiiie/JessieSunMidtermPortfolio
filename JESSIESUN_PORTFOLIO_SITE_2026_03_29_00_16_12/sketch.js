let particles = [];
let projects = [];
let projectData = [
  { name: "BOUNCING BALLZ", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/VijLLvdwa" },
  { name: "DOG", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/_W_AawaC7" },
  { name: "THE TIDES", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/xWfwliB5c" },
  { name: "GRID DRAWING", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/5ulnLgfq4" },
  { name: "PINK BOUNCE", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/LqotYiofQ" },
  { name: "WORM TWIN", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/ec_wjW_yh" },
  { name: "GRADIENT", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/VQcywmE6c" }, 
  { name: "ROLLING STRIPES", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/QZ9SptOon" },
  { name: "DRIFTS", url: "https://editor.p5js.org/Jessiiiiiiiiie/full/ZMS1B9SHl" }
];

let song, amp;
let counter = 0;

function preload() {
  song = loadSound('SONG.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1'); 
  
  amp = new p5.Amplitude();
  
  let colors = [
    color(255, 182, 193), 
    color(255, 209, 220), 
    color(255, 105, 180), 
    color(255, 240, 245)  
  ];

  for (let i = 0; i < 200; i++) {
    particles.push(new Particle(random(colors)));
  }
 for (let data of projectData) {
    projects.push(new ProjectLink(data.name, data.url));
  }
}

function draw() {
  background(20, 0, 10, 80); 
  let level = amp.getLevel();

  for (let p of particles) {
    p.move(level);
    p.display(level);
    p.checkMouse();
  }
  for (let prj of projects) {
    prj.move(level);
    prj.display();
  }
  
  drawFloatingUI();
}

function drawFloatingUI() {
  let floatY = sin(frameCount * 0.05) * 10;
  
  // MATCHED COLOR: A clean, soft cream
  let creamPearl = color(220, 215, 210); 

  push();
  textAlign(CENTER, CENTER);
  noStroke();
  
  // Name - Now the same color as the subtext
  fill(creamPearl);
  textSize(65); 
  textStyle(BOLD);
  drawingContext.shadowBlur = 0; // Keeping it flat and clean
  text("JESSIE SUN :)", width/2, (height/2 - 20) + floatY);
  
  // Subtitle
  textSize(20);
  textStyle(NORMAL);
  fill(creamPearl, 180); // Slightly transparent so it's secondary
  text("This is my portfolio site", width/2, (height/2 + 50) + floatY);
  
  pop();
}

function mousePressed() {
  let clickedProject = false;
   for (let prj of projects) {
    if (prj.checkClick()) { // ADDED: Check if a project was clicked
      clickedProject = true;
      window.open(prj.url, "_blank"); // ADDED: Open link in new tab
      break; 
    }
  }
   if (!clickedProject) {
  if (counter % 2 == 0) { song.loop(); } 
  else { song.pause(); }
  counter++;
}
}

class ProjectLink {
   constructor(txt, url) {
    this.txt = txt;
      this.url = url;
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.velX = random(-0.8, 0.8);
    this.velY = random(-0.8, 0.8);
    this.angle = random(TWO_PI);
  }

  move(lvl) {
    let speed = map(lvl, 0, 0.5, 1, 5); 
    this.x += this.velX * speed;
    this.y += this.velY * speed;

    if (this.x < 50 || this.x > width - 50) this.velX *= -1;
    if (this.y < 50 || this.y > height - 50) this.velY *= -1;
    this.angle += 0.01;
  }

  display() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    let isHovered = d < 80; 
    
    push();
    translate(this.x, this.y);
    rotate(sin(this.angle) * 0.1);
    textAlign(CENTER, CENTER);
    
    if (isHovered) {
      textSize(32);
      fill(255);
      drawingContext.shadowBlur = 15; 
      drawingContext.shadowColor = color(255, 105, 180);
    } else {
      textSize(20);
      fill(255, 182, 193, 220);
      drawingContext.shadowBlur = 0;
    }
    text(this.txt, 0, 0);
    pop();
  }
  checkClick() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < 80;
  }
}

class Particle {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.baseSize = random(3, 7);
    this.speedX = random(-1.5, 1.5);
    this.speedY = random(-1.5, 1.5);
    this.color = c;
    this.blinkOffset = random(PI * 2);
  }

  move(lvl) {
    let speedBoost = map(lvl, 0, 0.5, 1, 10); 
    this.x += this.speedX * speedBoost;
    this.y += this.speedY * speedBoost;

    if (this.x < 0) { this.x = 0; this.speedX *= -1; }
    if (this.x > width) { this.x = width; this.speedX *= -1; }
    if (this.y < 0) { this.y = 0; this.speedY *= -1; }
    if (this.y > height) { this.y = height; this.speedY *= -1; }
  }

  display(lvl) {
    let blink = map(sin(frameCount * 0.1 + this.blinkOffset), -1, 1, 40, 255);
    let beatSize = map(lvl, 0, 0.5, this.baseSize, this.baseSize * 10);
    
    noStroke();
    drawingContext.shadowBlur = map(lvl, 0, 0.5, 5, 30);
    drawingContext.shadowColor = this.color;
    
    let c = color(red(this.color), green(this.color), blue(this.color), blink);
    fill(c);
    circle(this.x, this.y, beatSize);
    drawingContext.shadowBlur = 0;
  }

  checkMouse() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 120) {
      this.x += (this.x - mouseX) * 0.08;
      this.y += (this.y - mouseY) * 0.08;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}