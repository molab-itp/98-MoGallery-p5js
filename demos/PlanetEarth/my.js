//
let dirRight = [0, 1];
let dirStop = [0, 0];
let dirLeft = [0, -1];
let dirUp = [1, 0];
let dirDown = [-1, 1];

let my = {
  //
  angleX: -0.6,
  angleXstep: 0.001,
  angleXdir: 1,

  // angleY: 2.8, // Africa
  angleY: 5.0, // North America
  angleYstep: 0.001,
  angleYdir: 0,

  aRadius: 200,
  aDetail: 4,
  dirs: [
    //
    dirRight,
    dirStop,
    dirLeft,
    dirStop,
    dirUp,
    dirStop,
    dirDown,
    dirStop,
  ],
  dirIndex: 0,
};
