
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
  pixel8.codeTab(pixel8.currentTab);
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
  pixel8.currentTab="update";
  pixel8.inputT.value=pixel8.updateTxt;
  input_syntax.innerHTML=Prism.highlight(pixel8.inputT.value,Prism.languages.js,"js").replaceAll("\n","<br>");
}

pixel8.initTxt=pixel8.updateTxt=pixel8.waveTxt="";
pixel8.codeTab = (tab) => {
  eval("pixel8."+pixel8.currentTab+"Txt=pixel8.inputT.value");
  pixel8.currentTab = tab;
  eval("pixel8.inputT.value = pixel8."+pixel8.currentTab+"Txt");
  input_syntax.innerHTML=Prism.highlight(pixel8.inputT.value,Prism.languages.js,"js").replaceAll("\n","<br>");
}

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

pixel8.inputT = document.getElementById("input");
pixel8.resize=()=>{
  var root = document.querySelector(":root");
  var width = window.innerWidth;
  var height = window.innerHeight;
  root.style.setProperty("--vw",width+"px");
  root.style.setProperty("--vh",height+"px");
  root.style.setProperty("--vmin",(width<height?width:height)+"px");
  root.style.setProperty("--vmax",(width>height?width:height)+"px");
  var width=pixel8.canvas.offsetWidth/128*122+"px";
  var height=pixel8.canvas.offsetWidth/128*100+"px";
  pixel8.inputT.style.width=width;
  input_syntax.style.width="calc("+width+" - "+pixel8.canvas.offsetWidth/128*5+"px"+")";
  input_syntax.style.marginRight=pixel8.canvas.offsetWidth/128*5+"px";
  pixel8.inputT.style.lineHeight=input_syntax.style.lineHeight=pixel8.canvas.offsetWidth/128*5+"px";
  pixel8.inputT.style.paddingTop=input_syntax.style.paddingTop=pixel8.canvas.offsetWidth/128+"px";
  pixel8.inputT.style.marginTop=input_syntax.style.marginTop=pixel8.canvas.offsetWidth/128+"px";
  pixel8.inputT.style.height=input_syntax.style.height=height;
};
window.addEventListener("resize",pixel8.resize);
pixel8.resize();
pixel8.inputT.addEventListener("scroll",function(e) {
  //pixel8.inputT.scrollTo(0,Math.floor(pixel8.inputT.scrollTop/16)*16);//pixel8.canvas.offsetWidth/128
  input_syntax.scrollTo(0,pixel8.inputT.scrollTop);
});
pixel8.inputT.addEventListener("input", function(e) {
  eval("pixel8."+pixel8.currentTab+"Txt=pixel8.inputT.value");
  input_syntax.innerHTML=Prism.highlight(pixel8.inputT.value,Prism.languages.js,"js").replaceAll("\n","<br>");
  pixel8.input = pixel8.inputT.value;
  input_syntax.scrollTo(0,pixel8.inputT.scrollTop);
});
pixel8.input = pixel8.inputT.value;
var url_string = window.location.href;
var url = new URL(url_string);
pixel8.cart = url.searchParams.get("cart");
if (pixel8.cart!=undefined) {
  pixel8.decodeT(pixel8.cart);
  pixel8.input = pixel8.inputT.value;
}

pixel8.addbtn = (x,y,i,j,d,s,a,b)=> {
  var xc = stat(6)+pixel8.camx;
  var yc = stat(7)+pixel8.camy;
  var dist=xc>x&yc>y&xc<x+d&yc<y+d
  var z=0;
  if (dist&&stat(8)) {
    pixel8.cursor = 2;
    var z=1;
    if (pixel8.page!="edit") {
      pixel8.inputT.style.display=input_syntax.style.display="none";
    }
  }
  else if (dist) {
    pixel8.cursor = 1;
  }
  else {
    var z=0;
  }
  spr(i,j+1,x,y+1+(b||0),s);
  spr(i,j,x,y+z+(a||0),s);
  return z;
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
      if (pixel8.page=="view"){
        for (var i=0;i<pixel8.sound.outData.length;i++,pixel8.sound.frame++) {
            pixel8.sound.out.getChannelData(0)[i] = pixel8.wave()/256%1;
          if (pixel8.sound.frame >= pixel8.sound.sampleRateScale) {
            pixel8.sound.frame = -1;
            pixel8.sound.t++;
          }
        }
      }
    };
    pixel8.sound.processor.connect(pixel8.sound.ctx.destination);
    pixel8.updateF();
  }
}
let t=0;
pixel8.page="init";
pixel8.cursor = 0;
pixel8.currentTab = "update";
pixel8.updateF = () =>  {
  if (pixel8.page!="view") {
    pixel8.ctx.clearRect(0,0,pixel8.canvas.width,pixel8.canvas.height);
  }
  pixel8.cursor = 0;
  switch (pixel8.page) {
    //--boot screen--//
    case "init":
      var cn=cos(t*6*(Math.PI/180));
      pixel8.ctx.save();
      pixel8.ctx.translate(48+16,44+16);
      pixel8.ctx.scale(cn,1);
      pixel8.ctx.translate(-48-16,-44-16);
      sspr(64-16,64-20,32,32,0,0,7,7);
      pixel8.ctx.restore();
      print("pixel-8",52,87,2);
      if (t>64) pixel8.page="main",pixel8.ctx.shadowColor="#0000",pixel8.ctx.shadowOffsetX=0,pixel8.ctx.shadowOffsetY=0,pixel8.canvas.style.background = pixel8.palette[3];
      else {
        pixel8.ctx.shadowColor=pixel8.palette[1];
        pixel8.ctx.shadowOffsetX=-2;
        pixel8.ctx.shadowOffsetY=2;
      }
      break;
    //--main page--//
    case "main":
      pixel8.inputT.style.display=input_syntax.style.display="none";
      var str = "welcome to pixel-8 0.9\n(c) 2023 D nxrix D".split("\n");
      for (i in str) {
        print(str[i],1,i*6+2,2);
        print(str[i],1,i*6+1,1);
      }
      break;
    //--editor--//
    case "edit": 
      pixel8.inputT.style.display=input_syntax.style.display="block";
      if (stat(7)<115&&stat(7)>13) {
        pixel8.cursor = 3;
      }
      rect(1.5,1.5,125,115,2,1);
      rectfill(3,3,122,10,2);
      print(pixel8.currentTab,125-pixel8.ctx.measureText(pixel8.currentTab).width,4,1);
      ["init","update","wave"].forEach((x,i) => {if (pixel8.addbtn(4+i*9,4,2+i,2,7,7,(pixel8.currentTab==x?1:0))) pixel8.codeTab(x)});
      break;
    //--viewer--//
    case "view":
    pixel8.inputT.style.display=input_syntax.style.display="none";
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
      if (pixel8.addbtn(2,61,4,0,7,7)) pixel8.page="edit",cls(3),pixel8.palette=pixel8.colors;
      if (pixel8.addbtn(118,61,8,0,7,7)) copyText("https://Nxrix.github.io/Pixel-8/?cart="+
        (pixel8.encode(pixel8.initTxt||"")||0)+","+
        (pixel8.encode(pixel8.updateTxt||"")||0)+","+
        (pixel8.encode(pixel8.waveTxt||"")||0)
      );
      break;
  }
  //--menu--//
  if (pixel8.page!="view"&&pixel8.page!="init") {
    rectfill(0,118,128,10,2);
    if (pixel8.addbtn(1,119,0,0,7,7)) pixel8.page="main";
    //if (pixel8.addbtn(11,119,2,0,7,7)) pixel8.page="store";
    if (pixel8.addbtn(110,119,1,0,7,7)) pixel8.page="edit";
    if (pixel8.addbtn(120,119,3,0,7,7)) {
      pixel8.sound.t=0;
      pixel8.compile();
      pixel8.page="view";
    }
  }
  spr(pixel8.cursor,4,pixel8.mouse.x+pixel8.camx,pixel8.mouse.y+pixel8.camy-(pixel8.cursor==3?4:0),9);
  t++;
  requestAnimationFrame(pixel8.updateF);
}