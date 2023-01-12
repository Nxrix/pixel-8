//Pixel8 Fantasy console
//All Rights Reserved 2023 Nxrix,Toxel

const $ = function(id) { return document.getElementById(id); }

const pixel8 = [];

//--styles--//
pixel8.style = `
@font-face {
  font-family: pixel8;
  src: url("pixel8.woff") format("woff");
}
* {
  margin: 0;
  padding: 0;
  color: white;
  font-smooth: never;
  font-smoothing: never;
  -webkit-font-smooth: never;
  -webkit-font-smoothing: never;
  font-family: pixel8;
  color: #fff;
  font-size: calc(100vw/8);
}
html {
  height: -webkit-fill-available;
  height: 100%;
}
body {
  height: calc(100%);
  min-height: 100%;
  min-height: -webkit-fill-available;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  display: none;
}
#pixel8_screen {
  width: 100vw;
  height: 100%;
}
#pixel8_canvas {
  width: 100%;
  image-rendering: pixelated;
  touch-action: none;
}
@media (orientation: landscape) {
  * {
    font-size: calc(100vh/8);
  }
  #pixel8_canvas {
    height: 100%;
    width: auto;
  }
}`;
if (document.body.getAttribute("init")=="f") {
  //pixel8.screen = $("pixel8_screen");
  pixel8.canvas = $("pixel8_canvas");
}
else {
  pixel8.styleSheet = document.createElement("style");
  pixel8.styleSheet.innerText = pixel8.style;
  document.head.appendChild(pixel8.styleSheet);
  //--main div--//
  /*pixel8.screen = document.createElement("div");
  pixel8.screen.id = "pixel8_screen";
  document.body.appendChild(pixel8.screen);*/
  //--canvas--//
  pixel8.canvas = document.createElement("canvas");
  pixel8.canvas.id = "pixel8_canvas";
  document.body.appendChild(pixel8.canvas);
}
pixel8.ctx = pixel8.canvas.getContext("2d");
pixel8.res = document.body.getAttribute("res")||128;
pixel8.canvas.width = pixel8.res;
pixel8.canvas.height = pixel8.res;

pixel8.compositionTypes = [
  'source-in',
  'source-out',
  'source-atop',
  'destination-over',
  'destination-in',
  'destination-out',
  'destination-atop',
  'lighter',
  'copy',
  'xor',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'diffrence',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity'
];

pixel8.xyznrgb = (r,g,b) => {
  return {x:r ,y:g ,z:b};
}

pixel8.palette = [];

pixel8.colors = [
  "rgb(220,221,255)",
  "rgb(255,26,94)",
  "rgb(243,104,16)",
  "rgb(249,255,137)",
  "rgb(52,255,79)",
  "rgb(34,195,236)",
  "rgb(156,97,255)",
  "rgb(255,189,166)",
  "rgb(134,134,207)",
  "rgb(203,25,79)",
  "rgb(207,55,30)",
  "rgb(255,230,65)",
  "rgb(41,209,72)",
  "rgb(34,143,236)",
  "rgb(115,43,255)",
  "rgb(255,156,138)",
  "rgb(49,51,113)",
  "rgb(139,26,68)",
  "rgb(174,18,6)",
  "rgb(255,203,0)",
  "rgb(33,141,70)",
  "rgb(0,99,202)",
  "rgb(86,48,160)",
  "rgb(255,117,187)",
  "rgb(25,26,48)",
  "rgb(77,10,55)",
  "rgb(123,9,0)",
  "rgb(255,136,13)",
  "rgb(25,97,84)",
  "rgb(24,37,175)",
  "rgb(40,24,71)",
  "rgb(184,24,140)"
];

for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 4; y++) {
    var i = y*8 + x;
    pixel8.palette[x*4+y] = pixel8.colors[i];
  }
}

if ($("sprite")!=undefined) {
  pixel8.sprite = $("sprite");
  pixel8.sprite.style.display = 'none';
}


//--Bayer Matrix Arrays--//

pixel8.bayer4 = [
  [  1,  9,  3, 11 ],
  [ 13,  5, 15,  7 ],
  [  4, 12,  2, 10 ],
  [ 16,  8, 14,  6 ]
];
  
pixel8.bayer8 = [
  [  1, 33,  9, 41,  3, 35, 11, 43 ],
  [ 49, 17, 57, 25, 51, 19, 59, 27 ],
  [ 13, 45,  5, 37, 15, 47,  7, 39 ],
  [ 61, 29, 53, 21, 63, 31, 55, 23 ],
  [  4, 36, 12, 44,  2, 34, 10, 42 ],
  [ 52, 20, 60, 28, 50, 18, 58, 26 ],
  [ 16, 48,  8, 40, 14, 46,  6, 38 ],
  [ 64, 32, 56, 24, 62, 30, 54, 22 ]
];

//--main functions--//

//font
pixel8.ctx.font = "16px pixel8";

const cls = (x) => {
  pixel8.ctx.clearRect(0,0,pixel8.canvas.width,pixel8.canvas.height);
  pixel8.canvas.style.background = x;
}

const pow = (x,y) => {
  return Math.pow(x,y);
}

const rnd = (x) => {
  return Math.random() * (x || 1);
}

const flr = (x) => {
  return Math.floor(x);
}

const deg = (x) => {
  return x * Math.PI / 180;
}

const sin = (x) => {
  return Math.sin(x);
}

const cos = (x) => {
  return Math.cos(x);
}

//--rotate x,y by z--//
const rot = (x1,y1,x,y,a) => {
  radians = (Math.PI / 180) * a;
  var c = Math.cos(radians);
  var s = Math.sin(radians);
  nx = (c * (x - x1)) + (s * (y - y1)) + x1;
  ny = (c * (y - y1)) - (s * (x - x1)) + y1;
  return [nx,ny];
}

//dist3D({x:1,y:2,z:3},{x:3,y:2,z:1});
const dist2D = (v1, v2) => {
  a = v2.x - v1.x;
  b = v2.y - v1.y;
  return Math.hypot(a,b);
}
const dist3D = (v1, v2) => {
  a = v2.x - v1.x;
  b = v2.y - v1.y;
  c = v2.z - v1.z;
  return Math.hypot(a,b,c);
}

//--rotation of two points--//
const lookAt2D = (v1,v2) => {
  return Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI;
}
const lookAt3D = (v1,v2) => {
  return Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI;
}

//--RGB to index--//
const rgb2index = (r,g,b,list) => {
  let id = 0;
  let min = Infinity;
  for (let i = 0; i < list.length; i++) {
    col = eval("pixel8.xyzn"+list[i]);
    a = (r-col.x)*(r-col.x)+(g-col.y)*(g-col.y)+(b-col.z)*(b-col.z);
    if (a < min) {
      id = i;
      min = a;
    }
  }
  return id;
}

//--RGB to color--//
const rgb2color = (r,g,b) => {
  return "rgb("+r+","+g+","+b+")";
}

//--drawing functions--//

//camera
const camera = (x,y) => {
  pixel8.camx = x;
  pixel8.camy = y;
}
camera(0,0);

pixel8.rgbPalette = new Image();
pixel8.scripts = document.getElementsByTagName("script");
pixel8.src = pixel8.scripts[pixel8.scripts.length-1].src;
pixel8.rgbPalette.src = pixel8.src.split("pixel8.js")[0]+"i128.png";

const pixs = (x,y,r,g,b,s,w) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  r = Math.max(Math.min(r,255),0);
  g = Math.max(Math.min(g,255),0);
  b = Math.max(Math.min(b,255),0);
  x1 = Math.min(r/2,128-s);
  y1 = Math.min(g/2,128-s)+Math.floor(Math.min(b/2,128-s))*128;
  pixel8.ctx.drawImage(pixel8.rgbPalette,x1,y1,s,s,x,y,w,w);
}

const pset = (x,y,c) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  pixel8.ctx.beginPath();
  pixel8.ctx.fillStyle = c;
  pixel8.ctx.fillRect(x,y,1,1);
  pixel8.ctx.fill();
}

const pget = (x,y) => {
  x = Math.round(x);
  y = Math.round(y);
  data = pixel8.ctx.getImageData(x,y, 1, 1).data;
  return "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
}

const spr = (i,j,x,y,z) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy)
  pixel8.ctx.imageSmoothingEnabled = false;
  pixel8.ctx.drawImage(pixel8.sprite,i*z,j*z,z,z,x,y,z,z);
}

const sspr = (x,y,w,h,x1,y1,w1,h1,r) => {
  pixel8.ctx.save();
  pixel8.ctx.imageSmoothingEnabled = false;
  pixel8.ctx.translate(x+w/2,y+h/2);
  pixel8.ctx.rotate(r * (Math.PI/180));
  pixel8.ctx.translate(-x-w/2,-y-h/2);
  pixel8.ctx.drawImage(pixel8.sprite,x1,y1,w1,h1,x,y,w,h);
  pixel8.ctx.restore();
}

const circ = (x,y,s,c,w) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  s = Math.round(s);
  pixel8.ctx.beginPath();
  pixel8.ctx.arc(x,y,s,0,2*Math.PI);
  pixel8.ctx.strokeStyle = c;
  pixel8.ctx.lineWidth = w || 1;
  pixel8.ctx.stroke();
}

const circfill = (x,y,s,c) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  s = Math.round(s);
  pixel8.ctx.beginPath();
  pixel8.ctx.arc(x,y,s,0,2*Math.PI);
  pixel8.ctx.fillStyle = c;
  pixel8.ctx.fill();
}

const line = (x,y,x1,y1,c,w) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  x1 = Math.round(x1-pixel8.camx);
  y1 = Math.round(y1-pixel8.camy);
  pixel8.ctx.beginPath();
  pixel8.ctx.moveTo(x,y);
  pixel8.ctx.strokeStyle = c;
  pixel8.ctx.lineWidth = w || 1;
  pixel8.ctx.stroke();
}

const rectfill = (x,y,sx,sy,c) => {
  x = Math.round(x-pixel8.camx)-sx/2;
  y = Math.round(y-pixel8.camy)-sy/2;
  sx = Math.round(sx);
  sy = Math.round(sy);
  pixel8.ctx.beginPath();
  pixel8.ctx.fillStyle = c;
  pixel8.ctx.fillRect(x,y,sx,sy);
  pixel8.ctx.fill();
}

const rect = (x,y,sx,sy,c,w) => {
  x = Math.round(x-pixel8.camx)-sx/2;
  y = Math.round(y-pixel8.camy)-sy/2;
  pixel8.ctx.beginPath();
  pixel8.ctx.strokeStyle = c;
  pixel8.ctx.lineWidth = w || 1;
  pixel8.ctx.strokeRect(x,y,sx,sy);
  pixel8.ctx.stroke();
}

const rectrot = (x,y,sx,sy,c,r) => {
  x = Math.round(x)-sx/2;
  y = Math.round(y)-sy/2;
  sx = Math.round(sx);
  sy = Math.round(sy);
  pixel8.ctx.save();
  pixel8.ctx.beginPath();
  pixel8.ctx.translate(x+sx/2,y+sy/2);
  pixel8.ctx.rotate(r * (Math.PI/180));
  pixel8.ctx.translate(-x-sx/2,-y-sy/2);
  pixel8.ctx.fillStyle = c;
  pixel8.ctx.fillRect(x,y,sx,sy);
  pixel8.ctx.fill()
  pixel8.ctx.restore();
}

const trifill = (x,y,x1,y1,x2,y2,c) => {
  x = Math.round(x-pixel8.camx);
  y = Math.round(y-pixel8.camy);
  x1 = Math.round(x1-pixel8.camx);
  y1 = Math.round(y1-pixel8.camy);
  x2 = Math.round(x2-pixel8.camx);
  y2 = Math.round(y2-pixel8.camy);
  pixel8.ctx.beginPath();
  pixel8.ctx.fillStyle = c;
  pixel8.ctx.moveTo(x,y);
  pixel8.ctx.lineTo(x1,y1);
  pixel8.ctx.lineTo(x2,y2);
  pixel8.ctx.fill();
}

//--make canvas context render without antialiasing--//
//pixel8.ctx.filter = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f')`;

//--file--//
const getFile = (url) => {
 const request = new XMLHttpRequest();
 request.open("GET",url,false);
 request.send(null);
 return request.responseText;
}

const copyText = (txt) => {
  var textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = txt;
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
  
const saveText = (txt,name) => {
  var a = document.createElement("a");
  a.href = "data:attachment/text," + encodeURI(txt);
  a.target = "_blank";
  a.download = name;
  a.click();
}

const saveImage = (img,name) => {
  var a = document.createElement("a");
  a.href = encodeURI(img);
  a.target = "_blank";
  a.download = name + ".png";
  a.click();
}

//--Mouse & Touch--//
window.addEventListener("resize",function(){pixel8.boundbox = pixel8.canvas.getBoundingClientRect();});
pixel8.canvas.addEventListener("touchstart", touch);
pixel8.canvas.addEventListener("touchmove",touch);
pixel8.canvas.addEventListener("touchend",mouseUp);
pixel8.canvas.addEventListener("mousedown", mouseDown);
pixel8.canvas.addEventListener("mousemove", mouseMove);
pixel8.canvas.addEventListener("mouseup", mouseUp);
pixel8.boundbox = pixel8.canvas.getBoundingClientRect();
pixel8.mouse=[];
function touch() {
  pixel8.mouse.x = (event.touches[0].clientX-pixel8.boundbox.left)/pixel8.boundbox.width*pixel8.canvas.width;
  pixel8.mouse.y = (event.touches[0].clientY-pixel8.boundbox.top)/pixel8.boundbox.height*pixel8.canvas.height;
  pixel8.mouse.start = true;
}

function mouseDown() {
  pixel8.mouse.start = true;
}

function mouseMove() {
  pixel8.mouse.x = (event.clientX-pixel8.boundbox.left)/pixel8.boundbox.width*pixel8.canvas.width;
  pixel8.mouse.y = (event.clientY-pixel8.boundbox.top)/pixel8.boundbox.height*pixel8.canvas.height;
}

function mouseUp() {
  pixel8.mouse.start = false;
}

//--Stats--//
const stat = (x) => {
  switch(x) {
    case 1:
      return pixel8
    break;
    case 2:
      return pixel8.canvas
    break;
    case 3:
      return pixel8.palette
    break;
    case 4:
      return pixel8.camx
    break;
    case 5:
      return pixel8.camy
    break;
    case 6:
      return pixel8.mouse.x
    break;
    case 7:
      return pixel8.mouse.y
    break;
    case 8:
      return pixel8.mouse.start
    break;
  }
}
