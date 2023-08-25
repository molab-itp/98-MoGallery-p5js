function my_init() {
  my.query = get_url_params();
  if (my.query) {
    my.guestName = my.query.g;
    my.hostName = my.query.h;
    my.nstep = my.query.nstep || my.nstep;
    my.perFrame = my.query.perFrame || my.perFrame;
    my.byLine = my.query.byLine || my.byLine;
  }
  if (my.hostName) {
    my.draw_func = draw_host;
    my.width = displayWidth;
    my.height = displayHeight;
    my.host = 1;
  } else {
    my.draw_func = draw_guest;
    my.width = my.vwidth;
    my.height = my.vheight;
    my.host = 0;
  }
  my.layer = createGraphics(my.width, my.height);
  my.vx = 0;
  my.vy = 0;
  my.drawOps = [];
  my.colr = [0, 0, 0];
  my.uid = -1;
  if (my.scrollOnStart) {
    ui_toggle_scroll();
  }
  init_nstep();
}

function init_nstep() {
  my.stepPx = floor(my.vwidth / my.nstep);
  my.innerPx = floor(my.stepPx * (1 - my.margin));
  my.crossWt = my.stepPx - my.innerPx;
  if (!my.query || !my.query.byLine) {
    my.byLine = my.nstep > 16;
  }
}

function ui_toggle_scroll() {
  if (window.scrollY > 0) {
    // scroll down some. jump back to top
    console.log('ui_toggle_scroll jump to top');
    window.scrollBy(0, -1000);
    my.scrolling = 0;
  } else {
    // At top. initiated scrolling
    console.log('ui_toggle_scroll start');
    my.scrolling = 1;
    setTimeout(function () {
      console.log('ui_toggle_scroll stop');
      my.scrolling = 0;
    }, my.scrollStopSecs * 1000);
  }
}

function check_scroll() {
  if (my.scrolling) {
    window.scrollBy(0, 1);
  }
}

function ui_init() {
  if (!my.hostName) {
    create_myVideo();
  }

  my.verBtn = createButton('v' + my.version);
  my.verBtn.mousePressed(function () {
    ui_toggle_scroll();
  });

  my.reloadBtn = createButton('Reload');
  my.reloadBtn.mousePressed(function () {
    location.reload();
  });

  ui_nstep_selection();
  // ui_perFrame_selection();

  createElement('br');

  if (!my.hostName) {
    my.faceChk = createCheckbox('Face', my.face);
    my.faceChk.style('display:inline');
    my.faceChk.changed(faceChk_action);
  }

  my.videoChk = createCheckbox('Video', my.showVideo);
  my.videoChk.style('display:inline');
  my.videoChk.changed(function () {
    my.showVideo = this.checked();
  });

  my.runChk = createCheckbox('Run', my.run);
  my.runChk.style('display:inline');
  my.runChk.changed(function () {
    my.run = this.checked();
  });

  my.storeChk = createCheckbox('Store', my.store);
  my.storeChk.style('display:inline');
  my.storeChk.changed(function () {
    my.store = this.checked();
  });

  my.hostChk = createCheckbox('Host', my.host);
  my.hostChk.style('display:inline');
  my.hostChk.changed(function () {
    my.host = this.checked();
    init_host();
  });

  createElement('br');
}

function init_host() {
  console.log('init_host', my.host);
  my.draw_func = my.host ? draw_host : draw_guest;
}

function ui_nstep_selection() {
  createSpan(' nstep:');
  let aSel = createSelect();
  let opts = [16, 32, 64, 128, 8];
  for (let ent of opts) {
    aSel.option(ent, ent);
  }
  aSel.selected(my.nstep);
  aSel.changed(function () {
    my.nstep = parseFloat(this.value());
    console.log('ui_nstep_selection', my.nstep);
    init_nstep();
    my.layer.clear();
  });
}

function faceChk_action() {
  my.face = this.checked();
  my.facingMode = my.face ? 'user' : 'environment';
  console.log('my.facingMode', my.facingMode);
  my.video.remove();
  create_myVideo();
}

function create_myVideo() {
  let options = { video: { facingMode: my.facingMode } };
  my.video = createCapture(options);
  my.video.size(my.vwidth, my.vheight);
  my.video.hide();
}

function video_ready() {
  return my.video.loadedmetadata && my.video.width > 0 && my.video.height > 0;
}

function ui_update() {
  ui_update_xy();
  ui_update_rgb();
  ui_break('break1');
  ui_update_info();
}

function ui_update_xy() {
  let x = my.vx;
  let y = my.vy;
  let str = ` x: ${x} y: ${y}`;
  my.report = ui_span('report', str);
}

function ui_update_rgb() {
  let r = my.colr[0];
  let g = my.colr[1];
  let b = my.colr[2];

  let spanrgb = ui_span('rgb', ` &nbsp&nbsp&nbsp&nbsp`);
  let spanr = ui_span('r', ` r: ${r} &nbsp`);
  let spang = ui_span('g', ` g: ${g} &nbsp`);
  let spanb = ui_span('b', ` b: ${b} &nbsp`);

  spanrgb.elt.style.backgroundColor = `rgb(${r},${g},${b})`;
  spanr.elt.style.backgroundColor = `rgb(${r},0,0)`;
  spang.elt.style.backgroundColor = `rgb(0,${g},0)`;
  spanb.elt.style.backgroundColor = `rgb(0,0,${b})`;

  spanr.elt.style.color = 'white';
  spang.elt.style.color = 'white';
  spanb.elt.style.color = 'white';
}

function ui_update_info() {
  // ui_span('updateCount', ' uc:' + my.updateCount);
  // ui_span('nitems', ' ni:' + my.nitems);
  if (my.guestName) {
    ui_span('guestName', ' guestName:' + my.guestName);
  }
  if (my.hostName) {
    ui_span('hostName', ' hostName:' + my.hostName);
  }
  if (my.uid) {
    ui_span('uid', ' uid:' + my.uid);
  }
}

function ui_break(id) {
  let elm = select('#' + id);
  if (!elm) {
    elm = createElement('br').id(id);
  }
}

function ui_span(id, html) {
  let span = select('#' + id);
  if (document.fullscreenElement) {
    if (span) {
      span.remove();
    }
    return;
  }
  if (!span) {
    span = createSpan().id(id);
  }
  span.html(html);
  return span;
}

// return null or url query as object
// eg. query='abc=foo&def=%5Basf%5D&xyz=5'
// params={abc: "foo", def: "[asf]", xyz: "5"}
function get_url_params() {
  let query = window.location.search;
  // console.log('query |' + query + '|');
  console.log('get_url_params query.length=', query.length);
  if (query.length < 1) return null;
  let params = params_query(query);
  console.log('get_url_params params=', params);
  return params;
  // let store = params['store'];
  // console.log('nstore', store);
  // return store;
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}
