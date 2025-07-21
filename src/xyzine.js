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
    return `floor(${a}${this.get_op()}${b})`;
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

  getx(d) {
    this.op = [];
    this.val = [];
    this.expf = [];
    this.bfreq = [];
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

  compilez2(exprStr) {
    const FUNCTIONS = {
      floor: Math.floor,
      abs: Math.abs,
      sign: Math.sign,
      sqrt: Math.sqrt,
      sin: Math.sin,
      cos: Math.cos,
      atan2: Math.atan2,
      min: Math.min,
      max: Math.max,
    };

    const tokenize = (expr) => {
      let i = 0, tokens = [];
      while (i < expr.length) {
        const c = expr[i];
        if (/\s/.test(c)) { i++; continue; }
        if (/[A-Za-z_]/.test(c)) {
          let start = i++;
          while (/[A-Za-z0-9_]/.test(expr[i])) i++;
          tokens.push(expr.slice(start, i));
        } else if (/\d/.test(c)) {
          let start = i++;
          while (/\d/.test(expr[i])) i++;
          if (expr[i] === '.') {
            i++;
            while (/\d/.test(expr[i])) i++;
          }
          tokens.push(expr.slice(start, i));
        } else if (expr.slice(i, i + 2) === '**' || expr.slice(i, i + 2) === '<<' || expr.slice(i, i + 2) === '>>') {
          tokens.push(expr.slice(i, i + 2)); i += 2;
        } else {
          tokens.push(c); i++;
        }
      }
      return tokens;
    };

    const parse = (tokens) => {
      let pos = 0;
      const peek = () => tokens[pos];
      const consume = (t) => {
        if (peek() == t) pos++;
        else throw `Expected '${t}' but got '${peek()}'`;
      };
      const parseExpression = () => parseBinary(parseBitwiseOr, ["+", "-"]);
      const parseBitwiseOr = () => parseBinary(parseBitwiseXor, ["|"]);
      const parseBitwiseXor = () => parseBinary(parseBitwiseAnd, ["^"]);
      const parseBitwiseAnd = () => parseBinary(parseShift, ["&"]);
      const parseShift = () => parseBinary(parseTerm, ["<<", ">>"]);
      const parseTerm = () => parseBinary(parseFactor, ["*", "/", "%"]);
      const parseFactor = () => parseBinary(parseUnary, ["**"]);
      const parseUnary = () => {
        if (peek() == "-") {
          consume("-"); const expr = parseUnary();
          if (expr.type == "const") return { type: "const", value: -expr.value };
          return { type: "unary", op: "-", expr };
        }
        if (peek() == "~") {
          consume("~"); const expr = parseUnary();
          if (expr.type == "const") return { type: "const", value: ~expr.value };
          return { type: "unary", op: "~", expr };
        }
        return parsePrimary();
      };
      const parseBinary = (subParser, ops) => {
        let left = subParser();
        while (ops.includes(peek())) {
          const op = peek(); consume(op);
          let right = subParser();
          if (left.type == "const" && right.type == "const") {
            const a = left.value, b = right.value;
            let result;
            switch (op) {
              case "+": result = a + b; break;
              case "-": result = a - b; break;
              case "*": result = a * b; break;
              case "/": result = b == 0 ? 0 : a / b; break;
              case "%": result = b == 0 ? 0 : a % b; break;
              case "**": result = Math.pow(a, b); break;
              case "&": result = a & b; break;
              case "|": result = a | b; break;
              case "^": result = a ^ b; break;
              case "<<": result = a << b; break;
              case ">>": result = a >> b; break;
              default: throw `Unknown op ${op}`;
            }
            left = { type: "const", value: result };
          } else {
            left = { type: "binary", op, left, right };
          }
        }
        return left;
      };
      const parsePrimary = () => {
        const token = peek();
        if (!token) throw "Unexpected end";
        if (token == "(") {
          consume("(");
          const expr = parseExpression();
          consume(")");
          return expr;
        }
        if (/^\d+(\.\d+)?$/.test(token)) {
          consume(token);
          return { type: "const", value: parseFloat(token) };
        }
        if (FUNCTIONS[token]) {
          const name = token;
          consume(name);
          consume("(");
          const args = [parseExpression()];
          while (peek() == ",") {
            consume(",");
            args.push(parseExpression());
          }
          consume(")");
          if (args.every(arg => arg.type == "const")) {
            return { type: "const", value: FUNCTIONS[name](...args.map(a => a.value)) };
          }
          return { type: "call", name, args };
        }
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
          consume(token);
          return { type: "var", name: token };
        }
        throw `Unexpected token: ${token}`;
      };
      const ast = parseExpression();
      if (pos < tokens.length) throw "Unexpected trailing input";
      return ast;
    };
    const evaluate = (node, vars) => {
      switch (node.type) {
        case "const": return node.value;
        case "var": return vars[node.name] ?? (() => { throw `Unknown variable: ${node.name}` })();
        case "unary": {
          const v = evaluate(node.expr, vars);
          return node.op == "-" ? -v : ~v;
        }
        case "binary": {
          const a = evaluate(node.left, vars), b = evaluate(node.right, vars);
          switch (node.op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return b == 0 ? 0 : a / b;
            case "%": return b == 0 ? 0 : a % b;
            case "**": return Math.pow(a, b);
            case "&": return a & b;
            case "|": return a | b;
            case "^": return a ^ b;
            case "<<": return a << b;
            case ">>": return a >> b;
          }
        }
        case "call": {
          const fn = FUNCTIONS[node.name];
          const args = node.args.map(arg => evaluate(arg, vars));
          return fn(...args);
        }
      }
    };
    const tokens = tokenize(exprStr);
    const ast = parse(tokens);
    return (x, y, px = 0, py = 0) => evaluate(ast, { x, y, px, py });
  }

  compilez3(exprStr) {
    const FUNCTIONS = {
      floor: Math.floor,
      abs: Math.abs,
      sign: Math.sign,
      sqrt: Math.sqrt,
      sin: Math.sin,
      cos: Math.cos,
      atan2: Math.atan2,
      min: Math.min,
      max: Math.max,
    };
    const OPCODES = {
      CONST: 0, VAR: 1,
      NEG: 2, NOT: 3,
      ADD: 4, SUB: 5, MUL: 6, DIV: 7, MOD: 8, POW: 9,
      AND: 10, OR: 11, XOR: 12, SHL: 13, SHR: 14,
      CALL: 15,
    };
    const tokenize = (expr) => {
      let i = 0, tokens = [];
      while (i < expr.length) {
        const c = expr[i];
        if (/\s/.test(c)) { i++; continue; }
        if (/[A-Za-z_]/.test(c)) {
          let start = i++;
          while (/[A-Za-z0-9_]/.test(expr[i])) i++;
          tokens.push(expr.slice(start, i));
        } else if (/\d/.test(c)) {
          let start = i++;
          while (/\d/.test(expr[i])) i++;
          if (expr[i] === '.') {
            i++;
            while (/\d/.test(expr[i])) i++;
          }
          tokens.push(expr.slice(start, i));
        } else if (expr.slice(i, i + 2) === '**' || expr.slice(i, i + 2) === '<<' || expr.slice(i, i + 2) === '>>') {
          tokens.push(expr.slice(i, i + 2)); i += 2;
        } else {
          tokens.push(c); i++;
        }
      }
      return tokens;
    };

    const parse = (tokens) => {
      let pos = 0;
      const peek = () => tokens[pos];
      const consume = (t) => { if (peek() == t) pos++; else throw `Expected '${t}'`; };
      const parseExpression = () => parseBinary(parseBitwiseOr, ["+", "-"]);
      const parseBitwiseOr = () => parseBinary(parseBitwiseXor, ["|"]);
      const parseBitwiseXor = () => parseBinary(parseBitwiseAnd, ["^"]);
      const parseBitwiseAnd = () => parseBinary(parseShift, ["&"]);
      const parseShift = () => parseBinary(parseTerm, ["<<", ">>"]);
      const parseTerm = () => parseBinary(parseFactor, ["*", "/", "%"]);
      const parseFactor = () => parseBinary(parseUnary, ["**"]);
      const parseUnary = () => {
        if (peek() == "-") {
          consume("-"); const expr = parseUnary();
          return ['NEG', expr];
        }
        if (peek() == "~") {
          consume("~"); const expr = parseUnary();
          return ['NOT', expr];
        }
        return parsePrimary();
      };
      const parseBinary = (sub, ops) => {
        let node = sub();
        while (ops.includes(peek())) {
          const op = peek(); consume(op);
          let right = sub();
          node = [op, node, right];
        }
        return node;
      };
      const parsePrimary = () => {
        const token = peek();
        if (!token) throw "Unexpected end";
        if (token == "(") {
          consume("(");
          const expr = parseExpression();
          consume(")");
          return expr;
        }
        if (/^\d+(\.\d+)?$/.test(token)) {
          consume(token);
          return ['CONST', parseFloat(token)];
        }
        if (FUNCTIONS[token]) {
          const name = token; consume(name); consume("(");
          const args = [parseExpression()];
          while (peek() == ",") {
            consume(","); args.push(parseExpression());
          }
          consume(")");
          return ['CALL', name, args];
        }
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
          consume(token);
          return ['VAR', token];
        }
        throw `Unexpected token ${token}`;
      };
      const ast = parseExpression();
      if (pos < tokens.length) throw "Unexpected trailing input";
      return ast;
    };
    const bytecode = [];
    const compileNode = (node) => {
      if (!node) return;
      const [type, ...rest] = node;
      switch (type) {
        case 'CONST': bytecode.push(OPCODES.CONST, rest[0]); break;
        case 'VAR': bytecode.push(OPCODES.VAR, rest[0]); break;
        case 'NEG': compileNode(rest[0]); bytecode.push(OPCODES.NEG); break;
        case 'NOT': compileNode(rest[0]); bytecode.push(OPCODES.NOT); break;
        case '+': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.ADD); break;
        case '-': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.SUB); break;
        case '*': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.MUL); break;
        case '/': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.DIV); break;
        case '%': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.MOD); break;
        case '**': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.POW); break;
        case '&': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.AND); break;
        case '|': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.OR); break;
        case '^': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.XOR); break;
        case '<<': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.SHL); break;
        case '>>': compileNode(rest[0]); compileNode(rest[1]); bytecode.push(OPCODES.SHR); break;
        case 'CALL':
          rest[1].forEach(arg => compileNode(arg));
          bytecode.push(OPCODES.CALL, rest[0], rest[1].length);
          break;
      }
    };
    compileNode(parse(tokenize(exprStr)));
    return (x, y, px = 0, py = 0) => {
      const stack = [];
      const vars = { x, y, px, py };
      let ip = 0;
      while (ip < bytecode.length) {
        const code = bytecode[ip++];
        switch (code) {
          case OPCODES.CONST: stack.push(bytecode[ip++]); break;
          case OPCODES.VAR: stack.push(vars[bytecode[ip++]] ?? (() => { throw "Unknown variable" })()); break;
          case OPCODES.NEG: stack.push(-stack.pop()); break;
          case OPCODES.NOT: stack.push(~stack.pop()); break;
          case OPCODES.ADD: stack.push(stack.pop() + stack.pop()); break;
          case OPCODES.SUB: { let b = stack.pop(); let a = stack.pop(); stack.push(a - b); break; }
          case OPCODES.MUL: stack.push(stack.pop() * stack.pop()); break;
          case OPCODES.DIV: { let b = stack.pop(); let a = stack.pop(); stack.push(b === 0 ? 0 : a / b); break; }
          case OPCODES.MOD: { let b = stack.pop(); let a = stack.pop(); stack.push(b === 0 ? 0 : a % b); break; }
          case OPCODES.POW: { let b = stack.pop(); let a = stack.pop(); stack.push(Math.pow(a, b)); break; }
          case OPCODES.AND: stack.push(stack.pop() & stack.pop()); break;
          case OPCODES.OR: stack.push(stack.pop() | stack.pop()); break;
          case OPCODES.XOR: stack.push(stack.pop() ^ stack.pop()); break;
          case OPCODES.SHL: { let b = stack.pop(); let a = stack.pop(); stack.push(a << b); break; }
          case OPCODES.SHR: { let b = stack.pop(); let a = stack.pop(); stack.push(a >> b); break; }
          case OPCODES.CALL: {
            const name = bytecode[ip++];
            const argc = bytecode[ip++];
            const args = stack.splice(-argc);
            stack.push(FUNCTIONS[name](...args));
            break;
          }
        }
      }
      return stack.pop();
    };
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

module.exports = XYZINE;
