# Pixel-8

A web based fantasy console and JavaScript library for creating small things.

## Usage

First you need to include the script
```html
<script src="https://nxrix.github.io/pixel-8/src/pixel8.js"></script>
```

Then you need a canvas to draw the screen buffer onto it
```js
const px8 = new Pixel8(128,128);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
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

`cls(c)`: Fills the buffer with color `c`.

`pset(x,y,c)`: Set color of pixel `[x,y]` to `c`.

`pget(x,y)`: Get color of pixel `[x,y]`.

`camera(x,y)`: Move camera to `[x,y]`. Can be reset using `camera()`.

`clip(x0,y0,x1,y1)`: Clip drawing to `[x0,y0]` & `[x1,y1]`. Can be reset using `clip()`.

`fillp(p,c)`: Set a pattern applied to all drawing functions. `p` is a number with 16 bits and each 4x4 area gets the same pattern. `c` is the pattern's base color. If `c` was 0, the pattern color will be transparent (use 32 for black). Pattern can be reset using `fillp()`.

`palt(c,t)`: Set color `c` to be transparent or not. Can be reset using `palt()`.

`line(x0,y0,x1,y1,c)`: Draw a line from `[x0,y0]` to `[x1,y1]` with color `c`.

`rect(x0,y0,x1,y1,c)`: Draw a rectangle from `[x0,y0]` to `[x1,y1]` with color `c`.

`rectfill(x0,y0,x1,y1,c)`: Draw a filled rectangle from `[x0,y0]` to `[x1,y1]` with color `c`.

`circ(x,y,r,c)`: Draw a circle with radius `r` at `[x,y]` with color `c`.

`circfill(x,y,r,c)`: Draw a filled circle with radius `r` at `[x,y]` with color `c`.

`sspr(s,x,y,w,h)`: Draw sprite `s` at `[x,y]` with width `w` and height `h`. The sprite should be exported using [PNG to sprite tool](./).

`print(t,x,y,c)`: Print string `t` at `[x,y]` with color `c`.
