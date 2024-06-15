"use strict";

const pixel8 = {};

var _init=()=>{};
var _draw=()=>{};

pixel8.init = async (canvas, width = 128, height = 128) => {
  pixel8.canvas = canvas;
  pixel8.canvas.width = width;
  pixel8.canvas.height = height;
  pixel8.canvas.widthm1 = pixel8.canvas.width-1;
  pixel8.canvas.heightm1 = pixel8.canvas.height-1;
  pixel8.gl = pixel8.canvas.getContext("webgl",{ alpha: false });

  var vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }`;

  var fragmentShaderSource = `
  precision highp float;
  uniform sampler2D u_texture;
  uniform sampler2D u_palette;
  void main() {
    float index = texture2D(u_texture, gl_FragCoord.xy / vec2(${pixel8.canvas.width}.0,-${pixel8.canvas.height}.0) + vec2(0.0, 1.0)).a;
    gl_FragColor = texture2D(u_palette,vec2(index,0.0));
  }`;

  var vertexShader = pixel8.gl.createShader(pixel8.gl.VERTEX_SHADER);
  pixel8.gl.shaderSource(vertexShader, vertexShaderSource);
  pixel8.gl.compileShader(vertexShader);

  var fragmentShader = pixel8.gl.createShader(pixel8.gl.FRAGMENT_SHADER);
  pixel8.gl.shaderSource(fragmentShader, fragmentShaderSource);
  pixel8.gl.compileShader(fragmentShader);

  var program = pixel8.gl.createProgram();
  pixel8.gl.attachShader(program, vertexShader);
  pixel8.gl.attachShader(program, fragmentShader);
  pixel8.gl.linkProgram(program);

  if (!pixel8.gl.getProgramParameter(program, pixel8.gl.LINK_STATUS)) {
    console.log(`fs : ${pixel8.gl.getShaderInfoLog(fragmentShader)} vs : ${pixel8.gl.getShaderInfoLog(fragmentShader)} pg : ${pixel8.gl.getProgramInfoLog(program)}\n`);
    pixel8.gl.deleteProgram(program);
  }

  pixel8.gl.useProgram(program);

  var positionAttributeLocation = pixel8.gl.getAttribLocation(program, "a_position");
  var textureUniformLocation = pixel8.gl.getUniformLocation(program, "u_texture");
  var paletteUniformLocation = pixel8.gl.getUniformLocation(program, "u_palette");

  pixel8.gl.enableVertexAttribArray(positionAttributeLocation);

  var positionBuffer = pixel8.gl.createBuffer();
  pixel8.gl.bindBuffer(pixel8.gl.ARRAY_BUFFER, positionBuffer);
  pixel8.gl.bufferData(pixel8.gl.ARRAY_BUFFER, new Float32Array([
    -1,  1,
    1,  1,
    -1, -1,
    1, -1,
  ]), pixel8.gl.STATIC_DRAW);

  pixel8.gl.vertexAttribPointer(positionAttributeLocation, 2, pixel8.gl.FLOAT, false, 0, 0);
  pixel8.gl.uniform1i(textureUniformLocation, 0);
  pixel8.gl.uniform1i(paletteUniformLocation, 1);

  pixel8.screenBuffer = new Uint8Array(pixel8.canvas.width*pixel8.canvas.height);
  pixel8.screenTexture = pixel8.gl.createTexture();
  pixel8.gl.activeTexture(pixel8.gl.TEXTURE0);
  pixel8.gl.bindTexture(pixel8.gl.TEXTURE_2D,pixel8.screenTexture);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_WRAP_S, pixel8.gl.CLAMP_TO_EDGE);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_WRAP_T, pixel8.gl.CLAMP_TO_EDGE);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_MIN_FILTER, pixel8.gl.NEAREST);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_MAG_FILTER, pixel8.gl.NEAREST);

  pixel8.palette = [
    [0x1d,0x18,0x26],
    [0x8b,0x7f,0xb0],
    [0xc3,0xbe,0xe5],
    [0xff,0xe8,0xe9],
    [0x65,0x26,0x4e],
    [0xa0,0x1a,0x3d],
    [0xde,0x1b,0x45],
    [0xf2,0x63,0x7b],
    [0x8b,0x3f,0x39],
    [0xbb,0x45,0x31],
    [0xef,0x5d,0x0e],
    [0xff,0x95,0x00],
    [0x00,0xa0,0x3d],
    [0x12,0xd5,0x00],
    [0xb4,0xd8,0x00],
    [0xff,0xc3,0x1f],
    [0x00,0x6e,0x69],
    [0x00,0xae,0x85],
    [0x00,0xda,0xa7],
    [0x4f,0xd6,0xff],
    [0x2b,0x27,0x54],
    [0x3c,0x51,0xaf],
    [0x18,0x88,0xde],
    [0x00,0xa9,0xe1],
    [0x59,0x3c,0x97],
    [0x89,0x44,0xcf],
    [0xb4,0x4a,0xff],
    [0xe9,0x59,0xff],
    [0xe7,0x87,0x6d],
    [0xff,0xba,0x8c],
    [0xff,0xef,0x5c],
    [0xff,0x9c,0xde]
  ];

  pixel8.bayer4x4 = [
    [ 0, 8, 2, 10],
    [12, 4, 14, 6],
    [ 3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  pixel8.bayer8x8 = [
    [ 0, 32,  8, 40,  2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44,  4, 36, 14, 46,  6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [ 3, 35, 11, 43,  1, 33,  9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];

  pixel8.paletteBuffer = new Uint8Array(32*4);
  for (var i = 0; i < pixel8.palette.length; i++) {
    var col = pixel8.palette[i];
    pixel8.paletteBuffer[i*4] = col[0];
    pixel8.paletteBuffer[(i*4) + 1] = col[1];
    pixel8.paletteBuffer[(i*4) + 2] = col[2];
  }

  pixel8.paletteTexture = pixel8.gl.createTexture();
  pixel8.gl.activeTexture(pixel8.gl.TEXTURE1);
  pixel8.gl.bindTexture(pixel8.gl.TEXTURE_2D, pixel8.paletteTexture);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_WRAP_S, pixel8.gl.CLAMP_TO_EDGE);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_WRAP_T, pixel8.gl.CLAMP_TO_EDGE);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_MIN_FILTER, pixel8.gl.NEAREST);
  pixel8.gl.texParameteri(pixel8.gl.TEXTURE_2D, pixel8.gl.TEXTURE_MAG_FILTER, pixel8.gl.NEAREST);
  pixel8.gl.texImage2D(pixel8.gl.TEXTURE_2D, 0, pixel8.gl.RGBA, 32, 1, 0, pixel8.gl.RGBA, pixel8.gl.UNSIGNED_BYTE, pixel8.paletteBuffer);

  pixel8.round = (n) => {
    return (n+0.5)|0;
  }

  pixel8.paletteMask = [];
  pixel8.pset = (x, y, col) => {
    x -= pixel8.cameraX;
    y -= pixel8.cameraY;
    if (x >= pixel8.clipX0 && x < pixel8.clipX1 && y >= pixel8.clipY0 && y < pixel8.clipY1) {
      col = pixel8.round(col);
      var pattern = (pixel8.pattern[0] >> ((~x & 0x3) + ((~y & 0x3)*4))) & 0x1;
      col = pattern ? pixel8.pattern[1] : col;
      if ((col > 0 || !pattern) && !pixel8.paletteMask[col]) {
        pixel8.screenBuffer[x+y*pixel8.canvas.width] = (col & 0x1F)*8;
      }
    }
  }

  window.cls = (col) => {
    pixel8.pattern = [];
    pixel8.paletteMask.fill(false);
    pixel8.screenBuffer.fill((pixel8.round(col)&0x1F)*8);
  }

  window.pset = (x, y, col) => {
    x = pixel8.round(x);
    y = pixel8.round(y);
    pixel8.pset(x,y,col);
  }

  window.pget = (x, y) => {
    x = pixel8.round(x)&pixel8.canvas.widthm1;
    y = pixel8.round(y)&pixel8.canvas.heightm1;
    return pixel8.screenBuffer[x+(y*pixel8.canvas.width)]>>3;
  }

  window.camera = (x, y) => {
    pixel8.cameraX = pixel8.round(x)||0;
    pixel8.cameraY = pixel8.round(y)||0;
  }
  camera();

  window.clip = (x0, y0, x1, y1) => {
    pixel8.clipX0 = pixel8.round(x0)||0;
    pixel8.clipY0 = pixel8.round(y0)||0;
    pixel8.clipX1 = pixel8.round(x1)||pixel8.canvas.width;
    pixel8.clipY1 = pixel8.round(y1)||pixel8.canvas.height;
  }
  clip();

  window.fillp = (p, col) => {
    pixel8.pattern = [pixel8.round(p)||0,pixel8.round(col)||0];
  }
  fillp();

  window.palt = (col, t) => {
    if (col === undefined) {
      pixel8.paletteMask.fill(false);
    } else {
      pixel8.paletteMask[pixel8.round(col)&0x1F]=t;
    }
  }
  palt();

  window.line = (x0, y0, x1, y1, col) => {
    x0 = pixel8.round(x0);
    y0 = pixel8.round(y0);
    x1 = pixel8.round(x1);
    y1 = pixel8.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    while (true) {
      pixel8.pset(x0, y0, col);
      if (x0 === x1 && y0 === y1) break;
      const e2 = err*2;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  window.rect = (x0, y0, x1, y1, col) => {
    x0 = pixel8.round(x0);
    y0 = pixel8.round(y0);
    x1 = pixel8.round(x1);
    y1 = pixel8.round(y1);
    if (x0 > x1) {
      var temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y0 > y1) {
      var temp = y0;
      y0 = y1;
      y1 = temp;
    }
    for (var x = x0; x <= x1; x++) {
      pixel8.pset(x,y0,col);
      pixel8.pset(x,y1,col);
    }
    for (var y = y0; y <= y1; y++) {
      pixel8.pset(x0,y,col);
      pixel8.pset(x1,y,col);
    }
  }

  window.rectfill = (x0, y0, x1, y1, col) => {
    x0 = pixel8.round(x0);
    y0 = pixel8.round(y0);
    x1 = pixel8.round(x1);
    y1 = pixel8.round(y1);
    if (x0 > x1) {
      var temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y0 > y1) {
      var temp = y0;
      y0 = y1;
      y1 = temp;
    }
    for (var x=x0;x<=x1;x++) {
      for (var y=y0;y<=y1;y++) {
        pixel8.pset(x,y,col);
      }
    }
  }

  window.circ = (x, y, r, col) => {
    x = pixel8.round(x);
    y = pixel8.round(y);
    r = pixel8.round(r);
    var xx = r;
    var yy = 0;
    var radiusError = 1 - xx;
    while (xx >= yy) {
      pixel8.pset(xx + x, yy + y, col);
      pixel8.pset(yy + x, xx + y, col);
      pixel8.pset(-xx + x, yy + y, col);
      pixel8.pset(-yy + x, xx + y, col);
      pixel8.pset(-xx + x, -yy + y, col);
      pixel8.pset(-yy + x, -xx + y, col);
      pixel8.pset(xx + x, -yy + y, col);
      pixel8.pset(yy + x, -xx + y, col);
      yy++;
      if (radiusError < 0) {
        radiusError += (yy*2) + 1;
      }
      else {
        xx--;
        radiusError += (yy - xx + 1)*2;
      }
    }
  }

  window.circfill = (x, y, r, col) => {
    x = pixel8.round(x);
    y = pixel8.round(y);
    r = pixel8.round(r);
    var xx = r;
    var yy = 0;
    var radiusError = 1 - xx;
    while (xx >= yy) {
      for (var i = -xx; i <= xx; i++) {
        pixel8.pset(i + x,yy + y, col);
        pixel8.pset(i + x, -yy + y, col);
        pixel8.pset(yy + x, i + y, col);
        pixel8.pset(-yy + x, i + y, col);
      }
      yy++;
      if (radiusError < 0) {
        radiusError += (yy*2) + 1;
      }
      else {
        xx--;
        radiusError += (yy - xx + 1)*2;
      }
    }
  }

  window.tri = (x0, y0, x1, y1, x2, y2, col) => {
    line(x0, y0, x1, y1, col);
    line(x1, y1, x2, y2, col);
    line(x2, y2, x0, y0, col);
  }

  window.trifill = (x0, y0, x1, y1, x2, y2, col) => {
    x0 = pixel8.round(x0);
    y0 = pixel8.round(y0);
    x1 = pixel8.round(x1);
    y1 = pixel8.round(y1);
    x2 = pixel8.round(x2);
    y2 = pixel8.round(y2);
    if (y0 > y1) {
      var temp = y0;
      y0 = y1;
      y1 = temp;
      temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y1 > y2) {
      var temp = y1;
      y1 = y2;
      y2 = temp;
      temp = x1;
      x1 = x2;
      x2 = temp;
    }
    if (y0 > y1) {
      var temp = y0;
      y0 = y1;
      y1 = temp;
      temp = x0;
      x0 = x1;
      x1 = temp;
    }
    var dx1 = x1 - x0;
    var dy1 = y1 - y0;
    var dx2 = x2 - x0;
    var dy2 = y2 - y0;
    var dx3 = x2 - x1;
    var dy3 = y2 - y1;
    var y = y0;
    var x = x0;
    var m1 = dx1 / dy1;
    var m2 = dx2 / dy2;
    var m3 = dx3 / dy3;
    var xl = x;
    var xr = x;
    for (var i = y0; i <= y1; i++) {
      line(xl, i, xr, i, col);
      xl += m1;
      xr += m2;
    }
    xl = x1;
    xr = x;
    for (var i = y1; i <= y2; i++) {
      line(xl, i, xr, i, col);
      xl += m3;
      xr += m2;
    }
  }

  window.sspr = (sprite, x, y, w, h) => {
    x = pixel8.round(x);
    y = pixel8.round(y);
    var w1 = sprite.split(",")[0];
    var h1 = sprite.split(",")[1];
    for (var i = 0; i < w; i++) {
      for (var j = 0; j < h; j++) {
        var col = parseInt(sprite.split(",")[2].split("")[Math.floor(i/w*w1)+Math.floor(j/h*h1)*w1],33);
        if (col<32) {
          pixel8.pset(x+i,y+j,col);
        }
      }
    }
  }

  window.print = (text, x, y, col) => {
    x = pixel8.round(x);
    y = pixel8.round(y);
    text = text.toString();
    var lines = text.split('\n');
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      for (var i = 0; i < line.length; i++) {
        var charCode = line.charCodeAt(i);
        var charX = x + (i*4);
        var charY = y + l * 5;
        for (var j = 0; j < 5; j++) {
          for (var k = 0; k < 4; k++) {
            var pixelIndex = ((charCode-33)*4) + (j*512) + k;
            var pixelValue = pixel8.fontBuffer[pixelIndex*4];
            if (pixelValue > 0) {
              var pixelX = charX + k;
              var pixelY = charY + j;
              pixel8.pset(pixelX,pixelY,col);
            }
          }
        }
      }
    }
  }

  var img = document.createElement("img");
  img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAFCAMAAAAE9KRSAAAAAXNSR0IArs4c6QAAAGBQTFRFAAAAHStTfiVTAIdRq1I2X1dPwsPH//Ho/wBN/6MA/+wnAOQ2Ka3/g3ac/3eo/8yqZy2KCmK+QiE2ElNZdC8p1I5vooh5//V9vhIm/2wkqPEuALJRg+v1vZrfuTe4/6zFJf86fAAAACB0Uk5TAP////////////////////////////////////////+Smq12AAABEklEQVRIie1VSxaEIAzrrve/8ehAmrRUtrKwyuNjfzQBzdyudzwY329qrVyafjeb/fQyFrjmDvVqPuI543pRcsSJCWJYxEj6Nea0g81w4fpp5gB/2UfaD1Iue1ta90wfEesoiQLNwiYy5HlnR3QIodq5i20DOIoGHdJgBaoS4L+igAr4Gqf6aPcO74n/nuMiRguyLftijfidg8MkEh0TYwfmSh/LwmoUP0BgL26MnllQLVyT1ZYAZtaSYEsA5YAzMkEmMUiSTHMeGsnngdi4AOC83lzvCvDpgBBWp7qhGMtV342pr0QK380NQNgkxQ0BIv+H/YVNkFxuigDa+Qsw5lV/BxlgzWk9KCQAWBDdJ5+cIT9DZA+l+hZF7AAAAABJRU5ErkJggg==";
  img.onload = () => {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixel8.fontBuffer = imageData.data;
    canvas.remove();
    _init();
    pixel8.update();
  }
}

pixel8.update = () => {
  try {
    _draw();
  }
  catch (error) {
    console.log(error.toString());
  }
  pixel8.gl.activeTexture(pixel8.gl.TEXTURE0);
  pixel8.gl.texImage2D(pixel8.gl.TEXTURE_2D,0,pixel8.gl.ALPHA,pixel8.canvas.width,pixel8.canvas.height,0,pixel8.gl.ALPHA,pixel8.gl.UNSIGNED_BYTE,pixel8.screenBuffer);
  pixel8.gl.drawArrays(pixel8.gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(pixel8.update);
}