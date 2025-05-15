/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

"use strict";

class Pixel8 {

  static palette = [
    [0x1d,0x18,0x26],[0x8b,0x7f,0xb0],[0xc3,0xbe,0xe5],[0xff,0xe8,0xe9],
    [0x65,0x26,0x4e],[0xa0,0x1a,0x3d],[0xde,0x1b,0x45],[0xf2,0x63,0x7b],
    [0x8b,0x3f,0x39],[0xbb,0x45,0x31],[0xef,0x5d,0x0e],[0xff,0x95,0x00],
    [0x00,0xa0,0x3d],[0x12,0xd5,0x00],[0xb4,0xd8,0x00],[0xff,0xc3,0x1f],
    [0x00,0x6e,0x69],[0x00,0xae,0x85],[0x00,0xda,0xa7],[0x4f,0xd6,0xff],
    [0x2b,0x27,0x54],[0x3c,0x51,0xaf],[0x18,0x88,0xde],[0x00,0xa9,0xe1],
    [0x59,0x3c,0x97],[0x89,0x44,0xcf],[0xb4,0x4a,0xff],[0xe9,0x59,0xff],
    [0xe7,0x87,0x6d],[0xff,0xba,0x8c],[0xff,0xef,0x5c],[0xff,0x9c,0xde]
  ];

  static font_buffer = [0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,1,0,1,1,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,0,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,0];

  static bayer4x4 = [
    [ 0, 8, 2, 10],
    [12, 4, 14, 6],
    [ 3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  static bayer8x8 = [
    [ 0, 32,  8, 40,  2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44,  4, 36, 14, 46,  6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [ 3, 35, 11, 43,  1, 33,  9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];

  constructor(w,h) {
    this.w = w;
    this.h = h;
    this.w2 = w/2;
    this.h2 = h/2;
    this.w1 = w-1;
    this.h1 = h-1;
    this.buffer = new Uint8Array(w*h);
    this.palette_mask = new Uint8Array(32);
    this.pattern = 0;
    this.pattern_color = 0;
    this.camera_x = 0;
    this.camera_y = 0;
    this.clip_x0 = 0;
    this.clip_y0 = 0;
    this.clip_x1 = w;
    this.clip_y1 = h;
  }

  _pset(x,y,c) {
    x -= this.camera_x;
    y -= this.camera_y;
    if (x >= this.clip_x0 && x < this.clip_x1 && y >= this.clip_y0 && y < this.clip_y1) {
      const ptrn = this.pattern>>((~x&3)+((~y&3)<<2))&1;
      c = ptrn ? this.pattern_color : c;
      if ((c > 0 || !ptrn) && !this.palette_mask[c&31]) {
        this.buffer[x+y*this.w] = c&31;
      }
    }
  }

  cls(c) {
    this.pattern = 0;
    this.pattern_color = 0;
    this.palette_mask.fill(false);
    this.buffer.fill(c&31);
  }

  pset(x,y,c) {
    this._pset(x|0,y|0,c|0);
  }

  pget(x,y) {
    return this.buffer[(x&this.w1)+(y&this.h1)*this.w];
  }

  fillp(p,c) {
    this.pattern = p&0xffff;
    this.pattern_color = c|0;//c&31;
  }

  palt(c,t) {
    if (c) {
      this.palette_mask[c&31] = t&1;
    } else {
      this.palette_mask.fill(0);
    }
  }

  camera(x,y) {
    this.camera_x = x|0;
    this.camera_y = y|0;
  }

  clip(x0,y0,x1,y1) {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    if (x0 > x1) {
      const temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y0 > y1) {
      const temp = y0;
      y0 = y1;
      y1 = temp;
    }
    this.clip_x0 = x0;
    this.clip_y0 = y0;
    this.clip_x1 = x1||this.w;
    this.clip_y1 = y1||this.h;
  }

  line(x0,y0,x1,y1,c) {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    const dx = Math.abs(x1-x0);
    const dy = Math.abs(y1-y0);
    const sx = (x0<x1)?1:-1;
    const sy = (y0<y1)?1:-1;
    let  err = dx-dy;
    while (true) {
      this._pset(x0,y0,c);
      if (x0==x1&&y0==y1) break;
      const e2 = err*2;
      if (e2>-dy) { err -= dy;x0 += sx; }
      if (e2< dx) { err += dx;y0 += sy; }
    }
  }
  
  rect(x0,y0,x1,y1,c) {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    if (x0 > x1) {
      const temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y0 > y1) {
      const temp = y0;
      y0 = y1;
      y1 = temp;
    }
    for (let x=x0;x<=x1;x++) {
      this._pset(x,y0,c);
      this._pset(x,y1,c);
    }
    for (let y=y0+1;y<y1;y++) {
      this._pset(x0,y,c);
      this._pset(x1,y,c);
    }
  }
  
  rectfill(x0,y0,x1,y1,c) {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    if (x0 > x1) {
      const temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y0 > y1) {
      const temp = y0;
      y0 = y1;
      y1 = temp;
    }
    for (let x=x0;x<=x1;x++) {
      for (let y=y0;y<=y1;y++) {
        this._pset(x,y,c);
      }
    }
  }
  
  circ(x,y,r,c) {
    x |= 0;
    y |= 0;
    r |= 0;
    if (r>1) {
      let cx = r;
      let cy = 0;
      let d = 1-cx;
      while (cy<=cx) {
        if (cy==0) {
          this._pset(x   ,y+cx,c);
          this._pset(x   ,y-cx,c);
          this._pset(x+cx,y   ,c);
          this._pset(x-cx,y   ,c);
        }
        else if (cx==cy) {
          this._pset(x+cx,y+cy,c);
          this._pset(x-cx,y+cy,c);
          this._pset(x+cx,y-cy,c);
          this._pset(x-cx,y-cy,c);
        }
        else {
          this._pset(x+cx,y+cy,c);
          this._pset(x-cx,y+cy,c);
          this._pset(x+cx,y-cy,c);
          this._pset(x-cx,y-cy,c);
          this._pset(x+cy,y+cx,c);
          this._pset(x-cy,y+cx,c);
          this._pset(x+cy,y-cx,c);
          this._pset(x-cy,y-cx,c);
        }
        cy++;
        if (d < 0) {
          d += 2*cy+1;
        } else {
          cx--;
          d += 2*(cy-cx)+1;
        }
      }
    } else if (r==1) {
      this._pset(x,y,c);
    }
  }
  
  circfill(x,y,r,c) {
    x |= 0;
    y |= 0;
    r |= 0;
    let cx = r;
    let cy = 0;
    let err = 1-r;
    const hline = (x1,x2,y) => {
      for (let i=x1;i<=x2;i++) {
        this._pset(i,y,c);
      }
    };
    while (cy<=cx) {
      hline(x-cx,x+cx,y+cy);
      if (cy!=0) hline(x-cx,x+cx,y-cy);
      if (err < 0) {
        err += 2*cy+3;
      } else {
        if (cx!=cy) {
          hline(x-cy,x+cy,y+cx);
          hline(x-cy,x+cy,y-cx);
        }
        cx--;
        err += 2*(cy-cx)+3;
      }
      cy++;
    }
  }
  
  rrect(x0,y0,x1,y1,r,c) {
    r |= 0;
    if (r<=0) {
      this.rect(x0,y0,x1,y1,c);
    } else {
      x0 |= 0;
      y0 |= 0;
      x1 |= 0;
      y1 |= 0;
      if (x0 > x1) {
        const temp = x0;
        x0 = x1;
        x1 = temp;
      }
      if (y0 > y1) {
        const temp = y0;
        y0 = y1;
        y1 = temp;
      }
      r++;
      const maxr = Math.min((x1-x0)>>1,(y1-y0)>>1);
      if (r>maxr) r = maxr;
      x0 += r;
      y0 += r;
      x1 -= r;
      y1 -= r;
      for (let x=x0+1;x<=x1-1;x++) {
        this._pset(x,y0-r,c);
        this._pset(x,y1+r,c);
      }
      for (let y=y0+1;y<=y1-1;y++) {
        this._pset(x0-r,y,c);
        this._pset(x1+r,y,c);
      }
      let cy = r;
      let cx = 0;
      let d = 1-cy;
      while (cx<=cy) {
        if (cx==cy) {
          this._pset(x1+cx,y1+cy,c);
          this._pset(x0-cx,y1+cy,c);
          this._pset(x1+cx,y0-cy,c);
          this._pset(x0-cx,y0-cy,c);
        } else {
          this._pset(x1+cx,y1+cy,c);
          this._pset(x0-cx,y1+cy,c);
          this._pset(x1+cx,y0-cy,c);
          this._pset(x0-cx,y0-cy,c);
          this._pset(x1+cy,y1+cx,c);
          this._pset(x0-cy,y1+cx,c);
          this._pset(x1+cy,y0-cx,c);
          this._pset(x0-cy,y0-cx,c);
        }
        cx++;
        if (d < 0) {
          d += 2*cx+1;
        } else {
          cy--;
          d += 2*(cx-cy)+1;
        }
      }
    }
  }
  
  trifill(x0,y0,x1,y1,x2,y2,c) {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    x2 |= 0;
    y2 |= 0;
    if (y0>y1) {
      let temp = y0;
      y0 = y1;
      y1 = temp;
      temp = x0;
      x0 = x1;
      x1 = temp;
    }
    if (y1>y2) {
      let temp = y1;
      y1 = y2;
      y2 = temp;
      temp = x1;
      x1 = x2;
      x2 = temp;
    }
    if (y0>y1) {
      let temp = y0;
      y0 = y1;
      y1 = temp;
      temp = x0;
      x0 = x1;
      x1 = temp;
    }
    const dx1 = x1-x0;
    const dy1 = y1-y0;
    const dx2 = x2-x0;
    const dy2 = y2-y0;
    const dx3 = x2-x1;
    const dy3 = y2-y1;
    const m1 = dx1/dy1;
    const m2 = dx2/dy2;
    const m3 = dx3/dy3;
    let xl = x0;
    let xr = x0;
    for (let i=y0;i<=y1;i++) {
      this.line(xl,i,xr,i,c);
      xl += m1;
      xr += m2;
    }
    xl = x1;
    xr = x0;
    for (let i=y1;i<=y2;i++) {
      this.line(xl,i,xr,i,c);
      xl += m3;
      xr += m2;
    }
  }
  
  sspr(spr,x,y,w,h) {
    x |= 0;
    y |= 0;
    const [w1,h1,d] = spr.split(",");
    spr = d.split("");
    for (let i=0;i<w;i++) {
      for (let j=0;j<h;j++) {
        const c = parseInt(spr[Math.floor(i/w*w1)+Math.floor(j/h*h1)*w1],33);
        if (c<32) {
          this._pset(x+i,y+j,c);
        }
      }
    }
  }

  print(t,x,y,c) {
    x |= 0;
    y |= 0;
    t = t.toString();
    const lines = t.split("\n");
    for (let l=0;l<lines.length;l++) {
      const line = lines[l];
      const cy = y+l*5;
      for (let i=0;i<line.length;i++) {
        const code = line.charCodeAt(i);
        const cx = x+i*4;
        for (let j=0;j<5;j++) {
          for (let k=0;k<4;k++) {
            if (Pixel8.font_buffer[(code-32)*4+j*380+k]==1) {
              this._pset(cx+k,cy+j,c);
            }
          }
        }
      }
    }
  }

}
