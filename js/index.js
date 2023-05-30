
/*
col=x^y+t;[sx,sy]=rot(c,c,sx,sy,15);[sy,sz]=rot(c,15.5,sy,col%32,-30);
*/
/*
0,㡣Ὤ⿸ṹ㩛ᛸ㵳㨬⽺㦽㫯ᒲᛸ᛹㡣፬ᦳ㪬㪬㈬ḩ㷳Ἣṷ㩛ᛸ㵳Ὕ㉳ᓬ㳳㨬᛹ᦳ㨯᛺ᕣ,0
0,濣㷬碨秞瓞㮩宊磳玬⳹竳㷝濲㋴碨禬掬泯瞥璬㊪璬㊪掬㮩玊⯺瞽઻珛⳸秳㷝揳⣬磳玬⳹⿷竳掬㮩,0
0,㡣Ὤ⿸ᙹᛴ㳛㴬㨬⽺㦽㫯ᒲᛸ᛹㡣፬ᦳ㪬㪬㈬ᚩ㷳Ἣᛷ㩛ᛸ㵳Ὕ㉳ᓬᛸ᛹ᡷ㷳㈬Ⴉ,0
0,㡦ᓲὩḰứᢱᢰ㔻ᘫ㲩㦽㋮ᤨᲲᚩό㟲ᓤᦱᔸ㢬㍳ᓴᛸ᛹㲨㵞ᠩᔴ,0
0,㈱㛯㲽㵞⸬ᛸ᛹㷳Ὕ㡲᧴㲨㴬㈬㛯㰥㪬㪬㈬ᚩ㷳Ἣᛷ㩛ᛸ㵳Ὕ㉳ᓬᛸ᛹ᡷ㷳㈬Ⴉ,ᢱᢰᒬ⁴ᶰὤ㧁ㅲᓹᦱᲲᔸ㎮㛩ᓬᔰⲬ㪽᦯ᖪᰱ㲬ㄽㅴᓮፘᖱㅴᓮㅍ㓴⢮ᗉᙘㅍ㓴ㄮ㕳ᓮ㕳ᓮ㪨᦯ᘵ㕳ᓮᡴᢱ᪲ᠩᔲᦪᖪ⸨ᣛᨬᰬ᤬⼲⸬ᚰᚵᚹᦱᛝᩛᰬ᤬ᚲᬱᛝ᝛ᚳᚴᚷ⼹⹝ῴ᤾Ꮇ⼳㫛ιᨱᨦᡝᦱᔩᔩᘩ៤㓳㏩ᓴᚩ៤㭰㓳㲨᦯ᒪឱ᜵ፘᔱᚩ㲨㨫㟩ᤨᩥᒯ፴ᖲᒪ᪱ᒭῴ᤾Ꮃ⾳ῴ᤾Ꮄ⾷ῴ᤾Ꮅᔳᨥ᦭ᄪ㾨ῴ᤾Ꮄᔷᔩᖪឨ᜵ፘᠱᔲᘩᒨῴ᤾ᎲᔳἽ㪨ιᬱᨦ㫞ιᨱᨦᔩᒪ㫾ιᎹᔷ㨪㟩ᒨᡴ㺲ῴ᤾ᎶᔷᖪᔳᲯᒫᡴᦱᠰㅍ㓴⢮ᗉᖲᒪᨧ᮸ᐰ㫛ιᰱᨦᡝᦱᎩᔱᒪῴ᤾ᎳᔱᠩᔴᤪᲲᤫᲲ
*/
pixel8.console = [];
pixel8.console.clear = () => {
  pixel8_console_div.innerHTML = `<img src="img/vox.png" draggable="false">&#10;Pixel-8 Console v.1 <a style="color:#1e90ff" href="javascript:pixel8.console.clear()">Clear Console</a>&#10;`
}
pixel8.console.D=false;
document.querySelector(".consolebtn").onclick = () => {
  pixel8.console.D=!pixel8.console.D;
  if (pixel8.console.D) {
    pixel8_console.style.transform = "scale(1,1)";
  }
  else {
    pixel8_console.style.transform = "scale(0,0)";
  }
}

pixel8_console.addEventListener("keyup", function(event) {
  if (event.key === 'Enter') {
    try {
      var output = eval(pixel8_console_input.value);
      pixel8_console_div.innerHTML += pixel8_console_input.value+":\n"+Prism.highlight((output||"undefined").toString(),Prism.languages.js,"js")+"\n";
    }
    catch (error){
      pixel8_console_div.innerHTML += pixel8_console_input.value+":\n"+"<div style='color:#ff386a'>"+error.toString()+"</div>";
    }
    pixel8_console_div.scrollTo(0,pixel8_console_div.scrollHeight)
  }
});

pixel8.compile = () => {
  w=c=vec=scale=undefined;
  pixel8.sound.sampleRateScale = (pixel8.sound.ctx.sampleRate/(eval(pixel8.waveTxt.split(",")[0])||8000));
  pixel8.error = "";
  try {
    pixel8.init=new Function (pixel8.initTxt);
    cls(3);
    pixel8.init();
    if (pixel8.updateTxt.substr(0,1)=="1") {
      vec=[];
      c=32/2-.5;
      w=32;
      scale=4;
      pixel8.update = new Function ("x","y",pixel8.updateTxt.substr(1));
    }
    else {
      pixel8.update = new Function (pixel8.updateTxt);
    }
    pixel8.wave=new Function((pixel8.waveTxt?"var t=pixel8.sound.t;var PI=Math.PI\nreturn "+pixel8.waveTxt+"":"return 0"));
    pixel8.wave();
  }
  catch(err) {
    pixel8.error=err.toString();
  }
}

pixel8.decodeT = (x) => {
  x=x.split(",");
  ["init","update","wave"].forEach((i,j) => {eval("pixel8."+i+"Txt = pixel8.decode(x[j]!=0?x[j]:'')")});
}
pixel8.initTxt=pixel8.updateTxt=pixel8.waveTxt="";

pixel8.encode = (x) => {
  var y="";
  x=x.split("");
  var l=Math.ceil(x.length/2);
  for (i=0;i<l;i++) {
    y+=String.fromCharCode(
      x[i*2].charCodeAt(0)+
      (x[i*2+1]||String.fromCharCode(32)).charCodeAt(0)*128+128
    );
  }
  return y;
}
pixel8.decode = (x) => {
  var y="";
  x=x.split("");
  for (i=0;i<x.length;i++) y+=String.fromCharCode((x[i].charCodeAt(0)-128)%128)+String.fromCharCode(parseInt((x[i].charCodeAt(0)-128)/128));
  return y;
}

pixel8.resize=()=>{
  var root = document.querySelector(":root");
  var width = window.innerWidth;
  var height = window.innerHeight;
  root.style.setProperty("--vw",width+"px");
  root.style.setProperty("--vh",height+"px");
  root.style.setProperty("--vmin",(width<height?width:height)+"px");
  root.style.setProperty("--vmax",(width>height?width:height)+"px");
};
window.addEventListener("resize",pixel8.resize);
pixel8.resize();

var url_string = window.location.href;
var url = new URL(url_string);
pixel8.cart = url.searchParams.get("cart");
if (pixel8.cart!=undefined) {
  pixel8.decodeT(pixel8.cart);
}
else {
  pixel8.decodeT("0,㈱㛯㲽㵞⸻㳳㨬᛹㷳Ὕ㡲᧴㲨㴬㈬㛯ᨥᚲᛴᛴᕣ㨻ᙺ㰽⸻㳳㨬⽹㨽㛣ᒲ㳳㨬᛹ᦳ㨯᛺ᕣ,0");
}

pixel8.inited = true;

window.onclick = function () {
  if (pixel8.inited) {
    pixel8.inited = false;
    document.querySelector(".play").remove();
    pixel8.canvas.style.background = pixel8.colors[0];
    pixel8.sound = [];
    pixel8.sound.ctx = new (window.AudioContext || window.webkitAudioContext)();
    pixel8.wave=()=>{return 0};
    pixel8.sound.processor = pixel8.sound.ctx.createScriptProcessor(0,1,1);
    pixel8.sound.sampleRateScale = Math.floor(pixel8.sound.ctx.sampleRate/8000);
    pixel8.sound.frame=0;
    pixel8.sound.t=0;
    pixel8.sound.processor.onaudioprocess = function(e) {
      pixel8.sound.out = e.outputBuffer;
      pixel8.sound.outData = pixel8.sound.out.getChannelData(0);
      for (var i=0;i<pixel8.sound.outData.length;i++,pixel8.sound.frame++) {
          pixel8.sound.out.getChannelData(0)[i] = pixel8.wave()/256%1;
        if (pixel8.sound.frame >= pixel8.sound.sampleRateScale) {
          pixel8.sound.frame = -1;
          pixel8.sound.t++;
        }
      }
    };
    pixel8.sound.processor.connect(pixel8.sound.ctx.destination);
    pixel8.compile();
    pixel8.updateF();
  }
}

let t=0;

pixel8.updateF = () =>  {
  if (pixel8.updateTxt.substr(0,1)=="1") {
    pixel8.ctx.clearRect(0,0,pixel8.canvas.width,pixel8.canvas.height);
    sz=1;col=3;
    for (var i=0;i<w;i++) {
      for (var j=0;j<w;j++) {
        x=i;y=j;sx=i;sy=j;
        try {
          pixel8.update(x,y);
        }
        catch(err) {
          pixel8.error=err.toString();
          break;
        }
        vec[i+j*w] = {x:sx,y:sy,z:sz,c:col};
      }
    }
    vec.sort((v1,v2) => {
      return v2.z - v1.z;
    });
    for (i in vec) {
      [sx,sy,sz,col]=[vec[i].x,vec[i].y,vec[i].z,vec[i].c];
      if (sz>0) {
        sx=sx*scale;
        sy=sy*scale;
        if (pixel8.error=="") {
          rectfill(sx,sy,scale,scale,parseInt(col)%32);
        }
      }
    }
  }
  else {
    try {
      pixel8.update();
    }
    catch(err) {
      pixel8.error=err.toString();
    }
  }
  if (pixel8.error!="") {
    cls(3);
    pixel8.errorL=pixel8.ctx.measureText(pixel8.error).width+8;
    for (i=2;i>0;i--) {
      print(pixel8.error.toLowerCase(),-t/4%pixel8.errorL,3+i,4+i);
      print(pixel8.error.toLowerCase(),-t/4%pixel8.errorL+pixel8.errorL,3+i,4+i);
    }
  }
  t++;
  requestAnimationFrame(pixel8.updateF);
}