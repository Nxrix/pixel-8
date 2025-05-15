# Pixel-8

A web based fantasy console and JavaScript library for creating small things.

## Usage

First you need to include the script.
```html
<script src="https://nxrix.github.io/pixel-8/src/pixel8.js"></script>
```

To use it you need a canvas cause Pixel-8 only gives you the screen buffer.
```js
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const px8 = new Pixel8(128,128);
const img = ctx.createImageData(px8.w,px8.h);
const img_data = img.data;
canvas.width = px8.w;
canvas.height = px8.h;
document.body.appendChild(canvas);

let t = 0;
const update = () => {

  px8.cls();
  px8.print("Hello",px8.w2-2*5,px8.h2-2,3);
  t++;

  for (let i = 0; i < px8.w*px8.h; i++) {
    const c = Pixel8.palette[px8.buffer[i]];
    const index = i * 4;
    img_data[index    ] = c[0];
    img_data[index + 1] = c[1];
    img_data[index + 2] = c[2];
    img_data[index + 3] = 255;
  }
  ctx.putImageData(img,0,0);
  requestAnimationFrame(update);
};
update();
```

## API

The drawing API is pretty similar to Pico8
