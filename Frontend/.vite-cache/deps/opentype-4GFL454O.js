import "./chunk-SNAQBZPT.js";

// node_modules/@splinetool/runtime/build/opentype.js
var va = (e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports);
var Ne = va(() => {
});
String.prototype.codePointAt || function() {
  var e = function() {
    try {
      var t = {}, a = Object.defineProperty, n = a(t, t, t) && a;
    } catch {
    }
    return n;
  }(), r = function(t) {
    if (this == null) throw TypeError();
    var a = String(this), n = a.length, s = t ? Number(t) : 0;
    if (s != s && (s = 0), !(s < 0 || s >= n)) {
      var i = a.charCodeAt(s), u;
      return i >= 55296 && i <= 56319 && n > s + 1 && (u = a.charCodeAt(s + 1), u >= 56320 && u <= 57343) ? (i - 55296) * 1024 + u - 56320 + 65536 : i;
    }
  };
  e ? e(String.prototype, "codePointAt", { value: r, configurable: true, writable: true }) : String.prototype.codePointAt = r;
}();
var Sr = 0;
var xt = -3;
function Le() {
  this.table = new Uint16Array(16), this.trans = new Uint16Array(288);
}
function da(e, r) {
  this.source = e, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = r, this.destLen = 0, this.ltree = new Le(), this.dtree = new Le();
}
var bt = new Le();
var St = new Le();
var Tr = new Uint8Array(30);
var kr = new Uint16Array(30);
var Tt = new Uint8Array(30);
var kt = new Uint16Array(30);
var ga = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var Br = new Le();
var se = new Uint8Array(288 + 32);
function Ft(e, r, t, a) {
  var n, s;
  for (n = 0; n < t; ++n) e[n] = 0;
  for (n = 0; n < 30 - t; ++n) e[n + t] = n / t | 0;
  for (s = a, n = 0; n < 30; ++n) r[n] = s, s += 1 << e[n];
}
function ma(e, r) {
  var t;
  for (t = 0; t < 7; ++t) e.table[t] = 0;
  for (e.table[7] = 24, e.table[8] = 152, e.table[9] = 112, t = 0; t < 24; ++t) e.trans[t] = 256 + t;
  for (t = 0; t < 144; ++t) e.trans[24 + t] = t;
  for (t = 0; t < 8; ++t) e.trans[24 + 144 + t] = 280 + t;
  for (t = 0; t < 112; ++t) e.trans[24 + 144 + 8 + t] = 144 + t;
  for (t = 0; t < 5; ++t) r.table[t] = 0;
  for (r.table[5] = 32, t = 0; t < 32; ++t) r.trans[t] = t;
}
var Ir = new Uint16Array(16);
function ar(e, r, t, a) {
  var n, s;
  for (n = 0; n < 16; ++n) e.table[n] = 0;
  for (n = 0; n < a; ++n) e.table[r[t + n]]++;
  for (e.table[0] = 0, s = 0, n = 0; n < 16; ++n) Ir[n] = s, s += e.table[n];
  for (n = 0; n < a; ++n) r[t + n] && (e.trans[Ir[r[t + n]]++] = n);
}
function ya(e) {
  e.bitcount-- || (e.tag = e.source[e.sourceIndex++], e.bitcount = 7);
  var r = e.tag & 1;
  return e.tag >>>= 1, r;
}
function ie(e, r, t) {
  if (!r) return t;
  for (; e.bitcount < 24; ) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
  var a = e.tag & 65535 >>> 16 - r;
  return e.tag >>>= r, e.bitcount -= r, a + t;
}
function hr(e, r) {
  for (; e.bitcount < 24; ) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
  var t = 0, a = 0, n = 0, s = e.tag;
  do
    a = 2 * a + (s & 1), s >>>= 1, ++n, t += r.table[n], a -= r.table[n];
  while (a >= 0);
  return e.tag = s, e.bitcount -= n, r.trans[t + a];
}
function xa(e, r, t) {
  var a, n, s, i, u, o;
  for (a = ie(e, 5, 257), n = ie(e, 5, 1), s = ie(e, 4, 4), i = 0; i < 19; ++i) se[i] = 0;
  for (i = 0; i < s; ++i) {
    var l = ie(e, 3, 0);
    se[ga[i]] = l;
  }
  for (ar(Br, se, 0, 19), u = 0; u < a + n; ) {
    var f = hr(e, Br);
    switch (f) {
      case 16:
        var h = se[u - 1];
        for (o = ie(e, 2, 3); o; --o) se[u++] = h;
        break;
      case 17:
        for (o = ie(e, 3, 3); o; --o) se[u++] = 0;
        break;
      case 18:
        for (o = ie(e, 7, 11); o; --o) se[u++] = 0;
        break;
      default:
        se[u++] = f;
        break;
    }
  }
  ar(r, se, 0, a), ar(t, se, a, n);
}
function Mr(e, r, t) {
  for (; ; ) {
    var a = hr(e, r);
    if (a === 256) return Sr;
    if (a < 256) e.dest[e.destLen++] = a;
    else {
      var n, s, i, u;
      for (a -= 257, n = ie(e, Tr[a], kr[a]), s = hr(e, t), i = e.destLen - ie(e, Tt[s], kt[s]), u = i; u < i + n; ++u) e.dest[e.destLen++] = e.dest[u];
    }
  }
}
function ba(e) {
  for (var r, t, a; e.bitcount > 8; ) e.sourceIndex--, e.bitcount -= 8;
  if (r = e.source[e.sourceIndex + 1], r = 256 * r + e.source[e.sourceIndex], t = e.source[e.sourceIndex + 3], t = 256 * t + e.source[e.sourceIndex + 2], r !== (~t & 65535)) return xt;
  for (e.sourceIndex += 4, a = r; a; --a) e.dest[e.destLen++] = e.source[e.sourceIndex++];
  return e.bitcount = 0, Sr;
}
function Sa(e, r) {
  var t = new da(e, r), a, n, s;
  do {
    switch (a = ya(t), n = ie(t, 2, 0), n) {
      case 0:
        s = ba(t);
        break;
      case 1:
        s = Mr(t, bt, St);
        break;
      case 2:
        xa(t, t.ltree, t.dtree), s = Mr(t, t.ltree, t.dtree);
        break;
      default:
        s = xt;
    }
    if (s !== Sr) throw new Error("Data error");
  } while (!a);
  return t.destLen < t.dest.length ? typeof t.dest.slice == "function" ? t.dest.slice(0, t.destLen) : t.dest.subarray(0, t.destLen) : t.dest;
}
ma(bt, St);
Ft(Tr, kr, 4, 3);
Ft(Tt, kt, 2, 1);
Tr[28] = 0;
kr[28] = 258;
var Ta = Sa;
function Te(e, r, t, a, n) {
  return Math.pow(1 - n, 3) * e + 3 * Math.pow(1 - n, 2) * n * r + 3 * (1 - n) * Math.pow(n, 2) * t + Math.pow(n, 3) * a;
}
function pe() {
  this.x1 = Number.NaN, this.y1 = Number.NaN, this.x2 = Number.NaN, this.y2 = Number.NaN;
}
pe.prototype.isEmpty = function() {
  return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};
pe.prototype.addPoint = function(e, r) {
  typeof e == "number" && ((isNaN(this.x1) || isNaN(this.x2)) && (this.x1 = e, this.x2 = e), e < this.x1 && (this.x1 = e), e > this.x2 && (this.x2 = e)), typeof r == "number" && ((isNaN(this.y1) || isNaN(this.y2)) && (this.y1 = r, this.y2 = r), r < this.y1 && (this.y1 = r), r > this.y2 && (this.y2 = r));
};
pe.prototype.addX = function(e) {
  this.addPoint(e, null);
};
pe.prototype.addY = function(e) {
  this.addPoint(null, e);
};
pe.prototype.addBezier = function(e, r, t, a, n, s, i, u) {
  var o = [e, r], l = [t, a], f = [n, s], h = [i, u];
  this.addPoint(e, r), this.addPoint(i, u);
  for (var p = 0; p <= 1; p++) {
    var c = 6 * o[p] - 12 * l[p] + 6 * f[p], d = -3 * o[p] + 9 * l[p] - 9 * f[p] + 3 * h[p], x = 3 * l[p] - 3 * o[p];
    if (d === 0) {
      if (c === 0) continue;
      var m = -x / c;
      0 < m && m < 1 && (p === 0 && this.addX(Te(o[p], l[p], f[p], h[p], m)), p === 1 && this.addY(Te(o[p], l[p], f[p], h[p], m)));
      continue;
    }
    var y = Math.pow(c, 2) - 4 * x * d;
    if (!(y < 0)) {
      var C = (-c + Math.sqrt(y)) / (2 * d);
      0 < C && C < 1 && (p === 0 && this.addX(Te(o[p], l[p], f[p], h[p], C)), p === 1 && this.addY(Te(o[p], l[p], f[p], h[p], C)));
      var S = (-c - Math.sqrt(y)) / (2 * d);
      0 < S && S < 1 && (p === 0 && this.addX(Te(o[p], l[p], f[p], h[p], S)), p === 1 && this.addY(Te(o[p], l[p], f[p], h[p], S)));
    }
  }
};
pe.prototype.addQuad = function(e, r, t, a, n, s) {
  var i = e + 0.6666666666666666 * (t - e), u = r + 2 / 3 * (a - r), o = i + 1 / 3 * (n - e), l = u + 1 / 3 * (s - r);
  this.addBezier(e, r, i, u, o, l, n, s);
};
function P() {
  this.commands = [], this.fill = "black", this.stroke = null, this.strokeWidth = 1;
}
P.prototype.moveTo = function(e, r) {
  this.commands.push({ type: "M", x: e, y: r });
};
P.prototype.lineTo = function(e, r) {
  this.commands.push({ type: "L", x: e, y: r });
};
P.prototype.curveTo = P.prototype.bezierCurveTo = function(e, r, t, a, n, s) {
  this.commands.push({ type: "C", x1: e, y1: r, x2: t, y2: a, x: n, y: s });
};
P.prototype.quadTo = P.prototype.quadraticCurveTo = function(e, r, t, a) {
  this.commands.push({ type: "Q", x1: e, y1: r, x: t, y: a });
};
P.prototype.close = P.prototype.closePath = function() {
  this.commands.push({ type: "Z" });
};
P.prototype.extend = function(e) {
  if (e.commands) e = e.commands;
  else if (e instanceof pe) {
    var r = e;
    this.moveTo(r.x1, r.y1), this.lineTo(r.x2, r.y1), this.lineTo(r.x2, r.y2), this.lineTo(r.x1, r.y2), this.close();
    return;
  }
  Array.prototype.push.apply(this.commands, e);
};
P.prototype.getBoundingBox = function() {
  for (var e = new pe(), r = 0, t = 0, a = 0, n = 0, s = 0; s < this.commands.length; s++) {
    var i = this.commands[s];
    switch (i.type) {
      case "M":
        e.addPoint(i.x, i.y), r = a = i.x, t = n = i.y;
        break;
      case "L":
        e.addPoint(i.x, i.y), a = i.x, n = i.y;
        break;
      case "Q":
        e.addQuad(a, n, i.x1, i.y1, i.x, i.y), a = i.x, n = i.y;
        break;
      case "C":
        e.addBezier(a, n, i.x1, i.y1, i.x2, i.y2, i.x, i.y), a = i.x, n = i.y;
        break;
      case "Z":
        a = r, n = t;
        break;
      default:
        throw new Error("Unexpected path command " + i.type);
    }
  }
  return e.isEmpty() && e.addPoint(0, 0), e;
};
P.prototype.draw = function(e) {
  e.beginPath();
  for (var r = 0; r < this.commands.length; r += 1) {
    var t = this.commands[r];
    t.type === "M" ? e.moveTo(t.x, t.y) : t.type === "L" ? e.lineTo(t.x, t.y) : t.type === "C" ? e.bezierCurveTo(t.x1, t.y1, t.x2, t.y2, t.x, t.y) : t.type === "Q" ? e.quadraticCurveTo(t.x1, t.y1, t.x, t.y) : t.type === "Z" && e.closePath();
  }
  this.fill && (e.fillStyle = this.fill, e.fill()), this.stroke && (e.strokeStyle = this.stroke, e.lineWidth = this.strokeWidth, e.stroke());
};
P.prototype.toPathData = function(e) {
  e = e !== void 0 ? e : 2;
  function r(i) {
    return Math.round(i) === i ? "" + Math.round(i) : i.toFixed(e);
  }
  function t() {
    for (var i = arguments, u = "", o = 0; o < arguments.length; o += 1) {
      var l = i[o];
      l >= 0 && o > 0 && (u += " "), u += r(l);
    }
    return u;
  }
  for (var a = "", n = 0; n < this.commands.length; n += 1) {
    var s = this.commands[n];
    s.type === "M" ? a += "M" + t(s.x, s.y) : s.type === "L" ? a += "L" + t(s.x, s.y) : s.type === "C" ? a += "C" + t(s.x1, s.y1, s.x2, s.y2, s.x, s.y) : s.type === "Q" ? a += "Q" + t(s.x1, s.y1, s.x, s.y) : s.type === "Z" && (a += "Z");
  }
  return a;
};
P.prototype.toSVG = function(e) {
  var r = '<path d="';
  return r += this.toPathData(e), r += '"', this.fill && this.fill !== "black" && (this.fill === null ? r += ' fill="none"' : r += ' fill="' + this.fill + '"'), this.stroke && (r += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"'), r += "/>", r;
};
P.prototype.toDOMElement = function(e) {
  var r = this.toPathData(e), t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", r), t;
};
function Ut(e) {
  throw new Error(e);
}
function Pr(e, r) {
  e || Ut(r);
}
var U = { fail: Ut, argument: Pr, assert: Pr };
var Gr = 32768;
var Nr = 2147483648;
var Fe = {};
var g = {};
var E = {};
function ae(e) {
  return function() {
    return e;
  };
}
g.BYTE = function(e) {
  return U.argument(e >= 0 && e <= 255, "Byte value should be between 0 and 255."), [e];
};
E.BYTE = ae(1);
g.CHAR = function(e) {
  return [e.charCodeAt(0)];
};
E.CHAR = ae(1);
g.CHARARRAY = function(e) {
  typeof e > "u" && (e = "", console.warn("Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name."));
  for (var r = [], t = 0; t < e.length; t += 1) r[t] = e.charCodeAt(t);
  return r;
};
E.CHARARRAY = function(e) {
  return typeof e > "u" ? 0 : e.length;
};
g.USHORT = function(e) {
  return [e >> 8 & 255, e & 255];
};
E.USHORT = ae(2);
g.SHORT = function(e) {
  return e >= Gr && (e = -(2 * Gr - e)), [e >> 8 & 255, e & 255];
};
E.SHORT = ae(2);
g.UINT24 = function(e) {
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
};
E.UINT24 = ae(3);
g.ULONG = function(e) {
  return [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255];
};
E.ULONG = ae(4);
g.LONG = function(e) {
  return e >= Nr && (e = -(2 * Nr - e)), [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255];
};
E.LONG = ae(4);
g.FIXED = g.ULONG;
E.FIXED = E.ULONG;
g.FWORD = g.SHORT;
E.FWORD = E.SHORT;
g.UFWORD = g.USHORT;
E.UFWORD = E.USHORT;
g.LONGDATETIME = function(e) {
  return [0, 0, 0, 0, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255];
};
E.LONGDATETIME = ae(8);
g.TAG = function(e) {
  return U.argument(e.length === 4, "Tag should be exactly 4 ASCII characters."), [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)];
};
E.TAG = ae(4);
g.Card8 = g.BYTE;
E.Card8 = E.BYTE;
g.Card16 = g.USHORT;
E.Card16 = E.USHORT;
g.OffSize = g.BYTE;
E.OffSize = E.BYTE;
g.SID = g.USHORT;
E.SID = E.USHORT;
g.NUMBER = function(e) {
  return e >= -107 && e <= 107 ? [e + 139] : e >= 108 && e <= 1131 ? (e = e - 108, [(e >> 8) + 247, e & 255]) : e >= -1131 && e <= -108 ? (e = -e - 108, [(e >> 8) + 251, e & 255]) : e >= -32768 && e <= 32767 ? g.NUMBER16(e) : g.NUMBER32(e);
};
E.NUMBER = function(e) {
  return g.NUMBER(e).length;
};
g.NUMBER16 = function(e) {
  return [28, e >> 8 & 255, e & 255];
};
E.NUMBER16 = ae(3);
g.NUMBER32 = function(e) {
  return [29, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255];
};
E.NUMBER32 = ae(5);
g.REAL = function(e) {
  var r = e.toString(), t = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(r);
  if (t) {
    var a = parseFloat("1e" + ((t[2] ? +t[2] : 0) + t[1].length));
    r = (Math.round(e * a) / a).toString();
  }
  for (var n = "", s = 0, i = r.length; s < i; s += 1) {
    var u = r[s];
    u === "e" ? n += r[++s] === "-" ? "c" : "b" : u === "." ? n += "a" : u === "-" ? n += "e" : n += u;
  }
  n += n.length & 1 ? "f" : "ff";
  for (var o = [30], l = 0, f = n.length; l < f; l += 2) o.push(parseInt(n.substr(l, 2), 16));
  return o;
};
E.REAL = function(e) {
  return g.REAL(e).length;
};
g.NAME = g.CHARARRAY;
E.NAME = E.CHARARRAY;
g.STRING = g.CHARARRAY;
E.STRING = E.CHARARRAY;
Fe.UTF8 = function(e, r, t) {
  for (var a = [], n = t, s = 0; s < n; s++, r += 1) a[s] = e.getUint8(r);
  return String.fromCharCode.apply(null, a);
};
Fe.UTF16 = function(e, r, t) {
  for (var a = [], n = t / 2, s = 0; s < n; s++, r += 2) a[s] = e.getUint16(r);
  return String.fromCharCode.apply(null, a);
};
g.UTF16 = function(e) {
  for (var r = [], t = 0; t < e.length; t += 1) {
    var a = e.charCodeAt(t);
    r[r.length] = a >> 8 & 255, r[r.length] = a & 255;
  }
  return r;
};
E.UTF16 = function(e) {
  return e.length * 2;
};
var cr = { "x-mac-croatian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ", "x-mac-cyrillic": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю", "x-mac-gaelic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ", "x-mac-greek": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­", "x-mac-icelandic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ", "x-mac-inuit": "ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł", "x-mac-ce": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ", macintosh: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ", "x-mac-romanian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ", "x-mac-turkish": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ" };
Fe.MACSTRING = function(e, r, t, a) {
  var n = cr[a];
  if (n !== void 0) {
    for (var s = "", i = 0; i < t; i++) {
      var u = e.getUint8(r + i);
      u <= 127 ? s += String.fromCharCode(u) : s += n[u & 127];
    }
    return s;
  }
};
var He = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap();
var ze;
var ka = function(e) {
  if (!ze) {
    ze = {};
    for (var r in cr) ze[r] = new String(r);
  }
  var t = ze[e];
  if (t !== void 0) {
    if (He) {
      var a = He.get(t);
      if (a !== void 0) return a;
    }
    var n = cr[e];
    if (n !== void 0) {
      for (var s = {}, i = 0; i < n.length; i++) s[n.charCodeAt(i)] = i + 128;
      return He && He.set(t, s), s;
    }
  }
};
g.MACSTRING = function(e, r) {
  var t = ka(r);
  if (t !== void 0) {
    for (var a = [], n = 0; n < e.length; n++) {
      var s = e.charCodeAt(n);
      if (s >= 128 && (s = t[s], s === void 0)) return;
      a[n] = s;
    }
    return a;
  }
};
E.MACSTRING = function(e, r) {
  var t = g.MACSTRING(e, r);
  return t !== void 0 ? t.length : 0;
};
function vr(e) {
  return e >= -128 && e <= 127;
}
function Fa(e, r, t) {
  for (var a = 0, n = e.length; r < n && a < 64 && e[r] === 0; ) ++r, ++a;
  return t.push(128 | a - 1), r;
}
function Ua(e, r, t) {
  for (var a = 0, n = e.length, s = r; s < n && a < 64; ) {
    var i = e[s];
    if (!vr(i) || i === 0 && s + 1 < n && e[s + 1] === 0) break;
    ++s, ++a;
  }
  t.push(a - 1);
  for (var u = r; u < s; ++u) t.push(e[u] + 256 & 255);
  return s;
}
function Ca(e, r, t) {
  for (var a = 0, n = e.length, s = r; s < n && a < 64; ) {
    var i = e[s];
    if (i === 0 || vr(i) && s + 1 < n && vr(e[s + 1])) break;
    ++s, ++a;
  }
  t.push(64 | a - 1);
  for (var u = r; u < s; ++u) {
    var o = e[u];
    t.push(o + 65536 >> 8 & 255, o + 256 & 255);
  }
  return s;
}
g.VARDELTAS = function(e) {
  for (var r = 0, t = []; r < e.length; ) {
    var a = e[r];
    a === 0 ? r = Fa(e, r, t) : a >= -128 && a <= 127 ? r = Ua(e, r, t) : r = Ca(e, r, t);
  }
  return t;
};
g.INDEX = function(e) {
  for (var r = 1, t = [r], a = [], n = 0; n < e.length; n += 1) {
    var s = g.OBJECT(e[n]);
    Array.prototype.push.apply(a, s), r += s.length, t.push(r);
  }
  if (a.length === 0) return [0, 0];
  for (var i = [], u = 1 + Math.floor(Math.log(r) / Math.log(2)) / 8 | 0, o = [void 0, g.BYTE, g.USHORT, g.UINT24, g.ULONG][u], l = 0; l < t.length; l += 1) {
    var f = o(t[l]);
    Array.prototype.push.apply(i, f);
  }
  return Array.prototype.concat(g.Card16(e.length), g.OffSize(u), i, a);
};
E.INDEX = function(e) {
  return g.INDEX(e).length;
};
g.DICT = function(e) {
  for (var r = [], t = Object.keys(e), a = t.length, n = 0; n < a; n += 1) {
    var s = parseInt(t[n], 0), i = e[s];
    r = r.concat(g.OPERAND(i.value, i.type)), r = r.concat(g.OPERATOR(s));
  }
  return r;
};
E.DICT = function(e) {
  return g.DICT(e).length;
};
g.OPERATOR = function(e) {
  return e < 1200 ? [e] : [12, e - 1200];
};
g.OPERAND = function(e, r) {
  var t = [];
  if (Array.isArray(r)) for (var a = 0; a < r.length; a += 1) U.argument(e.length === r.length, "Not enough arguments given for type" + r), t = t.concat(g.OPERAND(e[a], r[a]));
  else if (r === "SID") t = t.concat(g.NUMBER(e));
  else if (r === "offset") t = t.concat(g.NUMBER32(e));
  else if (r === "number") t = t.concat(g.NUMBER(e));
  else if (r === "real") t = t.concat(g.REAL(e));
  else throw new Error("Unknown operand type " + r);
  return t;
};
g.OP = g.BYTE;
E.OP = E.BYTE;
var We = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap();
g.CHARSTRING = function(e) {
  if (We) {
    var r = We.get(e);
    if (r !== void 0) return r;
  }
  for (var t = [], a = e.length, n = 0; n < a; n += 1) {
    var s = e[n];
    t = t.concat(g[s.type](s.value));
  }
  return We && We.set(e, t), t;
};
E.CHARSTRING = function(e) {
  return g.CHARSTRING(e).length;
};
g.OBJECT = function(e) {
  var r = g[e.type];
  return U.argument(r !== void 0, "No encoding function for type " + e.type), r(e.value);
};
E.OBJECT = function(e) {
  var r = E[e.type];
  return U.argument(r !== void 0, "No sizeOf function for type " + e.type), r(e.value);
};
g.TABLE = function(e) {
  for (var r = [], t = e.fields.length, a = [], n = [], s = 0; s < t; s += 1) {
    var i = e.fields[s], u = g[i.type];
    U.argument(u !== void 0, "No encoding function for field type " + i.type + " (" + i.name + ")");
    var o = e[i.name];
    o === void 0 && (o = i.value);
    var l = u(o);
    i.type === "TABLE" ? (n.push(r.length), r = r.concat([0, 0]), a.push(l)) : r = r.concat(l);
  }
  for (var f = 0; f < a.length; f += 1) {
    var h = n[f], p = r.length;
    U.argument(p < 65536, "Table " + e.tableName + " too big."), r[h] = p >> 8, r[h + 1] = p & 255, r = r.concat(a[f]);
  }
  return r;
};
E.TABLE = function(e) {
  for (var r = 0, t = e.fields.length, a = 0; a < t; a += 1) {
    var n = e.fields[a], s = E[n.type];
    U.argument(s !== void 0, "No sizeOf function for field type " + n.type + " (" + n.name + ")");
    var i = e[n.name];
    i === void 0 && (i = n.value), r += s(i), n.type === "TABLE" && (r += 2);
  }
  return r;
};
g.RECORD = g.TABLE;
E.RECORD = E.TABLE;
g.LITERAL = function(e) {
  return e;
};
E.LITERAL = function(e) {
  return e.length;
};
function z(e, r, t) {
  if (r.length && (r[0].name !== "coverageFormat" || r[0].value === 1)) for (var a = 0; a < r.length; a += 1) {
    var n = r[a];
    this[n.name] = n.value;
  }
  if (this.tableName = e, this.fields = r, t) for (var s = Object.keys(t), i = 0; i < s.length; i += 1) {
    var u = s[i], o = t[u];
    this[u] !== void 0 && (this[u] = o);
  }
}
z.prototype.encode = function() {
  return g.TABLE(this);
};
z.prototype.sizeOf = function() {
  return E.TABLE(this);
};
function Re(e, r, t) {
  t === void 0 && (t = r.length);
  var a = new Array(r.length + 1);
  a[0] = { name: e + "Count", type: "USHORT", value: t };
  for (var n = 0; n < r.length; n++) a[n + 1] = { name: e + n, type: "USHORT", value: r[n] };
  return a;
}
function dr(e, r, t) {
  var a = r.length, n = new Array(a + 1);
  n[0] = { name: e + "Count", type: "USHORT", value: a };
  for (var s = 0; s < a; s++) n[s + 1] = { name: e + s, type: "TABLE", value: t(r[s], s) };
  return n;
}
function we(e, r, t) {
  var a = r.length, n = [];
  n[0] = { name: e + "Count", type: "USHORT", value: a };
  for (var s = 0; s < a; s++) n = n.concat(t(r[s], s));
  return n;
}
function Ye(e) {
  e.format === 1 ? z.call(this, "coverageTable", [{ name: "coverageFormat", type: "USHORT", value: 1 }].concat(Re("glyph", e.glyphs))) : e.format === 2 ? z.call(this, "coverageTable", [{ name: "coverageFormat", type: "USHORT", value: 2 }].concat(we("rangeRecord", e.ranges, function(r) {
    return [{ name: "startGlyphID", type: "USHORT", value: r.start }, { name: "endGlyphID", type: "USHORT", value: r.end }, { name: "startCoverageIndex", type: "USHORT", value: r.index }];
  }))) : U.assert(false, "Coverage format must be 1 or 2.");
}
Ye.prototype = Object.create(z.prototype);
Ye.prototype.constructor = Ye;
function Ze(e) {
  z.call(this, "scriptListTable", we("scriptRecord", e, function(r, t) {
    var a = r.script, n = a.defaultLangSys;
    return U.assert(!!n, "Unable to write GSUB: script " + r.tag + " has no default language system."), [{ name: "scriptTag" + t, type: "TAG", value: r.tag }, { name: "script" + t, type: "TABLE", value: new z("scriptTable", [{ name: "defaultLangSys", type: "TABLE", value: new z("defaultLangSys", [{ name: "lookupOrder", type: "USHORT", value: 0 }, { name: "reqFeatureIndex", type: "USHORT", value: n.reqFeatureIndex }].concat(Re("featureIndex", n.featureIndexes))) }].concat(we("langSys", a.langSysRecords, function(s, i) {
      var u = s.langSys;
      return [{ name: "langSysTag" + i, type: "TAG", value: s.tag }, { name: "langSys" + i, type: "TABLE", value: new z("langSys", [{ name: "lookupOrder", type: "USHORT", value: 0 }, { name: "reqFeatureIndex", type: "USHORT", value: u.reqFeatureIndex }].concat(Re("featureIndex", u.featureIndexes))) }];
    }))) }];
  }));
}
Ze.prototype = Object.create(z.prototype);
Ze.prototype.constructor = Ze;
function Qe(e) {
  z.call(this, "featureListTable", we("featureRecord", e, function(r, t) {
    var a = r.feature;
    return [{ name: "featureTag" + t, type: "TAG", value: r.tag }, { name: "feature" + t, type: "TABLE", value: new z("featureTable", [{ name: "featureParams", type: "USHORT", value: a.featureParams }].concat(Re("lookupListIndex", a.lookupListIndexes))) }];
  }));
}
Qe.prototype = Object.create(z.prototype);
Qe.prototype.constructor = Qe;
function Ke(e, r) {
  z.call(this, "lookupListTable", dr("lookup", e, function(t) {
    var a = r[t.lookupType];
    return U.assert(!!a, "Unable to write GSUB lookup type " + t.lookupType + " tables."), new z("lookupTable", [{ name: "lookupType", type: "USHORT", value: t.lookupType }, { name: "lookupFlag", type: "USHORT", value: t.lookupFlag }].concat(dr("subtable", t.subtables, a)));
  }));
}
Ke.prototype = Object.create(z.prototype);
Ke.prototype.constructor = Ke;
var b = { Table: z, Record: z, Coverage: Ye, ScriptList: Ze, FeatureList: Qe, LookupList: Ke, ushortList: Re, tableList: dr, recordList: we };
function Hr(e, r) {
  return e.getUint8(r);
}
function Je(e, r) {
  return e.getUint16(r, false);
}
function Ea(e, r) {
  return e.getInt16(r, false);
}
function Fr(e, r) {
  return e.getUint32(r, false);
}
function Ct(e, r) {
  var t = e.getInt16(r, false), a = e.getUint16(r + 2, false);
  return t + a / 65535;
}
function Oa(e, r) {
  for (var t = "", a = r; a < r + 4; a += 1) t += String.fromCharCode(e.getInt8(a));
  return t;
}
function La(e, r, t) {
  for (var a = 0, n = 0; n < t; n += 1) a <<= 8, a += e.getUint8(r + n);
  return a;
}
function Ra(e, r, t) {
  for (var a = [], n = r; n < t; n += 1) a.push(e.getUint8(n));
  return a;
}
function wa(e) {
  for (var r = "", t = 0; t < e.length; t += 1) r += String.fromCharCode(e[t]);
  return r;
}
var Da = { byte: 1, uShort: 2, short: 2, uLong: 4, fixed: 4, longDateTime: 8, tag: 4 };
function v(e, r) {
  this.data = e, this.offset = r, this.relativeOffset = 0;
}
v.prototype.parseByte = function() {
  var e = this.data.getUint8(this.offset + this.relativeOffset);
  return this.relativeOffset += 1, e;
};
v.prototype.parseChar = function() {
  var e = this.data.getInt8(this.offset + this.relativeOffset);
  return this.relativeOffset += 1, e;
};
v.prototype.parseCard8 = v.prototype.parseByte;
v.prototype.parseUShort = function() {
  var e = this.data.getUint16(this.offset + this.relativeOffset);
  return this.relativeOffset += 2, e;
};
v.prototype.parseCard16 = v.prototype.parseUShort;
v.prototype.parseSID = v.prototype.parseUShort;
v.prototype.parseOffset16 = v.prototype.parseUShort;
v.prototype.parseShort = function() {
  var e = this.data.getInt16(this.offset + this.relativeOffset);
  return this.relativeOffset += 2, e;
};
v.prototype.parseF2Dot14 = function() {
  var e = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
  return this.relativeOffset += 2, e;
};
v.prototype.parseULong = function() {
  var e = Fr(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 4, e;
};
v.prototype.parseOffset32 = v.prototype.parseULong;
v.prototype.parseFixed = function() {
  var e = Ct(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 4, e;
};
v.prototype.parseString = function(e) {
  var r = this.data, t = this.offset + this.relativeOffset, a = "";
  this.relativeOffset += e;
  for (var n = 0; n < e; n++) a += String.fromCharCode(r.getUint8(t + n));
  return a;
};
v.prototype.parseTag = function() {
  return this.parseString(4);
};
v.prototype.parseLongDateTime = function() {
  var e = Fr(this.data, this.offset + this.relativeOffset + 4);
  return e -= 2082844800, this.relativeOffset += 8, e;
};
v.prototype.parseVersion = function(e) {
  var r = Je(this.data, this.offset + this.relativeOffset), t = Je(this.data, this.offset + this.relativeOffset + 2);
  return this.relativeOffset += 4, e === void 0 && (e = 4096), r + t / e / 10;
};
v.prototype.skip = function(e, r) {
  r === void 0 && (r = 1), this.relativeOffset += Da[e] * r;
};
v.prototype.parseULongList = function(e) {
  e === void 0 && (e = this.parseULong());
  for (var r = new Array(e), t = this.data, a = this.offset + this.relativeOffset, n = 0; n < e; n++) r[n] = t.getUint32(a), a += 4;
  return this.relativeOffset += e * 4, r;
};
v.prototype.parseOffset16List = v.prototype.parseUShortList = function(e) {
  e === void 0 && (e = this.parseUShort());
  for (var r = new Array(e), t = this.data, a = this.offset + this.relativeOffset, n = 0; n < e; n++) r[n] = t.getUint16(a), a += 2;
  return this.relativeOffset += e * 2, r;
};
v.prototype.parseShortList = function(e) {
  for (var r = new Array(e), t = this.data, a = this.offset + this.relativeOffset, n = 0; n < e; n++) r[n] = t.getInt16(a), a += 2;
  return this.relativeOffset += e * 2, r;
};
v.prototype.parseByteList = function(e) {
  for (var r = new Array(e), t = this.data, a = this.offset + this.relativeOffset, n = 0; n < e; n++) r[n] = t.getUint8(a++);
  return this.relativeOffset += e, r;
};
v.prototype.parseList = function(e, r) {
  r || (r = e, e = this.parseUShort());
  for (var t = new Array(e), a = 0; a < e; a++) t[a] = r.call(this);
  return t;
};
v.prototype.parseList32 = function(e, r) {
  r || (r = e, e = this.parseULong());
  for (var t = new Array(e), a = 0; a < e; a++) t[a] = r.call(this);
  return t;
};
v.prototype.parseRecordList = function(e, r) {
  r || (r = e, e = this.parseUShort());
  for (var t = new Array(e), a = Object.keys(r), n = 0; n < e; n++) {
    for (var s = {}, i = 0; i < a.length; i++) {
      var u = a[i], o = r[u];
      s[u] = o.call(this);
    }
    t[n] = s;
  }
  return t;
};
v.prototype.parseRecordList32 = function(e, r) {
  r || (r = e, e = this.parseULong());
  for (var t = new Array(e), a = Object.keys(r), n = 0; n < e; n++) {
    for (var s = {}, i = 0; i < a.length; i++) {
      var u = a[i], o = r[u];
      s[u] = o.call(this);
    }
    t[n] = s;
  }
  return t;
};
v.prototype.parseStruct = function(e) {
  if (typeof e == "function") return e.call(this);
  for (var r = Object.keys(e), t = {}, a = 0; a < r.length; a++) {
    var n = r[a], s = e[n];
    t[n] = s.call(this);
  }
  return t;
};
v.prototype.parseValueRecord = function(e) {
  if (e === void 0 && (e = this.parseUShort()), e !== 0) {
    var r = {};
    return e & 1 && (r.xPlacement = this.parseShort()), e & 2 && (r.yPlacement = this.parseShort()), e & 4 && (r.xAdvance = this.parseShort()), e & 8 && (r.yAdvance = this.parseShort()), e & 16 && (r.xPlaDevice = void 0, this.parseShort()), e & 32 && (r.yPlaDevice = void 0, this.parseShort()), e & 64 && (r.xAdvDevice = void 0, this.parseShort()), e & 128 && (r.yAdvDevice = void 0, this.parseShort()), r;
  }
};
v.prototype.parseValueRecordList = function() {
  for (var e = this.parseUShort(), r = this.parseUShort(), t = new Array(r), a = 0; a < r; a++) t[a] = this.parseValueRecord(e);
  return t;
};
v.prototype.parsePointer = function(e) {
  var r = this.parseOffset16();
  if (r > 0) return new v(this.data, this.offset + r).parseStruct(e);
};
v.prototype.parsePointer32 = function(e) {
  var r = this.parseOffset32();
  if (r > 0) return new v(this.data, this.offset + r).parseStruct(e);
};
v.prototype.parseListOfLists = function(e) {
  for (var r = this.parseOffset16List(), t = r.length, a = this.relativeOffset, n = new Array(t), s = 0; s < t; s++) {
    var i = r[s];
    if (i === 0) {
      n[s] = void 0;
      continue;
    }
    if (this.relativeOffset = i, e) {
      for (var u = this.parseOffset16List(), o = new Array(u.length), l = 0; l < u.length; l++) this.relativeOffset = i + u[l], o[l] = e.call(this);
      n[s] = o;
    } else n[s] = this.parseUShortList();
  }
  return this.relativeOffset = a, n;
};
v.prototype.parseCoverage = function() {
  var e = this.offset + this.relativeOffset, r = this.parseUShort(), t = this.parseUShort();
  if (r === 1) return { format: 1, glyphs: this.parseUShortList(t) };
  if (r === 2) {
    for (var a = new Array(t), n = 0; n < t; n++) a[n] = { start: this.parseUShort(), end: this.parseUShort(), index: this.parseUShort() };
    return { format: 2, ranges: a };
  }
  throw new Error("0x" + e.toString(16) + ": Coverage format must be 1 or 2.");
};
v.prototype.parseClassDef = function() {
  var e = this.offset + this.relativeOffset, r = this.parseUShort();
  if (r === 1) return { format: 1, startGlyph: this.parseUShort(), classes: this.parseUShortList() };
  if (r === 2) return { format: 2, ranges: this.parseRecordList({ start: v.uShort, end: v.uShort, classId: v.uShort }) };
  throw new Error("0x" + e.toString(16) + ": ClassDef format must be 1 or 2.");
};
v.list = function(e, r) {
  return function() {
    return this.parseList(e, r);
  };
};
v.list32 = function(e, r) {
  return function() {
    return this.parseList32(e, r);
  };
};
v.recordList = function(e, r) {
  return function() {
    return this.parseRecordList(e, r);
  };
};
v.recordList32 = function(e, r) {
  return function() {
    return this.parseRecordList32(e, r);
  };
};
v.pointer = function(e) {
  return function() {
    return this.parsePointer(e);
  };
};
v.pointer32 = function(e) {
  return function() {
    return this.parsePointer32(e);
  };
};
v.tag = v.prototype.parseTag;
v.byte = v.prototype.parseByte;
v.uShort = v.offset16 = v.prototype.parseUShort;
v.uShortList = v.prototype.parseUShortList;
v.uLong = v.offset32 = v.prototype.parseULong;
v.uLongList = v.prototype.parseULongList;
v.struct = v.prototype.parseStruct;
v.coverage = v.prototype.parseCoverage;
v.classDef = v.prototype.parseClassDef;
var zr = { reserved: v.uShort, reqFeatureIndex: v.uShort, featureIndexes: v.uShortList };
v.prototype.parseScriptList = function() {
  return this.parsePointer(v.recordList({ tag: v.tag, script: v.pointer({ defaultLangSys: v.pointer(zr), langSysRecords: v.recordList({ tag: v.tag, langSys: v.pointer(zr) }) }) })) || [];
};
v.prototype.parseFeatureList = function() {
  return this.parsePointer(v.recordList({ tag: v.tag, feature: v.pointer({ featureParams: v.offset16, lookupListIndexes: v.uShortList }) })) || [];
};
v.prototype.parseLookupList = function(e) {
  return this.parsePointer(v.list(v.pointer(function() {
    var r = this.parseUShort();
    U.argument(1 <= r && r <= 9, "GPOS/GSUB lookup type " + r + " unknown.");
    var t = this.parseUShort(), a = t & 16;
    return { lookupType: r, lookupFlag: t, subtables: this.parseList(v.pointer(e[r])), markFilteringSet: a ? this.parseUShort() : void 0 };
  }))) || [];
};
v.prototype.parseFeatureVariationsList = function() {
  return this.parsePointer32(function() {
    var e = this.parseUShort(), r = this.parseUShort();
    U.argument(e === 1 && r < 1, "GPOS/GSUB feature variations table unknown.");
    var t = this.parseRecordList32({ conditionSetOffset: v.offset32, featureTableSubstitutionOffset: v.offset32 });
    return t;
  }) || [];
};
var k = { getByte: Hr, getCard8: Hr, getUShort: Je, getCard16: Je, getShort: Ea, getULong: Fr, getFixed: Ct, getTag: Oa, getOffset: La, getBytes: Ra, bytesToString: wa, Parser: v };
function Aa(e, r) {
  r.parseUShort(), e.length = r.parseULong(), e.language = r.parseULong();
  var t;
  e.groupCount = t = r.parseULong(), e.glyphIndexMap = {};
  for (var a = 0; a < t; a += 1) for (var n = r.parseULong(), s = r.parseULong(), i = r.parseULong(), u = n; u <= s; u += 1) e.glyphIndexMap[u] = i, i++;
}
function Ba(e, r, t, a, n) {
  e.length = r.parseUShort(), e.language = r.parseUShort();
  var s;
  e.segCount = s = r.parseUShort() >> 1, r.skip("uShort", 3), e.glyphIndexMap = {};
  for (var i = new k.Parser(t, a + n + 14), u = new k.Parser(t, a + n + 16 + s * 2), o = new k.Parser(t, a + n + 16 + s * 4), l = new k.Parser(t, a + n + 16 + s * 6), f = a + n + 16 + s * 8, h = 0; h < s - 1; h += 1) for (var p = void 0, c = i.parseUShort(), d = u.parseUShort(), x = o.parseShort(), m = l.parseUShort(), y = d; y <= c; y += 1) m !== 0 ? (f = l.offset + l.relativeOffset - 2, f += m, f += (y - d) * 2, p = k.getUShort(t, f), p !== 0 && (p = p + x & 65535)) : p = y + x & 65535, e.glyphIndexMap[y] = p;
}
function Ia(e, r) {
  var t = {};
  t.version = k.getUShort(e, r), U.argument(t.version === 0, "cmap table version should be 0."), t.numTables = k.getUShort(e, r + 2);
  for (var a = -1, n = t.numTables - 1; n >= 0; n -= 1) {
    var s = k.getUShort(e, r + 4 + n * 8), i = k.getUShort(e, r + 4 + n * 8 + 2);
    if (s === 3 && (i === 0 || i === 1 || i === 10) || s === 0 && (i === 0 || i === 1 || i === 2 || i === 3 || i === 4)) {
      a = k.getULong(e, r + 4 + n * 8 + 4);
      break;
    }
  }
  if (a === -1) throw new Error("No valid cmap sub-tables found.");
  var u = new k.Parser(e, r + a);
  if (t.format = u.parseUShort(), t.format === 12) Aa(t, u);
  else if (t.format === 4) Ba(t, u, e, r, a);
  else throw new Error("Only format 4 and 12 cmap tables are supported (found format " + t.format + ").");
  return t;
}
function Ma(e, r, t) {
  e.segments.push({ end: r, start: r, delta: -(r - t), offset: 0, glyphIndex: t });
}
function Pa(e) {
  e.segments.push({ end: 65535, start: 65535, delta: 1, offset: 0 });
}
function Ga(e) {
  var r = true, t;
  for (t = e.length - 1; t > 0; t -= 1) {
    var a = e.get(t);
    if (a.unicode > 65535) {
      console.log("Adding CMAP format 12 (needed!)"), r = false;
      break;
    }
  }
  var n = [{ name: "version", type: "USHORT", value: 0 }, { name: "numTables", type: "USHORT", value: r ? 1 : 2 }, { name: "platformID", type: "USHORT", value: 3 }, { name: "encodingID", type: "USHORT", value: 1 }, { name: "offset", type: "ULONG", value: r ? 12 : 12 + 8 }];
  r || (n = n.concat([{ name: "cmap12PlatformID", type: "USHORT", value: 3 }, { name: "cmap12EncodingID", type: "USHORT", value: 10 }, { name: "cmap12Offset", type: "ULONG", value: 0 }])), n = n.concat([{ name: "format", type: "USHORT", value: 4 }, { name: "cmap4Length", type: "USHORT", value: 0 }, { name: "language", type: "USHORT", value: 0 }, { name: "segCountX2", type: "USHORT", value: 0 }, { name: "searchRange", type: "USHORT", value: 0 }, { name: "entrySelector", type: "USHORT", value: 0 }, { name: "rangeShift", type: "USHORT", value: 0 }]);
  var s = new b.Table("cmap", n);
  for (s.segments = [], t = 0; t < e.length; t += 1) {
    for (var i = e.get(t), u = 0; u < i.unicodes.length; u += 1) Ma(s, i.unicodes[u], t);
    s.segments = s.segments.sort(function(C, S) {
      return C.start - S.start;
    });
  }
  Pa(s);
  var o = s.segments.length, l = 0, f = [], h = [], p = [], c = [], d = [], x = [];
  for (t = 0; t < o; t += 1) {
    var m = s.segments[t];
    m.end <= 65535 && m.start <= 65535 ? (f = f.concat({ name: "end_" + t, type: "USHORT", value: m.end }), h = h.concat({ name: "start_" + t, type: "USHORT", value: m.start }), p = p.concat({ name: "idDelta_" + t, type: "SHORT", value: m.delta }), c = c.concat({ name: "idRangeOffset_" + t, type: "USHORT", value: m.offset }), m.glyphId !== void 0 && (d = d.concat({ name: "glyph_" + t, type: "USHORT", value: m.glyphId }))) : l += 1, !r && m.glyphIndex !== void 0 && (x = x.concat({ name: "cmap12Start_" + t, type: "ULONG", value: m.start }), x = x.concat({ name: "cmap12End_" + t, type: "ULONG", value: m.end }), x = x.concat({ name: "cmap12Glyph_" + t, type: "ULONG", value: m.glyphIndex }));
  }
  if (s.segCountX2 = (o - l) * 2, s.searchRange = Math.pow(2, Math.floor(Math.log(o - l) / Math.log(2))) * 2, s.entrySelector = Math.log(s.searchRange / 2) / Math.log(2), s.rangeShift = s.segCountX2 - s.searchRange, s.fields = s.fields.concat(f), s.fields.push({ name: "reservedPad", type: "USHORT", value: 0 }), s.fields = s.fields.concat(h), s.fields = s.fields.concat(p), s.fields = s.fields.concat(c), s.fields = s.fields.concat(d), s.cmap4Length = 14 + f.length * 2 + 2 + h.length * 2 + p.length * 2 + c.length * 2 + d.length * 2, !r) {
    var y = 16 + x.length * 4;
    s.cmap12Offset = 12 + 2 * 2 + 4 + s.cmap4Length, s.fields = s.fields.concat([{ name: "cmap12Format", type: "USHORT", value: 12 }, { name: "cmap12Reserved", type: "USHORT", value: 0 }, { name: "cmap12Length", type: "ULONG", value: y }, { name: "cmap12Language", type: "ULONG", value: 0 }, { name: "cmap12nGroups", type: "ULONG", value: x.length / 3 }]), s.fields = s.fields.concat(x);
  }
  return s;
}
var Et = { parse: Ia, make: Ga };
var qe = [".notdef", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "endash", "dagger", "daggerdbl", "periodcentered", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", "questiondown", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "emdash", "AE", "ordfeminine", "Lslash", "Oslash", "OE", "ordmasculine", "ae", "dotlessi", "lslash", "oslash", "oe", "germandbls", "onesuperior", "logicalnot", "mu", "trademark", "Eth", "onehalf", "plusminus", "Thorn", "onequarter", "divide", "brokenbar", "degree", "thorn", "threequarters", "twosuperior", "registered", "minus", "eth", "multiply", "threesuperior", "copyright", "Aacute", "Acircumflex", "Adieresis", "Agrave", "Aring", "Atilde", "Ccedilla", "Eacute", "Ecircumflex", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Ntilde", "Oacute", "Ocircumflex", "Odieresis", "Ograve", "Otilde", "Scaron", "Uacute", "Ucircumflex", "Udieresis", "Ugrave", "Yacute", "Ydieresis", "Zcaron", "aacute", "acircumflex", "adieresis", "agrave", "aring", "atilde", "ccedilla", "eacute", "ecircumflex", "edieresis", "egrave", "iacute", "icircumflex", "idieresis", "igrave", "ntilde", "oacute", "ocircumflex", "odieresis", "ograve", "otilde", "scaron", "uacute", "ucircumflex", "udieresis", "ugrave", "yacute", "ydieresis", "zcaron", "exclamsmall", "Hungarumlautsmall", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "266 ff", "onedotenleader", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "isuperior", "lsuperior", "msuperior", "nsuperior", "osuperior", "rsuperior", "ssuperior", "tsuperior", "ff", "ffi", "ffl", "parenleftinferior", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "exclamdownsmall", "centoldstyle", "Lslashsmall", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall", "Dotaccentsmall", "Macronsmall", "figuredash", "hypheninferior", "Ogoneksmall", "Ringsmall", "Cedillasmall", "questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "zerosuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall", "001.000", "001.001", "001.002", "001.003", "Black", "Bold", "Book", "Light", "Medium", "Regular", "Roman", "Semibold"];
var Na = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "", "endash", "dagger", "daggerdbl", "periodcentered", "", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", "", "questiondown", "", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "", "ring", "cedilla", "", "hungarumlaut", "ogonek", "caron", "emdash", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "AE", "", "ordfeminine", "", "", "", "", "Lslash", "Oslash", "OE", "ordmasculine", "", "", "", "", "", "ae", "", "", "", "dotlessi", "", "", "lslash", "oslash", "oe", "germandbls"];
var Ha = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "space", "exclamsmall", "Hungarumlautsmall", "", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "twodotenleader", "onedotenleader", "comma", "hyphen", "period", "fraction", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "colon", "semicolon", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "", "", "isuperior", "", "", "lsuperior", "msuperior", "nsuperior", "osuperior", "", "", "rsuperior", "ssuperior", "tsuperior", "", "ff", "fi", "fl", "ffi", "ffl", "parenleftinferior", "", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "exclamdownsmall", "centoldstyle", "Lslashsmall", "", "", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall", "", "Dotaccentsmall", "", "", "Macronsmall", "", "", "figuredash", "hypheninferior", "", "", "Ogoneksmall", "Ringsmall", "Cedillasmall", "", "", "", "onequarter", "onehalf", "threequarters", "questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "", "", "zerosuperior", "onesuperior", "twosuperior", "threesuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall"];
var xe = [".notdef", ".null", "nonmarkingreturn", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quotesingle", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "grave", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "Adieresis", "Aring", "Ccedilla", "Eacute", "Ntilde", "Odieresis", "Udieresis", "aacute", "agrave", "acircumflex", "adieresis", "atilde", "aring", "ccedilla", "eacute", "egrave", "ecircumflex", "edieresis", "iacute", "igrave", "icircumflex", "idieresis", "ntilde", "oacute", "ograve", "ocircumflex", "odieresis", "otilde", "uacute", "ugrave", "ucircumflex", "udieresis", "dagger", "degree", "cent", "sterling", "section", "bullet", "paragraph", "germandbls", "registered", "copyright", "trademark", "acute", "dieresis", "notequal", "AE", "Oslash", "infinity", "plusminus", "lessequal", "greaterequal", "yen", "mu", "partialdiff", "summation", "product", "pi", "integral", "ordfeminine", "ordmasculine", "Omega", "ae", "oslash", "questiondown", "exclamdown", "logicalnot", "radical", "florin", "approxequal", "Delta", "guillemotleft", "guillemotright", "ellipsis", "nonbreakingspace", "Agrave", "Atilde", "Otilde", "OE", "oe", "endash", "emdash", "quotedblleft", "quotedblright", "quoteleft", "quoteright", "divide", "lozenge", "ydieresis", "Ydieresis", "fraction", "currency", "guilsinglleft", "guilsinglright", "fi", "fl", "daggerdbl", "periodcentered", "quotesinglbase", "quotedblbase", "perthousand", "Acircumflex", "Ecircumflex", "Aacute", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Oacute", "Ocircumflex", "apple", "Ograve", "Uacute", "Ucircumflex", "Ugrave", "dotlessi", "circumflex", "tilde", "macron", "breve", "dotaccent", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "Lslash", "lslash", "Scaron", "scaron", "Zcaron", "zcaron", "brokenbar", "Eth", "eth", "Yacute", "yacute", "Thorn", "thorn", "minus", "multiply", "onesuperior", "twosuperior", "threesuperior", "onehalf", "onequarter", "threequarters", "franc", "Gbreve", "gbreve", "Idotaccent", "Scedilla", "scedilla", "Cacute", "cacute", "Ccaron", "ccaron", "dcroat"];
function Ot(e) {
  this.font = e;
}
Ot.prototype.charToGlyphIndex = function(e) {
  var r = e.codePointAt(0), t = this.font.glyphs;
  if (t) {
    for (var a = 0; a < t.length; a += 1) for (var n = t.get(a), s = 0; s < n.unicodes.length; s += 1) if (n.unicodes[s] === r) return a;
  }
  return null;
};
function Lt(e) {
  this.cmap = e;
}
Lt.prototype.charToGlyphIndex = function(e) {
  return this.cmap.glyphIndexMap[e.codePointAt(0)] || 0;
};
function je(e, r) {
  this.encoding = e, this.charset = r;
}
je.prototype.charToGlyphIndex = function(e) {
  var r = e.codePointAt(0), t = this.encoding[r];
  return this.charset.indexOf(t);
};
function Ur(e) {
  switch (e.version) {
    case 1:
      this.names = xe.slice();
      break;
    case 2:
      this.names = new Array(e.numberOfGlyphs);
      for (var r = 0; r < e.numberOfGlyphs; r++) e.glyphNameIndex[r] < xe.length ? this.names[r] = xe[e.glyphNameIndex[r]] : this.names[r] = e.names[e.glyphNameIndex[r] - xe.length];
      break;
    case 2.5:
      this.names = new Array(e.numberOfGlyphs);
      for (var t = 0; t < e.numberOfGlyphs; t++) this.names[t] = xe[t + e.glyphNameIndex[t]];
      break;
    case 3:
      this.names = [];
      break;
    default:
      this.names = [];
      break;
  }
}
Ur.prototype.nameToGlyphIndex = function(e) {
  return this.names.indexOf(e);
};
Ur.prototype.glyphIndexToName = function(e) {
  return this.names[e];
};
function za(e) {
  for (var r, t = e.tables.cmap.glyphIndexMap, a = Object.keys(t), n = 0; n < a.length; n += 1) {
    var s = a[n], i = t[s];
    r = e.glyphs.get(i), r.addUnicode(parseInt(s));
  }
  for (var u = 0; u < e.glyphs.length; u += 1) r = e.glyphs.get(u), e.cffEncoding ? e.isCIDFont ? r.name = "gid" + u : r.name = e.cffEncoding.charset[u] : e.glyphNames.names && (r.name = e.glyphNames.glyphIndexToName(u));
}
function Wa(e) {
  e._IndexToUnicodeMap = {};
  for (var r = e.tables.cmap.glyphIndexMap, t = Object.keys(r), a = 0; a < t.length; a += 1) {
    var n = t[a], s = r[n];
    e._IndexToUnicodeMap[s] === void 0 ? e._IndexToUnicodeMap[s] = { unicodes: [parseInt(n)] } : e._IndexToUnicodeMap[s].unicodes.push(parseInt(n));
  }
}
function _a(e, r) {
  r.lowMemory ? Wa(e) : za(e);
}
function Va(e, r, t, a, n) {
  e.beginPath(), e.moveTo(r, t), e.lineTo(a, n), e.stroke();
}
var ye = { line: Va };
function qa(e, r) {
  var t = r || new P();
  return { configurable: true, get: function() {
    return typeof t == "function" && (t = t()), t;
  }, set: function(a) {
    t = a;
  } };
}
function Q(e) {
  this.bindConstructorValues(e);
}
Q.prototype.bindConstructorValues = function(e) {
  this.index = e.index || 0, this.name = e.name || null, this.unicode = e.unicode || void 0, this.unicodes = e.unicodes || e.unicode !== void 0 ? [e.unicode] : [], "xMin" in e && (this.xMin = e.xMin), "yMin" in e && (this.yMin = e.yMin), "xMax" in e && (this.xMax = e.xMax), "yMax" in e && (this.yMax = e.yMax), "advanceWidth" in e && (this.advanceWidth = e.advanceWidth), Object.defineProperty(this, "path", qa(this, e.path));
};
Q.prototype.addUnicode = function(e) {
  this.unicodes.length === 0 && (this.unicode = e), this.unicodes.push(e);
};
Q.prototype.getBoundingBox = function() {
  return this.path.getBoundingBox();
};
Q.prototype.getPath = function(e, r, t, a, n) {
  e = e !== void 0 ? e : 0, r = r !== void 0 ? r : 0, t = t !== void 0 ? t : 72;
  var s, i;
  a || (a = {});
  var u = a.xScale, o = a.yScale;
  if (a.hinting && n && n.hinting && (i = this.path && n.hinting.exec(this, t)), i) s = n.hinting.getCommands(i), e = Math.round(e), r = Math.round(r), u = o = 1;
  else {
    s = this.path.commands;
    var l = 1 / (this.path.unitsPerEm || 1e3) * t;
    u === void 0 && (u = l), o === void 0 && (o = l);
  }
  for (var f = new P(), h = 0; h < s.length; h += 1) {
    var p = s[h];
    p.type === "M" ? f.moveTo(e + p.x * u, r + -p.y * o) : p.type === "L" ? f.lineTo(e + p.x * u, r + -p.y * o) : p.type === "Q" ? f.quadraticCurveTo(e + p.x1 * u, r + -p.y1 * o, e + p.x * u, r + -p.y * o) : p.type === "C" ? f.curveTo(e + p.x1 * u, r + -p.y1 * o, e + p.x2 * u, r + -p.y2 * o, e + p.x * u, r + -p.y * o) : p.type === "Z" && f.closePath();
  }
  return f;
};
Q.prototype.getContours = function() {
  if (this.points === void 0) return [];
  for (var e = [], r = [], t = 0; t < this.points.length; t += 1) {
    var a = this.points[t];
    r.push(a), a.lastPointOfContour && (e.push(r), r = []);
  }
  return U.argument(r.length === 0, "There are still points left in the current contour."), e;
};
Q.prototype.getMetrics = function() {
  for (var e = this.path.commands, r = [], t = [], a = 0; a < e.length; a += 1) {
    var n = e[a];
    n.type !== "Z" && (r.push(n.x), t.push(n.y)), (n.type === "Q" || n.type === "C") && (r.push(n.x1), t.push(n.y1)), n.type === "C" && (r.push(n.x2), t.push(n.y2));
  }
  var s = { xMin: Math.min.apply(null, r), yMin: Math.min.apply(null, t), xMax: Math.max.apply(null, r), yMax: Math.max.apply(null, t), leftSideBearing: this.leftSideBearing };
  return isFinite(s.xMin) || (s.xMin = 0), isFinite(s.xMax) || (s.xMax = this.advanceWidth), isFinite(s.yMin) || (s.yMin = 0), isFinite(s.yMax) || (s.yMax = 0), s.rightSideBearing = this.advanceWidth - s.leftSideBearing - (s.xMax - s.xMin), s;
};
Q.prototype.draw = function(e, r, t, a, n) {
  this.getPath(r, t, a, n).draw(e);
};
Q.prototype.drawPoints = function(e, r, t, a) {
  function n(h, p, c, d) {
    e.beginPath();
    for (var x = 0; x < h.length; x += 1) e.moveTo(p + h[x].x * d, c + h[x].y * d), e.arc(p + h[x].x * d, c + h[x].y * d, 2, 0, Math.PI * 2, false);
    e.closePath(), e.fill();
  }
  r = r !== void 0 ? r : 0, t = t !== void 0 ? t : 0, a = a !== void 0 ? a : 24;
  for (var s = 1 / this.path.unitsPerEm * a, i = [], u = [], o = this.path, l = 0; l < o.commands.length; l += 1) {
    var f = o.commands[l];
    f.x !== void 0 && i.push({ x: f.x, y: -f.y }), f.x1 !== void 0 && u.push({ x: f.x1, y: -f.y1 }), f.x2 !== void 0 && u.push({ x: f.x2, y: -f.y2 });
  }
  e.fillStyle = "blue", n(i, r, t, s), e.fillStyle = "red", n(u, r, t, s);
};
Q.prototype.drawMetrics = function(e, r, t, a) {
  var n;
  r = r !== void 0 ? r : 0, t = t !== void 0 ? t : 0, a = a !== void 0 ? a : 24, n = 1 / this.path.unitsPerEm * a, e.lineWidth = 1, e.strokeStyle = "black", ye.line(e, r, -1e4, r, 1e4), ye.line(e, -1e4, t, 1e4, t);
  var s = this.xMin || 0, i = this.yMin || 0, u = this.xMax || 0, o = this.yMax || 0, l = this.advanceWidth || 0;
  e.strokeStyle = "blue", ye.line(e, r + s * n, -1e4, r + s * n, 1e4), ye.line(e, r + u * n, -1e4, r + u * n, 1e4), ye.line(e, -1e4, t + -i * n, 1e4, t + -i * n), ye.line(e, -1e4, t + -o * n, 1e4, t + -o * n), e.strokeStyle = "green", ye.line(e, r + l * n, -1e4, r + l * n, 1e4);
};
function _e(e, r, t) {
  Object.defineProperty(e, r, { get: function() {
    return e.path, e[t];
  }, set: function(a) {
    e[t] = a;
  }, enumerable: true, configurable: true });
}
function Cr(e, r) {
  if (this.font = e, this.glyphs = {}, Array.isArray(r)) for (var t = 0; t < r.length; t++) {
    var a = r[t];
    a.path.unitsPerEm = e.unitsPerEm, this.glyphs[t] = a;
  }
  this.length = r && r.length || 0;
}
Cr.prototype.get = function(e) {
  if (this.glyphs[e] === void 0) {
    this.font._push(e), typeof this.glyphs[e] == "function" && (this.glyphs[e] = this.glyphs[e]());
    var r = this.glyphs[e], t = this.font._IndexToUnicodeMap[e];
    if (t) for (var a = 0; a < t.unicodes.length; a++) r.addUnicode(t.unicodes[a]);
    this.font.cffEncoding ? this.font.isCIDFont ? r.name = "gid" + e : r.name = this.font.cffEncoding.charset[e] : this.font.glyphNames.names && (r.name = this.font.glyphNames.glyphIndexToName(e)), this.glyphs[e].advanceWidth = this.font._hmtxTableData[e].advanceWidth, this.glyphs[e].leftSideBearing = this.font._hmtxTableData[e].leftSideBearing;
  } else typeof this.glyphs[e] == "function" && (this.glyphs[e] = this.glyphs[e]());
  return this.glyphs[e];
};
Cr.prototype.push = function(e, r) {
  this.glyphs[e] = r, this.length++;
};
function Xa(e, r) {
  return new Q({ index: r, font: e });
}
function Ya(e, r, t, a, n, s) {
  return function() {
    var i = new Q({ index: r, font: e });
    return i.path = function() {
      t(i, a, n);
      var u = s(e.glyphs, i);
      return u.unitsPerEm = e.unitsPerEm, u;
    }, _e(i, "xMin", "_xMin"), _e(i, "xMax", "_xMax"), _e(i, "yMin", "_yMin"), _e(i, "yMax", "_yMax"), i;
  };
}
function Za(e, r, t, a) {
  return function() {
    var n = new Q({ index: r, font: e });
    return n.path = function() {
      var s = t(e, n, a);
      return s.unitsPerEm = e.unitsPerEm, s;
    }, n;
  };
}
var ue = { GlyphSet: Cr, glyphLoader: Xa, ttfGlyphLoader: Ya, cffGlyphLoader: Za };
function Rt(e, r) {
  if (e === r) return true;
  if (Array.isArray(e) && Array.isArray(r)) {
    if (e.length !== r.length) return false;
    for (var t = 0; t < e.length; t += 1) if (!Rt(e[t], r[t])) return false;
    return true;
  } else return false;
}
function gr(e) {
  var r;
  return e.length < 1240 ? r = 107 : e.length < 33900 ? r = 1131 : r = 32768, r;
}
function ve(e, r, t) {
  var a = [], n = [], s = k.getCard16(e, r), i, u;
  if (s !== 0) {
    var o = k.getByte(e, r + 2);
    i = r + (s + 1) * o + 2;
    for (var l = r + 3, f = 0; f < s + 1; f += 1) a.push(k.getOffset(e, l, o)), l += o;
    u = i + a[s];
  } else u = r + 2;
  for (var h = 0; h < a.length - 1; h += 1) {
    var p = k.getBytes(e, i + a[h], i + a[h + 1]);
    t && (p = t(p)), n.push(p);
  }
  return { objects: n, startOffset: r, endOffset: u };
}
function Qa(e, r) {
  var t = [], a = k.getCard16(e, r), n, s;
  if (a !== 0) {
    var i = k.getByte(e, r + 2);
    n = r + (a + 1) * i + 2;
    for (var u = r + 3, o = 0; o < a + 1; o += 1) t.push(k.getOffset(e, u, i)), u += i;
    s = n + t[a];
  } else s = r + 2;
  return { offsets: t, startOffset: r, endOffset: s };
}
function Ka(e, r, t, a, n) {
  var s = k.getCard16(t, a), i = 0;
  if (s !== 0) {
    var u = k.getByte(t, a + 2);
    i = a + (s + 1) * u + 2;
  }
  var o = k.getBytes(t, i + r[e], i + r[e + 1]);
  return n && (o = n(o)), o;
}
function Ja(e) {
  for (var r = "", t = 15, a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"]; ; ) {
    var n = e.parseByte(), s = n >> 4, i = n & 15;
    if (s === t || (r += a[s], i === t)) break;
    r += a[i];
  }
  return parseFloat(r);
}
function ja(e, r) {
  var t, a, n, s;
  if (r === 28) return t = e.parseByte(), a = e.parseByte(), t << 8 | a;
  if (r === 29) return t = e.parseByte(), a = e.parseByte(), n = e.parseByte(), s = e.parseByte(), t << 24 | a << 16 | n << 8 | s;
  if (r === 30) return Ja(e);
  if (r >= 32 && r <= 246) return r - 139;
  if (r >= 247 && r <= 250) return t = e.parseByte(), (r - 247) * 256 + t + 108;
  if (r >= 251 && r <= 254) return t = e.parseByte(), -(r - 251) * 256 - t - 108;
  throw new Error("Invalid b0 " + r);
}
function $a(e) {
  for (var r = {}, t = 0; t < e.length; t += 1) {
    var a = e[t][0], n = e[t][1], s = void 0;
    if (n.length === 1 ? s = n[0] : s = n, r.hasOwnProperty(a) && !isNaN(r[a])) throw new Error("Object " + r + " already has key " + a);
    r[a] = s;
  }
  return r;
}
function wt(e, r, t) {
  r = r !== void 0 ? r : 0;
  var a = new k.Parser(e, r), n = [], s = [];
  for (t = t !== void 0 ? t : e.length; a.relativeOffset < t; ) {
    var i = a.parseByte();
    i <= 21 ? (i === 12 && (i = 1200 + a.parseByte()), n.push([i, s]), s = []) : s.push(ja(a, i));
  }
  return $a(n);
}
function Oe(e, r) {
  return r <= 390 ? r = qe[r] : r = e[r - 391], r;
}
function Dt(e, r, t) {
  for (var a = {}, n, s = 0; s < r.length; s += 1) {
    var i = r[s];
    if (Array.isArray(i.type)) {
      var u = [];
      u.length = i.type.length;
      for (var o = 0; o < i.type.length; o++) n = e[i.op] !== void 0 ? e[i.op][o] : void 0, n === void 0 && (n = i.value !== void 0 && i.value[o] !== void 0 ? i.value[o] : null), i.type[o] === "SID" && (n = Oe(t, n)), u[o] = n;
      a[i.name] = u;
    } else n = e[i.op], n === void 0 && (n = i.value !== void 0 ? i.value : null), i.type === "SID" && (n = Oe(t, n)), a[i.name] = n;
  }
  return a;
}
function en(e, r) {
  var t = {};
  return t.formatMajor = k.getCard8(e, r), t.formatMinor = k.getCard8(e, r + 1), t.size = k.getCard8(e, r + 2), t.offsetSize = k.getCard8(e, r + 3), t.startOffset = r, t.endOffset = r + 4, t;
}
var At = [{ name: "version", op: 0, type: "SID" }, { name: "notice", op: 1, type: "SID" }, { name: "copyright", op: 1200, type: "SID" }, { name: "fullName", op: 2, type: "SID" }, { name: "familyName", op: 3, type: "SID" }, { name: "weight", op: 4, type: "SID" }, { name: "isFixedPitch", op: 1201, type: "number", value: 0 }, { name: "italicAngle", op: 1202, type: "number", value: 0 }, { name: "underlinePosition", op: 1203, type: "number", value: -100 }, { name: "underlineThickness", op: 1204, type: "number", value: 50 }, { name: "paintType", op: 1205, type: "number", value: 0 }, { name: "charstringType", op: 1206, type: "number", value: 2 }, { name: "fontMatrix", op: 1207, type: ["real", "real", "real", "real", "real", "real"], value: [1e-3, 0, 0, 1e-3, 0, 0] }, { name: "uniqueId", op: 13, type: "number" }, { name: "fontBBox", op: 5, type: ["number", "number", "number", "number"], value: [0, 0, 0, 0] }, { name: "strokeWidth", op: 1208, type: "number", value: 0 }, { name: "xuid", op: 14, type: [], value: null }, { name: "charset", op: 15, type: "offset", value: 0 }, { name: "encoding", op: 16, type: "offset", value: 0 }, { name: "charStrings", op: 17, type: "offset", value: 0 }, { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] }, { name: "ros", op: 1230, type: ["SID", "SID", "number"] }, { name: "cidFontVersion", op: 1231, type: "number", value: 0 }, { name: "cidFontRevision", op: 1232, type: "number", value: 0 }, { name: "cidFontType", op: 1233, type: "number", value: 0 }, { name: "cidCount", op: 1234, type: "number", value: 8720 }, { name: "uidBase", op: 1235, type: "number" }, { name: "fdArray", op: 1236, type: "offset" }, { name: "fdSelect", op: 1237, type: "offset" }, { name: "fontName", op: 1238, type: "SID" }];
var Bt = [{ name: "subrs", op: 19, type: "offset", value: 0 }, { name: "defaultWidthX", op: 20, type: "number", value: 0 }, { name: "nominalWidthX", op: 21, type: "number", value: 0 }];
function rn(e, r) {
  var t = wt(e, 0, e.byteLength);
  return Dt(t, At, r);
}
function It(e, r, t, a) {
  var n = wt(e, r, t);
  return Dt(n, Bt, a);
}
function Wr(e, r, t, a) {
  for (var n = [], s = 0; s < t.length; s += 1) {
    var i = new DataView(new Uint8Array(t[s]).buffer), u = rn(i, a);
    u._subrs = [], u._subrsBias = 0, u._defaultWidthX = 0, u._nominalWidthX = 0;
    var o = u.private[0], l = u.private[1];
    if (o !== 0 && l !== 0) {
      var f = It(e, l + r, o, a);
      if (u._defaultWidthX = f.defaultWidthX, u._nominalWidthX = f.nominalWidthX, f.subrs !== 0) {
        var h = l + f.subrs, p = ve(e, h + r);
        u._subrs = p.objects, u._subrsBias = gr(u._subrs);
      }
      u._privateDict = f;
    }
    n.push(u);
  }
  return n;
}
function tn(e, r, t, a) {
  var n, s, i = new k.Parser(e, r);
  t -= 1;
  var u = [".notdef"], o = i.parseCard8();
  if (o === 0) for (var l = 0; l < t; l += 1) n = i.parseSID(), u.push(Oe(a, n));
  else if (o === 1) for (; u.length <= t; ) {
    n = i.parseSID(), s = i.parseCard8();
    for (var f = 0; f <= s; f += 1) u.push(Oe(a, n)), n += 1;
  }
  else if (o === 2) for (; u.length <= t; ) {
    n = i.parseSID(), s = i.parseCard16();
    for (var h = 0; h <= s; h += 1) u.push(Oe(a, n)), n += 1;
  }
  else throw new Error("Unknown charset format " + o);
  return u;
}
function an(e, r, t) {
  var a, n = {}, s = new k.Parser(e, r), i = s.parseCard8();
  if (i === 0) for (var u = s.parseCard8(), o = 0; o < u; o += 1) a = s.parseCard8(), n[a] = o;
  else if (i === 1) {
    var l = s.parseCard8();
    a = 1;
    for (var f = 0; f < l; f += 1) for (var h = s.parseCard8(), p = s.parseCard8(), c = h; c <= h + p; c += 1) n[c] = a, a += 1;
  } else throw new Error("Unknown encoding format " + i);
  return new je(n, t);
}
function _r(e, r, t) {
  var a, n, s, i, u = new P(), o = [], l = 0, f = false, h = false, p = 0, c = 0, d, x, m, y;
  if (e.isCIDFont) {
    var C = e.tables.cff.topDict._fdSelect[r.index], S = e.tables.cff.topDict._fdArray[C];
    d = S._subrs, x = S._subrsBias, m = S._defaultWidthX, y = S._nominalWidthX;
  } else d = e.tables.cff.topDict._subrs, x = e.tables.cff.topDict._subrsBias, m = e.tables.cff.topDict._defaultWidthX, y = e.tables.cff.topDict._nominalWidthX;
  var R = m;
  function O(F, G) {
    h && u.closePath(), u.moveTo(F, G), h = true;
  }
  function D() {
    var F;
    F = o.length % 2 !== 0, F && !f && (R = o.shift() + y), l += o.length >> 1, o.length = 0, f = true;
  }
  function L(F) {
    for (var G, Y, Z, j, $, M, N, W, _, V, H, X, A = 0; A < F.length; ) {
      var q = F[A];
      switch (A += 1, q) {
        case 1:
          D();
          break;
        case 3:
          D();
          break;
        case 4:
          o.length > 1 && !f && (R = o.shift() + y, f = true), c += o.pop(), O(p, c);
          break;
        case 5:
          for (; o.length > 0; ) p += o.shift(), c += o.shift(), u.lineTo(p, c);
          break;
        case 6:
          for (; o.length > 0 && (p += o.shift(), u.lineTo(p, c), o.length !== 0); ) c += o.shift(), u.lineTo(p, c);
          break;
        case 7:
          for (; o.length > 0 && (c += o.shift(), u.lineTo(p, c), o.length !== 0); ) p += o.shift(), u.lineTo(p, c);
          break;
        case 8:
          for (; o.length > 0; ) a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i + o.shift(), u.curveTo(a, n, s, i, p, c);
          break;
        case 10:
          $ = o.pop() + x, M = d[$], M && L(M);
          break;
        case 11:
          return;
        case 12:
          switch (q = F[A], A += 1, q) {
            case 35:
              a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), N = s + o.shift(), W = i + o.shift(), _ = N + o.shift(), V = W + o.shift(), H = _ + o.shift(), X = V + o.shift(), p = H + o.shift(), c = X + o.shift(), o.shift(), u.curveTo(a, n, s, i, N, W), u.curveTo(_, V, H, X, p, c);
              break;
            case 34:
              a = p + o.shift(), n = c, s = a + o.shift(), i = n + o.shift(), N = s + o.shift(), W = i, _ = N + o.shift(), V = i, H = _ + o.shift(), X = c, p = H + o.shift(), u.curveTo(a, n, s, i, N, W), u.curveTo(_, V, H, X, p, c);
              break;
            case 36:
              a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), N = s + o.shift(), W = i, _ = N + o.shift(), V = i, H = _ + o.shift(), X = V + o.shift(), p = H + o.shift(), u.curveTo(a, n, s, i, N, W), u.curveTo(_, V, H, X, p, c);
              break;
            case 37:
              a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), N = s + o.shift(), W = i + o.shift(), _ = N + o.shift(), V = W + o.shift(), H = _ + o.shift(), X = V + o.shift(), Math.abs(H - p) > Math.abs(X - c) ? p = H + o.shift() : c = X + o.shift(), u.curveTo(a, n, s, i, N, W), u.curveTo(_, V, H, X, p, c);
              break;
            default:
              console.log("Glyph " + r.index + ": unknown operator 1200" + q), o.length = 0;
          }
          break;
        case 14:
          o.length > 0 && !f && (R = o.shift() + y, f = true), h && (u.closePath(), h = false);
          break;
        case 18:
          D();
          break;
        case 19:
        case 20:
          D(), A += l + 7 >> 3;
          break;
        case 21:
          o.length > 2 && !f && (R = o.shift() + y, f = true), c += o.pop(), p += o.pop(), O(p, c);
          break;
        case 22:
          o.length > 1 && !f && (R = o.shift() + y, f = true), p += o.pop(), O(p, c);
          break;
        case 23:
          D();
          break;
        case 24:
          for (; o.length > 2; ) a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i + o.shift(), u.curveTo(a, n, s, i, p, c);
          p += o.shift(), c += o.shift(), u.lineTo(p, c);
          break;
        case 25:
          for (; o.length > 6; ) p += o.shift(), c += o.shift(), u.lineTo(p, c);
          a = p + o.shift(), n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i + o.shift(), u.curveTo(a, n, s, i, p, c);
          break;
        case 26:
          for (o.length % 2 && (p += o.shift()); o.length > 0; ) a = p, n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s, c = i + o.shift(), u.curveTo(a, n, s, i, p, c);
          break;
        case 27:
          for (o.length % 2 && (c += o.shift()); o.length > 0; ) a = p + o.shift(), n = c, s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i, u.curveTo(a, n, s, i, p, c);
          break;
        case 28:
          G = F[A], Y = F[A + 1], o.push((G << 24 | Y << 16) >> 16), A += 2;
          break;
        case 29:
          $ = o.pop() + e.gsubrsBias, M = e.gsubrs[$], M && L(M);
          break;
        case 30:
          for (; o.length > 0 && (a = p, n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i + (o.length === 1 ? o.shift() : 0), u.curveTo(a, n, s, i, p, c), o.length !== 0); ) a = p + o.shift(), n = c, s = a + o.shift(), i = n + o.shift(), c = i + o.shift(), p = s + (o.length === 1 ? o.shift() : 0), u.curveTo(a, n, s, i, p, c);
          break;
        case 31:
          for (; o.length > 0 && (a = p + o.shift(), n = c, s = a + o.shift(), i = n + o.shift(), c = i + o.shift(), p = s + (o.length === 1 ? o.shift() : 0), u.curveTo(a, n, s, i, p, c), o.length !== 0); ) a = p, n = c + o.shift(), s = a + o.shift(), i = n + o.shift(), p = s + o.shift(), c = i + (o.length === 1 ? o.shift() : 0), u.curveTo(a, n, s, i, p, c);
          break;
        default:
          q < 32 ? console.log("Glyph " + r.index + ": unknown operator " + q) : q < 247 ? o.push(q - 139) : q < 251 ? (G = F[A], A += 1, o.push((q - 247) * 256 + G + 108)) : q < 255 ? (G = F[A], A += 1, o.push(-(q - 251) * 256 - G - 108)) : (G = F[A], Y = F[A + 1], Z = F[A + 2], j = F[A + 3], A += 4, o.push((G << 24 | Y << 16 | Z << 8 | j) / 65536));
      }
    }
  }
  return L(t), r.advanceWidth = R, u;
}
function nn(e, r, t, a) {
  var n = [], s, i = new k.Parser(e, r), u = i.parseCard8();
  if (u === 0) for (var o = 0; o < t; o++) {
    if (s = i.parseCard8(), s >= a) throw new Error("CFF table CID Font FDSelect has bad FD index value " + s + " (FD count " + a + ")");
    n.push(s);
  }
  else if (u === 3) {
    var l = i.parseCard16(), f = i.parseCard16();
    if (f !== 0) throw new Error("CFF Table CID Font FDSelect format 3 range has bad initial GID " + f);
    for (var h, p = 0; p < l; p++) {
      if (s = i.parseCard8(), h = i.parseCard16(), s >= a) throw new Error("CFF table CID Font FDSelect has bad FD index value " + s + " (FD count " + a + ")");
      if (h > t) throw new Error("CFF Table CID Font FDSelect format 3 range has bad GID " + h);
      for (; f < h; f++) n.push(s);
      f = h;
    }
    if (h !== t) throw new Error("CFF Table CID Font FDSelect format 3 range has bad final GID " + h);
  } else throw new Error("CFF Table CID Font FDSelect table has unsupported format " + u);
  return n;
}
function sn(e, r, t, a) {
  t.tables.cff = {};
  var n = en(e, r), s = ve(e, n.endOffset, k.bytesToString), i = ve(e, s.endOffset), u = ve(e, i.endOffset, k.bytesToString), o = ve(e, u.endOffset);
  t.gsubrs = o.objects, t.gsubrsBias = gr(t.gsubrs);
  var l = Wr(e, r, i.objects, u.objects);
  if (l.length !== 1) throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + l.length);
  var f = l[0];
  if (t.tables.cff.topDict = f, f._privateDict && (t.defaultWidthX = f._privateDict.defaultWidthX, t.nominalWidthX = f._privateDict.nominalWidthX), f.ros[0] !== void 0 && f.ros[1] !== void 0 && (t.isCIDFont = true), t.isCIDFont) {
    var h = f.fdArray, p = f.fdSelect;
    if (h === 0 || p === 0) throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
    h += r;
    var c = ve(e, h), d = Wr(e, r, c.objects, u.objects);
    f._fdArray = d, p += r, f._fdSelect = nn(e, p, t.numGlyphs, d.length);
  }
  var x = r + f.private[1], m = It(e, x, f.private[0], u.objects);
  if (t.defaultWidthX = m.defaultWidthX, t.nominalWidthX = m.nominalWidthX, m.subrs !== 0) {
    var y = x + m.subrs, C = ve(e, y);
    t.subrs = C.objects, t.subrsBias = gr(t.subrs);
  } else t.subrs = [], t.subrsBias = 0;
  var S;
  a.lowMemory ? (S = Qa(e, r + f.charStrings), t.nGlyphs = S.offsets.length) : (S = ve(e, r + f.charStrings), t.nGlyphs = S.objects.length);
  var R = tn(e, r + f.charset, t.nGlyphs, u.objects);
  if (f.encoding === 0 ? t.cffEncoding = new je(Na, R) : f.encoding === 1 ? t.cffEncoding = new je(Ha, R) : t.cffEncoding = an(e, r + f.encoding, R), t.encoding = t.encoding || t.cffEncoding, t.glyphs = new ue.GlyphSet(t), a.lowMemory) t._push = function(L) {
    var F = Ka(L, S.offsets, e, r + f.charStrings);
    t.glyphs.push(L, ue.cffGlyphLoader(t, L, _r, F));
  };
  else for (var O = 0; O < t.nGlyphs; O += 1) {
    var D = S.objects[O];
    t.glyphs.push(O, ue.cffGlyphLoader(t, O, _r, D));
  }
}
function Mt(e, r) {
  var t, a = qe.indexOf(e);
  return a >= 0 && (t = a), a = r.indexOf(e), a >= 0 ? t = a + qe.length : (t = qe.length + r.length, r.push(e)), t;
}
function on() {
  return new b.Record("Header", [{ name: "major", type: "Card8", value: 1 }, { name: "minor", type: "Card8", value: 0 }, { name: "hdrSize", type: "Card8", value: 4 }, { name: "major", type: "Card8", value: 1 }]);
}
function un(e) {
  var r = new b.Record("Name INDEX", [{ name: "names", type: "INDEX", value: [] }]);
  r.names = [];
  for (var t = 0; t < e.length; t += 1) r.names.push({ name: "name_" + t, type: "NAME", value: e[t] });
  return r;
}
function Pt(e, r, t) {
  for (var a = {}, n = 0; n < e.length; n += 1) {
    var s = e[n], i = r[s.name];
    i !== void 0 && !Rt(i, s.value) && (s.type === "SID" && (i = Mt(i, t)), a[s.op] = { name: s.name, type: s.type, value: i });
  }
  return a;
}
function Vr(e, r) {
  var t = new b.Record("Top DICT", [{ name: "dict", type: "DICT", value: {} }]);
  return t.dict = Pt(At, e, r), t;
}
function qr(e) {
  var r = new b.Record("Top DICT INDEX", [{ name: "topDicts", type: "INDEX", value: [] }]);
  return r.topDicts = [{ name: "topDict_0", type: "TABLE", value: e }], r;
}
function ln(e) {
  var r = new b.Record("String INDEX", [{ name: "strings", type: "INDEX", value: [] }]);
  r.strings = [];
  for (var t = 0; t < e.length; t += 1) r.strings.push({ name: "string_" + t, type: "STRING", value: e[t] });
  return r;
}
function fn() {
  return new b.Record("Global Subr INDEX", [{ name: "subrs", type: "INDEX", value: [] }]);
}
function pn(e, r) {
  for (var t = new b.Record("Charsets", [{ name: "format", type: "Card8", value: 0 }]), a = 0; a < e.length; a += 1) {
    var n = e[a], s = Mt(n, r);
    t.fields.push({ name: "glyph_" + a, type: "SID", value: s });
  }
  return t;
}
function hn(e) {
  var r = [], t = e.path;
  r.push({ name: "width", type: "NUMBER", value: e.advanceWidth });
  for (var a = 0, n = 0, s = 0; s < t.commands.length; s += 1) {
    var i = void 0, u = void 0, o = t.commands[s];
    if (o.type === "Q") {
      var l = 0.3333333333333333, f = 2 / 3;
      o = { type: "C", x: o.x, y: o.y, x1: Math.round(l * a + f * o.x1), y1: Math.round(l * n + f * o.y1), x2: Math.round(l * o.x + f * o.x1), y2: Math.round(l * o.y + f * o.y1) };
    }
    if (o.type === "M") i = Math.round(o.x - a), u = Math.round(o.y - n), r.push({ name: "dx", type: "NUMBER", value: i }), r.push({ name: "dy", type: "NUMBER", value: u }), r.push({ name: "rmoveto", type: "OP", value: 21 }), a = Math.round(o.x), n = Math.round(o.y);
    else if (o.type === "L") i = Math.round(o.x - a), u = Math.round(o.y - n), r.push({ name: "dx", type: "NUMBER", value: i }), r.push({ name: "dy", type: "NUMBER", value: u }), r.push({ name: "rlineto", type: "OP", value: 5 }), a = Math.round(o.x), n = Math.round(o.y);
    else if (o.type === "C") {
      var h = Math.round(o.x1 - a), p = Math.round(o.y1 - n), c = Math.round(o.x2 - o.x1), d = Math.round(o.y2 - o.y1);
      i = Math.round(o.x - o.x2), u = Math.round(o.y - o.y2), r.push({ name: "dx1", type: "NUMBER", value: h }), r.push({ name: "dy1", type: "NUMBER", value: p }), r.push({ name: "dx2", type: "NUMBER", value: c }), r.push({ name: "dy2", type: "NUMBER", value: d }), r.push({ name: "dx", type: "NUMBER", value: i }), r.push({ name: "dy", type: "NUMBER", value: u }), r.push({ name: "rrcurveto", type: "OP", value: 8 }), a = Math.round(o.x), n = Math.round(o.y);
    }
  }
  return r.push({ name: "endchar", type: "OP", value: 14 }), r;
}
function cn(e) {
  for (var r = new b.Record("CharStrings INDEX", [{ name: "charStrings", type: "INDEX", value: [] }]), t = 0; t < e.length; t += 1) {
    var a = e.get(t), n = hn(a);
    r.charStrings.push({ name: a.name, type: "CHARSTRING", value: n });
  }
  return r;
}
function vn(e, r) {
  var t = new b.Record("Private DICT", [{ name: "dict", type: "DICT", value: {} }]);
  return t.dict = Pt(Bt, e, r), t;
}
function dn(e, r) {
  for (var t = new b.Table("CFF ", [{ name: "header", type: "RECORD" }, { name: "nameIndex", type: "RECORD" }, { name: "topDictIndex", type: "RECORD" }, { name: "stringIndex", type: "RECORD" }, { name: "globalSubrIndex", type: "RECORD" }, { name: "charsets", type: "RECORD" }, { name: "charStringsIndex", type: "RECORD" }, { name: "privateDict", type: "RECORD" }]), a = 1 / r.unitsPerEm, n = { version: r.version, fullName: r.fullName, familyName: r.familyName, weight: r.weightName, fontBBox: r.fontBBox || [0, 0, 0, 0], fontMatrix: [a, 0, 0, a, 0, 0], charset: 999, encoding: 0, charStrings: 999, private: [0, 999] }, s = {}, i = [], u, o = 1; o < e.length; o += 1) u = e.get(o), i.push(u.name);
  var l = [];
  t.header = on(), t.nameIndex = un([r.postScriptName]);
  var f = Vr(n, l);
  t.topDictIndex = qr(f), t.globalSubrIndex = fn(), t.charsets = pn(i, l), t.charStringsIndex = cn(e), t.privateDict = vn(s, l), t.stringIndex = ln(l);
  var h = t.header.sizeOf() + t.nameIndex.sizeOf() + t.topDictIndex.sizeOf() + t.stringIndex.sizeOf() + t.globalSubrIndex.sizeOf();
  return n.charset = h, n.encoding = 0, n.charStrings = n.charset + t.charsets.sizeOf(), n.private[1] = n.charStrings + t.charStringsIndex.sizeOf(), f = Vr(n, l), t.topDictIndex = qr(f), t;
}
var Gt = { parse: sn, make: dn };
function gn(e, r) {
  var t = {}, a = new k.Parser(e, r);
  return t.version = a.parseVersion(), t.fontRevision = Math.round(a.parseFixed() * 1e3) / 1e3, t.checkSumAdjustment = a.parseULong(), t.magicNumber = a.parseULong(), U.argument(t.magicNumber === 1594834165, "Font header has wrong magic number."), t.flags = a.parseUShort(), t.unitsPerEm = a.parseUShort(), t.created = a.parseLongDateTime(), t.modified = a.parseLongDateTime(), t.xMin = a.parseShort(), t.yMin = a.parseShort(), t.xMax = a.parseShort(), t.yMax = a.parseShort(), t.macStyle = a.parseUShort(), t.lowestRecPPEM = a.parseUShort(), t.fontDirectionHint = a.parseShort(), t.indexToLocFormat = a.parseShort(), t.glyphDataFormat = a.parseShort(), t;
}
function mn(e) {
  var r = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) + 2082844800, t = r;
  return e.createdTimestamp && (t = e.createdTimestamp + 2082844800), new b.Table("head", [{ name: "version", type: "FIXED", value: 65536 }, { name: "fontRevision", type: "FIXED", value: 65536 }, { name: "checkSumAdjustment", type: "ULONG", value: 0 }, { name: "magicNumber", type: "ULONG", value: 1594834165 }, { name: "flags", type: "USHORT", value: 0 }, { name: "unitsPerEm", type: "USHORT", value: 1e3 }, { name: "created", type: "LONGDATETIME", value: t }, { name: "modified", type: "LONGDATETIME", value: r }, { name: "xMin", type: "SHORT", value: 0 }, { name: "yMin", type: "SHORT", value: 0 }, { name: "xMax", type: "SHORT", value: 0 }, { name: "yMax", type: "SHORT", value: 0 }, { name: "macStyle", type: "USHORT", value: 0 }, { name: "lowestRecPPEM", type: "USHORT", value: 0 }, { name: "fontDirectionHint", type: "SHORT", value: 2 }, { name: "indexToLocFormat", type: "SHORT", value: 0 }, { name: "glyphDataFormat", type: "SHORT", value: 0 }], e);
}
var Nt = { parse: gn, make: mn };
function yn(e, r) {
  var t = {}, a = new k.Parser(e, r);
  return t.version = a.parseVersion(), t.ascender = a.parseShort(), t.descender = a.parseShort(), t.lineGap = a.parseShort(), t.advanceWidthMax = a.parseUShort(), t.minLeftSideBearing = a.parseShort(), t.minRightSideBearing = a.parseShort(), t.xMaxExtent = a.parseShort(), t.caretSlopeRise = a.parseShort(), t.caretSlopeRun = a.parseShort(), t.caretOffset = a.parseShort(), a.relativeOffset += 8, t.metricDataFormat = a.parseShort(), t.numberOfHMetrics = a.parseUShort(), t;
}
function xn(e) {
  return new b.Table("hhea", [{ name: "version", type: "FIXED", value: 65536 }, { name: "ascender", type: "FWORD", value: 0 }, { name: "descender", type: "FWORD", value: 0 }, { name: "lineGap", type: "FWORD", value: 0 }, { name: "advanceWidthMax", type: "UFWORD", value: 0 }, { name: "minLeftSideBearing", type: "FWORD", value: 0 }, { name: "minRightSideBearing", type: "FWORD", value: 0 }, { name: "xMaxExtent", type: "FWORD", value: 0 }, { name: "caretSlopeRise", type: "SHORT", value: 1 }, { name: "caretSlopeRun", type: "SHORT", value: 0 }, { name: "caretOffset", type: "SHORT", value: 0 }, { name: "reserved1", type: "SHORT", value: 0 }, { name: "reserved2", type: "SHORT", value: 0 }, { name: "reserved3", type: "SHORT", value: 0 }, { name: "reserved4", type: "SHORT", value: 0 }, { name: "metricDataFormat", type: "SHORT", value: 0 }, { name: "numberOfHMetrics", type: "USHORT", value: 0 }], e);
}
var Ht = { parse: yn, make: xn };
function bn(e, r, t, a, n) {
  for (var s, i, u = new k.Parser(e, r), o = 0; o < a; o += 1) {
    o < t && (s = u.parseUShort(), i = u.parseShort());
    var l = n.get(o);
    l.advanceWidth = s, l.leftSideBearing = i;
  }
}
function Sn(e, r, t, a, n) {
  e._hmtxTableData = {};
  for (var s, i, u = new k.Parser(r, t), o = 0; o < n; o += 1) o < a && (s = u.parseUShort(), i = u.parseShort()), e._hmtxTableData[o] = { advanceWidth: s, leftSideBearing: i };
}
function Tn(e, r, t, a, n, s, i) {
  i.lowMemory ? Sn(e, r, t, a, n) : bn(r, t, a, n, s);
}
function kn(e) {
  for (var r = new b.Table("hmtx", []), t = 0; t < e.length; t += 1) {
    var a = e.get(t), n = a.advanceWidth || 0, s = a.leftSideBearing || 0;
    r.fields.push({ name: "advanceWidth_" + t, type: "USHORT", value: n }), r.fields.push({ name: "leftSideBearing_" + t, type: "SHORT", value: s });
  }
  return r;
}
var zt = { parse: Tn, make: kn };
function Fn(e) {
  for (var r = new b.Table("ltag", [{ name: "version", type: "ULONG", value: 1 }, { name: "flags", type: "ULONG", value: 0 }, { name: "numTags", type: "ULONG", value: e.length }]), t = "", a = 12 + e.length * 4, n = 0; n < e.length; ++n) {
    var s = t.indexOf(e[n]);
    s < 0 && (s = t.length, t += e[n]), r.fields.push({ name: "offset " + n, type: "USHORT", value: a + s }), r.fields.push({ name: "length " + n, type: "USHORT", value: e[n].length });
  }
  return r.fields.push({ name: "stringPool", type: "CHARARRAY", value: t }), r;
}
function Un(e, r) {
  var t = new k.Parser(e, r), a = t.parseULong();
  U.argument(a === 1, "Unsupported ltag table version."), t.skip("uLong", 1);
  for (var n = t.parseULong(), s = [], i = 0; i < n; i++) {
    for (var u = "", o = r + t.parseUShort(), l = t.parseUShort(), f = o; f < o + l; ++f) u += String.fromCharCode(e.getInt8(f));
    s.push(u);
  }
  return s;
}
var Wt = { make: Fn, parse: Un };
function Cn(e, r) {
  var t = {}, a = new k.Parser(e, r);
  return t.version = a.parseVersion(), t.numGlyphs = a.parseUShort(), t.version === 1 && (t.maxPoints = a.parseUShort(), t.maxContours = a.parseUShort(), t.maxCompositePoints = a.parseUShort(), t.maxCompositeContours = a.parseUShort(), t.maxZones = a.parseUShort(), t.maxTwilightPoints = a.parseUShort(), t.maxStorage = a.parseUShort(), t.maxFunctionDefs = a.parseUShort(), t.maxInstructionDefs = a.parseUShort(), t.maxStackElements = a.parseUShort(), t.maxSizeOfInstructions = a.parseUShort(), t.maxComponentElements = a.parseUShort(), t.maxComponentDepth = a.parseUShort()), t;
}
function En(e) {
  return new b.Table("maxp", [{ name: "version", type: "FIXED", value: 20480 }, { name: "numGlyphs", type: "USHORT", value: e }]);
}
var _t = { parse: Cn, make: En };
var Vt = ["copyright", "fontFamily", "fontSubfamily", "uniqueID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "manufacturerURL", "designerURL", "license", "licenseURL", "reserved", "preferredFamily", "preferredSubfamily", "compatibleFullName", "sampleText", "postScriptFindFontName", "wwsFamily", "wwsSubfamily"];
var qt = { 0: "en", 1: "fr", 2: "de", 3: "it", 4: "nl", 5: "sv", 6: "es", 7: "da", 8: "pt", 9: "no", 10: "he", 11: "ja", 12: "ar", 13: "fi", 14: "el", 15: "is", 16: "mt", 17: "tr", 18: "hr", 19: "zh-Hant", 20: "ur", 21: "hi", 22: "th", 23: "ko", 24: "lt", 25: "pl", 26: "hu", 27: "es", 28: "lv", 29: "se", 30: "fo", 31: "fa", 32: "ru", 33: "zh", 34: "nl-BE", 35: "ga", 36: "sq", 37: "ro", 38: "cz", 39: "sk", 40: "si", 41: "yi", 42: "sr", 43: "mk", 44: "bg", 45: "uk", 46: "be", 47: "uz", 48: "kk", 49: "az-Cyrl", 50: "az-Arab", 51: "hy", 52: "ka", 53: "mo", 54: "ky", 55: "tg", 56: "tk", 57: "mn-CN", 58: "mn", 59: "ps", 60: "ks", 61: "ku", 62: "sd", 63: "bo", 64: "ne", 65: "sa", 66: "mr", 67: "bn", 68: "as", 69: "gu", 70: "pa", 71: "or", 72: "ml", 73: "kn", 74: "ta", 75: "te", 76: "si", 77: "my", 78: "km", 79: "lo", 80: "vi", 81: "id", 82: "tl", 83: "ms", 84: "ms-Arab", 85: "am", 86: "ti", 87: "om", 88: "so", 89: "sw", 90: "rw", 91: "rn", 92: "ny", 93: "mg", 94: "eo", 128: "cy", 129: "eu", 130: "ca", 131: "la", 132: "qu", 133: "gn", 134: "ay", 135: "tt", 136: "ug", 137: "dz", 138: "jv", 139: "su", 140: "gl", 141: "af", 142: "br", 143: "iu", 144: "gd", 145: "gv", 146: "ga", 147: "to", 148: "el-polyton", 149: "kl", 150: "az", 151: "nn" };
var On = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 5, 11: 1, 12: 4, 13: 0, 14: 6, 15: 0, 16: 0, 17: 0, 18: 0, 19: 2, 20: 4, 21: 9, 22: 21, 23: 3, 24: 29, 25: 29, 26: 29, 27: 29, 28: 29, 29: 0, 30: 0, 31: 4, 32: 7, 33: 25, 34: 0, 35: 0, 36: 0, 37: 0, 38: 29, 39: 29, 40: 0, 41: 5, 42: 7, 43: 7, 44: 7, 45: 7, 46: 7, 47: 7, 48: 7, 49: 7, 50: 4, 51: 24, 52: 23, 53: 7, 54: 7, 55: 7, 56: 7, 57: 27, 58: 7, 59: 4, 60: 4, 61: 4, 62: 4, 63: 26, 64: 9, 65: 9, 66: 9, 67: 13, 68: 13, 69: 11, 70: 10, 71: 12, 72: 17, 73: 16, 74: 14, 75: 15, 76: 18, 77: 19, 78: 20, 79: 22, 80: 30, 81: 0, 82: 0, 83: 0, 84: 4, 85: 28, 86: 28, 87: 28, 88: 0, 89: 0, 90: 0, 91: 0, 92: 0, 93: 0, 94: 0, 128: 0, 129: 0, 130: 0, 131: 0, 132: 0, 133: 0, 134: 0, 135: 7, 136: 4, 137: 26, 138: 0, 139: 0, 140: 0, 141: 0, 142: 0, 143: 28, 144: 0, 145: 0, 146: 0, 147: 0, 148: 6, 149: 0, 150: 0, 151: 0 };
var Xt = { 1078: "af", 1052: "sq", 1156: "gsw", 1118: "am", 5121: "ar-DZ", 15361: "ar-BH", 3073: "ar", 2049: "ar-IQ", 11265: "ar-JO", 13313: "ar-KW", 12289: "ar-LB", 4097: "ar-LY", 6145: "ary", 8193: "ar-OM", 16385: "ar-QA", 1025: "ar-SA", 10241: "ar-SY", 7169: "aeb", 14337: "ar-AE", 9217: "ar-YE", 1067: "hy", 1101: "as", 2092: "az-Cyrl", 1068: "az", 1133: "ba", 1069: "eu", 1059: "be", 2117: "bn", 1093: "bn-IN", 8218: "bs-Cyrl", 5146: "bs", 1150: "br", 1026: "bg", 1027: "ca", 3076: "zh-HK", 5124: "zh-MO", 2052: "zh", 4100: "zh-SG", 1028: "zh-TW", 1155: "co", 1050: "hr", 4122: "hr-BA", 1029: "cs", 1030: "da", 1164: "prs", 1125: "dv", 2067: "nl-BE", 1043: "nl", 3081: "en-AU", 10249: "en-BZ", 4105: "en-CA", 9225: "en-029", 16393: "en-IN", 6153: "en-IE", 8201: "en-JM", 17417: "en-MY", 5129: "en-NZ", 13321: "en-PH", 18441: "en-SG", 7177: "en-ZA", 11273: "en-TT", 2057: "en-GB", 1033: "en", 12297: "en-ZW", 1061: "et", 1080: "fo", 1124: "fil", 1035: "fi", 2060: "fr-BE", 3084: "fr-CA", 1036: "fr", 5132: "fr-LU", 6156: "fr-MC", 4108: "fr-CH", 1122: "fy", 1110: "gl", 1079: "ka", 3079: "de-AT", 1031: "de", 5127: "de-LI", 4103: "de-LU", 2055: "de-CH", 1032: "el", 1135: "kl", 1095: "gu", 1128: "ha", 1037: "he", 1081: "hi", 1038: "hu", 1039: "is", 1136: "ig", 1057: "id", 1117: "iu", 2141: "iu-Latn", 2108: "ga", 1076: "xh", 1077: "zu", 1040: "it", 2064: "it-CH", 1041: "ja", 1099: "kn", 1087: "kk", 1107: "km", 1158: "quc", 1159: "rw", 1089: "sw", 1111: "kok", 1042: "ko", 1088: "ky", 1108: "lo", 1062: "lv", 1063: "lt", 2094: "dsb", 1134: "lb", 1071: "mk", 2110: "ms-BN", 1086: "ms", 1100: "ml", 1082: "mt", 1153: "mi", 1146: "arn", 1102: "mr", 1148: "moh", 1104: "mn", 2128: "mn-CN", 1121: "ne", 1044: "nb", 2068: "nn", 1154: "oc", 1096: "or", 1123: "ps", 1045: "pl", 1046: "pt", 2070: "pt-PT", 1094: "pa", 1131: "qu-BO", 2155: "qu-EC", 3179: "qu", 1048: "ro", 1047: "rm", 1049: "ru", 9275: "smn", 4155: "smj-NO", 5179: "smj", 3131: "se-FI", 1083: "se", 2107: "se-SE", 8251: "sms", 6203: "sma-NO", 7227: "sms", 1103: "sa", 7194: "sr-Cyrl-BA", 3098: "sr", 6170: "sr-Latn-BA", 2074: "sr-Latn", 1132: "nso", 1074: "tn", 1115: "si", 1051: "sk", 1060: "sl", 11274: "es-AR", 16394: "es-BO", 13322: "es-CL", 9226: "es-CO", 5130: "es-CR", 7178: "es-DO", 12298: "es-EC", 17418: "es-SV", 4106: "es-GT", 18442: "es-HN", 2058: "es-MX", 19466: "es-NI", 6154: "es-PA", 15370: "es-PY", 10250: "es-PE", 20490: "es-PR", 3082: "es", 1034: "es", 21514: "es-US", 14346: "es-UY", 8202: "es-VE", 2077: "sv-FI", 1053: "sv", 1114: "syr", 1064: "tg", 2143: "tzm", 1097: "ta", 1092: "tt", 1098: "te", 1054: "th", 1105: "bo", 1055: "tr", 1090: "tk", 1152: "ug", 1058: "uk", 1070: "hsb", 1056: "ur", 2115: "uz-Cyrl", 1091: "uz", 1066: "vi", 1106: "cy", 1160: "wo", 1157: "sah", 1144: "ii", 1130: "yo" };
function Ln(e, r, t) {
  switch (e) {
    case 0:
      if (r === 65535) return "und";
      if (t) return t[r];
      break;
    case 1:
      return qt[r];
    case 3:
      return Xt[r];
  }
}
var mr = "utf-16";
var Rn = { 0: "macintosh", 1: "x-mac-japanese", 2: "x-mac-chinesetrad", 3: "x-mac-korean", 6: "x-mac-greek", 7: "x-mac-cyrillic", 9: "x-mac-devanagai", 10: "x-mac-gurmukhi", 11: "x-mac-gujarati", 12: "x-mac-oriya", 13: "x-mac-bengali", 14: "x-mac-tamil", 15: "x-mac-telugu", 16: "x-mac-kannada", 17: "x-mac-malayalam", 18: "x-mac-sinhalese", 19: "x-mac-burmese", 20: "x-mac-khmer", 21: "x-mac-thai", 22: "x-mac-lao", 23: "x-mac-georgian", 24: "x-mac-armenian", 25: "x-mac-chinesesimp", 26: "x-mac-tibetan", 27: "x-mac-mongolian", 28: "x-mac-ethiopic", 29: "x-mac-ce", 30: "x-mac-vietnamese", 31: "x-mac-extarabic" };
var wn = { 15: "x-mac-icelandic", 17: "x-mac-turkish", 18: "x-mac-croatian", 24: "x-mac-ce", 25: "x-mac-ce", 26: "x-mac-ce", 27: "x-mac-ce", 28: "x-mac-ce", 30: "x-mac-icelandic", 37: "x-mac-romanian", 38: "x-mac-ce", 39: "x-mac-ce", 40: "x-mac-ce", 143: "x-mac-inuit", 146: "x-mac-gaelic" };
function Yt(e, r, t) {
  switch (e) {
    case 0:
      return mr;
    case 1:
      return wn[t] || Rn[r];
    case 3:
      if (r === 1 || r === 10) return mr;
      break;
  }
}
function Dn(e, r, t) {
  for (var a = {}, n = new k.Parser(e, r), s = n.parseUShort(), i = n.parseUShort(), u = n.offset + n.parseUShort(), o = 0; o < i; o++) {
    var l = n.parseUShort(), f = n.parseUShort(), h = n.parseUShort(), p = n.parseUShort(), c = Vt[p] || p, d = n.parseUShort(), x = n.parseUShort(), m = Ln(l, h, t), y = Yt(l, f, h);
    if (y !== void 0 && m !== void 0) {
      var C = void 0;
      if (y === mr ? C = Fe.UTF16(e, u + x, d) : C = Fe.MACSTRING(e, u + x, d, y), C) {
        var S = a[c];
        S === void 0 && (S = a[c] = {}), S[m] = C;
      }
    }
  }
  var R = 0;
  return s === 1 && (R = n.parseUShort()), a;
}
function nr(e) {
  var r = {};
  for (var t in e) r[e[t]] = parseInt(t);
  return r;
}
function Xr(e, r, t, a, n, s) {
  return new b.Record("NameRecord", [{ name: "platformID", type: "USHORT", value: e }, { name: "encodingID", type: "USHORT", value: r }, { name: "languageID", type: "USHORT", value: t }, { name: "nameID", type: "USHORT", value: a }, { name: "length", type: "USHORT", value: n }, { name: "offset", type: "USHORT", value: s }]);
}
function An(e, r) {
  var t = e.length, a = r.length - t + 1;
  e: for (var n = 0; n < a; n++) for (; n < a; n++) {
    for (var s = 0; s < t; s++) if (r[n + s] !== e[s]) continue e;
    return n;
  }
  return -1;
}
function Yr(e, r) {
  var t = An(e, r);
  if (t < 0) {
    t = r.length;
    for (var a = 0, n = e.length; a < n; ++a) r.push(e[a]);
  }
  return t;
}
function Bn(e, r) {
  var t, a = [], n = {}, s = nr(Vt);
  for (var i in e) {
    var u = s[i];
    if (u === void 0 && (u = i), t = parseInt(u), isNaN(t)) throw new Error('Name table entry "' + i + '" does not exist, see nameTableNames for complete list.');
    n[t] = e[i], a.push(t);
  }
  for (var o = nr(qt), l = nr(Xt), f = [], h = [], p = 0; p < a.length; p++) {
    t = a[p];
    var c = n[t];
    for (var d in c) {
      var x = c[d], m = 1, y = o[d], C = On[y], S = Yt(m, C, y), R = g.MACSTRING(x, S);
      R === void 0 && (m = 0, y = r.indexOf(d), y < 0 && (y = r.length, r.push(d)), C = 4, R = g.UTF16(x));
      var O = Yr(R, h);
      f.push(Xr(m, C, y, t, R.length, O));
      var D = l[d];
      if (D !== void 0) {
        var L = g.UTF16(x), F = Yr(L, h);
        f.push(Xr(3, 1, D, t, L.length, F));
      }
    }
  }
  f.sort(function(Z, j) {
    return Z.platformID - j.platformID || Z.encodingID - j.encodingID || Z.languageID - j.languageID || Z.nameID - j.nameID;
  });
  for (var G = new b.Table("name", [{ name: "format", type: "USHORT", value: 0 }, { name: "count", type: "USHORT", value: f.length }, { name: "stringOffset", type: "USHORT", value: 6 + f.length * 12 }]), Y = 0; Y < f.length; Y++) G.fields.push({ name: "record_" + Y, type: "RECORD", value: f[Y] });
  return G.fields.push({ name: "strings", type: "LITERAL", value: h }), G;
}
var Zt = { parse: Dn, make: Bn };
var yr = [{ begin: 0, end: 127 }, { begin: 128, end: 255 }, { begin: 256, end: 383 }, { begin: 384, end: 591 }, { begin: 592, end: 687 }, { begin: 688, end: 767 }, { begin: 768, end: 879 }, { begin: 880, end: 1023 }, { begin: 11392, end: 11519 }, { begin: 1024, end: 1279 }, { begin: 1328, end: 1423 }, { begin: 1424, end: 1535 }, { begin: 42240, end: 42559 }, { begin: 1536, end: 1791 }, { begin: 1984, end: 2047 }, { begin: 2304, end: 2431 }, { begin: 2432, end: 2559 }, { begin: 2560, end: 2687 }, { begin: 2688, end: 2815 }, { begin: 2816, end: 2943 }, { begin: 2944, end: 3071 }, { begin: 3072, end: 3199 }, { begin: 3200, end: 3327 }, { begin: 3328, end: 3455 }, { begin: 3584, end: 3711 }, { begin: 3712, end: 3839 }, { begin: 4256, end: 4351 }, { begin: 6912, end: 7039 }, { begin: 4352, end: 4607 }, { begin: 7680, end: 7935 }, { begin: 7936, end: 8191 }, { begin: 8192, end: 8303 }, { begin: 8304, end: 8351 }, { begin: 8352, end: 8399 }, { begin: 8400, end: 8447 }, { begin: 8448, end: 8527 }, { begin: 8528, end: 8591 }, { begin: 8592, end: 8703 }, { begin: 8704, end: 8959 }, { begin: 8960, end: 9215 }, { begin: 9216, end: 9279 }, { begin: 9280, end: 9311 }, { begin: 9312, end: 9471 }, { begin: 9472, end: 9599 }, { begin: 9600, end: 9631 }, { begin: 9632, end: 9727 }, { begin: 9728, end: 9983 }, { begin: 9984, end: 10175 }, { begin: 12288, end: 12351 }, { begin: 12352, end: 12447 }, { begin: 12448, end: 12543 }, { begin: 12544, end: 12591 }, { begin: 12592, end: 12687 }, { begin: 43072, end: 43135 }, { begin: 12800, end: 13055 }, { begin: 13056, end: 13311 }, { begin: 44032, end: 55215 }, { begin: 55296, end: 57343 }, { begin: 67840, end: 67871 }, { begin: 19968, end: 40959 }, { begin: 57344, end: 63743 }, { begin: 12736, end: 12783 }, { begin: 64256, end: 64335 }, { begin: 64336, end: 65023 }, { begin: 65056, end: 65071 }, { begin: 65040, end: 65055 }, { begin: 65104, end: 65135 }, { begin: 65136, end: 65279 }, { begin: 65280, end: 65519 }, { begin: 65520, end: 65535 }, { begin: 3840, end: 4095 }, { begin: 1792, end: 1871 }, { begin: 1920, end: 1983 }, { begin: 3456, end: 3583 }, { begin: 4096, end: 4255 }, { begin: 4608, end: 4991 }, { begin: 5024, end: 5119 }, { begin: 5120, end: 5759 }, { begin: 5760, end: 5791 }, { begin: 5792, end: 5887 }, { begin: 6016, end: 6143 }, { begin: 6144, end: 6319 }, { begin: 10240, end: 10495 }, { begin: 40960, end: 42127 }, { begin: 5888, end: 5919 }, { begin: 66304, end: 66351 }, { begin: 66352, end: 66383 }, { begin: 66560, end: 66639 }, { begin: 118784, end: 119039 }, { begin: 119808, end: 120831 }, { begin: 1044480, end: 1048573 }, { begin: 65024, end: 65039 }, { begin: 917504, end: 917631 }, { begin: 6400, end: 6479 }, { begin: 6480, end: 6527 }, { begin: 6528, end: 6623 }, { begin: 6656, end: 6687 }, { begin: 11264, end: 11359 }, { begin: 11568, end: 11647 }, { begin: 19904, end: 19967 }, { begin: 43008, end: 43055 }, { begin: 65536, end: 65663 }, { begin: 65856, end: 65935 }, { begin: 66432, end: 66463 }, { begin: 66464, end: 66527 }, { begin: 66640, end: 66687 }, { begin: 66688, end: 66735 }, { begin: 67584, end: 67647 }, { begin: 68096, end: 68191 }, { begin: 119552, end: 119647 }, { begin: 73728, end: 74751 }, { begin: 119648, end: 119679 }, { begin: 7040, end: 7103 }, { begin: 7168, end: 7247 }, { begin: 7248, end: 7295 }, { begin: 43136, end: 43231 }, { begin: 43264, end: 43311 }, { begin: 43312, end: 43359 }, { begin: 43520, end: 43615 }, { begin: 65936, end: 65999 }, { begin: 66e3, end: 66047 }, { begin: 66208, end: 66271 }, { begin: 127024, end: 127135 }];
function In(e) {
  for (var r = 0; r < yr.length; r += 1) {
    var t = yr[r];
    if (e >= t.begin && e < t.end) return r;
  }
  return -1;
}
function Mn(e, r) {
  var t = {}, a = new k.Parser(e, r);
  t.version = a.parseUShort(), t.xAvgCharWidth = a.parseShort(), t.usWeightClass = a.parseUShort(), t.usWidthClass = a.parseUShort(), t.fsType = a.parseUShort(), t.ySubscriptXSize = a.parseShort(), t.ySubscriptYSize = a.parseShort(), t.ySubscriptXOffset = a.parseShort(), t.ySubscriptYOffset = a.parseShort(), t.ySuperscriptXSize = a.parseShort(), t.ySuperscriptYSize = a.parseShort(), t.ySuperscriptXOffset = a.parseShort(), t.ySuperscriptYOffset = a.parseShort(), t.yStrikeoutSize = a.parseShort(), t.yStrikeoutPosition = a.parseShort(), t.sFamilyClass = a.parseShort(), t.panose = [];
  for (var n = 0; n < 10; n++) t.panose[n] = a.parseByte();
  return t.ulUnicodeRange1 = a.parseULong(), t.ulUnicodeRange2 = a.parseULong(), t.ulUnicodeRange3 = a.parseULong(), t.ulUnicodeRange4 = a.parseULong(), t.achVendID = String.fromCharCode(a.parseByte(), a.parseByte(), a.parseByte(), a.parseByte()), t.fsSelection = a.parseUShort(), t.usFirstCharIndex = a.parseUShort(), t.usLastCharIndex = a.parseUShort(), t.sTypoAscender = a.parseShort(), t.sTypoDescender = a.parseShort(), t.sTypoLineGap = a.parseShort(), t.usWinAscent = a.parseUShort(), t.usWinDescent = a.parseUShort(), t.version >= 1 && (t.ulCodePageRange1 = a.parseULong(), t.ulCodePageRange2 = a.parseULong()), t.version >= 2 && (t.sxHeight = a.parseShort(), t.sCapHeight = a.parseShort(), t.usDefaultChar = a.parseUShort(), t.usBreakChar = a.parseUShort(), t.usMaxContent = a.parseUShort()), t;
}
function Pn(e) {
  return new b.Table("OS/2", [{ name: "version", type: "USHORT", value: 3 }, { name: "xAvgCharWidth", type: "SHORT", value: 0 }, { name: "usWeightClass", type: "USHORT", value: 0 }, { name: "usWidthClass", type: "USHORT", value: 0 }, { name: "fsType", type: "USHORT", value: 0 }, { name: "ySubscriptXSize", type: "SHORT", value: 650 }, { name: "ySubscriptYSize", type: "SHORT", value: 699 }, { name: "ySubscriptXOffset", type: "SHORT", value: 0 }, { name: "ySubscriptYOffset", type: "SHORT", value: 140 }, { name: "ySuperscriptXSize", type: "SHORT", value: 650 }, { name: "ySuperscriptYSize", type: "SHORT", value: 699 }, { name: "ySuperscriptXOffset", type: "SHORT", value: 0 }, { name: "ySuperscriptYOffset", type: "SHORT", value: 479 }, { name: "yStrikeoutSize", type: "SHORT", value: 49 }, { name: "yStrikeoutPosition", type: "SHORT", value: 258 }, { name: "sFamilyClass", type: "SHORT", value: 0 }, { name: "bFamilyType", type: "BYTE", value: 0 }, { name: "bSerifStyle", type: "BYTE", value: 0 }, { name: "bWeight", type: "BYTE", value: 0 }, { name: "bProportion", type: "BYTE", value: 0 }, { name: "bContrast", type: "BYTE", value: 0 }, { name: "bStrokeVariation", type: "BYTE", value: 0 }, { name: "bArmStyle", type: "BYTE", value: 0 }, { name: "bLetterform", type: "BYTE", value: 0 }, { name: "bMidline", type: "BYTE", value: 0 }, { name: "bXHeight", type: "BYTE", value: 0 }, { name: "ulUnicodeRange1", type: "ULONG", value: 0 }, { name: "ulUnicodeRange2", type: "ULONG", value: 0 }, { name: "ulUnicodeRange3", type: "ULONG", value: 0 }, { name: "ulUnicodeRange4", type: "ULONG", value: 0 }, { name: "achVendID", type: "CHARARRAY", value: "XXXX" }, { name: "fsSelection", type: "USHORT", value: 0 }, { name: "usFirstCharIndex", type: "USHORT", value: 0 }, { name: "usLastCharIndex", type: "USHORT", value: 0 }, { name: "sTypoAscender", type: "SHORT", value: 0 }, { name: "sTypoDescender", type: "SHORT", value: 0 }, { name: "sTypoLineGap", type: "SHORT", value: 0 }, { name: "usWinAscent", type: "USHORT", value: 0 }, { name: "usWinDescent", type: "USHORT", value: 0 }, { name: "ulCodePageRange1", type: "ULONG", value: 0 }, { name: "ulCodePageRange2", type: "ULONG", value: 0 }, { name: "sxHeight", type: "SHORT", value: 0 }, { name: "sCapHeight", type: "SHORT", value: 0 }, { name: "usDefaultChar", type: "USHORT", value: 0 }, { name: "usBreakChar", type: "USHORT", value: 0 }, { name: "usMaxContext", type: "USHORT", value: 0 }], e);
}
var xr = { parse: Mn, make: Pn, unicodeRanges: yr, getUnicodeRange: In };
function Gn(e, r) {
  var t = {}, a = new k.Parser(e, r);
  switch (t.version = a.parseVersion(), t.italicAngle = a.parseFixed(), t.underlinePosition = a.parseShort(), t.underlineThickness = a.parseShort(), t.isFixedPitch = a.parseULong(), t.minMemType42 = a.parseULong(), t.maxMemType42 = a.parseULong(), t.minMemType1 = a.parseULong(), t.maxMemType1 = a.parseULong(), t.version) {
    case 1:
      t.names = xe.slice();
      break;
    case 2:
      t.numberOfGlyphs = a.parseUShort(), t.glyphNameIndex = new Array(t.numberOfGlyphs);
      for (var n = 0; n < t.numberOfGlyphs; n++) t.glyphNameIndex[n] = a.parseUShort();
      t.names = [];
      for (var s = 0; s < t.numberOfGlyphs; s++) if (t.glyphNameIndex[s] >= xe.length) {
        var i = a.parseChar();
        t.names.push(a.parseString(i));
      }
      break;
    case 2.5:
      t.numberOfGlyphs = a.parseUShort(), t.offset = new Array(t.numberOfGlyphs);
      for (var u = 0; u < t.numberOfGlyphs; u++) t.offset[u] = a.parseChar();
      break;
  }
  return t;
}
function Nn() {
  return new b.Table("post", [{ name: "version", type: "FIXED", value: 196608 }, { name: "italicAngle", type: "FIXED", value: 0 }, { name: "underlinePosition", type: "FWORD", value: 0 }, { name: "underlineThickness", type: "FWORD", value: 0 }, { name: "isFixedPitch", type: "ULONG", value: 0 }, { name: "minMemType42", type: "ULONG", value: 0 }, { name: "maxMemType42", type: "ULONG", value: 0 }, { name: "minMemType1", type: "ULONG", value: 0 }, { name: "maxMemType1", type: "ULONG", value: 0 }]);
}
var Qt = { parse: Gn, make: Nn };
var ee = new Array(9);
ee[1] = function() {
  var r = this.offset + this.relativeOffset, t = this.parseUShort();
  if (t === 1) return { substFormat: 1, coverage: this.parsePointer(v.coverage), deltaGlyphId: this.parseUShort() };
  if (t === 2) return { substFormat: 2, coverage: this.parsePointer(v.coverage), substitute: this.parseOffset16List() };
  U.assert(false, "0x" + r.toString(16) + ": lookup type 1 format must be 1 or 2.");
};
ee[2] = function() {
  var r = this.parseUShort();
  return U.argument(r === 1, "GSUB Multiple Substitution Subtable identifier-format must be 1"), { substFormat: r, coverage: this.parsePointer(v.coverage), sequences: this.parseListOfLists() };
};
ee[3] = function() {
  var r = this.parseUShort();
  return U.argument(r === 1, "GSUB Alternate Substitution Subtable identifier-format must be 1"), { substFormat: r, coverage: this.parsePointer(v.coverage), alternateSets: this.parseListOfLists() };
};
ee[4] = function() {
  var r = this.parseUShort();
  return U.argument(r === 1, "GSUB ligature table identifier-format must be 1"), { substFormat: r, coverage: this.parsePointer(v.coverage), ligatureSets: this.parseListOfLists(function() {
    return { ligGlyph: this.parseUShort(), components: this.parseUShortList(this.parseUShort() - 1) };
  }) };
};
var ke = { sequenceIndex: v.uShort, lookupListIndex: v.uShort };
ee[5] = function() {
  var r = this.offset + this.relativeOffset, t = this.parseUShort();
  if (t === 1) return { substFormat: t, coverage: this.parsePointer(v.coverage), ruleSets: this.parseListOfLists(function() {
    var s = this.parseUShort(), i = this.parseUShort();
    return { input: this.parseUShortList(s - 1), lookupRecords: this.parseRecordList(i, ke) };
  }) };
  if (t === 2) return { substFormat: t, coverage: this.parsePointer(v.coverage), classDef: this.parsePointer(v.classDef), classSets: this.parseListOfLists(function() {
    var s = this.parseUShort(), i = this.parseUShort();
    return { classes: this.parseUShortList(s - 1), lookupRecords: this.parseRecordList(i, ke) };
  }) };
  if (t === 3) {
    var a = this.parseUShort(), n = this.parseUShort();
    return { substFormat: t, coverages: this.parseList(a, v.pointer(v.coverage)), lookupRecords: this.parseRecordList(n, ke) };
  }
  U.assert(false, "0x" + r.toString(16) + ": lookup type 5 format must be 1, 2 or 3.");
};
ee[6] = function() {
  var r = this.offset + this.relativeOffset, t = this.parseUShort();
  if (t === 1) return { substFormat: 1, coverage: this.parsePointer(v.coverage), chainRuleSets: this.parseListOfLists(function() {
    return { backtrack: this.parseUShortList(), input: this.parseUShortList(this.parseShort() - 1), lookahead: this.parseUShortList(), lookupRecords: this.parseRecordList(ke) };
  }) };
  if (t === 2) return { substFormat: 2, coverage: this.parsePointer(v.coverage), backtrackClassDef: this.parsePointer(v.classDef), inputClassDef: this.parsePointer(v.classDef), lookaheadClassDef: this.parsePointer(v.classDef), chainClassSet: this.parseListOfLists(function() {
    return { backtrack: this.parseUShortList(), input: this.parseUShortList(this.parseShort() - 1), lookahead: this.parseUShortList(), lookupRecords: this.parseRecordList(ke) };
  }) };
  if (t === 3) return { substFormat: 3, backtrackCoverage: this.parseList(v.pointer(v.coverage)), inputCoverage: this.parseList(v.pointer(v.coverage)), lookaheadCoverage: this.parseList(v.pointer(v.coverage)), lookupRecords: this.parseRecordList(ke) };
  U.assert(false, "0x" + r.toString(16) + ": lookup type 6 format must be 1, 2 or 3.");
};
ee[7] = function() {
  var r = this.parseUShort();
  U.argument(r === 1, "GSUB Extension Substitution subtable identifier-format must be 1");
  var t = this.parseUShort(), a = new v(this.data, this.offset + this.parseULong());
  return { substFormat: 1, lookupType: t, extension: ee[t].call(a) };
};
ee[8] = function() {
  var r = this.parseUShort();
  return U.argument(r === 1, "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"), { substFormat: r, coverage: this.parsePointer(v.coverage), backtrackCoverage: this.parseList(v.pointer(v.coverage)), lookaheadCoverage: this.parseList(v.pointer(v.coverage)), substitutes: this.parseUShortList() };
};
function Hn(e, r) {
  r = r || 0;
  var t = new v(e, r), a = t.parseVersion(1);
  return U.argument(a === 1 || a === 1.1, "Unsupported GSUB table version."), a === 1 ? { version: a, scripts: t.parseScriptList(), features: t.parseFeatureList(), lookups: t.parseLookupList(ee) } : { version: a, scripts: t.parseScriptList(), features: t.parseFeatureList(), lookups: t.parseLookupList(ee), variations: t.parseFeatureVariationsList() };
}
var Ue = new Array(9);
Ue[1] = function(r) {
  return r.substFormat === 1 ? new b.Table("substitutionTable", [{ name: "substFormat", type: "USHORT", value: 1 }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }, { name: "deltaGlyphID", type: "USHORT", value: r.deltaGlyphId }]) : new b.Table("substitutionTable", [{ name: "substFormat", type: "USHORT", value: 2 }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }].concat(b.ushortList("substitute", r.substitute)));
};
Ue[2] = function(r) {
  return U.assert(r.substFormat === 1, "Lookup type 2 substFormat must be 1."), new b.Table("substitutionTable", [{ name: "substFormat", type: "USHORT", value: 1 }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }].concat(b.tableList("seqSet", r.sequences, function(t) {
    return new b.Table("sequenceSetTable", b.ushortList("sequence", t));
  })));
};
Ue[3] = function(r) {
  return U.assert(r.substFormat === 1, "Lookup type 3 substFormat must be 1."), new b.Table("substitutionTable", [{ name: "substFormat", type: "USHORT", value: 1 }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }].concat(b.tableList("altSet", r.alternateSets, function(t) {
    return new b.Table("alternateSetTable", b.ushortList("alternate", t));
  })));
};
Ue[4] = function(r) {
  return U.assert(r.substFormat === 1, "Lookup type 4 substFormat must be 1."), new b.Table("substitutionTable", [{ name: "substFormat", type: "USHORT", value: 1 }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }].concat(b.tableList("ligSet", r.ligatureSets, function(t) {
    return new b.Table("ligatureSetTable", b.tableList("ligature", t, function(a) {
      return new b.Table("ligatureTable", [{ name: "ligGlyph", type: "USHORT", value: a.ligGlyph }].concat(b.ushortList("component", a.components, a.components.length + 1)));
    }));
  })));
};
Ue[6] = function(r) {
  if (r.substFormat === 1) {
    var t = new b.Table("chainContextTable", [{ name: "substFormat", type: "USHORT", value: r.substFormat }, { name: "coverage", type: "TABLE", value: new b.Coverage(r.coverage) }].concat(b.tableList("chainRuleSet", r.chainRuleSets, function(s) {
      return new b.Table("chainRuleSetTable", b.tableList("chainRule", s, function(i) {
        var u = b.ushortList("backtrackGlyph", i.backtrack, i.backtrack.length).concat(b.ushortList("inputGlyph", i.input, i.input.length + 1)).concat(b.ushortList("lookaheadGlyph", i.lookahead, i.lookahead.length)).concat(b.ushortList("substitution", [], i.lookupRecords.length));
        return i.lookupRecords.forEach(function(o, l) {
          u = u.concat({ name: "sequenceIndex" + l, type: "USHORT", value: o.sequenceIndex }).concat({ name: "lookupListIndex" + l, type: "USHORT", value: o.lookupListIndex });
        }), new b.Table("chainRuleTable", u);
      }));
    })));
    return t;
  } else if (r.substFormat === 2) U.assert(false, "lookup type 6 format 2 is not yet supported.");
  else if (r.substFormat === 3) {
    var a = [{ name: "substFormat", type: "USHORT", value: r.substFormat }];
    a.push({ name: "backtrackGlyphCount", type: "USHORT", value: r.backtrackCoverage.length }), r.backtrackCoverage.forEach(function(s, i) {
      a.push({ name: "backtrackCoverage" + i, type: "TABLE", value: new b.Coverage(s) });
    }), a.push({ name: "inputGlyphCount", type: "USHORT", value: r.inputCoverage.length }), r.inputCoverage.forEach(function(s, i) {
      a.push({ name: "inputCoverage" + i, type: "TABLE", value: new b.Coverage(s) });
    }), a.push({ name: "lookaheadGlyphCount", type: "USHORT", value: r.lookaheadCoverage.length }), r.lookaheadCoverage.forEach(function(s, i) {
      a.push({ name: "lookaheadCoverage" + i, type: "TABLE", value: new b.Coverage(s) });
    }), a.push({ name: "substitutionCount", type: "USHORT", value: r.lookupRecords.length }), r.lookupRecords.forEach(function(s, i) {
      a = a.concat({ name: "sequenceIndex" + i, type: "USHORT", value: s.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: s.lookupListIndex });
    });
    var n = new b.Table("chainContextTable", a);
    return n;
  }
  U.assert(false, "lookup type 6 format must be 1, 2 or 3.");
};
function zn(e) {
  return new b.Table("GSUB", [{ name: "version", type: "ULONG", value: 65536 }, { name: "scripts", type: "TABLE", value: new b.ScriptList(e.scripts) }, { name: "features", type: "TABLE", value: new b.FeatureList(e.features) }, { name: "lookups", type: "TABLE", value: new b.LookupList(e.lookups, Ue) }]);
}
var Kt = { parse: Hn, make: zn };
function Wn(e, r) {
  var t = new k.Parser(e, r), a = t.parseULong();
  U.argument(a === 1, "Unsupported META table version."), t.parseULong(), t.parseULong();
  for (var n = t.parseULong(), s = {}, i = 0; i < n; i++) {
    var u = t.parseTag(), o = t.parseULong(), l = t.parseULong(), f = Fe.UTF8(e, r + o, l);
    s[u] = f;
  }
  return s;
}
function _n(e) {
  var r = Object.keys(e).length, t = "", a = 16 + r * 12, n = new b.Table("meta", [{ name: "version", type: "ULONG", value: 1 }, { name: "flags", type: "ULONG", value: 0 }, { name: "offset", type: "ULONG", value: a }, { name: "numTags", type: "ULONG", value: r }]);
  for (var s in e) {
    var i = t.length;
    t += e[s], n.fields.push({ name: "tag " + s, type: "TAG", value: s }), n.fields.push({ name: "offset " + s, type: "ULONG", value: a + i }), n.fields.push({ name: "length " + s, type: "ULONG", value: e[s].length });
  }
  return n.fields.push({ name: "stringPool", type: "CHARARRAY", value: t }), n;
}
var Jt = { parse: Wn, make: _n };
function Zr(e) {
  return Math.log(e) / Math.log(2) | 0;
}
function Er(e) {
  for (; e.length % 4 !== 0; ) e.push(0);
  for (var r = 0, t = 0; t < e.length; t += 4) r += (e[t] << 24) + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3];
  return r %= Math.pow(2, 32), r;
}
function Qr(e, r, t, a) {
  return new b.Record("Table Record", [{ name: "tag", type: "TAG", value: e !== void 0 ? e : "" }, { name: "checkSum", type: "ULONG", value: r !== void 0 ? r : 0 }, { name: "offset", type: "ULONG", value: t !== void 0 ? t : 0 }, { name: "length", type: "ULONG", value: a !== void 0 ? a : 0 }]);
}
function jt(e) {
  var r = new b.Table("sfnt", [{ name: "version", type: "TAG", value: "OTTO" }, { name: "numTables", type: "USHORT", value: 0 }, { name: "searchRange", type: "USHORT", value: 0 }, { name: "entrySelector", type: "USHORT", value: 0 }, { name: "rangeShift", type: "USHORT", value: 0 }]);
  r.tables = e, r.numTables = e.length;
  var t = Math.pow(2, Zr(r.numTables));
  r.searchRange = 16 * t, r.entrySelector = Zr(t), r.rangeShift = r.numTables * 16 - r.searchRange;
  for (var a = [], n = [], s = r.sizeOf() + Qr().sizeOf() * r.numTables; s % 4 !== 0; ) s += 1, n.push({ name: "padding", type: "BYTE", value: 0 });
  for (var i = 0; i < e.length; i += 1) {
    var u = e[i];
    U.argument(u.tableName.length === 4, "Table name" + u.tableName + " is invalid.");
    var o = u.sizeOf(), l = Qr(u.tableName, Er(u.encode()), s, o);
    for (a.push({ name: l.tag + " Table Record", type: "RECORD", value: l }), n.push({ name: u.tableName + " table", type: "RECORD", value: u }), s += o, U.argument(!isNaN(s), "Something went wrong calculating the offset."); s % 4 !== 0; ) s += 1, n.push({ name: "padding", type: "BYTE", value: 0 });
  }
  return a.sort(function(f, h) {
    return f.value.tag > h.value.tag ? 1 : -1;
  }), r.fields = r.fields.concat(a), r.fields = r.fields.concat(n), r;
}
function Kr(e, r, t) {
  for (var a = 0; a < r.length; a += 1) {
    var n = e.charToGlyphIndex(r[a]);
    if (n > 0) {
      var s = e.glyphs.get(n);
      return s.getMetrics();
    }
  }
  return t;
}
function Vn(e) {
  for (var r = 0, t = 0; t < e.length; t += 1) r += e[t];
  return r / e.length;
}
function qn(e) {
  for (var r = [], t = [], a = [], n = [], s = [], i = [], u = [], o, l = 0, f = 0, h = 0, p = 0, c = 0, d = 0; d < e.glyphs.length; d += 1) {
    var x = e.glyphs.get(d), m = x.unicode | 0;
    if (isNaN(x.advanceWidth)) throw new Error("Glyph " + x.name + " (" + d + "): advanceWidth is not a number.");
    (o > m || o === void 0) && m > 0 && (o = m), l < m && (l = m);
    var y = xr.getUnicodeRange(m);
    if (y < 32) f |= 1 << y;
    else if (y < 64) h |= 1 << y - 32;
    else if (y < 96) p |= 1 << y - 64;
    else if (y < 123) c |= 1 << y - 96;
    else throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
    if (x.name !== ".notdef") {
      var C = x.getMetrics();
      r.push(C.xMin), t.push(C.yMin), a.push(C.xMax), n.push(C.yMax), i.push(C.leftSideBearing), u.push(C.rightSideBearing), s.push(x.advanceWidth);
    }
  }
  var S = { xMin: Math.min.apply(null, r), yMin: Math.min.apply(null, t), xMax: Math.max.apply(null, a), yMax: Math.max.apply(null, n), advanceWidthMax: Math.max.apply(null, s), advanceWidthAvg: Vn(s), minLeftSideBearing: Math.min.apply(null, i), maxLeftSideBearing: Math.max.apply(null, i), minRightSideBearing: Math.min.apply(null, u) };
  S.ascender = e.ascender, S.descender = e.descender;
  var R = Nt.make({ flags: 3, unitsPerEm: e.unitsPerEm, xMin: S.xMin, yMin: S.yMin, xMax: S.xMax, yMax: S.yMax, lowestRecPPEM: 3, createdTimestamp: e.createdTimestamp }), O = Ht.make({ ascender: S.ascender, descender: S.descender, advanceWidthMax: S.advanceWidthMax, minLeftSideBearing: S.minLeftSideBearing, minRightSideBearing: S.minRightSideBearing, xMaxExtent: S.maxLeftSideBearing + (S.xMax - S.xMin), numberOfHMetrics: e.glyphs.length }), D = _t.make(e.glyphs.length), L = xr.make(Object.assign({ xAvgCharWidth: Math.round(S.advanceWidthAvg), usFirstCharIndex: o, usLastCharIndex: l, ulUnicodeRange1: f, ulUnicodeRange2: h, ulUnicodeRange3: p, ulUnicodeRange4: c, sTypoAscender: S.ascender, sTypoDescender: S.descender, sTypoLineGap: 0, usWinAscent: S.yMax, usWinDescent: Math.abs(S.yMin), ulCodePageRange1: 1, sxHeight: Kr(e, "xyvw", { yMax: Math.round(S.ascender / 2) }).yMax, sCapHeight: Kr(e, "HIKLEFJMNTZBDPRAGOQSUVWXY", S).yMax, usDefaultChar: e.hasChar(" ") ? 32 : 0, usBreakChar: e.hasChar(" ") ? 32 : 0 }, e.tables.os2)), F = zt.make(e.glyphs), G = Et.make(e.glyphs), Y = e.getEnglishName("fontFamily"), Z = e.getEnglishName("fontSubfamily"), j = Y + " " + Z, $ = e.getEnglishName("postScriptName");
  $ || ($ = Y.replace(/\s/g, "") + "-" + Z);
  var M = {};
  for (var N in e.names) M[N] = e.names[N];
  M.uniqueID || (M.uniqueID = { en: e.getEnglishName("manufacturer") + ":" + j }), M.postScriptName || (M.postScriptName = { en: $ }), M.preferredFamily || (M.preferredFamily = e.names.fontFamily), M.preferredSubfamily || (M.preferredSubfamily = e.names.fontSubfamily);
  var W = [], _ = Zt.make(M, W), V = W.length > 0 ? Wt.make(W) : void 0, H = Qt.make(), X = Gt.make(e.glyphs, { version: e.getEnglishName("version"), fullName: j, familyName: Y, weightName: Z, postScriptName: $, unitsPerEm: e.unitsPerEm, fontBBox: [0, S.yMin, S.ascender, S.advanceWidthMax] }), A = e.metas && Object.keys(e.metas).length > 0 ? Jt.make(e.metas) : void 0, q = [R, O, D, L, _, G, H, X, F];
  V && q.push(V), e.tables.gsub && q.push(Kt.make(e.tables.gsub)), A && q.push(A);
  for (var rr = jt(q), ha = rr.encode(), ca = Er(ha), tr = rr.fields, Ar = false, Ge = 0; Ge < tr.length; Ge += 1) if (tr[Ge].name === "head table") {
    tr[Ge].value.checkSumAdjustment = 2981146554 - ca, Ar = true;
    break;
  }
  if (!Ar) throw new Error("Could not find head table with checkSum to adjust.");
  return rr;
}
var Xn = { make: jt, fontToTable: qn, computeCheckSum: Er };
function sr(e, r) {
  for (var t = 0, a = e.length - 1; t <= a; ) {
    var n = t + a >>> 1, s = e[n].tag;
    if (s === r) return n;
    s < r ? t = n + 1 : a = n - 1;
  }
  return -t - 1;
}
function Jr(e, r) {
  for (var t = 0, a = e.length - 1; t <= a; ) {
    var n = t + a >>> 1, s = e[n];
    if (s === r) return n;
    s < r ? t = n + 1 : a = n - 1;
  }
  return -t - 1;
}
function jr(e, r) {
  for (var t, a = 0, n = e.length - 1; a <= n; ) {
    var s = a + n >>> 1;
    t = e[s];
    var i = t.start;
    if (i === r) return t;
    i < r ? a = s + 1 : n = s - 1;
  }
  if (a > 0) return t = e[a - 1], r > t.end ? 0 : t;
}
function Ae(e, r) {
  this.font = e, this.tableName = r;
}
Ae.prototype = { searchTag: sr, binSearch: Jr, getTable: function(e) {
  var r = this.font.tables[this.tableName];
  return !r && e && (r = this.font.tables[this.tableName] = this.createDefaultTable()), r;
}, getScriptNames: function() {
  var e = this.getTable();
  return e ? e.scripts.map(function(r) {
    return r.tag;
  }) : [];
}, getDefaultScriptName: function() {
  var e = this.getTable();
  if (!!e) {
    for (var r = false, t = 0; t < e.scripts.length; t++) {
      var a = e.scripts[t].tag;
      if (a === "DFLT") return a;
      a === "latn" && (r = true);
    }
    if (r) return "latn";
  }
}, getScriptTable: function(e, r) {
  var t = this.getTable(r);
  if (t) {
    e = e || "DFLT";
    var a = t.scripts, n = sr(t.scripts, e);
    if (n >= 0) return a[n].script;
    if (r) {
      var s = { tag: e, script: { defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }, langSysRecords: [] } };
      return a.splice(-1 - n, 0, s), s.script;
    }
  }
}, getLangSysTable: function(e, r, t) {
  var a = this.getScriptTable(e, t);
  if (a) {
    if (!r || r === "dflt" || r === "DFLT") return a.defaultLangSys;
    var n = sr(a.langSysRecords, r);
    if (n >= 0) return a.langSysRecords[n].langSys;
    if (t) {
      var s = { tag: r, langSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] } };
      return a.langSysRecords.splice(-1 - n, 0, s), s.langSys;
    }
  }
}, getFeatureTable: function(e, r, t, a) {
  var n = this.getLangSysTable(e, r, a);
  if (n) {
    for (var s, i = n.featureIndexes, u = this.font.tables[this.tableName].features, o = 0; o < i.length; o++) if (s = u[i[o]], s.tag === t) return s.feature;
    if (a) {
      var l = u.length;
      return U.assert(l === 0 || t >= u[l - 1].tag, "Features must be added in alphabetical order."), s = { tag: t, feature: { params: 0, lookupListIndexes: [] } }, u.push(s), i.push(l), s.feature;
    }
  }
}, getLookupTables: function(e, r, t, a, n) {
  var s = this.getFeatureTable(e, r, t, n), i = [];
  if (s) {
    for (var u, o = s.lookupListIndexes, l = this.font.tables[this.tableName].lookups, f = 0; f < o.length; f++) u = l[o[f]], u.lookupType === a && i.push(u);
    if (i.length === 0 && n) {
      u = { lookupType: a, lookupFlag: 0, subtables: [], markFilteringSet: void 0 };
      var h = l.length;
      return l.push(u), o.push(h), [u];
    }
  }
  return i;
}, getGlyphClass: function(e, r) {
  switch (e.format) {
    case 1:
      return e.startGlyph <= r && r < e.startGlyph + e.classes.length ? e.classes[r - e.startGlyph] : 0;
    case 2:
      var t = jr(e.ranges, r);
      return t ? t.classId : 0;
  }
}, getCoverageIndex: function(e, r) {
  switch (e.format) {
    case 1:
      var t = Jr(e.glyphs, r);
      return t >= 0 ? t : -1;
    case 2:
      var a = jr(e.ranges, r);
      return a ? a.index + r - a.start : -1;
  }
}, expandCoverage: function(e) {
  if (e.format === 1) return e.glyphs;
  for (var r = [], t = e.ranges, a = 0; a < t.length; a++) for (var n = t[a], s = n.start, i = n.end, u = s; u <= i; u++) r.push(u);
  return r;
} };
function Be(e) {
  Ae.call(this, e, "gpos");
}
Be.prototype = Ae.prototype;
Be.prototype.init = function() {
  var e = this.getDefaultScriptName();
  this.defaultKerningTables = this.getKerningTables(e);
};
Be.prototype.getKerningValue = function(e, r, t) {
  for (var a = 0; a < e.length; a++) for (var n = e[a].subtables, s = 0; s < n.length; s++) {
    var i = n[s], u = this.getCoverageIndex(i.coverage, r);
    if (!(u < 0)) switch (i.posFormat) {
      case 1:
        for (var o = i.pairSets[u], l = 0; l < o.length; l++) {
          var f = o[l];
          if (f.secondGlyph === t) return f.value1 && f.value1.xAdvance || 0;
        }
        break;
      case 2:
        var h = this.getGlyphClass(i.classDef1, r), p = this.getGlyphClass(i.classDef2, t), c = i.classRecords[h][p];
        return c.value1 && c.value1.xAdvance || 0;
    }
  }
  return 0;
};
Be.prototype.getKerningTables = function(e, r) {
  if (this.font.tables.gpos) return this.getLookupTables(e, r, "kern", 2);
};
function K(e) {
  Ae.call(this, e, "gsub");
}
function Yn(e, r) {
  var t = e.length;
  if (t !== r.length) return false;
  for (var a = 0; a < t; a++) if (e[a] !== r[a]) return false;
  return true;
}
function Or(e, r, t) {
  for (var a = e.subtables, n = 0; n < a.length; n++) {
    var s = a[n];
    if (s.substFormat === r) return s;
  }
  if (t) return a.push(t), t;
}
K.prototype = Ae.prototype;
K.prototype.createDefaultTable = function() {
  return { version: 1, scripts: [{ tag: "DFLT", script: { defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }, langSysRecords: [] } }], features: [], lookups: [] };
};
K.prototype.getSingle = function(e, r, t) {
  for (var a = [], n = this.getLookupTables(r, t, e, 1), s = 0; s < n.length; s++) for (var i = n[s].subtables, u = 0; u < i.length; u++) {
    var o = i[u], l = this.expandCoverage(o.coverage), f = void 0;
    if (o.substFormat === 1) {
      var h = o.deltaGlyphId;
      for (f = 0; f < l.length; f++) {
        var p = l[f];
        a.push({ sub: p, by: p + h });
      }
    } else {
      var c = o.substitute;
      for (f = 0; f < l.length; f++) a.push({ sub: l[f], by: c[f] });
    }
  }
  return a;
};
K.prototype.getMultiple = function(e, r, t) {
  for (var a = [], n = this.getLookupTables(r, t, e, 2), s = 0; s < n.length; s++) for (var i = n[s].subtables, u = 0; u < i.length; u++) {
    var o = i[u], l = this.expandCoverage(o.coverage), f = void 0;
    for (f = 0; f < l.length; f++) {
      var h = l[f], p = o.sequences[f];
      a.push({ sub: h, by: p });
    }
  }
  return a;
};
K.prototype.getAlternates = function(e, r, t) {
  for (var a = [], n = this.getLookupTables(r, t, e, 3), s = 0; s < n.length; s++) for (var i = n[s].subtables, u = 0; u < i.length; u++) for (var o = i[u], l = this.expandCoverage(o.coverage), f = o.alternateSets, h = 0; h < l.length; h++) a.push({ sub: l[h], by: f[h] });
  return a;
};
K.prototype.getLigatures = function(e, r, t) {
  for (var a = [], n = this.getLookupTables(r, t, e, 4), s = 0; s < n.length; s++) for (var i = n[s].subtables, u = 0; u < i.length; u++) for (var o = i[u], l = this.expandCoverage(o.coverage), f = o.ligatureSets, h = 0; h < l.length; h++) for (var p = l[h], c = f[h], d = 0; d < c.length; d++) {
    var x = c[d];
    a.push({ sub: [p].concat(x.components), by: x.ligGlyph });
  }
  return a;
};
K.prototype.addSingle = function(e, r, t, a) {
  var n = this.getLookupTables(t, a, e, 1, true)[0], s = Or(n, 2, { substFormat: 2, coverage: { format: 1, glyphs: [] }, substitute: [] });
  U.assert(s.coverage.format === 1, "Single: unable to modify coverage table format " + s.coverage.format);
  var i = r.sub, u = this.binSearch(s.coverage.glyphs, i);
  u < 0 && (u = -1 - u, s.coverage.glyphs.splice(u, 0, i), s.substitute.splice(u, 0, 0)), s.substitute[u] = r.by;
};
K.prototype.addMultiple = function(e, r, t, a) {
  U.assert(r.by instanceof Array && r.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
  var n = this.getLookupTables(t, a, e, 2, true)[0], s = Or(n, 1, { substFormat: 1, coverage: { format: 1, glyphs: [] }, sequences: [] });
  U.assert(s.coverage.format === 1, "Multiple: unable to modify coverage table format " + s.coverage.format);
  var i = r.sub, u = this.binSearch(s.coverage.glyphs, i);
  u < 0 && (u = -1 - u, s.coverage.glyphs.splice(u, 0, i), s.sequences.splice(u, 0, 0)), s.sequences[u] = r.by;
};
K.prototype.addAlternate = function(e, r, t, a) {
  var n = this.getLookupTables(t, a, e, 3, true)[0], s = Or(n, 1, { substFormat: 1, coverage: { format: 1, glyphs: [] }, alternateSets: [] });
  U.assert(s.coverage.format === 1, "Alternate: unable to modify coverage table format " + s.coverage.format);
  var i = r.sub, u = this.binSearch(s.coverage.glyphs, i);
  u < 0 && (u = -1 - u, s.coverage.glyphs.splice(u, 0, i), s.alternateSets.splice(u, 0, 0)), s.alternateSets[u] = r.by;
};
K.prototype.addLigature = function(e, r, t, a) {
  var n = this.getLookupTables(t, a, e, 4, true)[0], s = n.subtables[0];
  s || (s = { substFormat: 1, coverage: { format: 1, glyphs: [] }, ligatureSets: [] }, n.subtables[0] = s), U.assert(s.coverage.format === 1, "Ligature: unable to modify coverage table format " + s.coverage.format);
  var i = r.sub[0], u = r.sub.slice(1), o = { ligGlyph: r.by, components: u }, l = this.binSearch(s.coverage.glyphs, i);
  if (l >= 0) {
    for (var f = s.ligatureSets[l], h = 0; h < f.length; h++) if (Yn(f[h].components, u)) return;
    f.push(o);
  } else l = -1 - l, s.coverage.glyphs.splice(l, 0, i), s.ligatureSets.splice(l, 0, [o]);
};
K.prototype.getFeature = function(e, r, t) {
  if (/ss\d\d/.test(e)) return this.getSingle(e, r, t);
  switch (e) {
    case "aalt":
    case "salt":
      return this.getSingle(e, r, t).concat(this.getAlternates(e, r, t));
    case "dlig":
    case "liga":
    case "rlig":
      return this.getLigatures(e, r, t);
    case "ccmp":
      return this.getMultiple(e, r, t).concat(this.getLigatures(e, r, t));
    case "stch":
      return this.getMultiple(e, r, t);
  }
};
K.prototype.add = function(e, r, t, a) {
  if (/ss\d\d/.test(e)) return this.addSingle(e, r, t, a);
  switch (e) {
    case "aalt":
    case "salt":
      return typeof r.by == "number" ? this.addSingle(e, r, t, a) : this.addAlternate(e, r, t, a);
    case "dlig":
    case "liga":
    case "rlig":
      return this.addLigature(e, r, t, a);
    case "ccmp":
      return r.by instanceof Array ? this.addMultiple(e, r, t, a) : this.addLigature(e, r, t, a);
  }
};
function Zn() {
  return typeof window < "u";
}
function $t(e) {
  for (var r = new ArrayBuffer(e.length), t = new Uint8Array(r), a = 0; a < e.length; ++a) t[a] = e[a];
  return r;
}
function Qn(e) {
  for (var r = new Buffer(e.byteLength), t = new Uint8Array(e), a = 0; a < r.length; ++a) r[a] = t[a];
  return r;
}
function Ee(e, r) {
  if (!e) throw r;
}
function $r(e, r, t, a, n) {
  var s;
  return (r & a) > 0 ? (s = e.parseByte(), (r & n) === 0 && (s = -s), s = t + s) : (r & n) > 0 ? s = t : s = t + e.parseShort(), s;
}
function ea(e, r, t) {
  var a = new k.Parser(r, t);
  e.numberOfContours = a.parseShort(), e._xMin = a.parseShort(), e._yMin = a.parseShort(), e._xMax = a.parseShort(), e._yMax = a.parseShort();
  var n, s;
  if (e.numberOfContours > 0) {
    for (var i = e.endPointIndices = [], u = 0; u < e.numberOfContours; u += 1) i.push(a.parseUShort());
    e.instructionLength = a.parseUShort(), e.instructions = [];
    for (var o = 0; o < e.instructionLength; o += 1) e.instructions.push(a.parseByte());
    var l = i[i.length - 1] + 1;
    n = [];
    for (var f = 0; f < l; f += 1) if (s = a.parseByte(), n.push(s), (s & 8) > 0) for (var h = a.parseByte(), p = 0; p < h; p += 1) n.push(s), f += 1;
    if (U.argument(n.length === l, "Bad flags."), i.length > 0) {
      var c = [], d;
      if (l > 0) {
        for (var x = 0; x < l; x += 1) s = n[x], d = {}, d.onCurve = !!(s & 1), d.lastPointOfContour = i.indexOf(x) >= 0, c.push(d);
        for (var m = 0, y = 0; y < l; y += 1) s = n[y], d = c[y], d.x = $r(a, s, m, 2, 16), m = d.x;
        for (var C = 0, S = 0; S < l; S += 1) s = n[S], d = c[S], d.y = $r(a, s, C, 4, 32), C = d.y;
      }
      e.points = c;
    } else e.points = [];
  } else if (e.numberOfContours === 0) e.points = [];
  else {
    e.isComposite = true, e.points = [], e.components = [];
    for (var R = true; R; ) {
      n = a.parseUShort();
      var O = { glyphIndex: a.parseUShort(), xScale: 1, scale01: 0, scale10: 0, yScale: 1, dx: 0, dy: 0 };
      (n & 1) > 0 ? (n & 2) > 0 ? (O.dx = a.parseShort(), O.dy = a.parseShort()) : O.matchedPoints = [a.parseUShort(), a.parseUShort()] : (n & 2) > 0 ? (O.dx = a.parseChar(), O.dy = a.parseChar()) : O.matchedPoints = [a.parseByte(), a.parseByte()], (n & 8) > 0 ? O.xScale = O.yScale = a.parseF2Dot14() : (n & 64) > 0 ? (O.xScale = a.parseF2Dot14(), O.yScale = a.parseF2Dot14()) : (n & 128) > 0 && (O.xScale = a.parseF2Dot14(), O.scale01 = a.parseF2Dot14(), O.scale10 = a.parseF2Dot14(), O.yScale = a.parseF2Dot14()), e.components.push(O), R = !!(n & 32);
    }
    if (n & 256) {
      e.instructionLength = a.parseUShort(), e.instructions = [];
      for (var D = 0; D < e.instructionLength; D += 1) e.instructions.push(a.parseByte());
    }
  }
}
function ir(e, r) {
  for (var t = [], a = 0; a < e.length; a += 1) {
    var n = e[a], s = { x: r.xScale * n.x + r.scale01 * n.y + r.dx, y: r.scale10 * n.x + r.yScale * n.y + r.dy, onCurve: n.onCurve, lastPointOfContour: n.lastPointOfContour };
    t.push(s);
  }
  return t;
}
function Kn(e) {
  for (var r = [], t = [], a = 0; a < e.length; a += 1) {
    var n = e[a];
    t.push(n), n.lastPointOfContour && (r.push(t), t = []);
  }
  return U.argument(t.length === 0, "There are still points left in the current contour."), r;
}
function ra(e) {
  var r = new P();
  if (!e) return r;
  for (var t = Kn(e), a = 0; a < t.length; ++a) {
    var n = t[a], s = null, i = n[n.length - 1], u = n[0];
    if (i.onCurve) r.moveTo(i.x, i.y);
    else if (u.onCurve) r.moveTo(u.x, u.y);
    else {
      var o = { x: (i.x + u.x) * 0.5, y: (i.y + u.y) * 0.5 };
      r.moveTo(o.x, o.y);
    }
    for (var l = 0; l < n.length; ++l) if (s = i, i = u, u = n[(l + 1) % n.length], i.onCurve) r.lineTo(i.x, i.y);
    else {
      var f = s, h = u;
      s.onCurve || (f = { x: (i.x + s.x) * 0.5, y: (i.y + s.y) * 0.5 }), u.onCurve || (h = { x: (i.x + u.x) * 0.5, y: (i.y + u.y) * 0.5 }), r.quadraticCurveTo(i.x, i.y, h.x, h.y);
    }
    r.closePath();
  }
  return r;
}
function ta(e, r) {
  if (r.isComposite) for (var t = 0; t < r.components.length; t += 1) {
    var a = r.components[t], n = e.get(a.glyphIndex);
    if (n.getPath(), n.points) {
      var s = void 0;
      if (a.matchedPoints === void 0) s = ir(n.points, a);
      else {
        if (a.matchedPoints[0] > r.points.length - 1 || a.matchedPoints[1] > n.points.length - 1) throw Error("Matched points out of range in " + r.name);
        var i = r.points[a.matchedPoints[0]], u = n.points[a.matchedPoints[1]], o = { xScale: a.xScale, scale01: a.scale01, scale10: a.scale10, yScale: a.yScale, dx: 0, dy: 0 };
        u = ir([u], o)[0], o.dx = i.x - u.x, o.dy = i.y - u.y, s = ir(n.points, o);
      }
      r.points = r.points.concat(s);
    }
  }
  return ra(r.points);
}
function Jn(e, r, t, a) {
  for (var n = new ue.GlyphSet(a), s = 0; s < t.length - 1; s += 1) {
    var i = t[s], u = t[s + 1];
    i !== u ? n.push(s, ue.ttfGlyphLoader(a, s, ea, e, r + i, ta)) : n.push(s, ue.glyphLoader(a, s));
  }
  return n;
}
function jn(e, r, t, a) {
  var n = new ue.GlyphSet(a);
  return a._push = function(s) {
    var i = t[s], u = t[s + 1];
    i !== u ? n.push(s, ue.ttfGlyphLoader(a, s, ea, e, r + i, ta)) : n.push(s, ue.glyphLoader(a, s));
  }, n;
}
function $n(e, r, t, a, n) {
  return n.lowMemory ? jn(e, r, t, a) : Jn(e, r, t, a);
}
var aa = { getPath: ra, parse: $n };
var na;
var Se;
var sa;
var br;
function ia(e) {
  this.font = e, this.getCommands = function(r) {
    return aa.getPath(r).commands;
  }, this._fpgmState = this._prepState = void 0, this._errorState = 0;
}
function es(e) {
  return e;
}
function oa(e) {
  return Math.sign(e) * Math.round(Math.abs(e));
}
function rs(e) {
  return Math.sign(e) * Math.round(Math.abs(e * 2)) / 2;
}
function ts(e) {
  return Math.sign(e) * (Math.round(Math.abs(e) + 0.5) - 0.5);
}
function as(e) {
  return Math.sign(e) * Math.ceil(Math.abs(e));
}
function ns(e) {
  return Math.sign(e) * Math.floor(Math.abs(e));
}
var ua = function(e) {
  var r = this.srPeriod, t = this.srPhase, a = this.srThreshold, n = 1;
  return e < 0 && (e = -e, n = -1), e += a - t, e = Math.trunc(e / r) * r, e += t, e < 0 ? t * n : e * n;
};
var oe = { x: 1, y: 0, axis: "x", distance: function(e, r, t, a) {
  return (t ? e.xo : e.x) - (a ? r.xo : r.x);
}, interpolate: function(e, r, t, a) {
  var n, s, i, u, o, l, f;
  if (!a || a === this) {
    if (n = e.xo - r.xo, s = e.xo - t.xo, o = r.x - r.xo, l = t.x - t.xo, i = Math.abs(n), u = Math.abs(s), f = i + u, f === 0) {
      e.x = e.xo + (o + l) / 2;
      return;
    }
    e.x = e.xo + (o * u + l * i) / f;
    return;
  }
  if (n = a.distance(e, r, true, true), s = a.distance(e, t, true, true), o = a.distance(r, r, false, true), l = a.distance(t, t, false, true), i = Math.abs(n), u = Math.abs(s), f = i + u, f === 0) {
    oe.setRelative(e, e, (o + l) / 2, a, true);
    return;
  }
  oe.setRelative(e, e, (o * u + l * i) / f, a, true);
}, normalSlope: Number.NEGATIVE_INFINITY, setRelative: function(e, r, t, a, n) {
  if (!a || a === this) {
    e.x = (n ? r.xo : r.x) + t;
    return;
  }
  var s = n ? r.xo : r.x, i = n ? r.yo : r.y, u = s + t * a.x, o = i + t * a.y;
  e.x = u + (e.y - o) / a.normalSlope;
}, slope: 0, touch: function(e) {
  e.xTouched = true;
}, touched: function(e) {
  return e.xTouched;
}, untouch: function(e) {
  e.xTouched = false;
} };
var le = { x: 0, y: 1, axis: "y", distance: function(e, r, t, a) {
  return (t ? e.yo : e.y) - (a ? r.yo : r.y);
}, interpolate: function(e, r, t, a) {
  var n, s, i, u, o, l, f;
  if (!a || a === this) {
    if (n = e.yo - r.yo, s = e.yo - t.yo, o = r.y - r.yo, l = t.y - t.yo, i = Math.abs(n), u = Math.abs(s), f = i + u, f === 0) {
      e.y = e.yo + (o + l) / 2;
      return;
    }
    e.y = e.yo + (o * u + l * i) / f;
    return;
  }
  if (n = a.distance(e, r, true, true), s = a.distance(e, t, true, true), o = a.distance(r, r, false, true), l = a.distance(t, t, false, true), i = Math.abs(n), u = Math.abs(s), f = i + u, f === 0) {
    le.setRelative(e, e, (o + l) / 2, a, true);
    return;
  }
  le.setRelative(e, e, (o * u + l * i) / f, a, true);
}, normalSlope: 0, setRelative: function(e, r, t, a, n) {
  if (!a || a === this) {
    e.y = (n ? r.yo : r.y) + t;
    return;
  }
  var s = n ? r.xo : r.x, i = n ? r.yo : r.y, u = s + t * a.x, o = i + t * a.y;
  e.y = o + a.normalSlope * (e.x - u);
}, slope: Number.POSITIVE_INFINITY, touch: function(e) {
  e.yTouched = true;
}, touched: function(e) {
  return e.yTouched;
}, untouch: function(e) {
  e.yTouched = false;
} };
Object.freeze(oe);
Object.freeze(le);
function Ie(e, r) {
  this.x = e, this.y = r, this.axis = void 0, this.slope = r / e, this.normalSlope = -e / r, Object.freeze(this);
}
Ie.prototype.distance = function(e, r, t, a) {
  return this.x * oe.distance(e, r, t, a) + this.y * le.distance(e, r, t, a);
};
Ie.prototype.interpolate = function(e, r, t, a) {
  var n, s, i, u, o, l, f;
  if (i = a.distance(e, r, true, true), u = a.distance(e, t, true, true), n = a.distance(r, r, false, true), s = a.distance(t, t, false, true), o = Math.abs(i), l = Math.abs(u), f = o + l, f === 0) {
    this.setRelative(e, e, (n + s) / 2, a, true);
    return;
  }
  this.setRelative(e, e, (n * l + s * o) / f, a, true);
};
Ie.prototype.setRelative = function(e, r, t, a, n) {
  a = a || this;
  var s = n ? r.xo : r.x, i = n ? r.yo : r.y, u = s + t * a.x, o = i + t * a.y, l = a.normalSlope, f = this.slope, h = e.x, p = e.y;
  e.x = (f * h - l * u + o - p) / (f - l), e.y = f * (e.x - h) + p;
};
Ie.prototype.touch = function(e) {
  e.xTouched = true, e.yTouched = true;
};
function Me(e, r) {
  var t = Math.sqrt(e * e + r * r);
  return e /= t, r /= t, e === 1 && r === 0 ? oe : e === 0 && r === 1 ? le : new Ie(e, r);
}
function fe(e, r, t, a) {
  this.x = this.xo = Math.round(e * 64) / 64, this.y = this.yo = Math.round(r * 64) / 64, this.lastPointOfContour = t, this.onCurve = a, this.prevPointOnContour = void 0, this.nextPointOnContour = void 0, this.xTouched = false, this.yTouched = false, Object.preventExtensions(this);
}
fe.prototype.nextTouched = function(e) {
  for (var r = this.nextPointOnContour; !e.touched(r) && r !== this; ) r = r.nextPointOnContour;
  return r;
};
fe.prototype.prevTouched = function(e) {
  for (var r = this.prevPointOnContour; !e.touched(r) && r !== this; ) r = r.prevPointOnContour;
  return r;
};
var De = Object.freeze(new fe(0, 0));
var ss = { cvCutIn: 17 / 16, deltaBase: 9, deltaShift: 0.125, loop: 1, minDis: 1, autoFlip: true };
function de(e, r) {
  switch (this.env = e, this.stack = [], this.prog = r, e) {
    case "glyf":
      this.zp0 = this.zp1 = this.zp2 = 1, this.rp0 = this.rp1 = this.rp2 = 0;
    case "prep":
      this.fv = this.pv = this.dpv = oe, this.round = oa;
  }
}
ia.prototype.exec = function(e, r) {
  if (typeof r != "number") throw new Error("Point size is not a number!");
  if (!(this._errorState > 2)) {
    var t = this.font, a = this._prepState;
    if (!a || a.ppem !== r) {
      var n = this._fpgmState;
      if (!n) {
        de.prototype = ss, n = this._fpgmState = new de("fpgm", t.tables.fpgm), n.funcs = [], n.font = t, exports.DEBUG && (console.log("---EXEC FPGM---"), n.step = -1);
        try {
          Se(n);
        } catch (l) {
          console.log("Hinting error in FPGM:" + l), this._errorState = 3;
          return;
        }
      }
      de.prototype = n, a = this._prepState = new de("prep", t.tables.prep), a.ppem = r;
      var s = t.tables.cvt;
      if (s) for (var i = a.cvt = new Array(s.length), u = r / t.unitsPerEm, o = 0; o < s.length; o++) i[o] = s[o] * u;
      else a.cvt = [];
      exports.DEBUG && (console.log("---EXEC PREP---"), a.step = -1);
      try {
        Se(a);
      } catch (l) {
        this._errorState < 2 && console.log("Hinting error in PREP:" + l), this._errorState = 2;
      }
    }
    if (!(this._errorState > 1)) try {
      return sa(e, a);
    } catch (l) {
      this._errorState < 1 && (console.log("Hinting error:" + l), console.log("Note: further hinting errors are silenced")), this._errorState = 1;
      return;
    }
  }
};
sa = function(e, r) {
  var t = r.ppem / r.font.unitsPerEm, a = t, n = e.components, s, i, u;
  if (de.prototype = r, !n) u = new de("glyf", e.instructions), exports.DEBUG && (console.log("---EXEC GLYPH---"), u.step = -1), br(e, u, t, a), i = u.gZone;
  else {
    var o = r.font;
    i = [], s = [];
    for (var l = 0; l < n.length; l++) {
      var f = n[l], h = o.glyphs.get(f.glyphIndex);
      u = new de("glyf", h.instructions), exports.DEBUG && (console.log("---EXEC COMP " + l + "---"), u.step = -1), br(h, u, t, a);
      for (var p = Math.round(f.dx * t), c = Math.round(f.dy * a), d = u.gZone, x = u.contours, m = 0; m < d.length; m++) {
        var y = d[m];
        y.xTouched = y.yTouched = false, y.xo = y.x = y.x + p, y.yo = y.y = y.y + c;
      }
      var C = i.length;
      i.push.apply(i, d);
      for (var S = 0; S < x.length; S++) s.push(x[S] + C);
    }
    e.instructions && !u.inhibitGridFit && (u = new de("glyf", e.instructions), u.gZone = u.z0 = u.z1 = u.z2 = i, u.contours = s, i.push(new fe(0, 0), new fe(Math.round(e.advanceWidth * t), 0)), exports.DEBUG && (console.log("---EXEC COMPOSITE---"), u.step = -1), Se(u), i.length -= 2);
  }
  return i;
};
br = function(e, r, t, a) {
  for (var n = e.points || [], s = n.length, i = r.gZone = r.z0 = r.z1 = r.z2 = [], u = r.contours = [], o, l = 0; l < s; l++) o = n[l], i[l] = new fe(o.x * t, o.y * a, o.lastPointOfContour, o.onCurve);
  for (var f, h, p = 0; p < s; p++) o = i[p], f || (f = o, u.push(p)), o.lastPointOfContour ? (o.nextPointOnContour = f, f.prevPointOnContour = o, f = void 0) : (h = i[p + 1], o.nextPointOnContour = h, h.prevPointOnContour = o);
  if (!r.inhibitGridFit) {
    if (exports.DEBUG) {
      console.log("PROCESSING GLYPH", r.stack);
      for (var c = 0; c < s; c++) console.log(c, i[c].x, i[c].y);
    }
    if (i.push(new fe(0, 0), new fe(Math.round(e.advanceWidth * t), 0)), Se(r), i.length -= 2, exports.DEBUG) {
      console.log("FINISHED GLYPH", r.stack);
      for (var d = 0; d < s; d++) console.log(d, i[d].x, i[d].y);
    }
  }
};
Se = function(e) {
  var r = e.prog;
  if (!!r) {
    var t = r.length, a;
    for (e.ip = 0; e.ip < t; e.ip++) {
      if (exports.DEBUG && e.step++, a = na[r[e.ip]], !a) throw new Error("unknown instruction: 0x" + Number(r[e.ip]).toString(16));
      a(e);
    }
  }
};
function $e(e) {
  for (var r = e.tZone = new Array(e.gZone.length), t = 0; t < r.length; t++) r[t] = new fe(0, 0);
}
function la(e, r) {
  var t = e.prog, a = e.ip, n = 1, s;
  do
    if (s = t[++a], s === 88) n++;
    else if (s === 89) n--;
    else if (s === 64) a += t[a + 1] + 1;
    else if (s === 65) a += 2 * t[a + 1] + 1;
    else if (s >= 176 && s <= 183) a += s - 176 + 1;
    else if (s >= 184 && s <= 191) a += (s - 184 + 1) * 2;
    else if (r && n === 1 && s === 27) break;
  while (n > 0);
  e.ip = a;
}
function et(e, r) {
  exports.DEBUG && console.log(r.step, "SVTCA[" + e.axis + "]"), r.fv = r.pv = r.dpv = e;
}
function rt(e, r) {
  exports.DEBUG && console.log(r.step, "SPVTCA[" + e.axis + "]"), r.pv = r.dpv = e;
}
function tt(e, r) {
  exports.DEBUG && console.log(r.step, "SFVTCA[" + e.axis + "]"), r.fv = e;
}
function at(e, r) {
  var t = r.stack, a = t.pop(), n = t.pop(), s = r.z2[a], i = r.z1[n];
  exports.DEBUG && console.log("SPVTL[" + e + "]", a, n);
  var u, o;
  e ? (u = s.y - i.y, o = i.x - s.x) : (u = i.x - s.x, o = i.y - s.y), r.pv = r.dpv = Me(u, o);
}
function nt(e, r) {
  var t = r.stack, a = t.pop(), n = t.pop(), s = r.z2[a], i = r.z1[n];
  exports.DEBUG && console.log("SFVTL[" + e + "]", a, n);
  var u, o;
  e ? (u = s.y - i.y, o = i.x - s.x) : (u = i.x - s.x, o = i.y - s.y), r.fv = Me(u, o);
}
function is(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "SPVFS[]", t, a), e.pv = e.dpv = Me(a, t);
}
function os(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "SPVFS[]", t, a), e.fv = Me(a, t);
}
function us(e) {
  var r = e.stack, t = e.pv;
  exports.DEBUG && console.log(e.step, "GPV[]"), r.push(t.x * 16384), r.push(t.y * 16384);
}
function ls(e) {
  var r = e.stack, t = e.fv;
  exports.DEBUG && console.log(e.step, "GFV[]"), r.push(t.x * 16384), r.push(t.y * 16384);
}
function fs(e) {
  e.fv = e.pv, exports.DEBUG && console.log(e.step, "SFVTPV[]");
}
function ps(e) {
  var r = e.stack, t = r.pop(), a = r.pop(), n = r.pop(), s = r.pop(), i = r.pop(), u = e.z0, o = e.z1, l = u[t], f = u[a], h = o[n], p = o[s], c = e.z2[i];
  exports.DEBUG && console.log("ISECT[], ", t, a, n, s, i);
  var d = l.x, x = l.y, m = f.x, y = f.y, C = h.x, S = h.y, R = p.x, O = p.y, D = (d - m) * (S - O) - (x - y) * (C - R), L = d * y - x * m, F = C * O - S * R;
  c.x = (L * (C - R) - F * (d - m)) / D, c.y = (L * (S - O) - F * (x - y)) / D;
}
function hs(e) {
  e.rp0 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP0[]", e.rp0);
}
function cs(e) {
  e.rp1 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP1[]", e.rp1);
}
function vs(e) {
  e.rp2 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP2[]", e.rp2);
}
function ds(e) {
  var r = e.stack.pop();
  switch (exports.DEBUG && console.log(e.step, "SZP0[]", r), e.zp0 = r, r) {
    case 0:
      e.tZone || $e(e), e.z0 = e.tZone;
      break;
    case 1:
      e.z0 = e.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function gs(e) {
  var r = e.stack.pop();
  switch (exports.DEBUG && console.log(e.step, "SZP1[]", r), e.zp1 = r, r) {
    case 0:
      e.tZone || $e(e), e.z1 = e.tZone;
      break;
    case 1:
      e.z1 = e.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function ms(e) {
  var r = e.stack.pop();
  switch (exports.DEBUG && console.log(e.step, "SZP2[]", r), e.zp2 = r, r) {
    case 0:
      e.tZone || $e(e), e.z2 = e.tZone;
      break;
    case 1:
      e.z2 = e.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function ys(e) {
  var r = e.stack.pop();
  switch (exports.DEBUG && console.log(e.step, "SZPS[]", r), e.zp0 = e.zp1 = e.zp2 = r, r) {
    case 0:
      e.tZone || $e(e), e.z0 = e.z1 = e.z2 = e.tZone;
      break;
    case 1:
      e.z0 = e.z1 = e.z2 = e.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function xs(e) {
  e.loop = e.stack.pop(), exports.DEBUG && console.log(e.step, "SLOOP[]", e.loop);
}
function bs(e) {
  exports.DEBUG && console.log(e.step, "RTG[]"), e.round = oa;
}
function Ss(e) {
  exports.DEBUG && console.log(e.step, "RTHG[]"), e.round = ts;
}
function Ts(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "SMD[]", r), e.minDis = r / 64;
}
function ks(e) {
  exports.DEBUG && console.log(e.step, "ELSE[]"), la(e, false);
}
function Fs(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "JMPR[]", r), e.ip += r - 1;
}
function Us(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "SCVTCI[]", r), e.cvCutIn = r / 64;
}
function Cs(e) {
  var r = e.stack;
  exports.DEBUG && console.log(e.step, "DUP[]"), r.push(r[r.length - 1]);
}
function or(e) {
  exports.DEBUG && console.log(e.step, "POP[]"), e.stack.pop();
}
function Es(e) {
  exports.DEBUG && console.log(e.step, "CLEAR[]"), e.stack.length = 0;
}
function Os(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "SWAP[]"), r.push(t), r.push(a);
}
function Ls(e) {
  var r = e.stack;
  exports.DEBUG && console.log(e.step, "DEPTH[]"), r.push(r.length);
}
function Rs(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "LOOPCALL[]", t, a);
  var n = e.ip, s = e.prog;
  e.prog = e.funcs[t];
  for (var i = 0; i < a; i++) Se(e), exports.DEBUG && console.log(++e.step, i + 1 < a ? "next loopcall" : "done loopcall", i);
  e.ip = n, e.prog = s;
}
function ws(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "CALL[]", r);
  var t = e.ip, a = e.prog;
  e.prog = e.funcs[r], Se(e), e.ip = t, e.prog = a, exports.DEBUG && console.log(++e.step, "returning from", r);
}
function Ds(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "CINDEX[]", t), r.push(r[r.length - t]);
}
function As(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "MINDEX[]", t), r.push(r.splice(r.length - t, 1)[0]);
}
function Bs(e) {
  if (e.env !== "fpgm") throw new Error("FDEF not allowed here");
  var r = e.stack, t = e.prog, a = e.ip, n = r.pop(), s = a;
  for (exports.DEBUG && console.log(e.step, "FDEF[]", n); t[++a] !== 45; ) ;
  e.ip = a, e.funcs[n] = t.slice(s + 1, a);
}
function st(e, r) {
  var t = r.stack.pop(), a = r.z0[t], n = r.fv, s = r.pv;
  exports.DEBUG && console.log(r.step, "MDAP[" + e + "]", t);
  var i = s.distance(a, De);
  e && (i = r.round(i)), n.setRelative(a, De, i, s), n.touch(a), r.rp0 = r.rp1 = t;
}
function it(e, r) {
  var t = r.z2, a = t.length - 2, n, s, i;
  exports.DEBUG && console.log(r.step, "IUP[" + e.axis + "]");
  for (var u = 0; u < a; u++) n = t[u], !e.touched(n) && (s = n.prevTouched(e), s !== n && (i = n.nextTouched(e), s === i && e.setRelative(n, n, e.distance(s, s, false, true), e, true), e.interpolate(n, s, i, e)));
}
function ot(e, r) {
  for (var t = r.stack, a = e ? r.rp1 : r.rp2, n = (e ? r.z0 : r.z1)[a], s = r.fv, i = r.pv, u = r.loop, o = r.z2; u--; ) {
    var l = t.pop(), f = o[l], h = i.distance(n, n, false, true);
    s.setRelative(f, f, h, i), s.touch(f), exports.DEBUG && console.log(r.step, (r.loop > 1 ? "loop " + (r.loop - u) + ": " : "") + "SHP[" + (e ? "rp1" : "rp2") + "]", l);
  }
  r.loop = 1;
}
function ut(e, r) {
  var t = r.stack, a = e ? r.rp1 : r.rp2, n = (e ? r.z0 : r.z1)[a], s = r.fv, i = r.pv, u = t.pop(), o = r.z2[r.contours[u]], l = o;
  exports.DEBUG && console.log(r.step, "SHC[" + e + "]", u);
  var f = i.distance(n, n, false, true);
  do
    l !== n && s.setRelative(l, l, f, i), l = l.nextPointOnContour;
  while (l !== o);
}
function lt(e, r) {
  var t = r.stack, a = e ? r.rp1 : r.rp2, n = (e ? r.z0 : r.z1)[a], s = r.fv, i = r.pv, u = t.pop();
  exports.DEBUG && console.log(r.step, "SHZ[" + e + "]", u);
  var o;
  switch (u) {
    case 0:
      o = r.tZone;
      break;
    case 1:
      o = r.gZone;
      break;
    default:
      throw new Error("Invalid zone");
  }
  for (var l, f = i.distance(n, n, false, true), h = o.length - 2, p = 0; p < h; p++) l = o[p], s.setRelative(l, l, f, i);
}
function Is(e) {
  for (var r = e.stack, t = e.loop, a = e.fv, n = r.pop() / 64, s = e.z2; t--; ) {
    var i = r.pop(), u = s[i];
    exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - t) + ": " : "") + "SHPIX[]", i, n), a.setRelative(u, u, n), a.touch(u);
  }
  e.loop = 1;
}
function Ms(e) {
  for (var r = e.stack, t = e.rp1, a = e.rp2, n = e.loop, s = e.z0[t], i = e.z1[a], u = e.fv, o = e.dpv, l = e.z2; n--; ) {
    var f = r.pop(), h = l[f];
    exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - n) + ": " : "") + "IP[]", f, t, "<->", a), u.interpolate(h, s, i, o), u.touch(h);
  }
  e.loop = 1;
}
function ft(e, r) {
  var t = r.stack, a = t.pop() / 64, n = t.pop(), s = r.z1[n], i = r.z0[r.rp0], u = r.fv, o = r.pv;
  u.setRelative(s, i, a, o), u.touch(s), exports.DEBUG && console.log(r.step, "MSIRP[" + e + "]", a, n), r.rp1 = r.rp0, r.rp2 = n, e && (r.rp0 = n);
}
function Ps(e) {
  for (var r = e.stack, t = e.rp0, a = e.z0[t], n = e.loop, s = e.fv, i = e.pv, u = e.z1; n--; ) {
    var o = r.pop(), l = u[o];
    exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - n) + ": " : "") + "ALIGNRP[]", o), s.setRelative(l, a, 0, i), s.touch(l);
  }
  e.loop = 1;
}
function Gs(e) {
  exports.DEBUG && console.log(e.step, "RTDG[]"), e.round = rs;
}
function pt(e, r) {
  var t = r.stack, a = t.pop(), n = t.pop(), s = r.z0[n], i = r.fv, u = r.pv, o = r.cvt[a];
  exports.DEBUG && console.log(r.step, "MIAP[" + e + "]", a, "(", o, ")", n);
  var l = u.distance(s, De);
  e && (Math.abs(l - o) < r.cvCutIn && (l = o), l = r.round(l)), i.setRelative(s, De, l, u), r.zp0 === 0 && (s.xo = s.x, s.yo = s.y), i.touch(s), r.rp0 = r.rp1 = n;
}
function Ns(e) {
  var r = e.prog, t = e.ip, a = e.stack, n = r[++t];
  exports.DEBUG && console.log(e.step, "NPUSHB[]", n);
  for (var s = 0; s < n; s++) a.push(r[++t]);
  e.ip = t;
}
function Hs(e) {
  var r = e.ip, t = e.prog, a = e.stack, n = t[++r];
  exports.DEBUG && console.log(e.step, "NPUSHW[]", n);
  for (var s = 0; s < n; s++) {
    var i = t[++r] << 8 | t[++r];
    i & 32768 && (i = -((i ^ 65535) + 1)), a.push(i);
  }
  e.ip = r;
}
function zs(e) {
  var r = e.stack, t = e.store;
  t || (t = e.store = []);
  var a = r.pop(), n = r.pop();
  exports.DEBUG && console.log(e.step, "WS", a, n), t[n] = a;
}
function Ws(e) {
  var r = e.stack, t = e.store, a = r.pop();
  exports.DEBUG && console.log(e.step, "RS", a);
  var n = t && t[a] || 0;
  r.push(n);
}
function _s(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "WCVTP", t, a), e.cvt[a] = t / 64;
}
function Vs(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "RCVT", t), r.push(e.cvt[t] * 64);
}
function ht(e, r) {
  var t = r.stack, a = t.pop(), n = r.z2[a];
  exports.DEBUG && console.log(r.step, "GC[" + e + "]", a), t.push(r.dpv.distance(n, De, e, false) * 64);
}
function ct(e, r) {
  var t = r.stack, a = t.pop(), n = t.pop(), s = r.z1[a], i = r.z0[n], u = r.dpv.distance(i, s, e, e);
  exports.DEBUG && console.log(r.step, "MD[" + e + "]", a, n, "->", u), r.stack.push(Math.round(u * 64));
}
function qs(e) {
  exports.DEBUG && console.log(e.step, "MPPEM[]"), e.stack.push(e.ppem);
}
function Xs(e) {
  exports.DEBUG && console.log(e.step, "FLIPON[]"), e.autoFlip = true;
}
function Ys(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "LT[]", t, a), r.push(a < t ? 1 : 0);
}
function Zs(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "LTEQ[]", t, a), r.push(a <= t ? 1 : 0);
}
function Qs(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "GT[]", t, a), r.push(a > t ? 1 : 0);
}
function Ks(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "GTEQ[]", t, a), r.push(a >= t ? 1 : 0);
}
function Js(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "EQ[]", t, a), r.push(t === a ? 1 : 0);
}
function js(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "NEQ[]", t, a), r.push(t !== a ? 1 : 0);
}
function $s(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "ODD[]", t), r.push(Math.trunc(t) % 2 ? 1 : 0);
}
function ei(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "EVEN[]", t), r.push(Math.trunc(t) % 2 ? 0 : 1);
}
function ri(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "IF[]", r), r || (la(e, true), exports.DEBUG && console.log(e.step, "EIF[]"));
}
function ti(e) {
  exports.DEBUG && console.log(e.step, "EIF[]");
}
function ai(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "AND[]", t, a), r.push(t && a ? 1 : 0);
}
function ni(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "OR[]", t, a), r.push(t || a ? 1 : 0);
}
function si(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "NOT[]", t), r.push(t ? 0 : 1);
}
function ur(e, r) {
  var t = r.stack, a = t.pop(), n = r.fv, s = r.pv, i = r.ppem, u = r.deltaBase + (e - 1) * 16, o = r.deltaShift, l = r.z0;
  exports.DEBUG && console.log(r.step, "DELTAP[" + e + "]", a, t);
  for (var f = 0; f < a; f++) {
    var h = t.pop(), p = t.pop(), c = u + ((p & 240) >> 4);
    if (c === i) {
      var d = (p & 15) - 8;
      d >= 0 && d++, exports.DEBUG && console.log(r.step, "DELTAPFIX", h, "by", d * o);
      var x = l[h];
      n.setRelative(x, x, d * o, s);
    }
  }
}
function ii(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "SDB[]", t), e.deltaBase = t;
}
function oi(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "SDS[]", t), e.deltaShift = Math.pow(0.5, t);
}
function ui(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "ADD[]", t, a), r.push(a + t);
}
function li(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "SUB[]", t, a), r.push(a - t);
}
function fi(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "DIV[]", t, a), r.push(a * 64 / t);
}
function pi(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "MUL[]", t, a), r.push(a * t / 64);
}
function hi(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "ABS[]", t), r.push(Math.abs(t));
}
function ci(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "NEG[]", t), r.push(-t);
}
function vi(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "FLOOR[]", t), r.push(Math.floor(t / 64) * 64);
}
function di(e) {
  var r = e.stack, t = r.pop();
  exports.DEBUG && console.log(e.step, "CEILING[]", t), r.push(Math.ceil(t / 64) * 64);
}
function Ve(e, r) {
  var t = r.stack, a = t.pop();
  exports.DEBUG && console.log(r.step, "ROUND[]"), t.push(r.round(a / 64) * 64);
}
function gi(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "WCVTF[]", t, a), e.cvt[a] = t * e.ppem / e.font.unitsPerEm;
}
function lr(e, r) {
  var t = r.stack, a = t.pop(), n = r.ppem, s = r.deltaBase + (e - 1) * 16, i = r.deltaShift;
  exports.DEBUG && console.log(r.step, "DELTAC[" + e + "]", a, t);
  for (var u = 0; u < a; u++) {
    var o = t.pop(), l = t.pop(), f = s + ((l & 240) >> 4);
    if (f === n) {
      var h = (l & 15) - 8;
      h >= 0 && h++;
      var p = h * i;
      exports.DEBUG && console.log(r.step, "DELTACFIX", o, "by", p), r.cvt[o] += p;
    }
  }
}
function mi(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "SROUND[]", r), e.round = ua;
  var t;
  switch (r & 192) {
    case 0:
      t = 0.5;
      break;
    case 64:
      t = 1;
      break;
    case 128:
      t = 2;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  switch (e.srPeriod = t, r & 48) {
    case 0:
      e.srPhase = 0;
      break;
    case 16:
      e.srPhase = 0.25 * t;
      break;
    case 32:
      e.srPhase = 0.5 * t;
      break;
    case 48:
      e.srPhase = 0.75 * t;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  r &= 15, r === 0 ? e.srThreshold = 0 : e.srThreshold = (r / 8 - 0.5) * t;
}
function yi(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "S45ROUND[]", r), e.round = ua;
  var t;
  switch (r & 192) {
    case 0:
      t = Math.sqrt(2) / 2;
      break;
    case 64:
      t = Math.sqrt(2);
      break;
    case 128:
      t = 2 * Math.sqrt(2);
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  switch (e.srPeriod = t, r & 48) {
    case 0:
      e.srPhase = 0;
      break;
    case 16:
      e.srPhase = 0.25 * t;
      break;
    case 32:
      e.srPhase = 0.5 * t;
      break;
    case 48:
      e.srPhase = 0.75 * t;
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  r &= 15, r === 0 ? e.srThreshold = 0 : e.srThreshold = (r / 8 - 0.5) * t;
}
function xi(e) {
  exports.DEBUG && console.log(e.step, "ROFF[]"), e.round = es;
}
function bi(e) {
  exports.DEBUG && console.log(e.step, "RUTG[]"), e.round = as;
}
function Si(e) {
  exports.DEBUG && console.log(e.step, "RDTG[]"), e.round = ns;
}
function Ti(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "SCANCTRL[]", r);
}
function vt(e, r) {
  var t = r.stack, a = t.pop(), n = t.pop(), s = r.z2[a], i = r.z1[n];
  exports.DEBUG && console.log(r.step, "SDPVTL[" + e + "]", a, n);
  var u, o;
  e ? (u = s.y - i.y, o = i.x - s.x) : (u = i.x - s.x, o = i.y - s.y), r.dpv = Me(u, o);
}
function ki(e) {
  var r = e.stack, t = r.pop(), a = 0;
  exports.DEBUG && console.log(e.step, "GETINFO[]", t), t & 1 && (a = 35), t & 32 && (a |= 4096), r.push(a);
}
function Fi(e) {
  var r = e.stack, t = r.pop(), a = r.pop(), n = r.pop();
  exports.DEBUG && console.log(e.step, "ROLL[]"), r.push(a), r.push(t), r.push(n);
}
function Ui(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "MAX[]", t, a), r.push(Math.max(a, t));
}
function Ci(e) {
  var r = e.stack, t = r.pop(), a = r.pop();
  exports.DEBUG && console.log(e.step, "MIN[]", t, a), r.push(Math.min(a, t));
}
function Ei(e) {
  var r = e.stack.pop();
  exports.DEBUG && console.log(e.step, "SCANTYPE[]", r);
}
function Oi(e) {
  var r = e.stack.pop(), t = e.stack.pop();
  switch (exports.DEBUG && console.log(e.step, "INSTCTRL[]", r, t), r) {
    case 1:
      e.inhibitGridFit = !!t;
      return;
    case 2:
      e.ignoreCvt = !!t;
      return;
    default:
      throw new Error("invalid INSTCTRL[] selector");
  }
}
function he(e, r) {
  var t = r.stack, a = r.prog, n = r.ip;
  exports.DEBUG && console.log(r.step, "PUSHB[" + e + "]");
  for (var s = 0; s < e; s++) t.push(a[++n]);
  r.ip = n;
}
function ce(e, r) {
  var t = r.ip, a = r.prog, n = r.stack;
  exports.DEBUG && console.log(r.ip, "PUSHW[" + e + "]");
  for (var s = 0; s < e; s++) {
    var i = a[++t] << 8 | a[++t];
    i & 32768 && (i = -((i ^ 65535) + 1)), n.push(i);
  }
  r.ip = t;
}
function T(e, r, t, a, n, s) {
  var i = s.stack, u = e && i.pop(), o = i.pop(), l = s.rp0, f = s.z0[l], h = s.z1[o], p = s.minDis, c = s.fv, d = s.dpv, x, m, y, C;
  m = x = d.distance(h, f, true, true), y = m >= 0 ? 1 : -1, m = Math.abs(m), e && (C = s.cvt[u], a && Math.abs(m - C) < s.cvCutIn && (m = C)), t && m < p && (m = p), a && (m = s.round(m)), c.setRelative(h, f, y * m, d), c.touch(h), exports.DEBUG && console.log(s.step, (e ? "MIRP[" : "MDRP[") + (r ? "M" : "m") + (t ? ">" : "_") + (a ? "R" : "_") + (n === 0 ? "Gr" : n === 1 ? "Bl" : n === 2 ? "Wh" : "") + "]", e ? u + "(" + s.cvt[u] + "," + C + ")" : "", o, "(d =", x, "->", y * m, ")"), s.rp1 = s.rp0, s.rp2 = o, r && (s.rp0 = o);
}
na = [et.bind(void 0, le), et.bind(void 0, oe), rt.bind(void 0, le), rt.bind(void 0, oe), tt.bind(void 0, le), tt.bind(void 0, oe), at.bind(void 0, 0), at.bind(void 0, 1), nt.bind(void 0, 0), nt.bind(void 0, 1), is, os, us, ls, fs, ps, hs, cs, vs, ds, gs, ms, ys, xs, bs, Ss, Ts, ks, Fs, Us, void 0, void 0, Cs, or, Es, Os, Ls, Ds, As, void 0, void 0, void 0, Rs, ws, Bs, void 0, st.bind(void 0, 0), st.bind(void 0, 1), it.bind(void 0, le), it.bind(void 0, oe), ot.bind(void 0, 0), ot.bind(void 0, 1), ut.bind(void 0, 0), ut.bind(void 0, 1), lt.bind(void 0, 0), lt.bind(void 0, 1), Is, Ms, ft.bind(void 0, 0), ft.bind(void 0, 1), Ps, Gs, pt.bind(void 0, 0), pt.bind(void 0, 1), Ns, Hs, zs, Ws, _s, Vs, ht.bind(void 0, 0), ht.bind(void 0, 1), void 0, ct.bind(void 0, 0), ct.bind(void 0, 1), qs, void 0, Xs, void 0, void 0, Ys, Zs, Qs, Ks, Js, js, $s, ei, ri, ti, ai, ni, si, ur.bind(void 0, 1), ii, oi, ui, li, fi, pi, hi, ci, vi, di, Ve.bind(void 0, 0), Ve.bind(void 0, 1), Ve.bind(void 0, 2), Ve.bind(void 0, 3), void 0, void 0, void 0, void 0, gi, ur.bind(void 0, 2), ur.bind(void 0, 3), lr.bind(void 0, 1), lr.bind(void 0, 2), lr.bind(void 0, 3), mi, yi, void 0, void 0, xi, void 0, bi, Si, or, or, void 0, void 0, void 0, void 0, void 0, Ti, vt.bind(void 0, 0), vt.bind(void 0, 1), ki, void 0, Fi, Ui, Ci, Ei, Oi, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, he.bind(void 0, 1), he.bind(void 0, 2), he.bind(void 0, 3), he.bind(void 0, 4), he.bind(void 0, 5), he.bind(void 0, 6), he.bind(void 0, 7), he.bind(void 0, 8), ce.bind(void 0, 1), ce.bind(void 0, 2), ce.bind(void 0, 3), ce.bind(void 0, 4), ce.bind(void 0, 5), ce.bind(void 0, 6), ce.bind(void 0, 7), ce.bind(void 0, 8), T.bind(void 0, 0, 0, 0, 0, 0), T.bind(void 0, 0, 0, 0, 0, 1), T.bind(void 0, 0, 0, 0, 0, 2), T.bind(void 0, 0, 0, 0, 0, 3), T.bind(void 0, 0, 0, 0, 1, 0), T.bind(void 0, 0, 0, 0, 1, 1), T.bind(void 0, 0, 0, 0, 1, 2), T.bind(void 0, 0, 0, 0, 1, 3), T.bind(void 0, 0, 0, 1, 0, 0), T.bind(void 0, 0, 0, 1, 0, 1), T.bind(void 0, 0, 0, 1, 0, 2), T.bind(void 0, 0, 0, 1, 0, 3), T.bind(void 0, 0, 0, 1, 1, 0), T.bind(void 0, 0, 0, 1, 1, 1), T.bind(void 0, 0, 0, 1, 1, 2), T.bind(void 0, 0, 0, 1, 1, 3), T.bind(void 0, 0, 1, 0, 0, 0), T.bind(void 0, 0, 1, 0, 0, 1), T.bind(void 0, 0, 1, 0, 0, 2), T.bind(void 0, 0, 1, 0, 0, 3), T.bind(void 0, 0, 1, 0, 1, 0), T.bind(void 0, 0, 1, 0, 1, 1), T.bind(void 0, 0, 1, 0, 1, 2), T.bind(void 0, 0, 1, 0, 1, 3), T.bind(void 0, 0, 1, 1, 0, 0), T.bind(void 0, 0, 1, 1, 0, 1), T.bind(void 0, 0, 1, 1, 0, 2), T.bind(void 0, 0, 1, 1, 0, 3), T.bind(void 0, 0, 1, 1, 1, 0), T.bind(void 0, 0, 1, 1, 1, 1), T.bind(void 0, 0, 1, 1, 1, 2), T.bind(void 0, 0, 1, 1, 1, 3), T.bind(void 0, 1, 0, 0, 0, 0), T.bind(void 0, 1, 0, 0, 0, 1), T.bind(void 0, 1, 0, 0, 0, 2), T.bind(void 0, 1, 0, 0, 0, 3), T.bind(void 0, 1, 0, 0, 1, 0), T.bind(void 0, 1, 0, 0, 1, 1), T.bind(void 0, 1, 0, 0, 1, 2), T.bind(void 0, 1, 0, 0, 1, 3), T.bind(void 0, 1, 0, 1, 0, 0), T.bind(void 0, 1, 0, 1, 0, 1), T.bind(void 0, 1, 0, 1, 0, 2), T.bind(void 0, 1, 0, 1, 0, 3), T.bind(void 0, 1, 0, 1, 1, 0), T.bind(void 0, 1, 0, 1, 1, 1), T.bind(void 0, 1, 0, 1, 1, 2), T.bind(void 0, 1, 0, 1, 1, 3), T.bind(void 0, 1, 1, 0, 0, 0), T.bind(void 0, 1, 1, 0, 0, 1), T.bind(void 0, 1, 1, 0, 0, 2), T.bind(void 0, 1, 1, 0, 0, 3), T.bind(void 0, 1, 1, 0, 1, 0), T.bind(void 0, 1, 1, 0, 1, 1), T.bind(void 0, 1, 1, 0, 1, 2), T.bind(void 0, 1, 1, 0, 1, 3), T.bind(void 0, 1, 1, 1, 0, 0), T.bind(void 0, 1, 1, 1, 0, 1), T.bind(void 0, 1, 1, 1, 0, 2), T.bind(void 0, 1, 1, 1, 0, 3), T.bind(void 0, 1, 1, 1, 1, 0), T.bind(void 0, 1, 1, 1, 1, 1), T.bind(void 0, 1, 1, 1, 1, 2), T.bind(void 0, 1, 1, 1, 1, 3)];
function Ce(e) {
  this.char = e, this.state = {}, this.activeState = null;
}
function Lr(e, r, t) {
  this.contextName = t, this.startIndex = e, this.endOffset = r;
}
function Li(e, r, t) {
  this.contextName = e, this.openRange = null, this.ranges = [], this.checkStart = r, this.checkEnd = t;
}
function re(e, r) {
  this.context = e, this.index = r, this.length = e.length, this.current = e[r], this.backtrack = e.slice(0, r), this.lookahead = e.slice(r + 1);
}
function er(e) {
  this.eventId = e, this.subscribers = [];
}
function Ri(e) {
  var r = this, t = ["start", "end", "next", "newToken", "contextStart", "contextEnd", "insertToken", "removeToken", "removeRange", "replaceToken", "replaceRange", "composeRUD", "updateContextsRanges"];
  t.forEach(function(n) {
    Object.defineProperty(r.events, n, { value: new er(n) });
  }), e && t.forEach(function(n) {
    var s = e[n];
    typeof s == "function" && r.events[n].subscribe(s);
  });
  var a = ["insertToken", "removeToken", "removeRange", "replaceToken", "replaceRange", "composeRUD"];
  a.forEach(function(n) {
    r.events[n].subscribe(r.updateContextsRanges);
  });
}
function B(e) {
  this.tokens = [], this.registeredContexts = {}, this.contextCheckers = [], this.events = {}, this.registeredModifiers = [], Ri.call(this, e);
}
Ce.prototype.setState = function(e, r) {
  return this.state[e] = r, this.activeState = { key: e, value: this.state[e] }, this.activeState;
};
Ce.prototype.getState = function(e) {
  return this.state[e] || null;
};
B.prototype.inboundIndex = function(e) {
  return e >= 0 && e < this.tokens.length;
};
B.prototype.composeRUD = function(e) {
  var r = this, t = true, a = e.map(function(s) {
    return r[s[0]].apply(r, s.slice(1).concat(t));
  }), n = function(s) {
    return typeof s == "object" && s.hasOwnProperty("FAIL");
  };
  if (a.every(n)) return { FAIL: "composeRUD: one or more operations hasn't completed successfully", report: a.filter(n) };
  this.dispatch("composeRUD", [a.filter(function(s) {
    return !n(s);
  })]);
};
B.prototype.replaceRange = function(e, r, t, a) {
  r = r !== null ? r : this.tokens.length;
  var n = t.every(function(i) {
    return i instanceof Ce;
  });
  if (!isNaN(e) && this.inboundIndex(e) && n) {
    var s = this.tokens.splice.apply(this.tokens, [e, r].concat(t));
    return a || this.dispatch("replaceToken", [e, r, t]), [s, t];
  } else return { FAIL: "replaceRange: invalid tokens or startIndex." };
};
B.prototype.replaceToken = function(e, r, t) {
  if (!isNaN(e) && this.inboundIndex(e) && r instanceof Ce) {
    var a = this.tokens.splice(e, 1, r);
    return t || this.dispatch("replaceToken", [e, r]), [a[0], r];
  } else return { FAIL: "replaceToken: invalid token or index." };
};
B.prototype.removeRange = function(e, r, t) {
  r = isNaN(r) ? this.tokens.length : r;
  var a = this.tokens.splice(e, r);
  return t || this.dispatch("removeRange", [a, e, r]), a;
};
B.prototype.removeToken = function(e, r) {
  if (!isNaN(e) && this.inboundIndex(e)) {
    var t = this.tokens.splice(e, 1);
    return r || this.dispatch("removeToken", [t, e]), t;
  } else return { FAIL: "removeToken: invalid token index." };
};
B.prototype.insertToken = function(e, r, t) {
  var a = e.every(function(n) {
    return n instanceof Ce;
  });
  return a ? (this.tokens.splice.apply(this.tokens, [r, 0].concat(e)), t || this.dispatch("insertToken", [e, r]), e) : { FAIL: "insertToken: invalid token(s)." };
};
B.prototype.registerModifier = function(e, r, t) {
  this.events.newToken.subscribe(function(a, n) {
    var s = [a, n], i = r === null || r.apply(this, s) === true, u = [a, n];
    if (i) {
      var o = t.apply(this, u);
      a.setState(e, o);
    }
  }), this.registeredModifiers.push(e);
};
er.prototype.subscribe = function(e) {
  return typeof e == "function" ? this.subscribers.push(e) - 1 : { FAIL: "invalid '" + this.eventId + "' event handler" };
};
er.prototype.unsubscribe = function(e) {
  this.subscribers.splice(e, 1);
};
re.prototype.setCurrentIndex = function(e) {
  this.index = e, this.current = this.context[e], this.backtrack = this.context.slice(0, e), this.lookahead = this.context.slice(e + 1);
};
re.prototype.get = function(e) {
  switch (true) {
    case e === 0:
      return this.current;
    case (e < 0 && Math.abs(e) <= this.backtrack.length):
      return this.backtrack.slice(e)[0];
    case (e > 0 && e <= this.lookahead.length):
      return this.lookahead[e - 1];
    default:
      return null;
  }
};
B.prototype.rangeToText = function(e) {
  if (e instanceof Lr) return this.getRangeTokens(e).map(function(r) {
    return r.char;
  }).join("");
};
B.prototype.getText = function() {
  return this.tokens.map(function(e) {
    return e.char;
  }).join("");
};
B.prototype.getContext = function(e) {
  var r = this.registeredContexts[e];
  return r || null;
};
B.prototype.on = function(e, r) {
  var t = this.events[e];
  return t ? t.subscribe(r) : null;
};
B.prototype.dispatch = function(e, r) {
  var t = this, a = this.events[e];
  a instanceof er && a.subscribers.forEach(function(n) {
    n.apply(t, r || []);
  });
};
B.prototype.registerContextChecker = function(e, r, t) {
  if (this.getContext(e)) return { FAIL: "context name '" + e + "' is already registered." };
  if (typeof r != "function") return { FAIL: "missing context start check." };
  if (typeof t != "function") return { FAIL: "missing context end check." };
  var a = new Li(e, r, t);
  return this.registeredContexts[e] = a, this.contextCheckers.push(a), a;
};
B.prototype.getRangeTokens = function(e) {
  var r = e.startIndex + e.endOffset;
  return [].concat(this.tokens.slice(e.startIndex, r));
};
B.prototype.getContextRanges = function(e) {
  var r = this.getContext(e);
  return r ? r.ranges : { FAIL: "context checker '" + e + "' is not registered." };
};
B.prototype.resetContextsRanges = function() {
  var e = this.registeredContexts;
  for (var r in e) if (e.hasOwnProperty(r)) {
    var t = e[r];
    t.ranges = [];
  }
};
B.prototype.updateContextsRanges = function() {
  this.resetContextsRanges();
  for (var e = this.tokens.map(function(a) {
    return a.char;
  }), r = 0; r < e.length; r++) {
    var t = new re(e, r);
    this.runContextCheck(t);
  }
  this.dispatch("updateContextsRanges", [this.registeredContexts]);
};
B.prototype.setEndOffset = function(e, r) {
  var t = this.getContext(r).openRange.startIndex, a = new Lr(t, e, r), n = this.getContext(r).ranges;
  return a.rangeId = r + "." + n.length, n.push(a), this.getContext(r).openRange = null, a;
};
B.prototype.runContextCheck = function(e) {
  var r = this, t = e.index;
  this.contextCheckers.forEach(function(a) {
    var n = a.contextName, s = r.getContext(n).openRange;
    if (!s && a.checkStart(e) && (s = new Lr(t, null, n), r.getContext(n).openRange = s, r.dispatch("contextStart", [n, t])), !!s && a.checkEnd(e)) {
      var i = t - s.startIndex + 1, u = r.setEndOffset(i, n);
      r.dispatch("contextEnd", [n, u]);
    }
  });
};
B.prototype.tokenize = function(e) {
  this.tokens = [], this.resetContextsRanges();
  var r = Array.from(e);
  this.dispatch("start");
  for (var t = 0; t < r.length; t++) {
    var a = r[t], n = new re(r, t);
    this.dispatch("next", [n]), this.runContextCheck(n);
    var s = new Ce(a);
    this.tokens.push(s), this.dispatch("newToken", [s, n]);
  }
  return this.dispatch("end", [this.tokens]), this.tokens;
};
function ge(e) {
  return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(e);
}
function fa(e) {
  return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(e);
}
function me(e) {
  return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(e);
}
function Xe(e) {
  return /[A-z]/.test(e);
}
function wi(e) {
  return /\s/.test(e);
}
function J(e) {
  this.font = e, this.features = {};
}
function be(e) {
  this.id = e.id, this.tag = e.tag, this.substitution = e.substitution;
}
function Pe(e, r) {
  if (!e) return -1;
  switch (r.format) {
    case 1:
      return r.glyphs.indexOf(e);
    case 2:
      for (var t = r.ranges, a = 0; a < t.length; a++) {
        var n = t[a];
        if (e >= n.start && e <= n.end) {
          var s = e - n.start;
          return n.index + s;
        }
      }
      break;
    default:
      return -1;
  }
  return -1;
}
function Di(e, r) {
  var t = Pe(e, r.coverage);
  return t === -1 ? null : e + r.deltaGlyphId;
}
function Ai(e, r) {
  var t = Pe(e, r.coverage);
  return t === -1 ? null : r.substitute[t];
}
function fr(e, r) {
  for (var t = [], a = 0; a < e.length; a++) {
    var n = e[a], s = r.current;
    s = Array.isArray(s) ? s[0] : s;
    var i = Pe(s, n);
    i !== -1 && t.push(i);
  }
  return t.length !== e.length ? -1 : t;
}
function Bi(e, r) {
  var t = r.inputCoverage.length + r.lookaheadCoverage.length + r.backtrackCoverage.length;
  if (e.context.length < t) return [];
  var a = fr(r.inputCoverage, e);
  if (a === -1) return [];
  var n = r.inputCoverage.length - 1;
  if (e.lookahead.length < r.lookaheadCoverage.length) return [];
  for (var s = e.lookahead.slice(n); s.length && me(s[0].char); ) s.shift();
  var i = new re(s, 0), u = fr(r.lookaheadCoverage, i), o = [].concat(e.backtrack);
  for (o.reverse(); o.length && me(o[0].char); ) o.shift();
  if (o.length < r.backtrackCoverage.length) return [];
  var l = new re(o, 0), f = fr(r.backtrackCoverage, l), h = a.length === r.inputCoverage.length && u.length === r.lookaheadCoverage.length && f.length === r.backtrackCoverage.length, p = [];
  if (h) for (var c = 0; c < r.lookupRecords.length; c++) for (var d = r.lookupRecords[c], x = d.lookupListIndex, m = this.getLookupByIndex(x), y = 0; y < m.subtables.length; y++) {
    var C = m.subtables[y], S = this.getLookupMethod(m, C), R = this.getSubstitutionType(m, C);
    if (R === "12") for (var O = 0; O < a.length; O++) {
      var D = e.get(O), L = S(D);
      L && p.push(L);
    }
  }
  return p;
}
function Ii(e, r) {
  var t = e.current, a = Pe(t, r.coverage);
  if (a === -1) return null;
  for (var n, s = r.ligatureSets[a], i = 0; i < s.length; i++) {
    n = s[i];
    for (var u = 0; u < n.components.length; u++) {
      var o = e.lookahead[u], l = n.components[u];
      if (o !== l) break;
      if (u === n.components.length - 1) return n;
    }
  }
  return null;
}
function Mi(e, r) {
  var t = Pe(e, r.coverage);
  return t === -1 ? null : r.sequences[t];
}
J.prototype.getDefaultScriptFeaturesIndexes = function() {
  for (var e = this.font.tables.gsub.scripts, r = 0; r < e.length; r++) {
    var t = e[r];
    if (t.tag === "DFLT") return t.script.defaultLangSys.featureIndexes;
  }
  return [];
};
J.prototype.getScriptFeaturesIndexes = function(e) {
  var r = this.font.tables;
  if (!r.gsub) return [];
  if (!e) return this.getDefaultScriptFeaturesIndexes();
  for (var t = this.font.tables.gsub.scripts, a = 0; a < t.length; a++) {
    var n = t[a];
    if (n.tag === e && n.script.defaultLangSys) return n.script.defaultLangSys.featureIndexes;
    var s = n.langSysRecords;
    if (s) for (var i = 0; i < s.length; i++) {
      var u = s[i];
      if (u.tag === e) {
        var o = u.langSys;
        return o.featureIndexes;
      }
    }
  }
  return this.getDefaultScriptFeaturesIndexes();
};
J.prototype.mapTagsToFeatures = function(e, r) {
  for (var t = {}, a = 0; a < e.length; a++) {
    var n = e[a].tag, s = e[a].feature;
    t[n] = s;
  }
  this.features[r].tags = t;
};
J.prototype.getScriptFeatures = function(e) {
  var r = this.features[e];
  if (this.features.hasOwnProperty(e)) return r;
  var t = this.getScriptFeaturesIndexes(e);
  if (!t) return null;
  var a = this.font.tables.gsub;
  return r = t.map(function(n) {
    return a.features[n];
  }), this.features[e] = r, this.mapTagsToFeatures(r, e), r;
};
J.prototype.getSubstitutionType = function(e, r) {
  var t = e.lookupType.toString(), a = r.substFormat.toString();
  return t + a;
};
J.prototype.getLookupMethod = function(e, r) {
  var t = this, a = this.getSubstitutionType(e, r);
  switch (a) {
    case "11":
      return function(n) {
        return Di.apply(t, [n, r]);
      };
    case "12":
      return function(n) {
        return Ai.apply(t, [n, r]);
      };
    case "63":
      return function(n) {
        return Bi.apply(t, [n, r]);
      };
    case "41":
      return function(n) {
        return Ii.apply(t, [n, r]);
      };
    case "21":
      return function(n) {
        return Mi.apply(t, [n, r]);
      };
    default:
      throw new Error("lookupType: " + e.lookupType + " - substFormat: " + r.substFormat + " is not yet supported");
  }
};
J.prototype.lookupFeature = function(e) {
  var r = e.contextParams, t = r.index, a = this.getFeature({ tag: e.tag, script: e.script });
  if (!a) return new Error("font '" + this.font.names.fullName.en + "' doesn't support feature '" + e.tag + "' for script '" + e.script + "'.");
  for (var n = this.getFeatureLookups(a), s = [].concat(r.context), i = 0; i < n.length; i++) for (var u = n[i], o = this.getLookupSubtables(u), l = 0; l < o.length; l++) {
    var f = o[l], h = this.getSubstitutionType(u, f), p = this.getLookupMethod(u, f), c = void 0;
    switch (h) {
      case "11":
        c = p(r.current), c && s.splice(t, 1, new be({ id: 11, tag: e.tag, substitution: c }));
        break;
      case "12":
        c = p(r.current), c && s.splice(t, 1, new be({ id: 12, tag: e.tag, substitution: c }));
        break;
      case "63":
        c = p(r), Array.isArray(c) && c.length && s.splice(t, 1, new be({ id: 63, tag: e.tag, substitution: c }));
        break;
      case "41":
        c = p(r), c && s.splice(t, 1, new be({ id: 41, tag: e.tag, substitution: c }));
        break;
      case "21":
        c = p(r.current), c && s.splice(t, 1, new be({ id: 21, tag: e.tag, substitution: c }));
        break;
    }
    r = new re(s, t), !(Array.isArray(c) && !c.length) && (c = null);
  }
  return s.length ? s : null;
};
J.prototype.supports = function(e) {
  if (!e.script) return false;
  this.getScriptFeatures(e.script);
  var r = this.features.hasOwnProperty(e.script);
  if (!e.tag) return r;
  var t = this.features[e.script].some(function(a) {
    return a.tag === e.tag;
  });
  return r && t;
};
J.prototype.getLookupSubtables = function(e) {
  return e.subtables || null;
};
J.prototype.getLookupByIndex = function(e) {
  var r = this.font.tables.gsub.lookups;
  return r[e] || null;
};
J.prototype.getFeatureLookups = function(e) {
  return e.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};
J.prototype.getFeature = function(r) {
  if (!this.font) return { FAIL: "No font was found" };
  this.features.hasOwnProperty(r.script) || this.getScriptFeatures(r.script);
  var t = this.features[r.script];
  return t ? t.tags[r.tag] ? this.features[r.script].tags[r.tag] : null : { FAIL: "No feature for script " + r.script };
};
function Pi(e) {
  var r = e.current, t = e.get(-1);
  return t === null && ge(r) || !ge(t) && ge(r);
}
function Gi(e) {
  var r = e.get(1);
  return r === null || !ge(r);
}
var Ni = { startCheck: Pi, endCheck: Gi };
function Hi(e) {
  var r = e.current, t = e.get(-1);
  return (ge(r) || me(r)) && !ge(t);
}
function zi(e) {
  var r = e.get(1);
  switch (true) {
    case r === null:
      return true;
    case (!ge(r) && !me(r)):
      var t = wi(r);
      if (!t) return true;
      if (t) {
        var a = false;
        if (a = e.lookahead.some(function(n) {
          return ge(n) || me(n);
        }), !a) return true;
      }
      break;
    default:
      return false;
  }
}
var Wi = { startCheck: Hi, endCheck: zi };
function _i(e, r, t) {
  r[t].setState(e.tag, e.substitution);
}
function Vi(e, r, t) {
  r[t].setState(e.tag, e.substitution);
}
function qi(e, r, t) {
  e.substitution.forEach(function(a, n) {
    var s = r[t + n];
    s.setState(e.tag, a);
  });
}
function Xi(e, r, t) {
  var a = r[t];
  a.setState(e.tag, e.substitution.ligGlyph);
  for (var n = e.substitution.components.length, s = 0; s < n; s++) a = r[t + s + 1], a.setState("deleted", true);
}
var dt = { 11: _i, 12: Vi, 63: qi, 41: Xi };
function Rr(e, r, t) {
  e instanceof be && dt[e.id] && dt[e.id](e, r, t);
}
function Yi(e) {
  for (var r = [].concat(e.backtrack), t = r.length - 1; t >= 0; t--) {
    var a = r[t], n = fa(a), s = me(a);
    if (!n && !s) return true;
    if (n) return false;
  }
  return false;
}
function Zi(e) {
  if (fa(e.current)) return false;
  for (var r = 0; r < e.lookahead.length; r++) {
    var t = e.lookahead[r], a = me(t);
    if (!a) return true;
  }
  return false;
}
function Qi(e) {
  var r = this, t = "arab", a = this.featuresTags[t], n = this.tokenizer.getRangeTokens(e);
  if (n.length !== 1) {
    var s = new re(n.map(function(u) {
      return u.getState("glyphIndex");
    }), 0), i = new re(n.map(function(u) {
      return u.char;
    }), 0);
    n.forEach(function(u, o) {
      if (!me(u.char)) {
        s.setCurrentIndex(o), i.setCurrentIndex(o);
        var l = 0;
        Yi(i) && (l |= 1), Zi(i) && (l |= 2);
        var f;
        switch (l) {
          case 1:
            f = "fina";
            break;
          case 2:
            f = "init";
            break;
          case 3:
            f = "medi";
            break;
        }
        if (a.indexOf(f) !== -1) {
          var h = r.query.lookupFeature({ tag: f, script: t, contextParams: s });
          if (h instanceof Error) return console.info(h.message);
          h.forEach(function(p, c) {
            p instanceof be && (Rr(p, n, c), s.context[c] = p.substitution);
          });
        }
      }
    });
  }
}
function gt(e, r) {
  var t = e.map(function(a) {
    return a.activeState.value;
  });
  return new re(t, r || 0);
}
function Ki(e) {
  var r = this, t = "arab", a = this.tokenizer.getRangeTokens(e), n = gt(a);
  n.context.forEach(function(s, i) {
    n.setCurrentIndex(i);
    var u = r.query.lookupFeature({ tag: "rlig", script: t, contextParams: n });
    u.length && (u.forEach(function(o) {
      return Rr(o, a, i);
    }), n = gt(a));
  });
}
function Ji(e) {
  var r = e.current, t = e.get(-1);
  return t === null && Xe(r) || !Xe(t) && Xe(r);
}
function ji(e) {
  var r = e.get(1);
  return r === null || !Xe(r);
}
var $i = { startCheck: Ji, endCheck: ji };
function mt(e, r) {
  var t = e.map(function(a) {
    return a.activeState.value;
  });
  return new re(t, r || 0);
}
function eo(e) {
  var r = this, t = "latn", a = this.tokenizer.getRangeTokens(e), n = mt(a);
  n.context.forEach(function(s, i) {
    n.setCurrentIndex(i);
    var u = r.query.lookupFeature({ tag: "liga", script: t, contextParams: n });
    u.length && (u.forEach(function(o) {
      return Rr(o, a, i);
    }), n = mt(a));
  });
}
function ne(e) {
  this.baseDir = e || "ltr", this.tokenizer = new B(), this.featuresTags = {};
}
ne.prototype.setText = function(e) {
  this.text = e;
};
ne.prototype.contextChecks = { latinWordCheck: $i, arabicWordCheck: Ni, arabicSentenceCheck: Wi };
function pr(e) {
  var r = this.contextChecks[e + "Check"];
  return this.tokenizer.registerContextChecker(e, r.startCheck, r.endCheck);
}
function ro() {
  return pr.call(this, "latinWord"), pr.call(this, "arabicWord"), pr.call(this, "arabicSentence"), this.tokenizer.tokenize(this.text);
}
function to() {
  var e = this, r = this.tokenizer.getContextRanges("arabicSentence");
  r.forEach(function(t) {
    var a = e.tokenizer.getRangeTokens(t);
    e.tokenizer.replaceRange(t.startIndex, t.endOffset, a.reverse());
  });
}
ne.prototype.registerFeatures = function(e, r) {
  var t = this, a = r.filter(function(n) {
    return t.query.supports({ script: e, tag: n });
  });
  this.featuresTags.hasOwnProperty(e) ? this.featuresTags[e] = this.featuresTags[e].concat(a) : this.featuresTags[e] = a;
};
ne.prototype.applyFeatures = function(e, r) {
  if (!e) throw new Error("No valid font was provided to apply features");
  this.query || (this.query = new J(e));
  for (var t = 0; t < r.length; t++) {
    var a = r[t];
    !this.query.supports({ script: a.script }) || this.registerFeatures(a.script, a.tags);
  }
};
ne.prototype.registerModifier = function(e, r, t) {
  this.tokenizer.registerModifier(e, r, t);
};
function wr() {
  if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1) throw new Error("glyphIndex modifier is required to apply arabic presentation features.");
}
function ao() {
  var e = this, r = "arab";
  if (!!this.featuresTags.hasOwnProperty(r)) {
    wr.call(this);
    var t = this.tokenizer.getContextRanges("arabicWord");
    t.forEach(function(a) {
      Qi.call(e, a);
    });
  }
}
function no() {
  var e = this, r = "arab";
  if (!!this.featuresTags.hasOwnProperty(r)) {
    var t = this.featuresTags[r];
    if (t.indexOf("rlig") !== -1) {
      wr.call(this);
      var a = this.tokenizer.getContextRanges("arabicWord");
      a.forEach(function(n) {
        Ki.call(e, n);
      });
    }
  }
}
function so() {
  var e = this, r = "latn";
  if (!!this.featuresTags.hasOwnProperty(r)) {
    var t = this.featuresTags[r];
    if (t.indexOf("liga") !== -1) {
      wr.call(this);
      var a = this.tokenizer.getContextRanges("latinWord");
      a.forEach(function(n) {
        eo.call(e, n);
      });
    }
  }
}
ne.prototype.checkContextReady = function(e) {
  return !!this.tokenizer.getContext(e);
};
ne.prototype.applyFeaturesToContexts = function() {
  this.checkContextReady("arabicWord") && (ao.call(this), no.call(this)), this.checkContextReady("latinWord") && so.call(this), this.checkContextReady("arabicSentence") && to.call(this);
};
ne.prototype.processText = function(e) {
  (!this.text || this.text !== e) && (this.setText(e), ro.call(this), this.applyFeaturesToContexts());
};
ne.prototype.getBidiText = function(e) {
  return this.processText(e), this.tokenizer.getText();
};
ne.prototype.getTextGlyphs = function(e) {
  this.processText(e);
  for (var r = [], t = 0; t < this.tokenizer.tokens.length; t++) {
    var a = this.tokenizer.tokens[t];
    if (!a.state.deleted) {
      var n = a.activeState.value;
      r.push(Array.isArray(n) ? n[0] : n);
    }
  }
  return r;
};
function w(e) {
  e = e || {}, e.tables = e.tables || {}, e.empty || (Ee(e.familyName, "When creating a new Font object, familyName is required."), Ee(e.styleName, "When creating a new Font object, styleName is required."), Ee(e.unitsPerEm, "When creating a new Font object, unitsPerEm is required."), Ee(e.ascender, "When creating a new Font object, ascender is required."), Ee(e.descender <= 0, "When creating a new Font object, negative descender value is required."), this.names = { fontFamily: { en: e.familyName || " " }, fontSubfamily: { en: e.styleName || " " }, fullName: { en: e.fullName || e.familyName + " " + e.styleName }, postScriptName: { en: e.postScriptName || (e.familyName + e.styleName).replace(/\s/g, "") }, designer: { en: e.designer || " " }, designerURL: { en: e.designerURL || " " }, manufacturer: { en: e.manufacturer || " " }, manufacturerURL: { en: e.manufacturerURL || " " }, license: { en: e.license || " " }, licenseURL: { en: e.licenseURL || " " }, version: { en: e.version || "Version 0.1" }, description: { en: e.description || " " }, copyright: { en: e.copyright || " " }, trademark: { en: e.trademark || " " } }, this.unitsPerEm = e.unitsPerEm || 1e3, this.ascender = e.ascender, this.descender = e.descender, this.createdTimestamp = e.createdTimestamp, this.tables = Object.assign(e.tables, { os2: Object.assign({ usWeightClass: e.weightClass || this.usWeightClasses.MEDIUM, usWidthClass: e.widthClass || this.usWidthClasses.MEDIUM, fsSelection: e.fsSelection || this.fsSelectionValues.REGULAR }, e.tables.os2) })), this.supported = true, this.glyphs = new ue.GlyphSet(this, e.glyphs || []), this.encoding = new Ot(this), this.position = new Be(this), this.substitution = new K(this), this.tables = this.tables || {}, this._push = null, this._hmtxTableData = {}, Object.defineProperty(this, "hinting", { get: function() {
    if (this._hinting) return this._hinting;
    if (this.outlinesFormat === "truetype") return this._hinting = new ia(this);
  } });
}
w.prototype.hasChar = function(e) {
  return this.encoding.charToGlyphIndex(e) !== null;
};
w.prototype.charToGlyphIndex = function(e) {
  return this.encoding.charToGlyphIndex(e);
};
w.prototype.charToGlyph = function(e) {
  var r = this.charToGlyphIndex(e), t = this.glyphs.get(r);
  return t || (t = this.glyphs.get(0)), t;
};
w.prototype.updateFeatures = function(e) {
  return this.defaultRenderOptions.features.map(function(r) {
    return r.script === "latn" ? { script: "latn", tags: r.tags.filter(function(t) {
      return e[t];
    }) } : r;
  });
};
w.prototype.stringToGlyphs = function(e, r) {
  var t = this, a = new ne(), n = function(h) {
    return t.charToGlyphIndex(h.char);
  };
  a.registerModifier("glyphIndex", null, n);
  var s = r ? this.updateFeatures(r.features) : this.defaultRenderOptions.features;
  a.applyFeatures(this, s);
  for (var i = a.getTextGlyphs(e), u = i.length, o = new Array(u), l = this.glyphs.get(0), f = 0; f < u; f += 1) o[f] = this.glyphs.get(i[f]) || l;
  return o;
};
w.prototype.nameToGlyphIndex = function(e) {
  return this.glyphNames.nameToGlyphIndex(e);
};
w.prototype.nameToGlyph = function(e) {
  var r = this.nameToGlyphIndex(e), t = this.glyphs.get(r);
  return t || (t = this.glyphs.get(0)), t;
};
w.prototype.glyphIndexToName = function(e) {
  return this.glyphNames.glyphIndexToName ? this.glyphNames.glyphIndexToName(e) : "";
};
w.prototype.getKerningValue = function(e, r) {
  e = e.index || e, r = r.index || r;
  var t = this.position.defaultKerningTables;
  return t ? this.position.getKerningValue(t, e, r) : this.kerningPairs[e + "," + r] || 0;
};
w.prototype.defaultRenderOptions = { kerning: true, features: [{ script: "arab", tags: ["init", "medi", "fina", "rlig"] }, { script: "latn", tags: ["liga", "rlig"] }] };
w.prototype.forEachGlyph = function(e, r, t, a, n, s) {
  r = r !== void 0 ? r : 0, t = t !== void 0 ? t : 0, a = a !== void 0 ? a : 72, n = Object.assign({}, this.defaultRenderOptions, n);
  var i = 1 / this.unitsPerEm * a, u = this.stringToGlyphs(e, n), o;
  if (n.kerning) {
    var l = n.script || this.position.getDefaultScriptName();
    o = this.position.getKerningTables(l, n.language);
  }
  for (var f = 0; f < u.length; f += 1) {
    var h = u[f];
    if (s.call(this, h, r, t, a, n), h.advanceWidth && (r += h.advanceWidth * i), n.kerning && f < u.length - 1) {
      var p = o ? this.position.getKerningValue(o, h.index, u[f + 1].index) : this.getKerningValue(h, u[f + 1]);
      r += p * i;
    }
    n.letterSpacing ? r += n.letterSpacing * a : n.tracking && (r += n.tracking / 1e3 * a);
  }
  return r;
};
w.prototype.getPath = function(e, r, t, a, n) {
  var s = new P();
  return this.forEachGlyph(e, r, t, a, n, function(i, u, o, l) {
    var f = i.getPath(u, o, l, n, this);
    s.extend(f);
  }), s;
};
w.prototype.getPaths = function(e, r, t, a, n) {
  var s = [];
  return this.forEachGlyph(e, r, t, a, n, function(i, u, o, l) {
    var f = i.getPath(u, o, l, n, this);
    s.push(f);
  }), s;
};
w.prototype.getAdvanceWidth = function(e, r, t) {
  return this.forEachGlyph(e, 0, 0, r, t, function() {
  });
};
w.prototype.draw = function(e, r, t, a, n, s) {
  this.getPath(r, t, a, n, s).draw(e);
};
w.prototype.drawPoints = function(e, r, t, a, n, s) {
  this.forEachGlyph(r, t, a, n, s, function(i, u, o, l) {
    i.drawPoints(e, u, o, l);
  });
};
w.prototype.drawMetrics = function(e, r, t, a, n, s) {
  this.forEachGlyph(r, t, a, n, s, function(i, u, o, l) {
    i.drawMetrics(e, u, o, l);
  });
};
w.prototype.getEnglishName = function(e) {
  var r = this.names[e];
  if (r) return r.en;
};
w.prototype.validate = function() {
  var e = this;
  function r(a, n) {
  }
  function t(a) {
    var n = e.getEnglishName(a);
    n && n.trim().length > 0;
  }
  t("fontFamily"), t("weightName"), t("manufacturer"), t("copyright"), t("version"), this.unitsPerEm > 0;
};
w.prototype.toTables = function() {
  return Xn.fontToTable(this);
};
w.prototype.toBuffer = function() {
  return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."), this.toArrayBuffer();
};
w.prototype.toArrayBuffer = function() {
  for (var e = this.toTables(), r = e.encode(), t = new ArrayBuffer(r.length), a = new Uint8Array(t), n = 0; n < r.length; n++) a[n] = r[n];
  return t;
};
w.prototype.download = function(e) {
  var r = this.getEnglishName("fontFamily"), t = this.getEnglishName("fontSubfamily");
  e = e || r.replace(/\s/g, "") + "-" + t + ".otf";
  var a = this.toArrayBuffer();
  if (Zn()) if (window.URL = window.URL || window.webkitURL, window.URL) {
    var n = new DataView(a), s = new Blob([n], { type: "font/opentype" }), i = document.createElement("a");
    i.href = window.URL.createObjectURL(s), i.download = e;
    var u = document.createEvent("MouseEvents");
    u.initEvent("click", true, false), i.dispatchEvent(u);
  } else console.warn("Font file could not be downloaded. Try using a different browser.");
  else {
    var o = Ne(), l = Qn(a);
    o.writeFileSync(e, l);
  }
};
w.prototype.fsSelectionValues = { ITALIC: 1, UNDERSCORE: 2, NEGATIVE: 4, OUTLINED: 8, STRIKEOUT: 16, BOLD: 32, REGULAR: 64, USER_TYPO_METRICS: 128, WWS: 256, OBLIQUE: 512 };
w.prototype.usWidthClasses = { ULTRA_CONDENSED: 1, EXTRA_CONDENSED: 2, CONDENSED: 3, SEMI_CONDENSED: 4, MEDIUM: 5, SEMI_EXPANDED: 6, EXPANDED: 7, EXTRA_EXPANDED: 8, ULTRA_EXPANDED: 9 };
w.prototype.usWeightClasses = { THIN: 100, EXTRA_LIGHT: 200, LIGHT: 300, NORMAL: 400, MEDIUM: 500, SEMI_BOLD: 600, BOLD: 700, EXTRA_BOLD: 800, BLACK: 900 };
function pa(e, r) {
  var t = JSON.stringify(e), a = 256;
  for (var n in r) {
    var s = parseInt(n);
    if (!(!s || s < 256)) {
      if (JSON.stringify(r[n]) === t) return s;
      a <= s && (a = s + 1);
    }
  }
  return r[a] = e, a;
}
function io(e, r, t) {
  var a = pa(r.name, t);
  return [{ name: "tag_" + e, type: "TAG", value: r.tag }, { name: "minValue_" + e, type: "FIXED", value: r.minValue << 16 }, { name: "defaultValue_" + e, type: "FIXED", value: r.defaultValue << 16 }, { name: "maxValue_" + e, type: "FIXED", value: r.maxValue << 16 }, { name: "flags_" + e, type: "USHORT", value: 0 }, { name: "nameID_" + e, type: "USHORT", value: a }];
}
function oo(e, r, t) {
  var a = {}, n = new k.Parser(e, r);
  return a.tag = n.parseTag(), a.minValue = n.parseFixed(), a.defaultValue = n.parseFixed(), a.maxValue = n.parseFixed(), n.skip("uShort", 1), a.name = t[n.parseUShort()] || {}, a;
}
function uo(e, r, t, a) {
  for (var n = pa(r.name, a), s = [{ name: "nameID_" + e, type: "USHORT", value: n }, { name: "flags_" + e, type: "USHORT", value: 0 }], i = 0; i < t.length; ++i) {
    var u = t[i].tag;
    s.push({ name: "axis_" + e + " " + u, type: "FIXED", value: r.coordinates[u] << 16 });
  }
  return s;
}
function lo(e, r, t, a) {
  var n = {}, s = new k.Parser(e, r);
  n.name = a[s.parseUShort()] || {}, s.skip("uShort", 1), n.coordinates = {};
  for (var i = 0; i < t.length; ++i) n.coordinates[t[i].tag] = s.parseFixed();
  return n;
}
function fo(e, r) {
  var t = new b.Table("fvar", [{ name: "version", type: "ULONG", value: 65536 }, { name: "offsetToData", type: "USHORT", value: 0 }, { name: "countSizePairs", type: "USHORT", value: 2 }, { name: "axisCount", type: "USHORT", value: e.axes.length }, { name: "axisSize", type: "USHORT", value: 20 }, { name: "instanceCount", type: "USHORT", value: e.instances.length }, { name: "instanceSize", type: "USHORT", value: 4 + e.axes.length * 4 }]);
  t.offsetToData = t.sizeOf();
  for (var a = 0; a < e.axes.length; a++) t.fields = t.fields.concat(io(a, e.axes[a], r));
  for (var n = 0; n < e.instances.length; n++) t.fields = t.fields.concat(uo(n, e.instances[n], e.axes, r));
  return t;
}
function po(e, r, t) {
  var a = new k.Parser(e, r), n = a.parseULong();
  U.argument(n === 65536, "Unsupported fvar table version.");
  var s = a.parseOffset16();
  a.skip("uShort", 1);
  for (var i = a.parseUShort(), u = a.parseUShort(), o = a.parseUShort(), l = a.parseUShort(), f = [], h = 0; h < i; h++) f.push(oo(e, r + s + h * u, t));
  for (var p = [], c = r + s + i * u, d = 0; d < o; d++) p.push(lo(e, c + d * l, f, t));
  return { axes: f, instances: p };
}
var ho = { make: fo, parse: po };
var co = function() {
  return { coverage: this.parsePointer(v.coverage), attachPoints: this.parseList(v.pointer(v.uShortList)) };
};
var vo = function() {
  var e = this.parseUShort();
  if (U.argument(e === 1 || e === 2 || e === 3, "Unsupported CaretValue table version."), e === 1) return { coordinate: this.parseShort() };
  if (e === 2) return { pointindex: this.parseShort() };
  if (e === 3) return { coordinate: this.parseShort() };
};
var go = function() {
  return this.parseList(v.pointer(vo));
};
var mo = function() {
  return { coverage: this.parsePointer(v.coverage), ligGlyphs: this.parseList(v.pointer(go)) };
};
var yo = function() {
  return this.parseUShort(), this.parseList(v.pointer(v.coverage));
};
function xo(e, r) {
  r = r || 0;
  var t = new v(e, r), a = t.parseVersion(1);
  U.argument(a === 1 || a === 1.2 || a === 1.3, "Unsupported GDEF table version.");
  var n = { version: a, classDef: t.parsePointer(v.classDef), attachList: t.parsePointer(co), ligCaretList: t.parsePointer(mo), markAttachClassDef: t.parsePointer(v.classDef) };
  return a >= 1.2 && (n.markGlyphSets = t.parsePointer(yo)), n;
}
var bo = { parse: xo };
var te = new Array(10);
te[1] = function() {
  var r = this.offset + this.relativeOffset, t = this.parseUShort();
  if (t === 1) return { posFormat: 1, coverage: this.parsePointer(v.coverage), value: this.parseValueRecord() };
  if (t === 2) return { posFormat: 2, coverage: this.parsePointer(v.coverage), values: this.parseValueRecordList() };
  U.assert(false, "0x" + r.toString(16) + ": GPOS lookup type 1 format must be 1 or 2.");
};
te[2] = function() {
  var r = this.offset + this.relativeOffset, t = this.parseUShort();
  U.assert(t === 1 || t === 2, "0x" + r.toString(16) + ": GPOS lookup type 2 format must be 1 or 2.");
  var a = this.parsePointer(v.coverage), n = this.parseUShort(), s = this.parseUShort();
  if (t === 1) return { posFormat: t, coverage: a, valueFormat1: n, valueFormat2: s, pairSets: this.parseList(v.pointer(v.list(function() {
    return { secondGlyph: this.parseUShort(), value1: this.parseValueRecord(n), value2: this.parseValueRecord(s) };
  }))) };
  if (t === 2) {
    var i = this.parsePointer(v.classDef), u = this.parsePointer(v.classDef), o = this.parseUShort(), l = this.parseUShort();
    return { posFormat: t, coverage: a, valueFormat1: n, valueFormat2: s, classDef1: i, classDef2: u, class1Count: o, class2Count: l, classRecords: this.parseList(o, v.list(l, function() {
      return { value1: this.parseValueRecord(n), value2: this.parseValueRecord(s) };
    })) };
  }
};
te[3] = function() {
  return { error: "GPOS Lookup 3 not supported" };
};
te[4] = function() {
  return { error: "GPOS Lookup 4 not supported" };
};
te[5] = function() {
  return { error: "GPOS Lookup 5 not supported" };
};
te[6] = function() {
  return { error: "GPOS Lookup 6 not supported" };
};
te[7] = function() {
  return { error: "GPOS Lookup 7 not supported" };
};
te[8] = function() {
  return { error: "GPOS Lookup 8 not supported" };
};
te[9] = function() {
  return { error: "GPOS Lookup 9 not supported" };
};
function So(e, r) {
  r = r || 0;
  var t = new v(e, r), a = t.parseVersion(1);
  return U.argument(a === 1 || a === 1.1, "Unsupported GPOS table version " + a), a === 1 ? { version: a, scripts: t.parseScriptList(), features: t.parseFeatureList(), lookups: t.parseLookupList(te) } : { version: a, scripts: t.parseScriptList(), features: t.parseFeatureList(), lookups: t.parseLookupList(te), variations: t.parseFeatureVariationsList() };
}
var To = new Array(10);
function ko(e) {
  return new b.Table("GPOS", [{ name: "version", type: "ULONG", value: 65536 }, { name: "scripts", type: "TABLE", value: new b.ScriptList(e.scripts) }, { name: "features", type: "TABLE", value: new b.FeatureList(e.features) }, { name: "lookups", type: "TABLE", value: new b.LookupList(e.lookups, To) }]);
}
var Fo = { parse: So, make: ko };
function Uo(e) {
  var r = {};
  e.skip("uShort");
  var t = e.parseUShort();
  U.argument(t === 0, "Unsupported kern sub-table version."), e.skip("uShort", 2);
  var a = e.parseUShort();
  e.skip("uShort", 3);
  for (var n = 0; n < a; n += 1) {
    var s = e.parseUShort(), i = e.parseUShort(), u = e.parseShort();
    r[s + "," + i] = u;
  }
  return r;
}
function Co(e) {
  var r = {};
  e.skip("uShort");
  var t = e.parseULong();
  t > 1 && console.warn("Only the first kern subtable is supported."), e.skip("uLong");
  var a = e.parseUShort(), n = a & 255;
  if (e.skip("uShort"), n === 0) {
    var s = e.parseUShort();
    e.skip("uShort", 3);
    for (var i = 0; i < s; i += 1) {
      var u = e.parseUShort(), o = e.parseUShort(), l = e.parseShort();
      r[u + "," + o] = l;
    }
  }
  return r;
}
function Eo(e, r) {
  var t = new k.Parser(e, r), a = t.parseUShort();
  if (a === 0) return Uo(t);
  if (a === 1) return Co(t);
  throw new Error("Unsupported kern table version (" + a + ").");
}
var Oo = { parse: Eo };
function Lo(e, r, t, a) {
  for (var n = new k.Parser(e, r), s = a ? n.parseUShort : n.parseULong, i = [], u = 0; u < t + 1; u += 1) {
    var o = s.call(n);
    a && (o *= 2), i.push(o);
  }
  return i;
}
var Ro = { parse: Lo };
function wo(e, r) {
  var t = Ne();
  t.readFile(e, function(a, n) {
    if (a) return r(a.message);
    r(null, $t(n));
  });
}
function Do(e, r) {
  var t = new XMLHttpRequest();
  t.open("get", e, true), t.responseType = "arraybuffer", t.onload = function() {
    return t.response ? r(null, t.response) : r("Font could not be loaded: " + t.statusText);
  }, t.onerror = function() {
    r("Font could not be loaded");
  }, t.send();
}
function yt(e, r) {
  for (var t = [], a = 12, n = 0; n < r; n += 1) {
    var s = k.getTag(e, a), i = k.getULong(e, a + 4), u = k.getULong(e, a + 8), o = k.getULong(e, a + 12);
    t.push({ tag: s, checksum: i, offset: u, length: o, compression: false }), a += 16;
  }
  return t;
}
function Ao(e, r) {
  for (var t = [], a = 44, n = 0; n < r; n += 1) {
    var s = k.getTag(e, a), i = k.getULong(e, a + 4), u = k.getULong(e, a + 8), o = k.getULong(e, a + 12), l = void 0;
    u < o ? l = "WOFF" : l = false, t.push({ tag: s, offset: i, compression: l, compressedLength: u, length: o }), a += 20;
  }
  return t;
}
function I(e, r) {
  if (r.compression === "WOFF") {
    var t = new Uint8Array(e.buffer, r.offset + 2, r.compressedLength - 2), a = new Uint8Array(r.length);
    if (Ta(t, a), a.byteLength !== r.length) throw new Error("Decompression error: " + r.tag + " decompressed length doesn't match recorded length");
    var n = new DataView(a.buffer, 0);
    return { data: n, offset: 0 };
  } else return { data: e, offset: r.offset };
}
function Dr(e, r) {
  r = r ?? {};
  var t, a, n = new w({ empty: true }), s = new DataView(e, 0), i, u = [], o = k.getTag(s, 0);
  if (o === String.fromCharCode(0, 1, 0, 0) || o === "true" || o === "typ1") n.outlinesFormat = "truetype", i = k.getUShort(s, 4), u = yt(s, i);
  else if (o === "OTTO") n.outlinesFormat = "cff", i = k.getUShort(s, 4), u = yt(s, i);
  else if (o === "wOFF") {
    var l = k.getTag(s, 4);
    if (l === String.fromCharCode(0, 1, 0, 0)) n.outlinesFormat = "truetype";
    else if (l === "OTTO") n.outlinesFormat = "cff";
    else throw new Error("Unsupported OpenType flavor " + o);
    i = k.getUShort(s, 12), u = Ao(s, i);
  } else throw new Error("Unsupported OpenType signature " + o);
  for (var f, h, p, c, d, x, m, y, C, S, R, O, D = 0; D < i; D += 1) {
    var L = u[D], F = void 0;
    switch (L.tag) {
      case "cmap":
        F = I(s, L), n.tables.cmap = Et.parse(F.data, F.offset), n.encoding = new Lt(n.tables.cmap);
        break;
      case "cvt ":
        F = I(s, L), O = new k.Parser(F.data, F.offset), n.tables.cvt = O.parseShortList(L.length / 2);
        break;
      case "fvar":
        h = L;
        break;
      case "fpgm":
        F = I(s, L), O = new k.Parser(F.data, F.offset), n.tables.fpgm = O.parseByteList(L.length);
        break;
      case "head":
        F = I(s, L), n.tables.head = Nt.parse(F.data, F.offset), n.unitsPerEm = n.tables.head.unitsPerEm, t = n.tables.head.indexToLocFormat;
        break;
      case "hhea":
        F = I(s, L), n.tables.hhea = Ht.parse(F.data, F.offset), n.ascender = n.tables.hhea.ascender, n.descender = n.tables.hhea.descender, n.numberOfHMetrics = n.tables.hhea.numberOfHMetrics;
        break;
      case "hmtx":
        m = L;
        break;
      case "ltag":
        F = I(s, L), a = Wt.parse(F.data, F.offset);
        break;
      case "maxp":
        F = I(s, L), n.tables.maxp = _t.parse(F.data, F.offset), n.numGlyphs = n.tables.maxp.numGlyphs;
        break;
      case "name":
        S = L;
        break;
      case "OS/2":
        F = I(s, L), n.tables.os2 = xr.parse(F.data, F.offset);
        break;
      case "post":
        F = I(s, L), n.tables.post = Qt.parse(F.data, F.offset), n.glyphNames = new Ur(n.tables.post);
        break;
      case "prep":
        F = I(s, L), O = new k.Parser(F.data, F.offset), n.tables.prep = O.parseByteList(L.length);
        break;
      case "glyf":
        p = L;
        break;
      case "loca":
        C = L;
        break;
      case "CFF ":
        f = L;
        break;
      case "kern":
        y = L;
        break;
      case "GDEF":
        c = L;
        break;
      case "GPOS":
        d = L;
        break;
      case "GSUB":
        x = L;
        break;
      case "meta":
        R = L;
        break;
    }
  }
  var G = I(s, S);
  if (n.tables.name = Zt.parse(G.data, G.offset, a), n.names = n.tables.name, p && C) {
    var Y = t === 0, Z = I(s, C), j = Ro.parse(Z.data, Z.offset, n.numGlyphs, Y), $ = I(s, p);
    n.glyphs = aa.parse($.data, $.offset, j, n, r);
  } else if (f) {
    var M = I(s, f);
    Gt.parse(M.data, M.offset, n, r);
  } else throw new Error("Font doesn't contain TrueType or CFF outlines.");
  var N = I(s, m);
  if (zt.parse(n, N.data, N.offset, n.numberOfHMetrics, n.numGlyphs, n.glyphs, r), _a(n, r), y) {
    var W = I(s, y);
    n.kerningPairs = Oo.parse(W.data, W.offset);
  } else n.kerningPairs = {};
  if (c) {
    var _ = I(s, c);
    n.tables.gdef = bo.parse(_.data, _.offset);
  }
  if (d) {
    var V = I(s, d);
    n.tables.gpos = Fo.parse(V.data, V.offset), n.position.init();
  }
  if (x) {
    var H = I(s, x);
    n.tables.gsub = Kt.parse(H.data, H.offset);
  }
  if (h) {
    var X = I(s, h);
    n.tables.fvar = ho.parse(X.data, X.offset, n.names);
  }
  if (R) {
    var A = I(s, R);
    n.tables.meta = Jt.parse(A.data, A.offset), n.metas = n.tables.meta;
  }
  return n;
}
function Bo(e, r, t) {
  t = t ?? {};
  var a = typeof window > "u", n = a && !t.isUrl ? wo : Do;
  return new Promise(function(s, i) {
    n(e, function(u, o) {
      if (u) {
        if (r) return r(u);
        i(u);
      }
      var l;
      try {
        l = Dr(o, t);
      } catch (f) {
        if (r) return r(f, null);
        i(f);
      }
      if (r) return r(null, l);
      s(l);
    });
  });
}
function Io(e, r) {
  var t = Ne(), a = t.readFileSync(e);
  return Dr($t(a), r);
}
var Mo = Object.freeze({ __proto__: null, Font: w, Glyph: Q, Path: P, BoundingBox: pe, _parse: k, parse: Dr, load: Bo, loadSync: Io });
var Ho = Mo;
export {
  ne as Bidi,
  pe as BoundingBox,
  w as Font,
  Q as Glyph,
  P as Path,
  k as _parse,
  Ho as default,
  Bo as load,
  Io as loadSync,
  Dr as parse
};
//# sourceMappingURL=opentype-4GFL454O.js.map
