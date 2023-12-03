// https://editor.p5js.org/jht9629-nyu/sketches/K_xe4i5md
// PlanetEarth

function preload() {
  my.earthImg = loadImage('assets/world-ultra.jpg');
  my.plenty = loadImage('assets/plenty-3.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  my.aRadius = floor(windowHeight * 0.38);

  const skt = (p_) => {
    p_.setup = () => {
      let w = windowWidth;
      let h = windowHeight;
      my.aCanvas = p_.createCanvas(h, h, WEBGL);
      // my.aCanvas.position(w / 2 - h / 2, 0);
      my.aCanvas.position(w - h, 0);
      p_.clear();
      p_.noStroke();
    };
    p_.draw = () => {
      p_.rotateX(my.angleX);
      p_.rotateY(my.angleY);

      my.angleX += my.angleXstep * my.angleXdir;
      my.angleY += my.angleYstep * my.angleYdir;

      p_.lights();
      p_.texture(my.earthImg);
      p_.sphere(my.aRadius, 24 * my.aDetail, 16 * my.aDetail);
    };
  };
  my.p_inst = new p5(skt);

  nextDir();
}

function draw() {
  background(0);
  // fill('red');
  // rect(0, 0, 300, 100);
  // fill('green');
  // textSize(40);
  // text('Hello', 0, 50);
  let w = my.plenty.width;
  let h = my.plenty.height;
  let wr = windowWidth;
  let hr = windowHeight;
  // image(my.plenty, 0, 0, wr, hr);
}

function mousePressed() {
  nextDir();
}

function nextDir() {
  my.dirIndex = (my.dirIndex + 1) % my.dirs.length;
  let newDirs = my.dirs[my.dirIndex];
  my.angleXdir = newDirs[0];
  my.angleYdir = newDirs[1];
}

// https://editor.p5js.org/jht9629-nyu/sketches/SJtBwJIcU
// CC 58 - Earthquake Visualization 3D

// https://github.com/dmojdehi/SwiftGlobe.git
//  demos/PlanetEarth/world-large.jpg
//  demos/PlanetEarth/world-ultra.jpg
//  demos/PlanetEarth/world.jpg
