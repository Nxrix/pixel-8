# Pixel-8
tiny Fantasy Console and JavaScript library for making tiny games or art

![Pixel-8](img/icon.png "pixel-8")

# Specifications
| ‌ | ‌ |
| - | - |
| Display        | 32x32 |
| Cart           | 2024 char |
| Sound          | Not Supported |
| Code           | JavaScript |
| Sprite         | just in JS library |

# Api

### Options
* Resolution
  * <body res="n">
* disable canvas and styles
  * <body init="f">
* Adding sprite
  * <img id="sprite">

### Colors
* RGB to color
  * rgb2color(r,g,b);

* RGB to palette index
  * rgb2index(palette,r,g,b);

### Sprites/Images
* Draw a part of image
  * spr(i,j,x,y,z)
  * sspr(x,y,w,h,x1,y1,w1,h1,r);

__x,y__ drawing position

__w,h,z__ drawing width,height,scale
 
__x1,y1/i,j__ sprite position
 
__w1,h1__ sprite width,height

### Drawing
* camera position
  * camera(x,y);

* set color of a pixel
  * pset(x,y,color);

* get color of a pixel
  * pget(x,y);

* Drawing filled shapes
  * pixs(x,y,r,g,b,s,w);
    * RGB rectangle from palette
  * rectfill(x,y,w,h,c);
  * rectrot(x,y,w,h,c,r);
  * circfill(x,y,size,c);
  * trifill(x,y,x1,y1,x2,y2,c);

* Drawing line based shapes
  * line(x,y,x1,y1,c,w);
  * rect(x,y,w,h);
  * circ(x,y,s,c,w);

* clear screen
  * cls(color);

### Math
* Functions 
  * sin, cos, rnd(Random number), flr, deg(Radians to degrees), pow

* Rotate a point around pivot
  * rot(px,py,x,y,rot);

* Distance between 2 points
  * dist3D(v1,v2);
  * dist2D(v1,v2);

* Rotation between 2 points
  * lookAt3D(v1,v2);
  * lookAt2D(v1,v2);

### Bayer Matrix Arrays
* pixel8.bayer4[x%4][y%4]
* pixel8.bayer8[x%8][y%8]

### File
* getFile(url);
* copyText(txt);
* saveText(txt,name);
* saveImage(img,name);

### stat(x)
1. pixel8
2. canvas
3. palette
4. cameraX
5. cameraY
6. mouseX
7. mouseY
8. mouseStart

# Editor
> 32x32 points 3D screen
* sx,sy,sz are positions for drawing points on screen
* x,y are for 2d loop of pixels
* i,j are predefined for loop!
* t is used for time
