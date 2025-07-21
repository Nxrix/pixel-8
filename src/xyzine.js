/* Based on Picotron xyzine demo by Lexaloffle */
/* https://www.lexaloffle.com/picotron.php */
class XYZINE {
  constructor() {
    this.op = [];
    this.val = [];
    this.expf = [];
    this.bfreq = [];
    this.rnds = ((BigInt(Date.now())^BigInt(Math.floor(Math.random()*0xFFFFFFFF)))&0xFFFFFFFFn)|7012135492040785920n;
  }

  rng(s=0n) {
    s = s|7012135492040785920n;
    return () => {
      s = (s*6364136223846793005n+1442695040888963407n)&18446744073709551615n;
      const x = Number(((s>>18n)^s)>>27n)>>>0;
      const r = Number(s>>59n);
      return ((x>>>r)|(x<<((32-r)&31)))>>>0;
    }
  }
  
  srnd(s) {
    this.rnds = (((s!=undefined&&s!=null)?BigInt(s):BigInt(Date.now())^BigInt(Math.floor(Math.random()*0xFFFFFFFF)))&0xFFFFFFFFn)|7012135492040785920n;
  }

  rnd(m) {
    this.rnds = (this.rnds*6364136223846793005n+1442695040888963407n)&18446744073709551615n;
    const x = Number(((this.rnds>>18n)^this.rnds)>>27n)>>>0;
    const r = Number(this.rnds>>59n);
    const o = (((x>>>r)|(x<<((32-r)&31)))>>>0)/0x100000000;
    if (Array.isArray(m)) {
      return m[o*m.length|0];
    } else {
      return o*(m||1);
    }
  }

  get_op() {
    if (this.op.length == 0) {
      this.op = ["+","+","-","*","/","^","^","&","|","%"];
    }
    return this.del(this.op,this.rnd(this.op));
  }

  get_val() {
    if (this.val.length == 0) {
      this.val = [
        "(x-px)","(y-py)",
        "abs(x)","abs(y)",
        "x","y","x","y",
        "3",
        Math.floor(1+this.rnd()* 4),
        Math.floor(1+this.rnd()* 8),
        Math.floor(1+this.rnd()*16),
        Math.floor(1+this.rnd()*64)
      ];
      const freq = 12;
      if (this.rnd()<1/freq) this.val.push("floor(sqrt(x*x+y*y))");
      if (this.rnd()<1/freq) this.val.push("(x*x+y*y)");
      if (this.rnd()<1/freq) this.val.push("floor(sqrt((x-px)^2+(y-py)^2))");
      if (this.rnd()<1/freq) this.val.push("max(abs(x),abs(y))");
      if (this.rnd()<1/freq) this.val.push("min(abs(x),abs(y))");
      if (this.rnd()<1/freq) this.val.push("(abs(x)+abs(y))");
      if (this.rnd()<1/freq) this.val.push("(max(abs(x),abs(y))+min(abs(x),abs(y)))/2");
      if (this.rnd()<1/freq) this.val.push("(x&y)");
      if (this.rnd()<1/freq) this.val.push("(x|y)");
      if (this.rnd()<1/freq) this.val.push("((x*x)>>7)");
      if (this.rnd()<1/freq) this.val.push("((y*y)>>7)");
      if (this.rnd()<1/freq) this.val.push("sign(x)");
      if (this.rnd()<1/freq) this.val.push("sign(y)");
    }
    return this.del(this.val,this.rnd(this.val));
  }

  exp_a_op_b(a,b) {
    const op = this.get_op();
    if (this.safe && (op === "/" || op === "%")) {
      return `((${b}!=0)?(${a}${op}${b}):0)`;
    }
    return `(${a}${op}${b})`;
  }

  exp_max(a,b) {
    return `max(${a},${b})`;
  }

  exp_min(a,b) {
    return `min(${a},${b})`;
  }

  exp_cos(a,b) {
    return `floor(cos(${a}/${b})*${this.get_val()})`;
  }

  exp_atan(a,b) {
    return `floor(atan2(${a},${b})*${this.get_val()})`;
  }

  exp(depth) {
    if (this.bfreq.length == 0) this.bfreq = [1,2,2,3];
    if (depth>this.del(this.bfreq,this.rnd(this.bfreq))) {
      return this.get_val();
    }
    const a = this.exp(depth+1);
    const b = this.exp(depth+1);
    if (this.expf.length == 0) {
      this.expf = [
        this.exp_a_op_b.bind(this),
        this.exp_a_op_b.bind(this),
        this.exp_a_op_b.bind(this),
        this.exp_a_op_b.bind(this),
        this.exp_max.bind(this),
        this.exp_min.bind(this),
        this.exp_cos.bind(this),
        this.exp_atan.bind(this)
      ];
    }
    const ff = this.del(this.expf, this.rnd(this.expf));
    return `(${ff(a,b)})`;
  }

  getx(d,s=0) {
    this.op = [];
    this.val = [];
    this.expf = [];
    this.bfreq = [];
    this.safe = s;
    return this.exp(d);
  }

  del(arr,value) {
    const idx = arr.indexOf(value);
    if (idx!=-1) {
      arr.splice(idx,1);
    }
    return value;
  }

  getr() {
    const ramps = [
      [0,20,24,1,2,3],
      [0,20,4,8,9,10,11,15,30,3],
      [0,20,4,5,6,7,31,3],
      [0,20,24,25,26,27,31,3],
      [0,20,21,22,23,19,3],
      [0,20,16,17,18,19,3],
      [0,20,16,12,13,14,15,30,3]
    ];
    const r = [];
    const v = this.rnd([1,1,1,1,2,2,2,3,4]);
    const a1 = ramps.slice();
    const a2 = ramps.slice();
    for (let i = 0; i < v; i++) {
      r.push(...this.del(a1,this.rnd(a1)));
      r.push(...this.del(a2,this.rnd(a2)).slice().reverse().slice(1,-1));
    }
    //for (let i=0;i<Math.floor(rnd()*4+4);i++) r.push(rnd(b));
    return r;
  }

  compilez = (() => {
    const operators = {
      "+":  [ 9, "left", 2, (a,b) => a + b ],
      "-":  [ 9, "left", 2, (a,b) => a - b ],
      "*":  [ 10,"left", 2, (a,b) => a * b ],
      "/":  [ 10,"left", 2, (a,b) => b !== 0 ? a / b : 0 ],
      "%":  [ 10,"left", 2, (a,b) => b !== 0 ? a % b : 0 ],
      "|":  [ 3, "left", 2, (a,b) => a | b ],
      "^":  [ 4, "left", 2, (a,b) => a ^ b ],
      "&":  [ 5, "left", 2, (a,b) => a & b ],
      "**": [ 11,"right",2, (a,b) => a ** b ],
      "<<": [ 8, "left", 2, (a,b) => a << b ],
      ">>": [ 8, "left", 2, (a,b) => a >> b ],
      "==": [ 6, "left", 2, (a,b) => a == b ],
      "||": [ 1, "left", 2, (a,b) => a || b ],
      "&&": [ 2, "left", 2, (a,b) => a && b ],
      "!=": [ 6, "left", 2, (a,b) => a != b ],
      "<=": [ 7, "left", 2, (a,b) => a <= b ],
      ">=": [ 7, "left", 2, (a,b) => a >= b ],
      "<":  [ 7, "left", 2, (a,b) => a < b ],
      ">":  [ 7, "left", 2, (a,b) => a > b ],
      "~":  [ 12,"right",1, a => ~a ],
      "!":  [ 12,"right",1, a => !a ],
      "u+": [ 12,"right",1, a => +a ],
      "u-": [ 12,"right",1, a => -a ],
    };
    const functions = {
      floor: Math.floor,
      round: Math.round,
      ceil:  Math.ceil,
      sign:  Math.sign,
      sqrt:  Math.sqrt,
      abs:   Math.abs,
      sin:   Math.sin,
      cos:   Math.cos,
      tan:   Math.tan,
      min:   Math.min,
      max:   Math.max,
      pow:   Math.pow,
      log:   Math.log,
      exp:   Math.exp,
      asin:  Math.asin,
      acos:  Math.acos,
      atan:  Math.atan,
      atan2: Math.atan2,
    };
    function tokenize(expr) {
      const regex = /\s*([A-Za-z_]\w*|\d*\.\d+|\d+|\*\*|==|!=|<=|>=|\|\||&&|[+\-*/%\^|&~<>()=,])\s*/g;
      const tokens = [];
      let m;
      while ((m = regex.exec(expr)) !== null) {
        tokens.push(m[1]);
      }
      return tokens;
    }
    function toRPN(tokens) {
      const output = [];
      const stack = [];
      let prevToken = null;
      for (let token of tokens) {
        if (!isNaN(token)) {
          output.push({ type: "number", value: parseFloat(token) });
        } else if (/^[A-Za-z_]\w*$/.test(token)) {
          if (functions[token]) {
            stack.push({ type:"func", value: token });
          } else {
            output.push({ type:"var", value: token });
          }
        } else if (token === ",") {
          while (stack.length && stack[stack.length-1].value !== "(") {
            output.push(stack.pop());
          }
        } else if (token === "(") {
          stack.push({ type:"paren", value:"(" });
        } else if (token === ")") {
          while (stack.length && stack[stack.length-1].value !== "(") {
            output.push(stack.pop());
          }
          stack.pop();
          if (stack.length && stack[stack.length-1].type === "func") {
            output.push(stack.pop());
          }
        } else {
          let op = token;
          if ((op === "+" || op === "-") &&
              (!prevToken || ["(", ",", "="].includes(prevToken))) {
            op = "u" + op;
          }
          if (!(op in operators)) throw new Error('Unknown operator ' + op);
          const [prec, assoc] = operators[op];
          while (stack.length) {
            const top = stack[stack.length-1];
            if (top.type === "func" || top.value === "(") break;
            const [tprec] = operators[top.value];
            if (tprec > prec || (tprec === prec && assoc === "left")) {
              output.push(stack.pop());
            } else break;
          }
          stack.push({ type:"op", value: op});
        }
        prevToken = token;
      }
      while (stack.length) output.push(stack.pop());
      return output;
    }
    function compilez(expr) {
      const tokens = tokenize(expr);
      const rpn = toRPN(tokens);
      return function(x, y, px = 0, py = 0) {
        const stack = [];
        for (let tok of rpn) {
          if (tok.type === "number") stack.push(tok.value);
          else if (tok.type === "var") {
            if (tok.value === "x") stack.push(x);
            else if (tok.value === "y") stack.push(y);
            else if (tok.value === "px") stack.push(px);
            else if (tok.value === "py") stack.push(py);
            else throw new Error("Unknown variable " + tok.value);
          } else if (tok.type === "func") {
            const fn = functions[tok.value];
            const arity = fn.length;
            const args = stack.splice(stack.length - arity, arity);
            stack.push(fn(...args));
          } else if (tok.type === "op") {
            const [ , , arity, fn] = operators[tok.value];
            if (arity === 1) {
              const a = stack.pop();
              stack.push(fn(a));
            } else {
              const b = stack.pop(), a = stack.pop();
              stack.push(fn(a, b));
            }
          }
        }
        return stack[0];
      };
    }
    compilez.functions = functions;
    return compilez;
  })();

}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = XYZINE;
}
