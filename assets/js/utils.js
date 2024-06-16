const utils = {};

/*
px8: {
  0: px8
  1: xyt
  2: pix
  3: glsl
  ...
}
*/

utils.encode = (arr, bitLength) => {
  let bitString = "";
  for (let num of arr) {
    let binaryString = num.toString(2).padStart(bitLength,"0");
    bitString += binaryString;
  }
  bitString += "1";
  while (bitString.length % 16 !== 0) {
    bitString += "0";
  }
  let result = "";
  for (let i = 0; i < bitString.length; i += 16) {
    let bits = bitString.substring(i, i + 16);
    let charCode = parseInt(bits, 2);
    let unicodeChar = String.fromCharCode(charCode);
    result += unicodeChar;
  }
  return result;
}

utils.decode = (str, bitLength) => {
  let bitString = "";
  for (let char of str) {
    let charCode = char.charCodeAt(0);
    let binaryString = charCode.toString(2).padStart(16, '0');
    bitString += binaryString;
  }
  let endMarkerIndex = bitString.lastIndexOf("1");
  bitString = bitString.substring(0, endMarkerIndex);
  let result = [];
  for (let i = 0; i < bitString.length; i += bitLength) {
    let bits = bitString.substring(i, i + bitLength);
    let num = parseInt(bits, 2);
    result.push(num);
  }
  return result;
}

utils.bitstrlength = (str) => {
  return str.split("").map(char => char.charCodeAt(0).toString(2)).join().length;
}

utils.encode8 = (arr) => {
  let result = "";
  for (let i = 0; i < arr.length; i += 2) {
    const bits = (arr[i] << 8) | arr[i + 1];
    const unicodeChar = String.fromCharCode(bits);
    result += unicodeChar;
  }
  return result;
}

utils.decode8 = (str) => {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    result.push(charCode >> 8, charCode & 0xFF);
  }
  return result;
}

utils.strcell8 = (cell,str) => {
  const bytes = Math.floor(cell.bits.getFreeBits() / 8);
  if(bytes < str.length) {
    cell.bits.writeString(str.substring(0, bytes));
    const newCell = utils.strcell8(new TonWeb.boc.Cell(),str.substring(bytes));
    cell.refs.push(newCell);
  } else {
    cell.bits.writeString(str);
  }
  return cell;
}

utils.strcell16 = (cell,str) => {
  const bytes = Math.floor(cell.bits.getFreeBits() / 16);
  const chars = Math.floor(bytes / 2);
  if(chars < str.length) {
    const substring = str.substring(0, chars);
    cell.bits.writeString(substring);
    const newCell = utils.strcell16(new TonWeb.boc.Cell(),str.substring(chars));
    cell.refs.push(newCell);
  } else {
    cell.bits.writeString(str);
  }
  return cell;
}

utils.copy = (text) => {
  if (!navigator.clipboard) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textarea);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log("Async: Copying to clipboard was successful!");
  }, function(err) {
    console.error("Async: Could not copy text: ", err);
  });
}

utils.makebmp = (width, height, colors) => {
  const palette = [
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
  const header = new Uint8Array([
    0x42, 0x4D,
    0x36, 0x28, 0x00, 0x00,
    0x00, 0x00,
    0x00, 0x00,
    0x36, 0x00, 0x00, 0x00,
    0x28, 0x00, 0x00, 0x00,
    width, 0x00, 0x00, 0x00,
    height, 0x00, 0x00, 0x00,
    0x01, 0x00,
    0x18, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x28, 0x00, 0x00,
    0x13, 0x0B, 0x00, 0x00,
    0x13, 0x0B, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
  ]);
  const rowpad = (4 - ((width * 3) % 4)) % 4;
  const pixelsize = (width * 3 + rowpad) * height;
  const fileSize = 54 + pixelsize;
  header[2] = fileSize & 0xff;
  header[3] = (fileSize >> 8) & 0xff;
  header[4] = (fileSize >> 16) & 0xff;
  header[5] = (fileSize >> 24) & 0xff;
  header[34] = pixelsize & 0xff;
  header[35] = (pixelsize >> 8) & 0xff;
  header[36] = (pixelsize >> 16) & 0xff;
  header[37] = (pixelsize >> 24) & 0xff;
  let pixels = new Uint8Array(pixelsize);
  let i = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const color = palette[colors[(width-x-1)+y*height]];
      pixels[i++] = color[2];
      pixels[i++] = color[1];
      pixels[i++] = color[0];
    }
    i += rowpad;
  }
  const data = new Uint8Array(header.length + pixels.length);
  data.set(header);
  data.set(pixels, header.length);
  return "data:image/bmp;base64," + btoa(String.fromCharCode.apply(null, data));
}
