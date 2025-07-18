import {
  __require
} from "./chunk-SNAQBZPT.js";

// node_modules/@splinetool/runtime/build/ui.js
var Qr = ((ae) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(ae, { get: (ge, m) => (typeof __require < "u" ? __require : ge)[m] }) : ae)(function(ae) {
  if (typeof __require < "u") return __require.apply(this, arguments);
  throw new Error('Dynamic require of "' + ae + '" is not supported');
});
var Kn = (ae, ge) => () => (ge || ae((ge = { exports: {} }).exports, ge), ge.exports);
var Jn = Kn((zr, Kt) => {
  var Zr = (() => {
    var ae = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
    return typeof __filename < "u" && (ae = ae || __filename), function(ge = {}) {
      var m = ge, Jt, et;
      m.ready = new Promise((e, t) => {
        Jt = e, et = t;
      }), function(e) {
        e.Id = e.Id || [], e.Id.push(function() {
          e.MakeSWCanvasSurface = function(t) {
            var r = t, i = typeof OffscreenCanvas < "u" && r instanceof OffscreenCanvas;
            if (!(typeof HTMLCanvasElement < "u" && r instanceof HTMLCanvasElement || i || (r = document.getElementById(t), r))) throw "Canvas with id " + t + " was not found";
            return (t = e.MakeSurface(r.width, r.height)) && (t.ie = r), t;
          }, e.MakeCanvasSurface || (e.MakeCanvasSurface = e.MakeSWCanvasSurface), e.MakeSurface = function(t, r) {
            var i = { width: t, height: r, colorType: e.ColorType.RGBA_8888, alphaType: e.AlphaType.Unpremul, colorSpace: e.ColorSpace.SRGB }, o = t * r * 4, s = e._malloc(o);
            return (i = e.Surface._makeRasterDirect(i, s, 4 * t)) && (i.ie = null, i.Pe = t, i.Me = r, i.Ne = o, i.re = s, i.getCanvas().clear(e.TRANSPARENT)), i;
          }, e.MakeRasterDirectSurface = function(t, r, i) {
            return e.Surface._makeRasterDirect(t, r.byteOffset, i);
          }, e.Surface.prototype.flush = function(t) {
            if (e.Fd(this.Ed), this._flush(), this.ie) {
              var r = new Uint8ClampedArray(e.HEAPU8.buffer, this.re, this.Ne);
              r = new ImageData(r, this.Pe, this.Me), t ? this.ie.getContext("2d").putImageData(r, 0, 0, t[0], t[1], t[2] - t[0], t[3] - t[1]) : this.ie.getContext("2d").putImageData(r, 0, 0);
            }
          }, e.Surface.prototype.dispose = function() {
            this.re && e._free(this.re), this.delete();
          }, e.Fd = e.Fd || function() {
          }, e.je = e.je || function() {
            return null;
          };
        });
      }(m), function(e) {
        e.Id = e.Id || [], e.Id.push(function() {
          function t(f, h, g) {
            return f && f.hasOwnProperty(h) ? f[h] : g;
          }
          function r(f) {
            var h = ke(re);
            return re[h] = f, h;
          }
          function i(f) {
            return f.naturalHeight || f.videoHeight || f.displayHeight || f.height;
          }
          function o(f) {
            return f.naturalWidth || f.videoWidth || f.displayWidth || f.width;
          }
          function s(f, h, g, P) {
            return f.bindTexture(f.TEXTURE_2D, h), P || g.alphaType !== e.AlphaType.Premul || f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true), h;
          }
          function l(f, h, g) {
            g || h.alphaType !== e.AlphaType.Premul || f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), f.bindTexture(f.TEXTURE_2D, null);
          }
          e.GetWebGLContext = function(f, h) {
            if (!f) throw "null canvas passed into makeWebGLContext";
            var g = { alpha: t(h, "alpha", 1), depth: t(h, "depth", 1), stencil: t(h, "stencil", 8), antialias: t(h, "antialias", 0), premultipliedAlpha: t(h, "premultipliedAlpha", 1), preserveDrawingBuffer: t(h, "preserveDrawingBuffer", 0), preferLowPowerToHighPerformance: t(h, "preferLowPowerToHighPerformance", 0), failIfMajorPerformanceCaveat: t(h, "failIfMajorPerformanceCaveat", 0), enableExtensionsByDefault: t(h, "enableExtensionsByDefault", 1), explicitSwapControl: t(h, "explicitSwapControl", 0), renderViaOffscreenBackBuffer: t(h, "renderViaOffscreenBackBuffer", 0) };
            if (g.majorVersion = h && h.majorVersion ? h.majorVersion : typeof WebGL2RenderingContext < "u" ? 2 : 1, g.explicitSwapControl) throw "explicitSwapControl is not supported";
            return f = Mn(f, g), f ? (Ir(f), B.Qd.getExtension("WEBGL_debug_renderer_info"), f) : 0;
          }, e.deleteContext = function(f) {
            B === me[f] && (B = null), typeof JSEvents == "object" && JSEvents.tf(me[f].Qd.canvas), me[f] && me[f].Qd.canvas && (me[f].Qd.canvas.Ke = void 0), me[f] = null;
          }, e._setTextureCleanup({ deleteTexture: function(f, h) {
            var g = re[h];
            g && me[f].Qd.deleteTexture(g), re[h] = null;
          } }), e.MakeWebGLContext = function(f) {
            if (!this.Fd(f)) return null;
            var h = this._MakeGrContext();
            if (!h) return null;
            h.Ed = f;
            var g = h.delete.bind(h);
            return h.delete = (function() {
              e.Fd(this.Ed), g();
            }).bind(h), B.te = h;
          }, e.MakeGrContext = e.MakeWebGLContext, e.GrDirectContext.prototype.getResourceCacheLimitBytes = function() {
            e.Fd(this.Ed), this._getResourceCacheLimitBytes();
          }, e.GrDirectContext.prototype.getResourceCacheUsageBytes = function() {
            e.Fd(this.Ed), this._getResourceCacheUsageBytes();
          }, e.GrDirectContext.prototype.releaseResourcesAndAbandonContext = function() {
            e.Fd(this.Ed), this._releaseResourcesAndAbandonContext();
          }, e.GrDirectContext.prototype.setResourceCacheLimitBytes = function(f) {
            e.Fd(this.Ed), this._setResourceCacheLimitBytes(f);
          }, e.MakeOnScreenGLSurface = function(f, h, g, P, E, T) {
            return !this.Fd(f.Ed) || (h = E === void 0 || T === void 0 ? this._MakeOnScreenGLSurface(f, h, g, P) : this._MakeOnScreenGLSurface(f, h, g, P, E, T), !h) ? null : (h.Ed = f.Ed, h);
          }, e.MakeRenderTarget = function() {
            var f = arguments[0];
            if (!this.Fd(f.Ed)) return null;
            if (arguments.length === 3) {
              var h = this._MakeRenderTargetWH(f, arguments[1], arguments[2]);
              if (!h) return null;
            } else if (arguments.length === 2) {
              if (h = this._MakeRenderTargetII(f, arguments[1]), !h) return null;
            } else return null;
            return h.Ed = f.Ed, h;
          }, e.MakeWebGLCanvasSurface = function(f, h, g) {
            h = h || null;
            var P = f, E = typeof OffscreenCanvas < "u" && P instanceof OffscreenCanvas;
            if (!(typeof HTMLCanvasElement < "u" && P instanceof HTMLCanvasElement || E || (P = document.getElementById(f), P))) throw "Canvas with id " + f + " was not found";
            if (f = this.GetWebGLContext(P, g), !f || 0 > f) throw "failed to create webgl context: err " + f;
            return f = this.MakeWebGLContext(f), h = this.MakeOnScreenGLSurface(f, P.width, P.height, h), h || (h = P.cloneNode(true), P.parentNode.replaceChild(h, P), h.classList.add("ck-replaced"), e.MakeSWCanvasSurface(h));
          }, e.MakeCanvasSurface = e.MakeWebGLCanvasSurface, e.Surface.prototype.makeImageFromTexture = function(f, h) {
            return e.Fd(this.Ed), f = r(f), (h = this._makeImageFromTexture(this.Ed, f, h)) && (h.de = f), h;
          }, e.Surface.prototype.makeImageFromTextureSource = function(f, h, g) {
            h || (h = { height: i(f), width: o(f), colorType: e.ColorType.RGBA_8888, alphaType: g ? e.AlphaType.Premul : e.AlphaType.Unpremul }), h.colorSpace || (h.colorSpace = e.ColorSpace.SRGB), e.Fd(this.Ed);
            var P = B.Qd;
            return g = s(P, P.createTexture(), h, g), B.version === 2 ? P.texImage2D(P.TEXTURE_2D, 0, P.RGBA, h.width, h.height, 0, P.RGBA, P.UNSIGNED_BYTE, f) : P.texImage2D(P.TEXTURE_2D, 0, P.RGBA, P.RGBA, P.UNSIGNED_BYTE, f), l(P, h), this._resetContext(), this.makeImageFromTexture(g, h);
          }, e.Surface.prototype.updateTextureFromSource = function(f, h, g) {
            if (f.de) {
              e.Fd(this.Ed);
              var P = f.getImageInfo(), E = B.Qd, T = s(E, re[f.de], P, g);
              B.version === 2 ? E.texImage2D(E.TEXTURE_2D, 0, E.RGBA, o(h), i(h), 0, E.RGBA, E.UNSIGNED_BYTE, h) : E.texImage2D(E.TEXTURE_2D, 0, E.RGBA, E.RGBA, E.UNSIGNED_BYTE, h), l(E, P, g), this._resetContext(), re[f.de] = null, f.de = r(T), P.colorSpace = f.getColorSpace(), h = this._makeImageFromTexture(this.Ed, f.de, P), g = f.Dd.Hd, E = f.Dd.Ld, f.Dd.Hd = h.Dd.Hd, f.Dd.Ld = h.Dd.Ld, h.Dd.Hd = g, h.Dd.Ld = E, h.delete(), P.colorSpace.delete();
            }
          }, e.MakeLazyImageFromTextureSource = function(f, h, g) {
            h || (h = { height: i(f), width: o(f), colorType: e.ColorType.RGBA_8888, alphaType: g ? e.AlphaType.Premul : e.AlphaType.Unpremul }), h.colorSpace || (h.colorSpace = e.ColorSpace.SRGB);
            var P = { makeTexture: function() {
              var E = B, T = E.Qd, v = s(T, T.createTexture(), h, g);
              return E.version === 2 ? T.texImage2D(T.TEXTURE_2D, 0, T.RGBA, h.width, h.height, 0, T.RGBA, T.UNSIGNED_BYTE, f) : T.texImage2D(T.TEXTURE_2D, 0, T.RGBA, T.RGBA, T.UNSIGNED_BYTE, f), l(T, h, g), r(v);
            }, freeSrc: function() {
            } };
            return f.constructor.name === "VideoFrame" && (P.freeSrc = function() {
              f.close();
            }), e.Image._makeFromGenerator(h, P);
          }, e.Fd = function(f) {
            return f ? Ir(f) : false;
          }, e.je = function() {
            return B && B.te && !B.te.isDeleted() ? B.te : null;
          };
        });
      }(m), function(e) {
        function t(a) {
          return (o(255 * a[3]) << 24 | o(255 * a[0]) << 16 | o(255 * a[1]) << 8 | o(255 * a[2]) << 0) >>> 0;
        }
        function r(a) {
          if (a && a._ck) return a;
          if (a instanceof Float32Array) {
            for (var n = Math.floor(a.length / 4), u = new Uint32Array(n), c = 0; c < n; c++) u[c] = t(a.slice(4 * c, 4 * (c + 1)));
            return u;
          }
          if (a instanceof Uint32Array) return a;
          if (a instanceof Array && a[0] instanceof Float32Array) return a.map(t);
        }
        function i(a) {
          if (a === void 0) return 1;
          var n = parseFloat(a);
          return a && a.indexOf("%") !== -1 ? n / 100 : n;
        }
        function o(a) {
          return Math.round(Math.max(0, Math.min(a || 0, 255)));
        }
        function s(a, n) {
          n && n._ck || e._free(a);
        }
        function l(a, n, u) {
          if (!a || !a.length) return L;
          if (a && a._ck) return a.byteOffset;
          var c = e[n].BYTES_PER_ELEMENT;
          return u || (u = e._malloc(a.length * c)), e[n].set(a, u / c), u;
        }
        function f(a) {
          var n = { Nd: L, count: a.length, colorType: e.ColorType.RGBA_F32 };
          if (a instanceof Float32Array) n.Nd = l(a, "HEAPF32"), n.count = a.length / 4;
          else if (a instanceof Uint32Array) n.Nd = l(a, "HEAPU32"), n.colorType = e.ColorType.RGBA_8888;
          else if (a instanceof Array) {
            if (a && a.length) {
              for (var u = e._malloc(16 * a.length), c = 0, y = u / 4, _ = 0; _ < a.length; _++) for (var C = 0; 4 > C; C++) e.HEAPF32[y + c] = a[_][C], c++;
              a = u;
            } else a = L;
            n.Nd = a;
          } else throw "Invalid argument to copyFlexibleColorArray, Not a color array " + typeof a;
          return n;
        }
        function h(a) {
          if (!a) return L;
          var n = W.toTypedArray();
          if (a.length) {
            if (a.length === 6 || a.length === 9) return l(a, "HEAPF32", x), a.length === 6 && e.HEAPF32.set(Xn, 6 + x / 4), x;
            if (a.length === 16) return n[0] = a[0], n[1] = a[1], n[2] = a[3], n[3] = a[4], n[4] = a[5], n[5] = a[7], n[6] = a[12], n[7] = a[13], n[8] = a[15], x;
            throw "invalid matrix size";
          }
          if (a.m11 === void 0) throw "invalid matrix argument";
          return n[0] = a.m11, n[1] = a.m21, n[2] = a.m41, n[3] = a.m12, n[4] = a.m22, n[5] = a.m42, n[6] = a.m14, n[7] = a.m24, n[8] = a.m44, x;
        }
        function g(a) {
          if (!a) return L;
          var n = Y.toTypedArray();
          if (a.length) {
            if (a.length !== 16 && a.length !== 6 && a.length !== 9) throw "invalid matrix size";
            return a.length === 16 ? l(a, "HEAPF32", J) : (n.fill(0), n[0] = a[0], n[1] = a[1], n[3] = a[2], n[4] = a[3], n[5] = a[4], n[7] = a[5], n[10] = 1, n[12] = a[6], n[13] = a[7], n[15] = a[8], a.length === 6 && (n[12] = 0, n[13] = 0, n[15] = 1), J);
          }
          if (a.m11 === void 0) throw "invalid matrix argument";
          return n[0] = a.m11, n[1] = a.m21, n[2] = a.m31, n[3] = a.m41, n[4] = a.m12, n[5] = a.m22, n[6] = a.m32, n[7] = a.m42, n[8] = a.m13, n[9] = a.m23, n[10] = a.m33, n[11] = a.m43, n[12] = a.m14, n[13] = a.m24, n[14] = a.m34, n[15] = a.m44, J;
        }
        function P(a, n) {
          return l(a, "HEAPF32", n || _e);
        }
        function E(a, n, u, c) {
          var y = Ue.toTypedArray();
          return y[0] = a, y[1] = n, y[2] = u, y[3] = c, _e;
        }
        function T(a) {
          for (var n = new Float32Array(4), u = 0; 4 > u; u++) n[u] = e.HEAPF32[a / 4 + u];
          return n;
        }
        function v(a, n) {
          return l(a, "HEAPF32", n || N);
        }
        function M(a, n) {
          return l(a, "HEAPF32", n || Nt);
        }
        e.Color = function(a, n, u, c) {
          return c === void 0 && (c = 1), e.Color4f(o(a) / 255, o(n) / 255, o(u) / 255, c);
        }, e.ColorAsInt = function(a, n, u, c) {
          return c === void 0 && (c = 255), (o(c) << 24 | o(a) << 16 | o(n) << 8 | o(u) << 0 & 268435455) >>> 0;
        }, e.Color4f = function(a, n, u, c) {
          return c === void 0 && (c = 1), Float32Array.of(a, n, u, c);
        }, Object.defineProperty(e, "TRANSPARENT", { get: function() {
          return e.Color4f(0, 0, 0, 0);
        } }), Object.defineProperty(e, "BLACK", { get: function() {
          return e.Color4f(0, 0, 0, 1);
        } }), Object.defineProperty(e, "WHITE", { get: function() {
          return e.Color4f(1, 1, 1, 1);
        } }), Object.defineProperty(e, "RED", { get: function() {
          return e.Color4f(1, 0, 0, 1);
        } }), Object.defineProperty(e, "GREEN", { get: function() {
          return e.Color4f(0, 1, 0, 1);
        } }), Object.defineProperty(e, "BLUE", { get: function() {
          return e.Color4f(0, 0, 1, 1);
        } }), Object.defineProperty(e, "YELLOW", { get: function() {
          return e.Color4f(1, 1, 0, 1);
        } }), Object.defineProperty(e, "CYAN", { get: function() {
          return e.Color4f(0, 1, 1, 1);
        } }), Object.defineProperty(e, "MAGENTA", { get: function() {
          return e.Color4f(1, 0, 1, 1);
        } }), e.getColorComponents = function(a) {
          return [Math.floor(255 * a[0]), Math.floor(255 * a[1]), Math.floor(255 * a[2]), a[3]];
        }, e.parseColorString = function(a, n) {
          if (a = a.toLowerCase(), a.startsWith("#")) {
            switch (n = 255, a.length) {
              case 9:
                n = parseInt(a.slice(7, 9), 16);
              case 7:
                var u = parseInt(a.slice(1, 3), 16), c = parseInt(a.slice(3, 5), 16), y = parseInt(a.slice(5, 7), 16);
                break;
              case 5:
                n = 17 * parseInt(a.slice(4, 5), 16);
              case 4:
                u = 17 * parseInt(a.slice(1, 2), 16), c = 17 * parseInt(a.slice(2, 3), 16), y = 17 * parseInt(a.slice(3, 4), 16);
            }
            return e.Color(u, c, y, n / 255);
          }
          return a.startsWith("rgba") ? (a = a.slice(5, -1), a = a.split(","), e.Color(+a[0], +a[1], +a[2], i(a[3]))) : a.startsWith("rgb") ? (a = a.slice(4, -1), a = a.split(","), e.Color(+a[0], +a[1], +a[2], i(a[3]))) : a.startsWith("gray(") || a.startsWith("hsl") || !n || (a = n[a], a === void 0) ? e.BLACK : a;
        }, e.multiplyByAlpha = function(a, n) {
          return a = a.slice(), a[3] = Math.max(0, Math.min(a[3] * n, 1)), a;
        }, e.Malloc = function(a, n) {
          var u = e._malloc(n * a.BYTES_PER_ELEMENT);
          return { _ck: true, length: n, byteOffset: u, Xd: null, subarray: function(c, y) {
            return c = this.toTypedArray().subarray(c, y), c._ck = true, c;
          }, toTypedArray: function() {
            return this.Xd && this.Xd.length ? this.Xd : (this.Xd = new a(e.HEAPU8.buffer, u, n), this.Xd._ck = true, this.Xd);
          } };
        }, e.Free = function(a) {
          e._free(a.byteOffset), a.byteOffset = L, a.toTypedArray = null, a.Xd = null;
        };
        var x = L, W, J = L, Y, _e = L, Ue, de, N = L, Sr, Fe = L, Vr, St = L, Nr, Vt = L, Et, ze = L, Yr, Nt = L, Xr, Kr = L, Xn = Float32Array.of(0, 0, 1), L = 0;
        e.onRuntimeInitialized = function() {
          function a(n, u, c, y, _, C, F) {
            C || (C = 4 * y.width, y.colorType === e.ColorType.RGBA_F16 ? C *= 2 : y.colorType === e.ColorType.RGBA_F32 && (C *= 4));
            var D = C * y.height, I = _ ? _.byteOffset : e._malloc(D);
            if (F ? !n._readPixels(y, I, C, u, c, F) : !n._readPixels(y, I, C, u, c)) return _ || e._free(I), null;
            if (_) return _.toTypedArray();
            switch (y.colorType) {
              case e.ColorType.RGBA_8888:
              case e.ColorType.RGBA_F16:
                n = new Uint8Array(e.HEAPU8.buffer, I, D).slice();
                break;
              case e.ColorType.RGBA_F32:
                n = new Float32Array(e.HEAPU8.buffer, I, D).slice();
                break;
              default:
                return null;
            }
            return e._free(I), n;
          }
          Ue = e.Malloc(Float32Array, 4), _e = Ue.byteOffset, Y = e.Malloc(Float32Array, 16), J = Y.byteOffset, W = e.Malloc(Float32Array, 9), x = W.byteOffset, Yr = e.Malloc(Float32Array, 12), Nt = Yr.byteOffset, Xr = e.Malloc(Float32Array, 12), Kr = Xr.byteOffset, de = e.Malloc(Float32Array, 4), N = de.byteOffset, Sr = e.Malloc(Float32Array, 4), Fe = Sr.byteOffset, Vr = e.Malloc(Float32Array, 3), St = Vr.byteOffset, Nr = e.Malloc(Float32Array, 3), Vt = Nr.byteOffset, Et = e.Malloc(Int32Array, 4), ze = Et.byteOffset, e.ColorSpace.SRGB = e.ColorSpace._MakeSRGB(), e.ColorSpace.DISPLAY_P3 = e.ColorSpace._MakeDisplayP3(), e.ColorSpace.ADOBE_RGB = e.ColorSpace._MakeAdobeRGB(), e.GlyphRunFlags = { IsWhiteSpace: e._GlyphRunFlags_isWhiteSpace }, e.Path.MakeFromCmds = function(n) {
            var u = l(n, "HEAPF32"), c = e.Path._MakeFromCmds(u, n.length);
            return s(u, n), c;
          }, e.Path.MakeFromVerbsPointsWeights = function(n, u, c) {
            var y = l(n, "HEAPU8"), _ = l(u, "HEAPF32"), C = l(c, "HEAPF32"), F = e.Path._MakeFromVerbsPointsWeights(y, n.length, _, u.length, C, c && c.length || 0);
            return s(y, n), s(_, u), s(C, c), F;
          }, e.Path.prototype.addArc = function(n, u, c) {
            return n = v(n), this._addArc(n, u, c), this;
          }, e.Path.prototype.addCircle = function(n, u, c, y) {
            return this._addCircle(n, u, c, !!y), this;
          }, e.Path.prototype.addOval = function(n, u, c) {
            return c === void 0 && (c = 1), n = v(n), this._addOval(n, !!u, c), this;
          }, e.Path.prototype.addPath = function() {
            var n = Array.prototype.slice.call(arguments), u = n[0], c = false;
            if (typeof n[n.length - 1] == "boolean" && (c = n.pop()), n.length === 1) this._addPath(u, 1, 0, 0, 0, 1, 0, 0, 0, 1, c);
            else if (n.length === 2) n = n[1], this._addPath(u, n[0], n[1], n[2], n[3], n[4], n[5], n[6] || 0, n[7] || 0, n[8] || 1, c);
            else if (n.length === 7 || n.length === 10) this._addPath(u, n[1], n[2], n[3], n[4], n[5], n[6], n[7] || 0, n[8] || 0, n[9] || 1, c);
            else return null;
            return this;
          }, e.Path.prototype.addPoly = function(n, u) {
            var c = l(n, "HEAPF32");
            return this._addPoly(c, n.length / 2, u), s(c, n), this;
          }, e.Path.prototype.addRect = function(n, u) {
            return n = v(n), this._addRect(n, !!u), this;
          }, e.Path.prototype.addRRect = function(n, u) {
            return n = M(n), this._addRRect(n, !!u), this;
          }, e.Path.prototype.addVerbsPointsWeights = function(n, u, c) {
            var y = l(n, "HEAPU8"), _ = l(u, "HEAPF32"), C = l(c, "HEAPF32");
            this._addVerbsPointsWeights(y, n.length, _, u.length, C, c && c.length || 0), s(y, n), s(_, u), s(C, c);
          }, e.Path.prototype.arc = function(n, u, c, y, _, C) {
            return n = e.LTRBRect(n - c, u - c, n + c, u + c), _ = (_ - y) / Math.PI * 180 - 360 * !!C, C = new e.Path(), C.addArc(n, y / Math.PI * 180, _), this.addPath(C, true), C.delete(), this;
          }, e.Path.prototype.arcToOval = function(n, u, c, y) {
            return n = v(n), this._arcToOval(n, u, c, y), this;
          }, e.Path.prototype.arcToRotated = function(n, u, c, y, _, C, F) {
            return this._arcToRotated(n, u, c, !!y, !!_, C, F), this;
          }, e.Path.prototype.arcToTangent = function(n, u, c, y, _) {
            return this._arcToTangent(n, u, c, y, _), this;
          }, e.Path.prototype.close = function() {
            return this._close(), this;
          }, e.Path.prototype.conicTo = function(n, u, c, y, _) {
            return this._conicTo(n, u, c, y, _), this;
          }, e.Path.prototype.computeTightBounds = function(n) {
            this._computeTightBounds(N);
            var u = de.toTypedArray();
            return n ? (n.set(u), n) : u.slice();
          }, e.Path.prototype.cubicTo = function(n, u, c, y, _, C) {
            return this._cubicTo(n, u, c, y, _, C), this;
          }, e.Path.prototype.dash = function(n, u, c) {
            return this._dash(n, u, c) ? this : null;
          }, e.Path.prototype.getBounds = function(n) {
            this._getBounds(N);
            var u = de.toTypedArray();
            return n ? (n.set(u), n) : u.slice();
          }, e.Path.prototype.lineTo = function(n, u) {
            return this._lineTo(n, u), this;
          }, e.Path.prototype.moveTo = function(n, u) {
            return this._moveTo(n, u), this;
          }, e.Path.prototype.offset = function(n, u) {
            return this._transform(1, 0, n, 0, 1, u, 0, 0, 1), this;
          }, e.Path.prototype.quadTo = function(n, u, c, y) {
            return this._quadTo(n, u, c, y), this;
          }, e.Path.prototype.rArcTo = function(n, u, c, y, _, C, F) {
            return this._rArcTo(n, u, c, y, _, C, F), this;
          }, e.Path.prototype.rConicTo = function(n, u, c, y, _) {
            return this._rConicTo(n, u, c, y, _), this;
          }, e.Path.prototype.rCubicTo = function(n, u, c, y, _, C) {
            return this._rCubicTo(n, u, c, y, _, C), this;
          }, e.Path.prototype.rLineTo = function(n, u) {
            return this._rLineTo(n, u), this;
          }, e.Path.prototype.rMoveTo = function(n, u) {
            return this._rMoveTo(n, u), this;
          }, e.Path.prototype.rQuadTo = function(n, u, c, y) {
            return this._rQuadTo(n, u, c, y), this;
          }, e.Path.prototype.stroke = function(n) {
            return n = n || {}, n.width = n.width || 1, n.miter_limit = n.miter_limit || 4, n.cap = n.cap || e.StrokeCap.Butt, n.join = n.join || e.StrokeJoin.Miter, n.precision = n.precision || 1, this._stroke(n) ? this : null;
          }, e.Path.prototype.transform = function() {
            if (arguments.length === 1) {
              var n = arguments[0];
              this._transform(n[0], n[1], n[2], n[3], n[4], n[5], n[6] || 0, n[7] || 0, n[8] || 1);
            } else if (arguments.length === 6 || arguments.length === 9) n = arguments, this._transform(n[0], n[1], n[2], n[3], n[4], n[5], n[6] || 0, n[7] || 0, n[8] || 1);
            else throw "transform expected to take 1 or 9 arguments. Got " + arguments.length;
            return this;
          }, e.Path.prototype.trim = function(n, u, c) {
            return this._trim(n, u, !!c) ? this : null;
          }, e.Image.prototype.encodeToBytes = function(n, u) {
            var c = e.je();
            return n = n || e.ImageFormat.PNG, u = u || 100, c ? this._encodeToBytes(n, u, c) : this._encodeToBytes(n, u);
          }, e.Image.prototype.makeShaderCubic = function(n, u, c, y, _) {
            return _ = h(_), this._makeShaderCubic(n, u, c, y, _);
          }, e.Image.prototype.makeShaderOptions = function(n, u, c, y, _) {
            return _ = h(_), this._makeShaderOptions(n, u, c, y, _);
          }, e.Image.prototype.readPixels = function(n, u, c, y, _) {
            var C = e.je();
            return a(this, n, u, c, y, _, C);
          }, e.Canvas.prototype.clear = function(n) {
            e.Fd(this.Ed), n = P(n), this._clear(n);
          }, e.Canvas.prototype.clipRRect = function(n, u, c) {
            e.Fd(this.Ed), n = M(n), this._clipRRect(n, u, c);
          }, e.Canvas.prototype.clipRect = function(n, u, c) {
            e.Fd(this.Ed), n = v(n), this._clipRect(n, u, c);
          }, e.Canvas.prototype.concat = function(n) {
            e.Fd(this.Ed), n = g(n), this._concat(n);
          }, e.Canvas.prototype.drawArc = function(n, u, c, y, _) {
            e.Fd(this.Ed), n = v(n), this._drawArc(n, u, c, y, _);
          }, e.Canvas.prototype.drawAtlas = function(n, u, c, y, _, C, F) {
            if (n && y && u && c && u.length === c.length) {
              e.Fd(this.Ed), _ || (_ = e.BlendMode.SrcOver);
              var D = l(u, "HEAPF32"), I = l(c, "HEAPF32"), $ = c.length / 4, V = l(r(C), "HEAPU32");
              if (F && "B" in F && "C" in F) this._drawAtlasCubic(n, I, D, V, $, _, F.B, F.C, y);
              else {
                let d = e.FilterMode.Linear, A = e.MipmapMode.None;
                F && (d = F.filter, "mipmap" in F && (A = F.mipmap)), this._drawAtlasOptions(n, I, D, V, $, _, d, A, y);
              }
              s(D, u), s(I, c), s(V, C);
            }
          }, e.Canvas.prototype.drawCircle = function(n, u, c, y) {
            e.Fd(this.Ed), this._drawCircle(n, u, c, y);
          }, e.Canvas.prototype.drawColor = function(n, u) {
            e.Fd(this.Ed), n = P(n), u !== void 0 ? this._drawColor(n, u) : this._drawColor(n);
          }, e.Canvas.prototype.drawColorInt = function(n, u) {
            e.Fd(this.Ed), this._drawColorInt(n, u || e.BlendMode.SrcOver);
          }, e.Canvas.prototype.drawColorComponents = function(n, u, c, y, _) {
            e.Fd(this.Ed), n = E(n, u, c, y), _ !== void 0 ? this._drawColor(n, _) : this._drawColor(n);
          }, e.Canvas.prototype.drawDRRect = function(n, u, c) {
            e.Fd(this.Ed), n = M(n, Nt), u = M(u, Kr), this._drawDRRect(n, u, c);
          }, e.Canvas.prototype.drawImage = function(n, u, c, y) {
            e.Fd(this.Ed), this._drawImage(n, u, c, y || null);
          }, e.Canvas.prototype.drawImageCubic = function(n, u, c, y, _, C) {
            e.Fd(this.Ed), this._drawImageCubic(n, u, c, y, _, C || null);
          }, e.Canvas.prototype.drawImageOptions = function(n, u, c, y, _, C) {
            e.Fd(this.Ed), this._drawImageOptions(n, u, c, y, _, C || null);
          }, e.Canvas.prototype.drawImageNine = function(n, u, c, y, _) {
            e.Fd(this.Ed), u = l(u, "HEAP32", ze), c = v(c), this._drawImageNine(n, u, c, y, _ || null);
          }, e.Canvas.prototype.drawImageRect = function(n, u, c, y, _) {
            e.Fd(this.Ed), v(u, N), v(c, Fe), this._drawImageRect(n, N, Fe, y, !!_);
          }, e.Canvas.prototype.drawImageRectCubic = function(n, u, c, y, _, C) {
            e.Fd(this.Ed), v(u, N), v(c, Fe), this._drawImageRectCubic(n, N, Fe, y, _, C || null);
          }, e.Canvas.prototype.drawImageRectOptions = function(n, u, c, y, _, C) {
            e.Fd(this.Ed), v(u, N), v(c, Fe), this._drawImageRectOptions(n, N, Fe, y, _, C || null);
          }, e.Canvas.prototype.drawLine = function(n, u, c, y, _) {
            e.Fd(this.Ed), this._drawLine(n, u, c, y, _);
          }, e.Canvas.prototype.drawOval = function(n, u) {
            e.Fd(this.Ed), n = v(n), this._drawOval(n, u);
          }, e.Canvas.prototype.drawPaint = function(n) {
            e.Fd(this.Ed), this._drawPaint(n);
          }, e.Canvas.prototype.drawParagraph = function(n, u, c) {
            e.Fd(this.Ed), this._drawParagraph(n, u, c);
          }, e.Canvas.prototype.drawPatch = function(n, u, c, y, _) {
            if (24 > n.length) throw "Need 12 cubic points";
            if (u && 4 > u.length) throw "Need 4 colors";
            if (c && 8 > c.length) throw "Need 4 shader coordinates";
            e.Fd(this.Ed);
            let C = l(n, "HEAPF32"), F = u ? l(r(u), "HEAPU32") : L, D = c ? l(c, "HEAPF32") : L;
            y || (y = e.BlendMode.Modulate), this._drawPatch(C, F, D, y, _), s(D, c), s(F, u), s(C, n);
          }, e.Canvas.prototype.drawPath = function(n, u) {
            e.Fd(this.Ed), this._drawPath(n, u);
          }, e.Canvas.prototype.drawPicture = function(n) {
            e.Fd(this.Ed), this._drawPicture(n);
          }, e.Canvas.prototype.drawPoints = function(n, u, c) {
            e.Fd(this.Ed);
            var y = l(u, "HEAPF32");
            this._drawPoints(n, y, u.length / 2, c), s(y, u);
          }, e.Canvas.prototype.drawRRect = function(n, u) {
            e.Fd(this.Ed), n = M(n), this._drawRRect(n, u);
          }, e.Canvas.prototype.drawRect = function(n, u) {
            e.Fd(this.Ed), n = v(n), this._drawRect(n, u);
          }, e.Canvas.prototype.drawRect4f = function(n, u, c, y, _) {
            e.Fd(this.Ed), this._drawRect4f(n, u, c, y, _);
          }, e.Canvas.prototype.drawShadow = function(n, u, c, y, _, C, F) {
            e.Fd(this.Ed);
            var D = l(_, "HEAPF32"), I = l(C, "HEAPF32");
            u = l(u, "HEAPF32", St), c = l(c, "HEAPF32", Vt), this._drawShadow(n, u, c, y, D, I, F), s(D, _), s(I, C);
          }, e.getShadowLocalBounds = function(n, u, c, y, _, C, F) {
            return n = h(n), c = l(c, "HEAPF32", St), y = l(y, "HEAPF32", Vt), this._getShadowLocalBounds(n, u, c, y, _, C, N) ? (u = de.toTypedArray(), F ? (F.set(u), F) : u.slice()) : null;
          }, e.Canvas.prototype.drawTextBlob = function(n, u, c, y) {
            e.Fd(this.Ed), this._drawTextBlob(n, u, c, y);
          }, e.Canvas.prototype.drawVertices = function(n, u, c) {
            e.Fd(this.Ed), this._drawVertices(n, u, c);
          }, e.Canvas.prototype.getDeviceClipBounds = function(n) {
            this._getDeviceClipBounds(ze);
            var u = Et.toTypedArray();
            return n ? n.set(u) : n = u.slice(), n;
          }, e.Canvas.prototype.getLocalToDevice = function() {
            this._getLocalToDevice(J);
            for (var n = J, u = Array(16), c = 0; 16 > c; c++) u[c] = e.HEAPF32[n / 4 + c];
            return u;
          }, e.Canvas.prototype.getTotalMatrix = function() {
            this._getTotalMatrix(x);
            for (var n = Array(9), u = 0; 9 > u; u++) n[u] = e.HEAPF32[x / 4 + u];
            return n;
          }, e.Canvas.prototype.makeSurface = function(n) {
            return n = this._makeSurface(n), n.Ed = this.Ed, n;
          }, e.Canvas.prototype.readPixels = function(n, u, c, y, _) {
            return e.Fd(this.Ed), a(this, n, u, c, y, _);
          }, e.Canvas.prototype.saveLayer = function(n, u, c, y) {
            return u = v(u), this._saveLayer(n || null, u, c || null, y || 0);
          }, e.Canvas.prototype.writePixels = function(n, u, c, y, _, C, F, D) {
            if (n.byteLength % (u * c)) throw "pixels length must be a multiple of the srcWidth * srcHeight";
            e.Fd(this.Ed);
            var I = n.byteLength / (u * c);
            C = C || e.AlphaType.Unpremul, F = F || e.ColorType.RGBA_8888, D = D || e.ColorSpace.SRGB;
            var $ = I * u;
            return I = l(n, "HEAPU8"), u = this._writePixels({ width: u, height: c, colorType: F, alphaType: C, colorSpace: D }, I, $, y, _), s(I, n), u;
          }, e.ColorFilter.MakeBlend = function(n, u, c) {
            return n = P(n), c = c || e.ColorSpace.SRGB, e.ColorFilter._MakeBlend(n, u, c);
          }, e.ColorFilter.MakeMatrix = function(n) {
            if (!n || n.length !== 20) throw "invalid color matrix";
            var u = l(n, "HEAPF32"), c = e.ColorFilter._makeMatrix(u);
            return s(u, n), c;
          }, e.ContourMeasure.prototype.getPosTan = function(n, u) {
            return this._getPosTan(n, N), n = de.toTypedArray(), u ? (u.set(n), u) : n.slice();
          }, e.ImageFilter.prototype.getOutputBounds = function(n, u, c) {
            return n = v(n, N), u = h(u), this._getOutputBounds(n, u, ze), u = Et.toTypedArray(), c ? (c.set(u), c) : u.slice();
          }, e.ImageFilter.MakeDropShadow = function(n, u, c, y, _, C) {
            return _ = P(_, _e), e.ImageFilter._MakeDropShadow(n, u, c, y, _, C);
          }, e.ImageFilter.MakeDropShadowOnly = function(n, u, c, y, _, C) {
            return _ = P(_, _e), e.ImageFilter._MakeDropShadowOnly(n, u, c, y, _, C);
          }, e.ImageFilter.MakeImage = function(n, u, c, y) {
            if (c = v(c, N), y = v(y, Fe), "B" in u && "C" in u) return e.ImageFilter._MakeImageCubic(n, u.B, u.C, c, y);
            let _ = u.filter, C = e.MipmapMode.None;
            return "mipmap" in u && (C = u.mipmap), e.ImageFilter._MakeImageOptions(n, _, C, c, y);
          }, e.ImageFilter.MakeMatrixTransform = function(n, u, c) {
            if (n = h(n), "B" in u && "C" in u) return e.ImageFilter._MakeMatrixTransformCubic(n, u.B, u.C, c);
            let y = u.filter, _ = e.MipmapMode.None;
            return "mipmap" in u && (_ = u.mipmap), e.ImageFilter._MakeMatrixTransformOptions(n, y, _, c);
          }, e.Paint.prototype.getColor = function() {
            return this._getColor(_e), T(_e);
          }, e.Paint.prototype.setColor = function(n, u) {
            u = u || null, n = P(n), this._setColor(n, u);
          }, e.Paint.prototype.setColorComponents = function(n, u, c, y, _) {
            _ = _ || null, n = E(n, u, c, y), this._setColor(n, _);
          }, e.Path.prototype.getPoint = function(n, u) {
            return this._getPoint(n, N), n = de.toTypedArray(), u ? (u[0] = n[0], u[1] = n[1], u) : n.slice(0, 2);
          }, e.Picture.prototype.makeShader = function(n, u, c, y, _) {
            return y = h(y), _ = v(_), this._makeShader(n, u, c, y, _);
          }, e.Picture.prototype.cullRect = function(n) {
            this._cullRect(N);
            var u = de.toTypedArray();
            return n ? (n.set(u), n) : u.slice();
          }, e.PictureRecorder.prototype.beginRecording = function(n, u) {
            return n = v(n), this._beginRecording(n, !!u);
          }, e.Surface.prototype.getCanvas = function() {
            var n = this._getCanvas();
            return n.Ed = this.Ed, n;
          }, e.Surface.prototype.makeImageSnapshot = function(n) {
            return e.Fd(this.Ed), n = l(n, "HEAP32", ze), this._makeImageSnapshot(n);
          }, e.Surface.prototype.makeSurface = function(n) {
            return e.Fd(this.Ed), n = this._makeSurface(n), n.Ed = this.Ed, n;
          }, e.Surface.prototype.Oe = function(n, u) {
            return this.ce || (this.ce = this.getCanvas()), requestAnimationFrame((function() {
              e.Fd(this.Ed), n(this.ce), this.flush(u);
            }).bind(this));
          }, e.Surface.prototype.requestAnimationFrame || (e.Surface.prototype.requestAnimationFrame = e.Surface.prototype.Oe), e.Surface.prototype.Le = function(n, u) {
            this.ce || (this.ce = this.getCanvas()), requestAnimationFrame((function() {
              e.Fd(this.Ed), n(this.ce), this.flush(u), this.dispose();
            }).bind(this));
          }, e.Surface.prototype.drawOnce || (e.Surface.prototype.drawOnce = e.Surface.prototype.Le), e.PathEffect.MakeDash = function(n, u) {
            if (u || (u = 0), !n.length || n.length % 2 === 1) throw "Intervals array must have even length";
            var c = l(n, "HEAPF32");
            return u = e.PathEffect._MakeDash(c, n.length, u), s(c, n), u;
          }, e.PathEffect.MakeLine2D = function(n, u) {
            return u = h(u), e.PathEffect._MakeLine2D(n, u);
          }, e.PathEffect.MakePath2D = function(n, u) {
            return n = h(n), e.PathEffect._MakePath2D(n, u);
          }, e.Shader.MakeColor = function(n, u) {
            return u = u || null, n = P(n), e.Shader._MakeColor(n, u);
          }, e.Shader.Blend = e.Shader.MakeBlend, e.Shader.Color = e.Shader.MakeColor, e.Shader.MakeLinearGradient = function(n, u, c, y, _, C, F, D) {
            D = D || null;
            var I = f(c), $ = l(y, "HEAPF32");
            F = F || 0, C = h(C);
            var V = de.toTypedArray();
            return V.set(n), V.set(u, 2), n = e.Shader._MakeLinearGradient(N, I.Nd, I.colorType, $, I.count, _, F, C, D), s(I.Nd, c), y && s($, y), n;
          }, e.Shader.MakeRadialGradient = function(n, u, c, y, _, C, F, D) {
            D = D || null;
            var I = f(c), $ = l(y, "HEAPF32");
            return F = F || 0, C = h(C), n = e.Shader._MakeRadialGradient(n[0], n[1], u, I.Nd, I.colorType, $, I.count, _, F, C, D), s(I.Nd, c), y && s($, y), n;
          }, e.Shader.MakeSweepGradient = function(n, u, c, y, _, C, F, D, I, $) {
            $ = $ || null;
            var V = f(c), d = l(y, "HEAPF32");
            return F = F || 0, D = D || 0, I = I || 360, C = h(C), n = e.Shader._MakeSweepGradient(n, u, V.Nd, V.colorType, d, V.count, _, D, I, F, C, $), s(V.Nd, c), y && s(d, y), n;
          }, e.Shader.MakeTwoPointConicalGradient = function(n, u, c, y, _, C, F, D, I, $) {
            $ = $ || null;
            var V = f(_), d = l(C, "HEAPF32");
            I = I || 0, D = h(D);
            var A = de.toTypedArray();
            return A.set(n), A.set(c, 2), n = e.Shader._MakeTwoPointConicalGradient(N, u, y, V.Nd, V.colorType, d, V.count, F, I, D, $), s(V.Nd, _), C && s(d, C), n;
          }, e.Vertices.prototype.bounds = function(n) {
            this._bounds(N);
            var u = de.toTypedArray();
            return n ? (n.set(u), n) : u.slice();
          }, e.Id && e.Id.forEach(function(n) {
            n();
          });
        }, e.computeTonalColors = function(a) {
          var n = l(a.ambient, "HEAPF32"), u = l(a.spot, "HEAPF32");
          this._computeTonalColors(n, u);
          var c = { ambient: T(n), spot: T(u) };
          return s(n, a.ambient), s(u, a.spot), c;
        }, e.LTRBRect = function(a, n, u, c) {
          return Float32Array.of(a, n, u, c);
        }, e.XYWHRect = function(a, n, u, c) {
          return Float32Array.of(a, n, a + u, n + c);
        }, e.LTRBiRect = function(a, n, u, c) {
          return Int32Array.of(a, n, u, c);
        }, e.XYWHiRect = function(a, n, u, c) {
          return Int32Array.of(a, n, a + u, n + c);
        }, e.RRectXY = function(a, n, u) {
          return Float32Array.of(a[0], a[1], a[2], a[3], n, u, n, u, n, u, n, u);
        }, e.MakeAnimatedImageFromEncoded = function(a) {
          a = new Uint8Array(a);
          var n = e._malloc(a.byteLength);
          return e.HEAPU8.set(a, n), (a = e._decodeAnimatedImage(n, a.byteLength)) ? a : null;
        }, e.MakeImageFromEncoded = function(a) {
          a = new Uint8Array(a);
          var n = e._malloc(a.byteLength);
          return e.HEAPU8.set(a, n), (a = e._decodeImage(n, a.byteLength)) ? a : null;
        };
        var qe = null;
        e.MakeImageFromCanvasImageSource = function(a) {
          var n = a.width, u = a.height;
          qe || (qe = document.createElement("canvas")), qe.width = n, qe.height = u;
          var c = qe.getContext("2d", { willReadFrequently: true });
          return c.drawImage(a, 0, 0), a = c.getImageData(0, 0, n, u), e.MakeImage({ width: n, height: u, alphaType: e.AlphaType.Unpremul, colorType: e.ColorType.RGBA_8888, colorSpace: e.ColorSpace.SRGB }, a.data, 4 * n);
        }, e.MakeImage = function(a, n, u) {
          var c = e._malloc(n.length);
          return e.HEAPU8.set(n, c), e._MakeImage(a, c, n.length, u);
        }, e.MakeVertices = function(a, n, u, c, y, _) {
          var C = y && y.length || 0, F = 0;
          return u && u.length && (F |= 1), c && c.length && (F |= 2), _ === void 0 || _ || (F |= 4), a = new e._VerticesBuilder(a, n.length / 2, C, F), l(n, "HEAPF32", a.positions()), a.texCoords() && l(u, "HEAPF32", a.texCoords()), a.colors() && l(r(c), "HEAPU32", a.colors()), a.indices() && l(y, "HEAPU16", a.indices()), a.detach();
        }, function(a) {
          a.Id = a.Id || [], a.Id.push(function() {
            function n(d) {
              return d && (d.dir = d.dir === 0 ? a.TextDirection.RTL : a.TextDirection.LTR), d;
            }
            function u(d) {
              if (!d || !d.length) return [];
              for (var A = [], U = 0; U < d.length; U += 5) {
                var X = a.LTRBRect(d[U], d[U + 1], d[U + 2], d[U + 3]), Ce = a.TextDirection.LTR;
                d[U + 4] === 0 && (Ce = a.TextDirection.RTL), A.push({ rect: X, dir: Ce });
              }
              return a._free(d.byteOffset), A;
            }
            function c(d) {
              return d = d || {}, d.weight === void 0 && (d.weight = a.FontWeight.Normal), d.width = d.width || a.FontWidth.Normal, d.slant = d.slant || a.FontSlant.Upright, d;
            }
            function y(d) {
              if (!d || !d.length) return L;
              for (var A = [], U = 0; U < d.length; U++) {
                var X = _(d[U]);
                A.push(X);
              }
              return l(A, "HEAPU32");
            }
            function _(d) {
              if (D[d]) return D[d];
              var A = le(d) + 1, U = a._malloc(A);
              return se(d, G, U, A), D[d] = U;
            }
            function C(d) {
              if (d._colorPtr = P(d.color), d._foregroundColorPtr = L, d._backgroundColorPtr = L, d._decorationColorPtr = L, d.foregroundColor && (d._foregroundColorPtr = P(d.foregroundColor, I)), d.backgroundColor && (d._backgroundColorPtr = P(d.backgroundColor, $)), d.decorationColor && (d._decorationColorPtr = P(d.decorationColor, V)), Array.isArray(d.fontFamilies) && d.fontFamilies.length ? (d._fontFamiliesPtr = y(d.fontFamilies), d._fontFamiliesLen = d.fontFamilies.length) : (d._fontFamiliesPtr = L, d._fontFamiliesLen = 0), d.locale) {
                var A = d.locale;
                d._localePtr = _(A), d._localeLen = le(A) + 1;
              } else d._localePtr = L, d._localeLen = 0;
              if (Array.isArray(d.shadows) && d.shadows.length) {
                A = d.shadows;
                var U = A.map(function(he) {
                  return he.color || a.BLACK;
                }), X = A.map(function(he) {
                  return he.blurRadius || 0;
                });
                d._shadowLen = A.length;
                for (var Ce = a._malloc(8 * A.length), Yt = Ce / 4, Xt = 0; Xt < A.length; Xt++) {
                  var Jr = A[Xt].offset || [0, 0];
                  a.HEAPF32[Yt] = Jr[0], a.HEAPF32[Yt + 1] = Jr[1], Yt += 2;
                }
                d._shadowColorsPtr = f(U).Nd, d._shadowOffsetsPtr = Ce, d._shadowBlurRadiiPtr = l(X, "HEAPF32");
              } else d._shadowLen = 0, d._shadowColorsPtr = L, d._shadowOffsetsPtr = L, d._shadowBlurRadiiPtr = L;
              Array.isArray(d.fontFeatures) && d.fontFeatures.length ? (A = d.fontFeatures, U = A.map(function(he) {
                return he.name;
              }), X = A.map(function(he) {
                return he.value;
              }), d._fontFeatureLen = A.length, d._fontFeatureNamesPtr = y(U), d._fontFeatureValuesPtr = l(X, "HEAPU32")) : (d._fontFeatureLen = 0, d._fontFeatureNamesPtr = L, d._fontFeatureValuesPtr = L), Array.isArray(d.fontVariations) && d.fontVariations.length ? (A = d.fontVariations, U = A.map(function(he) {
                return he.axis;
              }), X = A.map(function(he) {
                return he.value;
              }), d._fontVariationLen = A.length, d._fontVariationAxesPtr = y(U), d._fontVariationValuesPtr = l(X, "HEAPF32")) : (d._fontVariationLen = 0, d._fontVariationAxesPtr = L, d._fontVariationValuesPtr = L);
            }
            function F(d) {
              a._free(d._fontFamiliesPtr), a._free(d._shadowColorsPtr), a._free(d._shadowOffsetsPtr), a._free(d._shadowBlurRadiiPtr), a._free(d._fontFeatureNamesPtr), a._free(d._fontFeatureValuesPtr), a._free(d._fontVariationAxesPtr), a._free(d._fontVariationValuesPtr);
            }
            a.Paragraph.prototype.getRectsForRange = function(d, A, U, X) {
              return d = this._getRectsForRange(d, A, U, X), u(d);
            }, a.Paragraph.prototype.getRectsForPlaceholders = function() {
              var d = this._getRectsForPlaceholders();
              return u(d);
            }, a.Paragraph.prototype.getGlyphInfoAt = function(d) {
              return n(this._getGlyphInfoAt(d));
            }, a.Paragraph.prototype.getClosestGlyphInfoAtCoordinate = function(d, A) {
              return n(this._getClosestGlyphInfoAtCoordinate(d, A));
            }, a.TypefaceFontProvider.prototype.registerFont = function(d, A) {
              if (d = a.Typeface.MakeFreeTypeFaceFromData(d), !d) return null;
              A = _(A), this._registerFont(d, A);
            }, a.ParagraphStyle = function(d) {
              if (d.disableHinting = d.disableHinting || false, d.ellipsis) {
                var A = d.ellipsis;
                d._ellipsisPtr = _(A), d._ellipsisLen = le(A) + 1;
              } else d._ellipsisPtr = L, d._ellipsisLen = 0;
              return d.heightMultiplier == null && (d.heightMultiplier = -1), d.maxLines = d.maxLines || 0, d.replaceTabCharacters = d.replaceTabCharacters || false, A = (A = d.strutStyle) || {}, A.strutEnabled = A.strutEnabled || false, A.strutEnabled && Array.isArray(A.fontFamilies) && A.fontFamilies.length ? (A._fontFamiliesPtr = y(A.fontFamilies), A._fontFamiliesLen = A.fontFamilies.length) : (A._fontFamiliesPtr = L, A._fontFamiliesLen = 0), A.fontStyle = c(A.fontStyle), A.fontSize == null && (A.fontSize = -1), A.heightMultiplier == null && (A.heightMultiplier = -1), A.halfLeading = A.halfLeading || false, A.leading = A.leading || 0, A.forceStrutHeight = A.forceStrutHeight || false, d.strutStyle = A, d.textAlign = d.textAlign || a.TextAlign.Start, d.textDirection = d.textDirection || a.TextDirection.LTR, d.textHeightBehavior = d.textHeightBehavior || a.TextHeightBehavior.All, d.textStyle = a.TextStyle(d.textStyle), d.applyRoundingHack = d.applyRoundingHack !== false, d;
            }, a.TextStyle = function(d) {
              return d.color || (d.color = a.BLACK), d.decoration = d.decoration || 0, d.decorationThickness = d.decorationThickness || 0, d.decorationStyle = d.decorationStyle || a.DecorationStyle.Solid, d.textBaseline = d.textBaseline || a.TextBaseline.Alphabetic, d.fontSize == null && (d.fontSize = -1), d.letterSpacing = d.letterSpacing || 0, d.wordSpacing = d.wordSpacing || 0, d.heightMultiplier == null && (d.heightMultiplier = -1), d.halfLeading = d.halfLeading || false, d.fontStyle = c(d.fontStyle), d;
            };
            var D = {}, I = a._malloc(16), $ = a._malloc(16), V = a._malloc(16);
            a.ParagraphBuilder.Make = function(d, A) {
              return C(d.textStyle), A = a.ParagraphBuilder._Make(d, A), F(d.textStyle), A;
            }, a.ParagraphBuilder.MakeFromFontProvider = function(d, A) {
              return C(d.textStyle), A = a.ParagraphBuilder._MakeFromFontProvider(d, A), F(d.textStyle), A;
            }, a.ParagraphBuilder.MakeFromFontCollection = function(d, A) {
              return C(d.textStyle), A = a.ParagraphBuilder._MakeFromFontCollection(d, A), F(d.textStyle), A;
            }, a.ParagraphBuilder.ShapeText = function(d, A, U) {
              let X = 0;
              for (let Ce of A) X += Ce.length;
              if (X !== d.length) throw "Accumulated block lengths must equal text.length";
              return a.ParagraphBuilder._ShapeText(d, A, U);
            }, a.ParagraphBuilder.prototype.pushStyle = function(d) {
              C(d), this._pushStyle(d), F(d);
            }, a.ParagraphBuilder.prototype.pushPaintStyle = function(d, A, U) {
              C(d), this._pushPaintStyle(d, A, U), F(d);
            }, a.ParagraphBuilder.prototype.addPlaceholder = function(d, A, U, X, Ce) {
              U = U || a.PlaceholderAlignment.Baseline, X = X || a.TextBaseline.Alphabetic, this._addPlaceholder(d || 0, A || 0, U, X, Ce || 0);
            }, a.ParagraphBuilder.prototype.setWordsUtf8 = function(d) {
              var A = l(d, "HEAPU32");
              this._setWordsUtf8(A, d && d.length || 0), s(A, d);
            }, a.ParagraphBuilder.prototype.setWordsUtf16 = function(d) {
              var A = l(d, "HEAPU32");
              this._setWordsUtf16(A, d && d.length || 0), s(A, d);
            }, a.ParagraphBuilder.prototype.setGraphemeBreaksUtf8 = function(d) {
              var A = l(d, "HEAPU32");
              this._setGraphemeBreaksUtf8(A, d && d.length || 0), s(A, d);
            }, a.ParagraphBuilder.prototype.setGraphemeBreaksUtf16 = function(d) {
              var A = l(d, "HEAPU32");
              this._setGraphemeBreaksUtf16(A, d && d.length || 0), s(A, d);
            }, a.ParagraphBuilder.prototype.setLineBreaksUtf8 = function(d) {
              var A = l(d, "HEAPU32");
              this._setLineBreaksUtf8(A, d && d.length || 0), s(A, d);
            }, a.ParagraphBuilder.prototype.setLineBreaksUtf16 = function(d) {
              var A = l(d, "HEAPU32");
              this._setLineBreaksUtf16(A, d && d.length || 0), s(A, d);
            };
          });
        }(m), e.Id = e.Id || [], e.Id.push(function() {
          e.Path.prototype.op = function(a, n) {
            return this._op(a, n) ? this : null;
          }, e.Path.prototype.simplify = function() {
            return this._simplify() ? this : null;
          };
        }), e.Id = e.Id || [], e.Id.push(function() {
          e.Canvas.prototype.drawText = function(a, n, u, c, y) {
            var _ = le(a), C = e._malloc(_ + 1);
            se(a, G, C, _ + 1), this._drawSimpleText(C, _, n, u, y, c), e._free(C);
          }, e.Canvas.prototype.drawGlyphs = function(a, n, u, c, y, _) {
            if (!(2 * a.length <= n.length)) throw "Not enough positions for the array of gyphs";
            e.Fd(this.Ed);
            let C = l(a, "HEAPU16"), F = l(n, "HEAPF32");
            this._drawGlyphs(a.length, C, F, u, c, y, _), s(F, n), s(C, a);
          }, e.Font.prototype.getGlyphBounds = function(a, n, u) {
            var c = l(a, "HEAPU16"), y = e._malloc(16 * a.length);
            return this._getGlyphWidthBounds(c, a.length, L, y, n || null), n = new Float32Array(e.HEAPU8.buffer, y, 4 * a.length), s(c, a), u ? (u.set(n), e._free(y), u) : (a = Float32Array.from(n), e._free(y), a);
          }, e.Font.prototype.getGlyphIDs = function(a, n, u) {
            n || (n = a.length);
            var c = le(a) + 1, y = e._malloc(c);
            return se(a, G, y, c), a = e._malloc(2 * n), n = this._getGlyphIDs(y, c - 1, n, a), e._free(y), 0 > n ? (e._free(a), null) : (y = new Uint16Array(e.HEAPU8.buffer, a, n), u ? (u.set(y), e._free(a), u) : (u = Uint16Array.from(y), e._free(a), u));
          }, e.Font.prototype.getGlyphIntercepts = function(a, n, u, c) {
            var y = l(a, "HEAPU16"), _ = l(n, "HEAPF32");
            return this._getGlyphIntercepts(y, a.length, !(a && a._ck), _, n.length, !(n && n._ck), u, c);
          }, e.Font.prototype.getGlyphWidths = function(a, n, u) {
            var c = l(a, "HEAPU16"), y = e._malloc(4 * a.length);
            return this._getGlyphWidthBounds(c, a.length, y, L, n || null), n = new Float32Array(e.HEAPU8.buffer, y, a.length), s(c, a), u ? (u.set(n), e._free(y), u) : (a = Float32Array.from(n), e._free(y), a);
          }, e.FontMgr.FromData = function() {
            if (!arguments.length) return null;
            var a = arguments;
            if (a.length === 1 && Array.isArray(a[0]) && (a = arguments[0]), !a.length) return null;
            for (var n = [], u = [], c = 0; c < a.length; c++) {
              var y = new Uint8Array(a[c]), _ = l(y, "HEAPU8");
              n.push(_), u.push(y.byteLength);
            }
            return n = l(n, "HEAPU32"), u = l(u, "HEAPU32"), a = e.FontMgr._fromData(n, u, a.length), e._free(n), e._free(u), a;
          }, e.Typeface.MakeFreeTypeFaceFromData = function(a) {
            a = new Uint8Array(a);
            var n = l(a, "HEAPU8");
            return (a = e.Typeface._MakeFreeTypeFaceFromData(n, a.byteLength)) ? a : null;
          }, e.Typeface.prototype.getGlyphIDs = function(a, n, u) {
            n || (n = a.length);
            var c = le(a) + 1, y = e._malloc(c);
            return se(a, G, y, c), a = e._malloc(2 * n), n = this._getGlyphIDs(y, c - 1, n, a), e._free(y), 0 > n ? (e._free(a), null) : (y = new Uint16Array(e.HEAPU8.buffer, a, n), u ? (u.set(y), e._free(a), u) : (u = Uint16Array.from(y), e._free(a), u));
          }, e.TextBlob.MakeOnPath = function(a, n, u, c) {
            if (a && a.length && n && n.countPoints()) {
              if (n.countPoints() === 1) return this.MakeFromText(a, u);
              c || (c = 0);
              var y = u.getGlyphIDs(a);
              y = u.getGlyphWidths(y);
              var _ = [];
              n = new e.ContourMeasureIter(n, false, 1);
              for (var C = n.next(), F = new Float32Array(4), D = 0; D < a.length && C; D++) {
                var I = y[D];
                if (c += I / 2, c > C.length()) {
                  if (C.delete(), C = n.next(), !C) {
                    a = a.substring(0, D);
                    break;
                  }
                  c = I / 2;
                }
                C.getPosTan(c, F);
                var $ = F[2], V = F[3];
                _.push($, V, F[0] - I / 2 * $, F[1] - I / 2 * V), c += I / 2;
              }
              return a = this.MakeFromRSXform(a, _, u), C && C.delete(), n.delete(), a;
            }
          }, e.TextBlob.MakeFromRSXform = function(a, n, u) {
            var c = le(a) + 1, y = e._malloc(c);
            return se(a, G, y, c), a = l(n, "HEAPF32"), u = e.TextBlob._MakeFromRSXform(y, c - 1, a, u), e._free(y), u || null;
          }, e.TextBlob.MakeFromRSXformGlyphs = function(a, n, u) {
            var c = l(a, "HEAPU16");
            return n = l(n, "HEAPF32"), u = e.TextBlob._MakeFromRSXformGlyphs(c, 2 * a.length, n, u), s(c, a), u || null;
          }, e.TextBlob.MakeFromGlyphs = function(a, n) {
            var u = l(a, "HEAPU16");
            return n = e.TextBlob._MakeFromGlyphs(u, 2 * a.length, n), s(u, a), n || null;
          }, e.TextBlob.MakeFromText = function(a, n) {
            var u = le(a) + 1, c = e._malloc(u);
            return se(a, G, c, u), a = e.TextBlob._MakeFromText(c, u - 1, n), e._free(c), a || null;
          }, e.MallocGlyphIDs = function(a) {
            return e.Malloc(Uint16Array, a);
          };
        }), e.Id = e.Id || [], e.Id.push(function() {
          e.MakePicture = function(a) {
            a = new Uint8Array(a);
            var n = e._malloc(a.byteLength);
            return e.HEAPU8.set(a, n), (a = e._MakePicture(n, a.byteLength)) ? a : null;
          };
        }), e.Id = e.Id || [], e.Id.push(function() {
          e.RuntimeEffect.Make = function(a, n) {
            return e.RuntimeEffect._Make(a, { onError: n || function(u) {
              console.log("RuntimeEffect error", u);
            } });
          }, e.RuntimeEffect.MakeForBlender = function(a, n) {
            return e.RuntimeEffect._MakeForBlender(a, { onError: n || function(u) {
              console.log("RuntimeEffect error", u);
            } });
          }, e.RuntimeEffect.prototype.makeShader = function(a, n) {
            var u = !a._ck, c = l(a, "HEAPF32");
            return n = h(n), this._makeShader(c, 4 * a.length, u, n);
          }, e.RuntimeEffect.prototype.makeShaderWithChildren = function(a, n, u) {
            var c = !a._ck, y = l(a, "HEAPF32");
            u = h(u);
            for (var _ = [], C = 0; C < n.length; C++) _.push(n[C].Dd.Hd);
            return n = l(_, "HEAPU32"), this._makeShaderWithChildren(y, 4 * a.length, c, n, _.length, u);
          }, e.RuntimeEffect.prototype.makeBlender = function(a) {
            var n = !a._ck, u = l(a, "HEAPF32");
            return this._makeBlender(u, 4 * a.length, n);
          };
        });
      }(m);
      var Qt = Object.assign({}, m), wt = "./this.program", Zt = typeof window == "object", Oe = typeof importScripts == "function", zt = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", z = "", Tt, tt, rt;
      if (zt) {
        var qt = Qr("fs"), Ft = Qr("path");
        z = Oe ? Ft.dirname(z) + "/" : __dirname + "/", Tt = (e, t) => (e = e.startsWith("file://") ? new URL(e) : Ft.normalize(e), qt.readFileSync(e, t ? void 0 : "utf8")), rt = (e) => (e = Tt(e, true), e.buffer || (e = new Uint8Array(e)), e), tt = (e, t, r, i = true) => {
          e = e.startsWith("file://") ? new URL(e) : Ft.normalize(e), qt.readFile(e, i ? void 0 : "utf8", (o, s) => {
            o ? r(o) : t(i ? s.buffer : s);
          });
        }, !m.thisProgram && 1 < process.argv.length && (wt = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), m.inspect = () => "[Emscripten Module object]";
      } else (Zt || Oe) && (Oe ? z = self.location.href : typeof document < "u" && document.currentScript && (z = document.currentScript.src), ae && (z = ae), z.indexOf("blob:") !== 0 ? z = z.substr(0, z.replace(/[?#].*/, "").lastIndexOf("/") + 1) : z = "", Tt = (e) => {
        var t = new XMLHttpRequest();
        return t.open("GET", e, false), t.send(null), t.responseText;
      }, Oe && (rt = (e) => {
        var t = new XMLHttpRequest();
        return t.open("GET", e, false), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
      }), tt = (e, t, r) => {
        var i = new XMLHttpRequest();
        i.open("GET", e, true), i.responseType = "arraybuffer", i.onload = () => {
          i.status == 200 || i.status == 0 && i.response ? t(i.response) : r();
        }, i.onerror = r, i.send(null);
      });
      var qr = m.print || console.log.bind(console), Ae = m.printErr || console.error.bind(console);
      Object.assign(m, Qt), Qt = null, m.thisProgram && (wt = m.thisProgram);
      var je;
      m.wasmBinary && (je = m.wasmBinary);
      var Qn = m.noExitRuntime || true;
      typeof WebAssembly != "object" && Rt("no native wasm support detected");
      var nt, b, er = false, pe, G, Ee, Be, w, O, R, tr;
      function rr() {
        var e = nt.buffer;
        m.HEAP8 = pe = new Int8Array(e), m.HEAP16 = Ee = new Int16Array(e), m.HEAP32 = w = new Int32Array(e), m.HEAPU8 = G = new Uint8Array(e), m.HEAPU16 = Be = new Uint16Array(e), m.HEAPU32 = O = new Uint32Array(e), m.HEAPF32 = R = new Float32Array(e), m.HEAPF64 = tr = new Float64Array(e);
      }
      var Q, nr = [], ir = [], or = [];
      function en() {
        var e = m.preRun.shift();
        nr.unshift(e);
      }
      var Me = 0, Mt = null, We = null;
      function Rt(e) {
        throw m.onAbort && m.onAbort(e), e = "Aborted(" + e + ")", Ae(e), er = true, e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info."), et(e), e;
      }
      function ar(e) {
        return e.startsWith("data:application/octet-stream;base64,");
      }
      var Ge;
      if (Ge = "canvaskit.wasm", !ar(Ge)) {
        var ur = Ge;
        Ge = m.locateFile ? m.locateFile(ur, z) : z + ur;
      }
      function sr(e) {
        if (e == Ge && je) return new Uint8Array(je);
        if (rt) return rt(e);
        throw "both async and sync fetching of the wasm failed";
      }
      function tn(e) {
        if (!je && (Zt || Oe)) {
          if (typeof fetch == "function" && !e.startsWith("file://")) return fetch(e, { credentials: "same-origin" }).then((t) => {
            if (!t.ok) throw "failed to load wasm binary file at '" + e + "'";
            return t.arrayBuffer();
          }).catch(() => sr(e));
          if (tt) return new Promise((t, r) => {
            tt(e, (i) => t(new Uint8Array(i)), r);
          });
        }
        return Promise.resolve().then(() => sr(e));
      }
      function lr(e, t, r) {
        return tn(e).then((i) => WebAssembly.instantiate(i, t)).then((i) => i).then(r, (i) => {
          Ae("failed to asynchronously prepare wasm: " + i), Rt(i);
        });
      }
      function rn(e, t) {
        var r = Ge;
        return je || typeof WebAssembly.instantiateStreaming != "function" || ar(r) || r.startsWith("file://") || zt || typeof fetch != "function" ? lr(r, e, t) : fetch(r, { credentials: "same-origin" }).then((i) => WebAssembly.instantiateStreaming(i, e).then(t, function(o) {
          return Ae("wasm streaming compile failed: " + o), Ae("falling back to ArrayBuffer instantiation"), lr(r, e, t);
        }));
      }
      var xt = (e) => {
        for (; 0 < e.length; ) e.shift()(m);
      }, fr = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Re = (e, t, r) => {
        var i = t + r;
        for (r = t; e[r] && !(r >= i); ) ++r;
        if (16 < r - t && e.buffer && fr) return fr.decode(e.subarray(t, r));
        for (i = ""; t < r; ) {
          var o = e[t++];
          if (o & 128) {
            var s = e[t++] & 63;
            if ((o & 224) == 192) i += String.fromCharCode((o & 31) << 6 | s);
            else {
              var l = e[t++] & 63;
              o = (o & 240) == 224 ? (o & 15) << 12 | s << 6 | l : (o & 7) << 18 | s << 12 | l << 6 | e[t++] & 63, 65536 > o ? i += String.fromCharCode(o) : (o -= 65536, i += String.fromCharCode(55296 | o >> 10, 56320 | o & 1023));
            }
          } else i += String.fromCharCode(o);
        }
        return i;
      }, it = {};
      function It(e) {
        for (; e.length; ) {
          var t = e.pop();
          e.pop()(t);
        }
      }
      function $e(e) {
        return this.fromWireType(w[e >> 2]);
      }
      var Le = {}, xe = {}, ot = {}, cr = void 0;
      function at(e) {
        throw new cr(e);
      }
      function ue(e, t, r) {
        function i(f) {
          f = r(f), f.length !== e.length && at("Mismatched type converter count");
          for (var h = 0; h < e.length; ++h) ye(e[h], f[h]);
        }
        e.forEach(function(f) {
          ot[f] = t;
        });
        var o = Array(t.length), s = [], l = 0;
        t.forEach((f, h) => {
          xe.hasOwnProperty(f) ? o[h] = xe[f] : (s.push(f), Le.hasOwnProperty(f) || (Le[f] = []), Le[f].push(() => {
            o[h] = xe[f], ++l, l === s.length && i(o);
          }));
        }), s.length === 0 && i(o);
      }
      function ut(e) {
        switch (e) {
          case 1:
            return 0;
          case 2:
            return 1;
          case 4:
            return 2;
          case 8:
            return 3;
          default:
            throw new TypeError(`Unknown type size: ${e}`);
        }
      }
      var dr = void 0;
      function S(e) {
        for (var t = ""; G[e]; ) t += dr[G[e++]];
        return t;
      }
      var be = void 0;
      function k(e) {
        throw new be(e);
      }
      function nn(e, t, r = {}) {
        var i = t.name;
        if (e || k(`type "${i}" must have a positive integer typeid pointer`), xe.hasOwnProperty(e)) {
          if (r.af) return;
          k(`Cannot register type '${i}' twice`);
        }
        xe[e] = t, delete ot[e], Le.hasOwnProperty(e) && (t = Le[e], delete Le[e], t.forEach((o) => o()));
      }
      function ye(e, t, r = {}) {
        if (!("argPackAdvance" in t)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
        nn(e, t, r);
      }
      function Dt(e) {
        k(e.Dd.Jd.Gd.name + " instance already deleted");
      }
      var Bt = false;
      function hr() {
      }
      function pr(e) {
        --e.count.value, e.count.value === 0 && (e.Ld ? e.Pd.Td(e.Ld) : e.Jd.Gd.Td(e.Hd));
      }
      function yr(e, t, r) {
        return t === r ? e : r.Md === void 0 ? null : (e = yr(e, t, r.Md), e === null ? null : r.Te(e));
      }
      var vr = {}, Se = [];
      function Gt() {
        for (; Se.length; ) {
          var e = Se.pop();
          e.Dd.$d = false, e.delete();
        }
      }
      var Ve = void 0, Ne = {};
      function on(e, t) {
        for (t === void 0 && k("ptr should not be undefined"); e.Md; ) t = e.ge(t), e = e.Md;
        return Ne[t];
      }
      function st(e, t) {
        return t.Jd && t.Hd || at("makeClassHandle requires ptr and ptrType"), !!t.Pd != !!t.Ld && at("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, Ye(Object.create(e, { Dd: { value: t } }));
      }
      function Ye(e) {
        return typeof FinalizationRegistry > "u" ? (Ye = (t) => t, e) : (Bt = new FinalizationRegistry((t) => {
          pr(t.Dd);
        }), Ye = (t) => {
          var r = t.Dd;
          return r.Ld && Bt.register(t, { Dd: r }, t), t;
        }, hr = (t) => {
          Bt.unregister(t);
        }, Ye(e));
      }
      function we() {
      }
      function mr(e) {
        if (e === void 0) return "_unknown";
        e = e.replace(/[^a-zA-Z0-9_]/g, "$");
        var t = e.charCodeAt(0);
        return 48 <= t && 57 >= t ? `_${e}` : e;
      }
      function Lt(e, t) {
        return e = mr(e), { [e]: function() {
          return t.apply(this, arguments);
        } }[e];
      }
      function bt(e, t, r) {
        if (e[t].Kd === void 0) {
          var i = e[t];
          e[t] = function() {
            return e[t].Kd.hasOwnProperty(arguments.length) || k(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].Kd})!`), e[t].Kd[arguments.length].apply(this, arguments);
          }, e[t].Kd = [], e[t].Kd[i.Yd] = i;
        }
      }
      function kt(e, t, r) {
        m.hasOwnProperty(e) ? ((r === void 0 || m[e].Kd !== void 0 && m[e].Kd[r] !== void 0) && k(`Cannot register public name '${e}' twice`), bt(m, e, e), m.hasOwnProperty(r) && k(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), m[e].Kd[r] = t) : (m[e] = t, r !== void 0 && (m[e].sf = r));
      }
      function an(e, t, r, i, o, s, l, f) {
        this.name = e, this.constructor = t, this.ae = r, this.Td = i, this.Md = o, this.We = s, this.ge = l, this.Te = f, this.ef = [];
      }
      function Ht(e, t, r) {
        for (; t !== r; ) t.ge || k(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.ge(e), t = t.Md;
        return e;
      }
      function un(e, t) {
        return t === null ? (this.ue && k(`null is not a valid ${this.name}`), 0) : (t.Dd || k(`Cannot pass "${Ot(t)}" as a ${this.name}`), t.Dd.Hd || k(`Cannot pass deleted object as a pointer of type ${this.name}`), Ht(t.Dd.Hd, t.Dd.Jd.Gd, this.Gd));
      }
      function sn(e, t) {
        if (t === null) {
          if (this.ue && k(`null is not a valid ${this.name}`), this.le) {
            var r = this.ve();
            return e !== null && e.push(this.Td, r), r;
          }
          return 0;
        }
        if (t.Dd || k(`Cannot pass "${Ot(t)}" as a ${this.name}`), t.Dd.Hd || k(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.ke && t.Dd.Jd.ke && k(`Cannot convert argument of type ${t.Dd.Pd ? t.Dd.Pd.name : t.Dd.Jd.name} to parameter type ${this.name}`), r = Ht(t.Dd.Hd, t.Dd.Jd.Gd, this.Gd), this.le) switch (t.Dd.Ld === void 0 && k("Passing raw pointer to smart pointer is illegal"), this.kf) {
          case 0:
            t.Dd.Pd === this ? r = t.Dd.Ld : k(`Cannot convert argument of type ${t.Dd.Pd ? t.Dd.Pd.name : t.Dd.Jd.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.Dd.Ld;
            break;
          case 2:
            if (t.Dd.Pd === this) r = t.Dd.Ld;
            else {
              var i = t.clone();
              r = this.ff(r, te(function() {
                i.delete();
              })), e !== null && e.push(this.Td, r);
            }
            break;
          default:
            k("Unsupporting sharing policy");
        }
        return r;
      }
      function ln(e, t) {
        return t === null ? (this.ue && k(`null is not a valid ${this.name}`), 0) : (t.Dd || k(`Cannot pass "${Ot(t)}" as a ${this.name}`), t.Dd.Hd || k(`Cannot pass deleted object as a pointer of type ${this.name}`), t.Dd.Jd.ke && k(`Cannot convert argument of type ${t.Dd.Jd.name} to parameter type ${this.name}`), Ht(t.Dd.Hd, t.Dd.Jd.Gd, this.Gd));
      }
      function ve(e, t, r, i, o, s, l, f, h, g, P) {
        this.name = e, this.Gd = t, this.ue = r, this.ke = i, this.le = o, this.df = s, this.kf = l, this.Ee = f, this.ve = h, this.ff = g, this.Td = P, o || t.Md !== void 0 ? this.toWireType = sn : (this.toWireType = i ? un : ln, this.Od = null);
      }
      function _r(e, t, r) {
        m.hasOwnProperty(e) || at("Replacing nonexistant public symbol"), m[e].Kd !== void 0 && r !== void 0 ? m[e].Kd[r] = t : (m[e] = t, m[e].Yd = r);
      }
      var fn = (e, t) => {
        var r = [];
        return function() {
          if (r.length = 0, Object.assign(r, arguments), e.includes("j")) {
            var i = m["dynCall_" + e];
            i = r && r.length ? i.apply(null, [t].concat(r)) : i.call(null, t);
          } else i = Q.get(t).apply(null, r);
          return i;
        };
      };
      function K(e, t) {
        e = S(e);
        var r = e.includes("j") ? fn(e, t) : Q.get(t);
        return typeof r != "function" && k(`unknown function pointer with signature ${e}: ${t}`), r;
      }
      var gr = void 0;
      function Pr(e) {
        e = Wr(e);
        var t = S(e);
        return Pe(e), t;
      }
      function Xe(e, t) {
        function r(s) {
          o[s] || xe[s] || (ot[s] ? ot[s].forEach(r) : (i.push(s), o[s] = true));
        }
        var i = [], o = {};
        throw t.forEach(r), new gr(`${e}: ` + i.map(Pr).join([", "]));
      }
      function lt(e, t, r, i, o) {
        var s = t.length;
        2 > s && k("argTypes array size mismatch! Must at least get return value and 'this' types!");
        var l = t[1] !== null && r !== null, f = false;
        for (r = 1; r < t.length; ++r) if (t[r] !== null && t[r].Od === void 0) {
          f = true;
          break;
        }
        var h = t[0].name !== "void", g = s - 2, P = Array(g), E = [], T = [];
        return function() {
          if (arguments.length !== g && k(`function ${e} called with ${arguments.length} arguments, expected ${g} args!`), T.length = 0, E.length = l ? 2 : 1, E[0] = o, l) {
            var v = t[1].toWireType(T, this);
            E[1] = v;
          }
          for (var M = 0; M < g; ++M) P[M] = t[M + 2].toWireType(T, arguments[M]), E.push(P[M]);
          if (M = i.apply(null, E), f) It(T);
          else for (var x = l ? 1 : 2; x < t.length; x++) {
            var W = x === 1 ? v : P[x - 2];
            t[x].Od !== null && t[x].Od(W);
          }
          return v = h ? t[0].fromWireType(M) : void 0, v;
        };
      }
      function ft(e, t) {
        for (var r = [], i = 0; i < e; i++) r.push(O[t + 4 * i >> 2]);
        return r;
      }
      function Cr() {
        this.Sd = [void 0], this.Ce = [];
      }
      var q = new Cr();
      function Ut(e) {
        e >= q.be && --q.get(e).Fe === 0 && q.Je(e);
      }
      var ee = (e) => (e || k("Cannot use deleted val. handle = " + e), q.get(e).value), te = (e) => {
        switch (e) {
          case void 0:
            return 1;
          case null:
            return 2;
          case true:
            return 3;
          case false:
            return 4;
          default:
            return q.Ie({ Fe: 1, value: e });
        }
      };
      function cn(e, t, r) {
        switch (t) {
          case 0:
            return function(i) {
              return this.fromWireType((r ? pe : G)[i]);
            };
          case 1:
            return function(i) {
              return this.fromWireType((r ? Ee : Be)[i >> 1]);
            };
          case 2:
            return function(i) {
              return this.fromWireType((r ? w : O)[i >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + e);
        }
      }
      function Ke(e, t) {
        var r = xe[e];
        return r === void 0 && k(t + " has unknown type " + Pr(e)), r;
      }
      function Ot(e) {
        if (e === null) return "null";
        var t = typeof e;
        return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
      }
      function dn(e, t) {
        switch (t) {
          case 2:
            return function(r) {
              return this.fromWireType(R[r >> 2]);
            };
          case 3:
            return function(r) {
              return this.fromWireType(tr[r >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + e);
        }
      }
      function hn(e, t, r) {
        switch (t) {
          case 0:
            return r ? function(i) {
              return pe[i];
            } : function(i) {
              return G[i];
            };
          case 1:
            return r ? function(i) {
              return Ee[i >> 1];
            } : function(i) {
              return Be[i >> 1];
            };
          case 2:
            return r ? function(i) {
              return w[i >> 2];
            } : function(i) {
              return O[i >> 2];
            };
          default:
            throw new TypeError("Unknown integer type: " + e);
        }
      }
      var se = (e, t, r, i) => {
        if (!(0 < i)) return 0;
        var o = r;
        i = r + i - 1;
        for (var s = 0; s < e.length; ++s) {
          var l = e.charCodeAt(s);
          if (55296 <= l && 57343 >= l) {
            var f = e.charCodeAt(++s);
            l = 65536 + ((l & 1023) << 10) | f & 1023;
          }
          if (127 >= l) {
            if (r >= i) break;
            t[r++] = l;
          } else {
            if (2047 >= l) {
              if (r + 1 >= i) break;
              t[r++] = 192 | l >> 6;
            } else {
              if (65535 >= l) {
                if (r + 2 >= i) break;
                t[r++] = 224 | l >> 12;
              } else {
                if (r + 3 >= i) break;
                t[r++] = 240 | l >> 18, t[r++] = 128 | l >> 12 & 63;
              }
              t[r++] = 128 | l >> 6 & 63;
            }
            t[r++] = 128 | l & 63;
          }
        }
        return t[r] = 0, r - o;
      }, le = (e) => {
        for (var t = 0, r = 0; r < e.length; ++r) {
          var i = e.charCodeAt(r);
          127 >= i ? t++ : 2047 >= i ? t += 2 : 55296 <= i && 57343 >= i ? (t += 4, ++r) : t += 3;
        }
        return t;
      }, Ar = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, pn = (e, t) => {
        for (var r = e >> 1, i = r + t / 2; !(r >= i) && Be[r]; ) ++r;
        if (r <<= 1, 32 < r - e && Ar) return Ar.decode(G.subarray(e, r));
        for (r = "", i = 0; !(i >= t / 2); ++i) {
          var o = Ee[e + 2 * i >> 1];
          if (o == 0) break;
          r += String.fromCharCode(o);
        }
        return r;
      }, yn = (e, t, r) => {
        if (r === void 0 && (r = 2147483647), 2 > r) return 0;
        r -= 2;
        var i = t;
        r = r < 2 * e.length ? r / 2 : e.length;
        for (var o = 0; o < r; ++o) Ee[t >> 1] = e.charCodeAt(o), t += 2;
        return Ee[t >> 1] = 0, t - i;
      }, vn = (e) => 2 * e.length, mn = (e, t) => {
        for (var r = 0, i = ""; !(r >= t / 4); ) {
          var o = w[e + 4 * r >> 2];
          if (o == 0) break;
          ++r, 65536 <= o ? (o -= 65536, i += String.fromCharCode(55296 | o >> 10, 56320 | o & 1023)) : i += String.fromCharCode(o);
        }
        return i;
      }, _n = (e, t, r) => {
        if (r === void 0 && (r = 2147483647), 4 > r) return 0;
        var i = t;
        r = i + r - 4;
        for (var o = 0; o < e.length; ++o) {
          var s = e.charCodeAt(o);
          if (55296 <= s && 57343 >= s) {
            var l = e.charCodeAt(++o);
            s = 65536 + ((s & 1023) << 10) | l & 1023;
          }
          if (w[t >> 2] = s, t += 4, t + 4 > r) break;
        }
        return w[t >> 2] = 0, t - i;
      }, gn = (e) => {
        for (var t = 0, r = 0; r < e.length; ++r) {
          var i = e.charCodeAt(r);
          55296 <= i && 57343 >= i && ++r, t += 4;
        }
        return t;
      }, Pn = {};
      function ct(e) {
        var t = Pn[e];
        return t === void 0 ? S(e) : t;
      }
      var dt = [];
      function Er() {
        function e(t) {
          t.$$$embind_global$$$ = t;
          var r = typeof $$$embind_global$$$ == "object" && t.$$$embind_global$$$ == t;
          return r || delete t.$$$embind_global$$$, r;
        }
        if (typeof globalThis == "object") return globalThis;
        if (typeof $$$embind_global$$$ == "object" || (typeof global == "object" && e(global) ? $$$embind_global$$$ = global : typeof self == "object" && e(self) && ($$$embind_global$$$ = self), typeof $$$embind_global$$$ == "object")) return $$$embind_global$$$;
        throw Error("unable to get global object.");
      }
      function Cn(e) {
        var t = dt.length;
        return dt.push(e), t;
      }
      function An(e, t) {
        for (var r = Array(e), i = 0; i < e; ++i) r[i] = Ke(O[t + 4 * i >> 2], "parameter " + i);
        return r;
      }
      var wr = [];
      function En(e) {
        var t = Array(e + 1);
        return function(r, i, o) {
          t[0] = r;
          for (var s = 0; s < e; ++s) {
            var l = Ke(O[i + 4 * s >> 2], "parameter " + s);
            t[s + 1] = l.readValueFromPointer(o), o += l.argPackAdvance;
          }
          return r = new (r.bind.apply(r, t))(), te(r);
        };
      }
      var Tr = {};
      function wn(e) {
        var t = e.getExtension("ANGLE_instanced_arrays");
        t && (e.vertexAttribDivisor = function(r, i) {
          t.vertexAttribDivisorANGLE(r, i);
        }, e.drawArraysInstanced = function(r, i, o, s) {
          t.drawArraysInstancedANGLE(r, i, o, s);
        }, e.drawElementsInstanced = function(r, i, o, s, l) {
          t.drawElementsInstancedANGLE(r, i, o, s, l);
        });
      }
      function Tn(e) {
        var t = e.getExtension("OES_vertex_array_object");
        t && (e.createVertexArray = function() {
          return t.createVertexArrayOES();
        }, e.deleteVertexArray = function(r) {
          t.deleteVertexArrayOES(r);
        }, e.bindVertexArray = function(r) {
          t.bindVertexArrayOES(r);
        }, e.isVertexArray = function(r) {
          return t.isVertexArrayOES(r);
        });
      }
      function Fn(e) {
        var t = e.getExtension("WEBGL_draw_buffers");
        t && (e.drawBuffers = function(r, i) {
          t.drawBuffersWEBGL(r, i);
        });
      }
      var Fr = 1, ht = [], fe = [], pt = [], Je = [], re = [], ce = [], yt = [], me = [], Ie = [], De = [], Mr = {}, Rr = {}, xr = 4;
      function j(e) {
        vt || (vt = e);
      }
      function ke(e) {
        for (var t = Fr++, r = e.length; r < t; r++) e[r] = null;
        return t;
      }
      function Mn(e, t) {
        e.be || (e.be = e.getContext, e.getContext = function(i, o) {
          return o = e.be(i, o), i == "webgl" == o instanceof WebGLRenderingContext ? o : null;
        });
        var r = 1 < t.majorVersion ? e.getContext("webgl2", t) : e.getContext("webgl", t);
        return r ? Rn(r, t) : 0;
      }
      function Rn(e, t) {
        var r = ke(me), i = { handle: r, attributes: t, version: t.majorVersion, Qd: e };
        return e.canvas && (e.canvas.Ke = i), me[r] = i, (typeof t.Ue > "u" || t.Ue) && xn(i), r;
      }
      function Ir(e) {
        return B = me[e], m.qf = p = B && B.Qd, !(e && !p);
      }
      function xn(e) {
        if (e || (e = B), !e.bf) {
          e.bf = true;
          var t = e.Qd;
          wn(t), Tn(t), Fn(t), t.ze = t.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"), t.De = t.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"), 2 <= e.version && (t.Ae = t.getExtension("EXT_disjoint_timer_query_webgl2")), (2 > e.version || !t.Ae) && (t.Ae = t.getExtension("EXT_disjoint_timer_query")), t.rf = t.getExtension("WEBGL_multi_draw"), (t.getSupportedExtensions() || []).forEach(function(r) {
            r.includes("lose_context") || r.includes("debug") || t.getExtension(r);
          });
        }
      }
      var B, vt, jt = {}, Dr = () => {
        if (!Wt) {
          var e = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: wt || "./this.program" }, t;
          for (t in jt) jt[t] === void 0 ? delete e[t] : e[t] = jt[t];
          var r = [];
          for (t in e) r.push(`${t}=${e[t]}`);
          Wt = r;
        }
        return Wt;
      }, Wt, In = [null, [], []];
      function Br(e) {
        p.bindVertexArray(yt[e]);
      }
      function Gr(e, t) {
        for (var r = 0; r < e; r++) {
          var i = w[t + 4 * r >> 2];
          p.deleteVertexArray(yt[i]), yt[i] = null;
        }
      }
      var mt = [];
      function Lr(e, t, r, i) {
        p.drawElements(e, t, r, i);
      }
      function He(e, t, r, i) {
        for (var o = 0; o < e; o++) {
          var s = p[r](), l = s && ke(i);
          s ? (s.name = l, i[l] = s) : j(1282), w[t + 4 * o >> 2] = l;
        }
      }
      function br(e, t) {
        He(e, t, "createVertexArray", yt);
      }
      function kr(e, t, r) {
        if (t) {
          var i = void 0;
          switch (e) {
            case 36346:
              i = 1;
              break;
            case 36344:
              r != 0 && r != 1 && j(1280);
              return;
            case 34814:
            case 36345:
              i = 0;
              break;
            case 34466:
              var o = p.getParameter(34467);
              i = o ? o.length : 0;
              break;
            case 33309:
              if (2 > B.version) {
                j(1282);
                return;
              }
              i = 2 * (p.getSupportedExtensions() || []).length;
              break;
            case 33307:
            case 33308:
              if (2 > B.version) {
                j(1280);
                return;
              }
              i = e == 33307 ? 3 : 0;
          }
          if (i === void 0) switch (o = p.getParameter(e), typeof o) {
            case "number":
              i = o;
              break;
            case "boolean":
              i = o ? 1 : 0;
              break;
            case "string":
              j(1280);
              return;
            case "object":
              if (o === null) switch (e) {
                case 34964:
                case 35725:
                case 34965:
                case 36006:
                case 36007:
                case 32873:
                case 34229:
                case 36662:
                case 36663:
                case 35053:
                case 35055:
                case 36010:
                case 35097:
                case 35869:
                case 32874:
                case 36389:
                case 35983:
                case 35368:
                case 34068:
                  i = 0;
                  break;
                default:
                  j(1280);
                  return;
              }
              else {
                if (o instanceof Float32Array || o instanceof Uint32Array || o instanceof Int32Array || o instanceof Array) {
                  for (e = 0; e < o.length; ++e) switch (r) {
                    case 0:
                      w[t + 4 * e >> 2] = o[e];
                      break;
                    case 2:
                      R[t + 4 * e >> 2] = o[e];
                      break;
                    case 4:
                      pe[t + e >> 0] = o[e] ? 1 : 0;
                  }
                  return;
                }
                try {
                  i = o.name | 0;
                } catch (s) {
                  j(1280), Ae("GL_INVALID_ENUM in glGet" + r + "v: Unknown object returned from WebGL getParameter(" + e + ")! (error: " + s + ")");
                  return;
                }
              }
              break;
            default:
              j(1280), Ae("GL_INVALID_ENUM in glGet" + r + "v: Native code calling glGet" + r + "v(" + e + ") and it returns " + o + " of type " + typeof o + "!");
              return;
          }
          switch (r) {
            case 1:
              r = i, O[t >> 2] = r, O[t + 4 >> 2] = (r - O[t >> 2]) / 4294967296;
              break;
            case 0:
              w[t >> 2] = i;
              break;
            case 2:
              R[t >> 2] = i;
              break;
            case 4:
              pe[t >> 0] = i ? 1 : 0;
          }
        } else j(1281);
      }
      var Qe = (e) => {
        var t = le(e) + 1, r = Ct(t);
        return r && se(e, G, r, t), r;
      };
      function Hr(e) {
        return e.slice(-1) == "]" && e.lastIndexOf("[");
      }
      function _t(e) {
        return e -= 5120, e == 0 ? pe : e == 1 ? G : e == 2 ? Ee : e == 4 ? w : e == 6 ? R : e == 5 || e == 28922 || e == 28520 || e == 30779 || e == 30782 ? O : Be;
      }
      function $t(e, t, r, i, o) {
        e = _t(e);
        var s = 31 - Math.clz32(e.BYTES_PER_ELEMENT), l = xr;
        return e.subarray(o >> s, o + i * (r * ({ 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }[t - 6402] || 1) * (1 << s) + l - 1 & -l) >> s);
      }
      function H(e) {
        var t = p.Re;
        if (t) {
          var r = t.fe[e];
          return typeof r == "number" && (t.fe[e] = r = p.getUniformLocation(t, t.Ge[e] + (0 < r ? "[" + r + "]" : ""))), r;
        }
        j(1282);
      }
      var Te = [], Ze = [], gt = (e) => e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0), Ur = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Or = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function Dn(e) {
        var t = Array(le(e) + 1);
        return se(e, t, 0, t.length), t;
      }
      var Bn = (e, t, r, i) => {
        function o(v, M, x) {
          for (v = typeof v == "number" ? v.toString() : v || ""; v.length < M; ) v = x[0] + v;
          return v;
        }
        function s(v, M) {
          return o(v, M, "0");
        }
        function l(v, M) {
          function x(J) {
            return 0 > J ? -1 : 0 < J ? 1 : 0;
          }
          var W;
          return (W = x(v.getFullYear() - M.getFullYear())) === 0 && (W = x(v.getMonth() - M.getMonth())) === 0 && (W = x(v.getDate() - M.getDate())), W;
        }
        function f(v) {
          switch (v.getDay()) {
            case 0:
              return new Date(v.getFullYear() - 1, 11, 29);
            case 1:
              return v;
            case 2:
              return new Date(v.getFullYear(), 0, 3);
            case 3:
              return new Date(v.getFullYear(), 0, 2);
            case 4:
              return new Date(v.getFullYear(), 0, 1);
            case 5:
              return new Date(v.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(v.getFullYear() - 1, 11, 30);
          }
        }
        function h(v) {
          var M = v.Vd;
          for (v = new Date(new Date(v.Wd + 1900, 0, 1).getTime()); 0 < M; ) {
            var x = v.getMonth(), W = (gt(v.getFullYear()) ? Ur : Or)[x];
            if (M > W - v.getDate()) M -= W - v.getDate() + 1, v.setDate(1), 11 > x ? v.setMonth(x + 1) : (v.setMonth(0), v.setFullYear(v.getFullYear() + 1));
            else {
              v.setDate(v.getDate() + M);
              break;
            }
          }
          return x = new Date(v.getFullYear() + 1, 0, 4), M = f(new Date(v.getFullYear(), 0, 4)), x = f(x), 0 >= l(M, v) ? 0 >= l(x, v) ? v.getFullYear() + 1 : v.getFullYear() : v.getFullYear() - 1;
        }
        var g = w[i + 40 >> 2];
        i = { nf: w[i >> 2], mf: w[i + 4 >> 2], pe: w[i + 8 >> 2], we: w[i + 12 >> 2], qe: w[i + 16 >> 2], Wd: w[i + 20 >> 2], Rd: w[i + 24 >> 2], Vd: w[i + 28 >> 2], uf: w[i + 32 >> 2], lf: w[i + 36 >> 2], pf: g && g ? Re(G, g) : "" }, r = r ? Re(G, r) : "", g = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
        for (var P in g) r = r.replace(new RegExp(P, "g"), g[P]);
        var E = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), T = "January February March April May June July August September October November December".split(" ");
        g = { "%a": (v) => E[v.Rd].substring(0, 3), "%A": (v) => E[v.Rd], "%b": (v) => T[v.qe].substring(0, 3), "%B": (v) => T[v.qe], "%C": (v) => s((v.Wd + 1900) / 100 | 0, 2), "%d": (v) => s(v.we, 2), "%e": (v) => o(v.we, 2, " "), "%g": (v) => h(v).toString().substring(2), "%G": (v) => h(v), "%H": (v) => s(v.pe, 2), "%I": (v) => (v = v.pe, v == 0 ? v = 12 : 12 < v && (v -= 12), s(v, 2)), "%j": (v) => {
          for (var M = 0, x = 0; x <= v.qe - 1; M += (gt(v.Wd + 1900) ? Ur : Or)[x++]) ;
          return s(v.we + M, 3);
        }, "%m": (v) => s(v.qe + 1, 2), "%M": (v) => s(v.mf, 2), "%n": () => `
`, "%p": (v) => 0 <= v.pe && 12 > v.pe ? "AM" : "PM", "%S": (v) => s(v.nf, 2), "%t": () => "	", "%u": (v) => v.Rd || 7, "%U": (v) => s(Math.floor((v.Vd + 7 - v.Rd) / 7), 2), "%V": (v) => {
          var M = Math.floor((v.Vd + 7 - (v.Rd + 6) % 7) / 7);
          if (2 >= (v.Rd + 371 - v.Vd - 2) % 7 && M++, M) M == 53 && (x = (v.Rd + 371 - v.Vd) % 7, x == 4 || x == 3 && gt(v.Wd) || (M = 1));
          else {
            M = 52;
            var x = (v.Rd + 7 - v.Vd - 1) % 7;
            (x == 4 || x == 5 && gt(v.Wd % 400 - 1)) && M++;
          }
          return s(M, 2);
        }, "%w": (v) => v.Rd, "%W": (v) => s(Math.floor((v.Vd + 7 - (v.Rd + 6) % 7) / 7), 2), "%y": (v) => (v.Wd + 1900).toString().substring(2), "%Y": (v) => v.Wd + 1900, "%z": (v) => {
          v = v.lf;
          var M = 0 <= v;
          return v = Math.abs(v) / 60, (M ? "+" : "-") + String("0000" + (v / 60 * 100 + v % 60)).slice(-4);
        }, "%Z": (v) => v.pf, "%%": () => "%" }, r = r.replace(/%%/g, "\0\0");
        for (P in g) r.includes(P) && (r = r.replace(new RegExp(P, "g"), g[P](i)));
        return r = r.replace(/\0\0/g, "%"), P = Dn(r), P.length > t ? 0 : (pe.set(P, e), P.length - 1);
      };
      cr = m.InternalError = class extends Error {
        constructor(e) {
          super(e), this.name = "InternalError";
        }
      };
      for (var jr = Array(256), Pt = 0; 256 > Pt; ++Pt) jr[Pt] = String.fromCharCode(Pt);
      dr = jr, be = m.BindingError = class extends Error {
        constructor(e) {
          super(e), this.name = "BindingError";
        }
      }, we.prototype.isAliasOf = function(e) {
        if (!(this instanceof we && e instanceof we)) return false;
        var t = this.Dd.Jd.Gd, r = this.Dd.Hd, i = e.Dd.Jd.Gd;
        for (e = e.Dd.Hd; t.Md; ) r = t.ge(r), t = t.Md;
        for (; i.Md; ) e = i.ge(e), i = i.Md;
        return t === i && r === e;
      }, we.prototype.clone = function() {
        if (this.Dd.Hd || Dt(this), this.Dd.ee) return this.Dd.count.value += 1, this;
        var e = Ye, t = Object, r = t.create, i = Object.getPrototypeOf(this), o = this.Dd;
        return e = e(r.call(t, i, { Dd: { value: { count: o.count, $d: o.$d, ee: o.ee, Hd: o.Hd, Jd: o.Jd, Ld: o.Ld, Pd: o.Pd } } })), e.Dd.count.value += 1, e.Dd.$d = false, e;
      }, we.prototype.delete = function() {
        this.Dd.Hd || Dt(this), this.Dd.$d && !this.Dd.ee && k("Object already scheduled for deletion"), hr(this), pr(this.Dd), this.Dd.ee || (this.Dd.Ld = void 0, this.Dd.Hd = void 0);
      }, we.prototype.isDeleted = function() {
        return !this.Dd.Hd;
      }, we.prototype.deleteLater = function() {
        return this.Dd.Hd || Dt(this), this.Dd.$d && !this.Dd.ee && k("Object already scheduled for deletion"), Se.push(this), Se.length === 1 && Ve && Ve(Gt), this.Dd.$d = true, this;
      }, m.getInheritedInstanceCount = function() {
        return Object.keys(Ne).length;
      }, m.getLiveInheritedInstances = function() {
        var e = [], t;
        for (t in Ne) Ne.hasOwnProperty(t) && e.push(Ne[t]);
        return e;
      }, m.flushPendingDeletes = Gt, m.setDelayFunction = function(e) {
        Ve = e, Se.length && Ve && Ve(Gt);
      }, ve.prototype.Xe = function(e) {
        return this.Ee && (e = this.Ee(e)), e;
      }, ve.prototype.ye = function(e) {
        this.Td && this.Td(e);
      }, ve.prototype.argPackAdvance = 8, ve.prototype.readValueFromPointer = $e, ve.prototype.deleteObject = function(e) {
        e !== null && e.delete();
      }, ve.prototype.fromWireType = function(e) {
        function t() {
          return this.le ? st(this.Gd.ae, { Jd: this.df, Hd: r, Pd: this, Ld: e }) : st(this.Gd.ae, { Jd: this, Hd: e });
        }
        var r = this.Xe(e);
        if (!r) return this.ye(e), null;
        var i = on(this.Gd, r);
        if (i !== void 0) return i.Dd.count.value === 0 ? (i.Dd.Hd = r, i.Dd.Ld = e, i.clone()) : (i = i.clone(), this.ye(e), i);
        if (i = this.Gd.We(r), i = vr[i], !i) return t.call(this);
        i = this.ke ? i.Qe : i.pointerType;
        var o = yr(r, this.Gd, i.Gd);
        return o === null ? t.call(this) : this.le ? st(i.Gd.ae, { Jd: i, Hd: o, Pd: this, Ld: e }) : st(i.Gd.ae, { Jd: i, Hd: o });
      }, gr = m.UnboundTypeError = function(e, t) {
        var r = Lt(t, function(i) {
          this.name = t, this.message = i, i = Error(i).stack, i !== void 0 && (this.stack = this.toString() + `
` + i.replace(/^Error(:[^\n]*)?\n/, ""));
        });
        return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
          return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
        }, r;
      }(Error, "UnboundTypeError"), Object.assign(Cr.prototype, { get(e) {
        return this.Sd[e];
      }, has(e) {
        return this.Sd[e] !== void 0;
      }, Ie(e) {
        var t = this.Ce.pop() || this.Sd.length;
        return this.Sd[t] = e, t;
      }, Je(e) {
        this.Sd[e] = void 0, this.Ce.push(e);
      } }), q.Sd.push({ value: void 0 }, { value: null }, { value: true }, { value: false }), q.be = q.Sd.length, m.count_emval_handles = function() {
        for (var e = 0, t = q.be; t < q.Sd.length; ++t) q.Sd[t] !== void 0 && ++e;
        return e;
      };
      for (var p, Z = 0; 32 > Z; ++Z) mt.push(Array(Z));
      var Gn = new Float32Array(288);
      for (Z = 0; 288 > Z; ++Z) Te[Z] = Gn.subarray(0, Z + 1);
      var Ln = new Int32Array(288);
      for (Z = 0; 288 > Z; ++Z) Ze[Z] = Ln.subarray(0, Z + 1);
      var bn = { Q: function() {
        return 0;
      }, Ab: () => {
      }, Cb: function() {
        return 0;
      }, xb: () => {
      }, yb: () => {
      }, R: function() {
      }, zb: () => {
      }, v: function(e) {
        var t = it[e];
        delete it[e];
        var r = t.ve, i = t.Td, o = t.Be, s = o.map((l) => l.$e).concat(o.map((l) => l.hf));
        ue([e], s, (l) => {
          var f = {};
          return o.forEach((h, g) => {
            var P = l[g], E = h.Ye, T = h.Ze, v = l[g + o.length], M = h.gf, x = h.jf;
            f[h.Ve] = { read: (W) => P.fromWireType(E(T, W)), write: (W, J) => {
              var Y = [];
              M(x, W, v.toWireType(Y, J)), It(Y);
            } };
          }), [{ name: t.name, fromWireType: function(h) {
            var g = {}, P;
            for (P in f) g[P] = f[P].read(h);
            return i(h), g;
          }, toWireType: function(h, g) {
            for (var P in f) if (!(P in g)) throw new TypeError(`Missing field: "${P}"`);
            var E = r();
            for (P in f) f[P].write(E, g[P]);
            return h !== null && h.push(i, E), E;
          }, argPackAdvance: 8, readValueFromPointer: $e, Od: i }];
        });
      }, pb: function() {
      }, Gb: function(e, t, r, i, o) {
        var s = ut(r);
        t = S(t), ye(e, { name: t, fromWireType: function(l) {
          return !!l;
        }, toWireType: function(l, f) {
          return f ? i : o;
        }, argPackAdvance: 8, readValueFromPointer: function(l) {
          if (r === 1) var f = pe;
          else if (r === 2) f = Ee;
          else if (r === 4) f = w;
          else throw new TypeError("Unknown boolean type size: " + t);
          return this.fromWireType(f[l >> s]);
        }, Od: null });
      }, k: function(e, t, r, i, o, s, l, f, h, g, P, E, T) {
        P = S(P), s = K(o, s), f && (f = K(l, f)), g && (g = K(h, g)), T = K(E, T);
        var v = mr(P);
        kt(v, function() {
          Xe(`Cannot construct ${P} due to unbound types`, [i]);
        }), ue([e, t, r], i ? [i] : [], function(M) {
          if (M = M[0], i) var x = M.Gd, W = x.ae;
          else W = we.prototype;
          M = Lt(v, function() {
            if (Object.getPrototypeOf(this) !== J) throw new be("Use 'new' to construct " + P);
            if (Y.Ud === void 0) throw new be(P + " has no accessible constructor");
            var Ue = Y.Ud[arguments.length];
            if (Ue === void 0) throw new be(`Tried to invoke ctor of ${P} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(Y.Ud).toString()}) parameters instead!`);
            return Ue.apply(this, arguments);
          });
          var J = Object.create(W, { constructor: { value: M } });
          M.prototype = J;
          var Y = new an(P, M, J, T, x, s, f, g);
          Y.Md && (Y.Md.he === void 0 && (Y.Md.he = []), Y.Md.he.push(Y)), x = new ve(P, Y, true, false, false), W = new ve(P + "*", Y, false, false, false);
          var _e = new ve(P + " const*", Y, false, true, false);
          return vr[e] = { pointerType: W, Qe: _e }, _r(v, M), [x, W, _e];
        });
      }, f: function(e, t, r, i, o, s, l) {
        var f = ft(r, i);
        t = S(t), s = K(o, s), ue([], [e], function(h) {
          function g() {
            Xe(`Cannot call ${P} due to unbound types`, f);
          }
          h = h[0];
          var P = `${h.name}.${t}`;
          t.startsWith("@@") && (t = Symbol[t.substring(2)]);
          var E = h.Gd.constructor;
          return E[t] === void 0 ? (g.Yd = r - 1, E[t] = g) : (bt(E, t, P), E[t].Kd[r - 1] = g), ue([], f, function(T) {
            if (T = [T[0], null].concat(T.slice(1)), T = lt(P, T, null, s, l), E[t].Kd === void 0 ? (T.Yd = r - 1, E[t] = T) : E[t].Kd[r - 1] = T, h.Gd.he) for (let v of h.Gd.he) v.constructor.hasOwnProperty(t) || (v.constructor[t] = T);
            return [];
          }), [];
        });
      }, t: function(e, t, r, i, o, s) {
        var l = ft(t, r);
        o = K(i, o), ue([], [e], function(f) {
          f = f[0];
          var h = `constructor ${f.name}`;
          if (f.Gd.Ud === void 0 && (f.Gd.Ud = []), f.Gd.Ud[t - 1] !== void 0) throw new be(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${f.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
          return f.Gd.Ud[t - 1] = () => {
            Xe(`Cannot construct ${f.name} due to unbound types`, l);
          }, ue([], l, function(g) {
            return g.splice(1, 0, null), f.Gd.Ud[t - 1] = lt(h, g, null, o, s), [];
          }), [];
        });
      }, b: function(e, t, r, i, o, s, l, f) {
        var h = ft(r, i);
        t = S(t), s = K(o, s), ue([], [e], function(g) {
          function P() {
            Xe(`Cannot call ${E} due to unbound types`, h);
          }
          g = g[0];
          var E = `${g.name}.${t}`;
          t.startsWith("@@") && (t = Symbol[t.substring(2)]), f && g.Gd.ef.push(t);
          var T = g.Gd.ae, v = T[t];
          return v === void 0 || v.Kd === void 0 && v.className !== g.name && v.Yd === r - 2 ? (P.Yd = r - 2, P.className = g.name, T[t] = P) : (bt(T, t, E), T[t].Kd[r - 2] = P), ue([], h, function(M) {
            return M = lt(E, M, g, s, l), T[t].Kd === void 0 ? (M.Yd = r - 2, T[t] = M) : T[t].Kd[r - 2] = M, [];
          }), [];
        });
      }, o: function(e, t, r) {
        e = S(e), ue([], [t], function(i) {
          return i = i[0], m[e] = i.fromWireType(r), [];
        });
      }, Fb: function(e, t) {
        t = S(t), ye(e, { name: t, fromWireType: function(r) {
          var i = ee(r);
          return Ut(r), i;
        }, toWireType: function(r, i) {
          return te(i);
        }, argPackAdvance: 8, readValueFromPointer: $e, Od: null });
      }, j: function(e, t, r, i) {
        function o() {
        }
        r = ut(r), t = S(t), o.values = {}, ye(e, { name: t, constructor: o, fromWireType: function(s) {
          return this.constructor.values[s];
        }, toWireType: function(s, l) {
          return l.value;
        }, argPackAdvance: 8, readValueFromPointer: cn(t, r, i), Od: null }), kt(t, o);
      }, c: function(e, t, r) {
        var i = Ke(e, "enum");
        t = S(t), e = i.constructor, i = Object.create(i.constructor.prototype, { value: { value: r }, constructor: { value: Lt(`${i.name}_${t}`, function() {
        }) } }), e.values[r] = i, e[t] = i;
      }, T: function(e, t, r) {
        r = ut(r), t = S(t), ye(e, { name: t, fromWireType: function(i) {
          return i;
        }, toWireType: function(i, o) {
          return o;
        }, argPackAdvance: 8, readValueFromPointer: dn(t, r), Od: null });
      }, r: function(e, t, r, i, o, s) {
        var l = ft(t, r);
        e = S(e), o = K(i, o), kt(e, function() {
          Xe(`Cannot call ${e} due to unbound types`, l);
        }, t - 1), ue([], l, function(f) {
          return f = [f[0], null].concat(f.slice(1)), _r(e, lt(e, f, null, o, s), t - 1), [];
        });
      }, x: function(e, t, r, i, o) {
        t = S(t), o === -1 && (o = 4294967295), o = ut(r);
        var s = (f) => f;
        if (i === 0) {
          var l = 32 - 8 * r;
          s = (f) => f << l >>> l;
        }
        r = t.includes("unsigned") ? function(f, h) {
          return h >>> 0;
        } : function(f, h) {
          return h;
        }, ye(e, { name: t, fromWireType: s, toWireType: r, argPackAdvance: 8, readValueFromPointer: hn(t, o, i !== 0), Od: null });
      }, n: function(e, t, r) {
        function i(s) {
          s >>= 2;
          var l = O;
          return new o(l.buffer, l[s + 1], l[s]);
        }
        var o = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][t];
        r = S(r), ye(e, { name: r, fromWireType: i, argPackAdvance: 8, readValueFromPointer: i }, { af: true });
      }, m: function(e, t, r, i, o, s, l, f, h, g, P, E) {
        r = S(r), s = K(o, s), f = K(l, f), g = K(h, g), E = K(P, E), ue([e], [t], function(T) {
          return T = T[0], [new ve(r, T.Gd, false, false, true, T, i, s, f, g, E)];
        });
      }, S: function(e, t) {
        t = S(t);
        var r = t === "std::string";
        ye(e, { name: t, fromWireType: function(i) {
          var o = O[i >> 2], s = i + 4;
          if (r) for (var l = s, f = 0; f <= o; ++f) {
            var h = s + f;
            if (f == o || G[h] == 0) {
              if (l = l ? Re(G, l, h - l) : "", g === void 0) var g = l;
              else g += String.fromCharCode(0), g += l;
              l = h + 1;
            }
          }
          else {
            for (g = Array(o), f = 0; f < o; ++f) g[f] = String.fromCharCode(G[s + f]);
            g = g.join("");
          }
          return Pe(i), g;
        }, toWireType: function(i, o) {
          o instanceof ArrayBuffer && (o = new Uint8Array(o));
          var s = typeof o == "string";
          s || o instanceof Uint8Array || o instanceof Uint8ClampedArray || o instanceof Int8Array || k("Cannot pass non-string to std::string");
          var l = r && s ? le(o) : o.length, f = Ct(4 + l + 1), h = f + 4;
          if (O[f >> 2] = l, r && s) se(o, G, h, l + 1);
          else if (s) for (s = 0; s < l; ++s) {
            var g = o.charCodeAt(s);
            255 < g && (Pe(h), k("String has UTF-16 code units that do not fit in 8 bits")), G[h + s] = g;
          }
          else for (s = 0; s < l; ++s) G[h + s] = o[s];
          return i !== null && i.push(Pe, f), f;
        }, argPackAdvance: 8, readValueFromPointer: $e, Od: function(i) {
          Pe(i);
        } });
      }, K: function(e, t, r) {
        if (r = S(r), t === 2) var i = pn, o = yn, s = vn, l = () => Be, f = 1;
        else t === 4 && (i = mn, o = _n, s = gn, l = () => O, f = 2);
        ye(e, { name: r, fromWireType: function(h) {
          for (var g = O[h >> 2], P = l(), E, T = h + 4, v = 0; v <= g; ++v) {
            var M = h + 4 + v * t;
            (v == g || P[M >> f] == 0) && (T = i(T, M - T), E === void 0 ? E = T : (E += String.fromCharCode(0), E += T), T = M + t);
          }
          return Pe(h), E;
        }, toWireType: function(h, g) {
          typeof g != "string" && k(`Cannot pass non-string to C++ string type ${r}`);
          var P = s(g), E = Ct(4 + P + t);
          return O[E >> 2] = P >> f, o(g, E + 4, P + t), h !== null && h.push(Pe, E), E;
        }, argPackAdvance: 8, readValueFromPointer: $e, Od: function(h) {
          Pe(h);
        } });
      }, w: function(e, t, r, i, o, s) {
        it[e] = { name: S(t), ve: K(r, i), Td: K(o, s), Be: [] };
      }, e: function(e, t, r, i, o, s, l, f, h, g) {
        it[e].Be.push({ Ve: S(t), $e: r, Ye: K(i, o), Ze: s, hf: l, gf: K(f, h), jf: g });
      }, Hb: function(e, t) {
        t = S(t), ye(e, { cf: true, name: t, argPackAdvance: 0, fromWireType: function() {
        }, toWireType: function() {
        } });
      }, Eb: () => true, tb: () => {
        throw 1 / 0;
      }, y: function(e, t, r) {
        e = ee(e), t = Ke(t, "emval::as");
        var i = [], o = te(i);
        return O[r >> 2] = o, t.toWireType(i, e);
      }, Y: function(e, t, r, i, o) {
        e = dt[e], t = ee(t), r = ct(r);
        var s = [];
        return O[i >> 2] = te(s), e(t, r, s, o);
      }, q: function(e, t, r, i) {
        e = dt[e], t = ee(t), r = ct(r), e(t, r, null, i);
      }, d: Ut, H: function(e) {
        return e === 0 ? te(Er()) : (e = ct(e), te(Er()[e]));
      }, p: function(e, t) {
        var r = An(e, t), i = r[0];
        t = i.name + "_$" + r.slice(1).map(function(l) {
          return l.name;
        }).join("_") + "$";
        var o = wr[t];
        if (o !== void 0) return o;
        var s = Array(e - 1);
        return o = Cn((l, f, h, g) => {
          for (var P = 0, E = 0; E < e - 1; ++E) s[E] = r[E + 1].readValueFromPointer(g + P), P += r[E + 1].argPackAdvance;
          for (l = l[f].apply(l, s), E = 0; E < e - 1; ++E) r[E + 1].Se && r[E + 1].Se(s[E]);
          if (!i.cf) return i.toWireType(h, l);
        }), wr[t] = o;
      }, s: function(e, t) {
        return e = ee(e), t = ee(t), te(e[t]);
      }, l: function(e) {
        4 < e && (q.get(e).Fe += 1);
      }, G: function(e, t, r, i) {
        e = ee(e);
        var o = Tr[t];
        return o || (o = En(t), Tr[t] = o), o(e, r, i);
      }, C: function() {
        return te([]);
      }, g: function(e) {
        return te(ct(e));
      }, z: function() {
        return te({});
      }, jb: function(e) {
        return e = ee(e), !e;
      }, u: function(e) {
        var t = ee(e);
        It(t), Ut(e);
      }, i: function(e, t, r) {
        e = ee(e), t = ee(t), r = ee(r), e[t] = r;
      }, h: function(e, t) {
        return e = Ke(e, "_emval_take_value"), e = e.readValueFromPointer(t), te(e);
      }, mb: function() {
        return -52;
      }, nb: function() {
      }, a: () => {
        Rt("");
      }, Db: () => performance.now(), ub: (e) => {
        var t = G.length;
        if (e >>>= 0, 2147483648 < e) return false;
        for (var r = 1; 4 >= r; r *= 2) {
          var i = t * (1 + 0.2 / r);
          i = Math.min(i, e + 100663296);
          var o = Math;
          i = Math.max(e, i);
          e: {
            o = o.min.call(o, 2147483648, i + (65536 - i % 65536) % 65536) - nt.buffer.byteLength + 65535 >>> 16;
            try {
              nt.grow(o), rr();
              var s = 1;
              break e;
            } catch {
            }
            s = void 0;
          }
          if (s) return true;
        }
        return false;
      }, kb: function() {
        return B ? B.handle : 0;
      }, vb: (e, t) => {
        var r = 0;
        return Dr().forEach(function(i, o) {
          var s = t + r;
          for (o = O[e + 4 * o >> 2] = s, s = 0; s < i.length; ++s) pe[o++ >> 0] = i.charCodeAt(s);
          pe[o >> 0] = 0, r += i.length + 1;
        }), 0;
      }, wb: (e, t) => {
        var r = Dr();
        O[e >> 2] = r.length;
        var i = 0;
        return r.forEach(function(o) {
          i += o.length + 1;
        }), O[t >> 2] = i, 0;
      }, J: () => 52, lb: function() {
        return 52;
      }, Bb: () => 52, ob: function() {
        return 70;
      }, P: (e, t, r, i) => {
        for (var o = 0, s = 0; s < r; s++) {
          var l = O[t >> 2], f = O[t + 4 >> 2];
          t += 8;
          for (var h = 0; h < f; h++) {
            var g = G[l + h], P = In[e];
            g === 0 || g === 10 ? ((e === 1 ? qr : Ae)(Re(P, 0)), P.length = 0) : P.push(g);
          }
          o += f;
        }
        return O[i >> 2] = o, 0;
      }, $: function(e) {
        p.activeTexture(e);
      }, aa: function(e, t) {
        p.attachShader(fe[e], ce[t]);
      }, ba: function(e, t, r) {
        p.bindAttribLocation(fe[e], t, r ? Re(G, r) : "");
      }, ca: function(e, t) {
        e == 35051 ? p.se = t : e == 35052 && (p.Zd = t), p.bindBuffer(e, ht[t]);
      }, _: function(e, t) {
        p.bindFramebuffer(e, pt[t]);
      }, ac: function(e, t) {
        p.bindRenderbuffer(e, Je[t]);
      }, Mb: function(e, t) {
        p.bindSampler(e, Ie[t]);
      }, da: function(e, t) {
        p.bindTexture(e, re[t]);
      }, uc: Br, xc: Br, ea: function(e, t, r, i) {
        p.blendColor(e, t, r, i);
      }, fa: function(e) {
        p.blendEquation(e);
      }, ga: function(e, t) {
        p.blendFunc(e, t);
      }, Wb: function(e, t, r, i, o, s, l, f, h, g) {
        p.blitFramebuffer(e, t, r, i, o, s, l, f, h, g);
      }, ha: function(e, t, r, i) {
        2 <= B.version ? r && t ? p.bufferData(e, G, i, r, t) : p.bufferData(e, t, i) : p.bufferData(e, r ? G.subarray(r, r + t) : t, i);
      }, ia: function(e, t, r, i) {
        2 <= B.version ? r && p.bufferSubData(e, t, G, i, r) : p.bufferSubData(e, t, G.subarray(i, i + r));
      }, bc: function(e) {
        return p.checkFramebufferStatus(e);
      }, N: function(e) {
        p.clear(e);
      }, Z: function(e, t, r, i) {
        p.clearColor(e, t, r, i);
      }, O: function(e) {
        p.clearStencil(e);
      }, rb: function(e, t, r, i) {
        return p.clientWaitSync(De[e], t, (r >>> 0) + 4294967296 * i);
      }, ja: function(e, t, r, i) {
        p.colorMask(!!e, !!t, !!r, !!i);
      }, ka: function(e) {
        p.compileShader(ce[e]);
      }, la: function(e, t, r, i, o, s, l, f) {
        2 <= B.version ? p.Zd || !l ? p.compressedTexImage2D(e, t, r, i, o, s, l, f) : p.compressedTexImage2D(e, t, r, i, o, s, G, f, l) : p.compressedTexImage2D(e, t, r, i, o, s, f ? G.subarray(f, f + l) : null);
      }, ma: function(e, t, r, i, o, s, l, f, h) {
        2 <= B.version ? p.Zd || !f ? p.compressedTexSubImage2D(e, t, r, i, o, s, l, f, h) : p.compressedTexSubImage2D(e, t, r, i, o, s, l, G, h, f) : p.compressedTexSubImage2D(e, t, r, i, o, s, l, h ? G.subarray(h, h + f) : null);
      }, Ub: function(e, t, r, i, o) {
        p.copyBufferSubData(e, t, r, i, o);
      }, na: function(e, t, r, i, o, s, l, f) {
        p.copyTexSubImage2D(e, t, r, i, o, s, l, f);
      }, oa: function() {
        var e = ke(fe), t = p.createProgram();
        return t.name = e, t.oe = t.me = t.ne = 0, t.xe = 1, fe[e] = t, e;
      }, pa: function(e) {
        var t = ke(ce);
        return ce[t] = p.createShader(e), t;
      }, qa: function(e) {
        p.cullFace(e);
      }, ra: function(e, t) {
        for (var r = 0; r < e; r++) {
          var i = w[t + 4 * r >> 2], o = ht[i];
          o && (p.deleteBuffer(o), o.name = 0, ht[i] = null, i == p.se && (p.se = 0), i == p.Zd && (p.Zd = 0));
        }
      }, cc: function(e, t) {
        for (var r = 0; r < e; ++r) {
          var i = w[t + 4 * r >> 2], o = pt[i];
          o && (p.deleteFramebuffer(o), o.name = 0, pt[i] = null);
        }
      }, sa: function(e) {
        if (e) {
          var t = fe[e];
          t ? (p.deleteProgram(t), t.name = 0, fe[e] = null) : j(1281);
        }
      }, dc: function(e, t) {
        for (var r = 0; r < e; r++) {
          var i = w[t + 4 * r >> 2], o = Je[i];
          o && (p.deleteRenderbuffer(o), o.name = 0, Je[i] = null);
        }
      }, Nb: function(e, t) {
        for (var r = 0; r < e; r++) {
          var i = w[t + 4 * r >> 2], o = Ie[i];
          o && (p.deleteSampler(o), o.name = 0, Ie[i] = null);
        }
      }, ta: function(e) {
        if (e) {
          var t = ce[e];
          t ? (p.deleteShader(t), ce[e] = null) : j(1281);
        }
      }, Vb: function(e) {
        if (e) {
          var t = De[e];
          t ? (p.deleteSync(t), t.name = 0, De[e] = null) : j(1281);
        }
      }, ua: function(e, t) {
        for (var r = 0; r < e; r++) {
          var i = w[t + 4 * r >> 2], o = re[i];
          o && (p.deleteTexture(o), o.name = 0, re[i] = null);
        }
      }, vc: Gr, yc: Gr, va: function(e) {
        p.depthMask(!!e);
      }, wa: function(e) {
        p.disable(e);
      }, xa: function(e) {
        p.disableVertexAttribArray(e);
      }, ya: function(e, t, r) {
        p.drawArrays(e, t, r);
      }, sc: function(e, t, r, i) {
        p.drawArraysInstanced(e, t, r, i);
      }, qc: function(e, t, r, i, o) {
        p.ze.drawArraysInstancedBaseInstanceWEBGL(e, t, r, i, o);
      }, oc: function(e, t) {
        for (var r = mt[e], i = 0; i < e; i++) r[i] = w[t + 4 * i >> 2];
        p.drawBuffers(r);
      }, za: Lr, tc: function(e, t, r, i, o) {
        p.drawElementsInstanced(e, t, r, i, o);
      }, rc: function(e, t, r, i, o, s, l) {
        p.ze.drawElementsInstancedBaseVertexBaseInstanceWEBGL(e, t, r, i, o, s, l);
      }, ic: function(e, t, r, i, o, s) {
        Lr(e, i, o, s);
      }, Aa: function(e) {
        p.enable(e);
      }, Ba: function(e) {
        p.enableVertexAttribArray(e);
      }, Sb: function(e, t) {
        return (e = p.fenceSync(e, t)) ? (t = ke(De), e.name = t, De[t] = e, t) : 0;
      }, Ca: function() {
        p.finish();
      }, Da: function() {
        p.flush();
      }, ec: function(e, t, r, i) {
        p.framebufferRenderbuffer(e, t, r, Je[i]);
      }, fc: function(e, t, r, i, o) {
        p.framebufferTexture2D(e, t, r, re[i], o);
      }, Ea: function(e) {
        p.frontFace(e);
      }, Fa: function(e, t) {
        He(e, t, "createBuffer", ht);
      }, gc: function(e, t) {
        He(e, t, "createFramebuffer", pt);
      }, hc: function(e, t) {
        He(e, t, "createRenderbuffer", Je);
      }, Ob: function(e, t) {
        He(e, t, "createSampler", Ie);
      }, Ga: function(e, t) {
        He(e, t, "createTexture", re);
      }, wc: br, zc: br, Yb: function(e) {
        p.generateMipmap(e);
      }, Ha: function(e, t, r) {
        r ? w[r >> 2] = p.getBufferParameter(e, t) : j(1281);
      }, Ia: function() {
        var e = p.getError() || vt;
        return vt = 0, e;
      }, Ja: function(e, t) {
        kr(e, t, 2);
      }, Zb: function(e, t, r, i) {
        e = p.getFramebufferAttachmentParameter(e, t, r), (e instanceof WebGLRenderbuffer || e instanceof WebGLTexture) && (e = e.name | 0), w[i >> 2] = e;
      }, I: function(e, t) {
        kr(e, t, 0);
      }, Ka: function(e, t, r, i) {
        e = p.getProgramInfoLog(fe[e]), e === null && (e = "(unknown error)"), t = 0 < t && i ? se(e, G, i, t) : 0, r && (w[r >> 2] = t);
      }, La: function(e, t, r) {
        if (r) if (e >= Fr) j(1281);
        else if (e = fe[e], t == 35716) e = p.getProgramInfoLog(e), e === null && (e = "(unknown error)"), w[r >> 2] = e.length + 1;
        else if (t == 35719) {
          if (!e.oe) for (t = 0; t < p.getProgramParameter(e, 35718); ++t) e.oe = Math.max(e.oe, p.getActiveUniform(e, t).name.length + 1);
          w[r >> 2] = e.oe;
        } else if (t == 35722) {
          if (!e.me) for (t = 0; t < p.getProgramParameter(e, 35721); ++t) e.me = Math.max(e.me, p.getActiveAttrib(e, t).name.length + 1);
          w[r >> 2] = e.me;
        } else if (t == 35381) {
          if (!e.ne) for (t = 0; t < p.getProgramParameter(e, 35382); ++t) e.ne = Math.max(e.ne, p.getActiveUniformBlockName(e, t).length + 1);
          w[r >> 2] = e.ne;
        } else w[r >> 2] = p.getProgramParameter(e, t);
        else j(1281);
      }, _b: function(e, t, r) {
        r ? w[r >> 2] = p.getRenderbufferParameter(e, t) : j(1281);
      }, Ma: function(e, t, r, i) {
        e = p.getShaderInfoLog(ce[e]), e === null && (e = "(unknown error)"), t = 0 < t && i ? se(e, G, i, t) : 0, r && (w[r >> 2] = t);
      }, Jb: function(e, t, r, i) {
        e = p.getShaderPrecisionFormat(e, t), w[r >> 2] = e.rangeMin, w[r + 4 >> 2] = e.rangeMax, w[i >> 2] = e.precision;
      }, Na: function(e, t, r) {
        r ? t == 35716 ? (e = p.getShaderInfoLog(ce[e]), e === null && (e = "(unknown error)"), w[r >> 2] = e ? e.length + 1 : 0) : t == 35720 ? (e = p.getShaderSource(ce[e]), w[r >> 2] = e ? e.length + 1 : 0) : w[r >> 2] = p.getShaderParameter(ce[e], t) : j(1281);
      }, M: function(e) {
        var t = Mr[e];
        if (!t) {
          switch (e) {
            case 7939:
              t = p.getSupportedExtensions() || [], t = t.concat(t.map(function(i) {
                return "GL_" + i;
              })), t = Qe(t.join(" "));
              break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
              (t = p.getParameter(e)) || j(1280), t = t && Qe(t);
              break;
            case 7938:
              t = p.getParameter(7938), t = 2 <= B.version ? "OpenGL ES 3.0 (" + t + ")" : "OpenGL ES 2.0 (" + t + ")", t = Qe(t);
              break;
            case 35724:
              t = p.getParameter(35724);
              var r = t.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
              r !== null && (r[1].length == 3 && (r[1] += "0"), t = "OpenGL ES GLSL ES " + r[1] + " (" + t + ")"), t = Qe(t);
              break;
            default:
              j(1280);
          }
          Mr[e] = t;
        }
        return t;
      }, ib: function(e, t) {
        if (2 > B.version) return j(1282), 0;
        var r = Rr[e];
        if (r) return 0 > t || t >= r.length ? (j(1281), 0) : r[t];
        switch (e) {
          case 7939:
            return r = p.getSupportedExtensions() || [], r = r.concat(r.map(function(i) {
              return "GL_" + i;
            })), r = r.map(function(i) {
              return Qe(i);
            }), r = Rr[e] = r, 0 > t || t >= r.length ? (j(1281), 0) : r[t];
          default:
            return j(1280), 0;
        }
      }, Oa: function(e, t) {
        if (t = t ? Re(G, t) : "", e = fe[e]) {
          var r = e, i = r.fe, o = r.He, s;
          if (!i) for (r.fe = i = {}, r.Ge = {}, s = 0; s < p.getProgramParameter(r, 35718); ++s) {
            var l = p.getActiveUniform(r, s), f = l.name;
            l = l.size;
            var h = Hr(f);
            h = 0 < h ? f.slice(0, h) : f;
            var g = r.xe;
            for (r.xe += l, o[h] = [l, g], f = 0; f < l; ++f) i[g] = f, r.Ge[g++] = h;
          }
          if (r = e.fe, i = 0, o = t, s = Hr(t), 0 < s && (i = parseInt(t.slice(s + 1)) >>> 0, o = t.slice(0, s)), (o = e.He[o]) && i < o[0] && (i += o[1], r[i] = r[i] || p.getUniformLocation(e, t))) return i;
        } else j(1281);
        return -1;
      }, Kb: function(e, t, r) {
        for (var i = mt[t], o = 0; o < t; o++) i[o] = w[r + 4 * o >> 2];
        p.invalidateFramebuffer(e, i);
      }, Lb: function(e, t, r, i, o, s, l) {
        for (var f = mt[t], h = 0; h < t; h++) f[h] = w[r + 4 * h >> 2];
        p.invalidateSubFramebuffer(e, f, i, o, s, l);
      }, Tb: function(e) {
        return p.isSync(De[e]);
      }, Pa: function(e) {
        return (e = re[e]) ? p.isTexture(e) : 0;
      }, Qa: function(e) {
        p.lineWidth(e);
      }, Ra: function(e) {
        e = fe[e], p.linkProgram(e), e.fe = 0, e.He = {};
      }, mc: function(e, t, r, i, o, s) {
        p.De.multiDrawArraysInstancedBaseInstanceWEBGL(e, w, t >> 2, w, r >> 2, w, i >> 2, O, o >> 2, s);
      }, nc: function(e, t, r, i, o, s, l, f) {
        p.De.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(e, w, t >> 2, r, w, i >> 2, w, o >> 2, w, s >> 2, O, l >> 2, f);
      }, Sa: function(e, t) {
        e == 3317 && (xr = t), p.pixelStorei(e, t);
      }, pc: function(e) {
        p.readBuffer(e);
      }, Ta: function(e, t, r, i, o, s, l) {
        if (2 <= B.version) if (p.se) p.readPixels(e, t, r, i, o, s, l);
        else {
          var f = _t(s);
          p.readPixels(e, t, r, i, o, s, f, l >> 31 - Math.clz32(f.BYTES_PER_ELEMENT));
        }
        else (l = $t(s, o, r, i, l)) ? p.readPixels(e, t, r, i, o, s, l) : j(1280);
      }, $b: function(e, t, r, i) {
        p.renderbufferStorage(e, t, r, i);
      }, Xb: function(e, t, r, i, o) {
        p.renderbufferStorageMultisample(e, t, r, i, o);
      }, Pb: function(e, t, r) {
        p.samplerParameterf(Ie[e], t, r);
      }, Qb: function(e, t, r) {
        p.samplerParameteri(Ie[e], t, r);
      }, Rb: function(e, t, r) {
        p.samplerParameteri(Ie[e], t, w[r >> 2]);
      }, Ua: function(e, t, r, i) {
        p.scissor(e, t, r, i);
      }, Va: function(e, t, r, i) {
        for (var o = "", s = 0; s < t; ++s) {
          var l = i ? w[i + 4 * s >> 2] : -1, f = w[r + 4 * s >> 2];
          l = f ? Re(G, f, 0 > l ? void 0 : l) : "", o += l;
        }
        p.shaderSource(ce[e], o);
      }, Wa: function(e, t, r) {
        p.stencilFunc(e, t, r);
      }, Xa: function(e, t, r, i) {
        p.stencilFuncSeparate(e, t, r, i);
      }, Ya: function(e) {
        p.stencilMask(e);
      }, Za: function(e, t) {
        p.stencilMaskSeparate(e, t);
      }, _a: function(e, t, r) {
        p.stencilOp(e, t, r);
      }, $a: function(e, t, r, i) {
        p.stencilOpSeparate(e, t, r, i);
      }, ab: function(e, t, r, i, o, s, l, f, h) {
        if (2 <= B.version) if (p.Zd) p.texImage2D(e, t, r, i, o, s, l, f, h);
        else if (h) {
          var g = _t(f);
          p.texImage2D(e, t, r, i, o, s, l, f, g, h >> 31 - Math.clz32(g.BYTES_PER_ELEMENT));
        } else p.texImage2D(e, t, r, i, o, s, l, f, null);
        else p.texImage2D(e, t, r, i, o, s, l, f, h ? $t(f, l, i, o, h) : null);
      }, bb: function(e, t, r) {
        p.texParameterf(e, t, r);
      }, cb: function(e, t, r) {
        p.texParameterf(e, t, R[r >> 2]);
      }, db: function(e, t, r) {
        p.texParameteri(e, t, r);
      }, eb: function(e, t, r) {
        p.texParameteri(e, t, w[r >> 2]);
      }, jc: function(e, t, r, i, o) {
        p.texStorage2D(e, t, r, i, o);
      }, fb: function(e, t, r, i, o, s, l, f, h) {
        if (2 <= B.version) if (p.Zd) p.texSubImage2D(e, t, r, i, o, s, l, f, h);
        else if (h) {
          var g = _t(f);
          p.texSubImage2D(e, t, r, i, o, s, l, f, g, h >> 31 - Math.clz32(g.BYTES_PER_ELEMENT));
        } else p.texSubImage2D(e, t, r, i, o, s, l, f, null);
        else g = null, h && (g = $t(f, l, o, s, h)), p.texSubImage2D(e, t, r, i, o, s, l, f, g);
      }, gb: function(e, t) {
        p.uniform1f(H(e), t);
      }, hb: function(e, t, r) {
        if (2 <= B.version) t && p.uniform1fv(H(e), R, r >> 2, t);
        else {
          if (288 >= t) for (var i = Te[t - 1], o = 0; o < t; ++o) i[o] = R[r + 4 * o >> 2];
          else i = R.subarray(r >> 2, r + 4 * t >> 2);
          p.uniform1fv(H(e), i);
        }
      }, Uc: function(e, t) {
        p.uniform1i(H(e), t);
      }, Vc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform1iv(H(e), w, r >> 2, t);
        else {
          if (288 >= t) for (var i = Ze[t - 1], o = 0; o < t; ++o) i[o] = w[r + 4 * o >> 2];
          else i = w.subarray(r >> 2, r + 4 * t >> 2);
          p.uniform1iv(H(e), i);
        }
      }, Wc: function(e, t, r) {
        p.uniform2f(H(e), t, r);
      }, Xc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform2fv(H(e), R, r >> 2, 2 * t);
        else {
          if (144 >= t) for (var i = Te[2 * t - 1], o = 0; o < 2 * t; o += 2) i[o] = R[r + 4 * o >> 2], i[o + 1] = R[r + (4 * o + 4) >> 2];
          else i = R.subarray(r >> 2, r + 8 * t >> 2);
          p.uniform2fv(H(e), i);
        }
      }, Tc: function(e, t, r) {
        p.uniform2i(H(e), t, r);
      }, Sc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform2iv(H(e), w, r >> 2, 2 * t);
        else {
          if (144 >= t) for (var i = Ze[2 * t - 1], o = 0; o < 2 * t; o += 2) i[o] = w[r + 4 * o >> 2], i[o + 1] = w[r + (4 * o + 4) >> 2];
          else i = w.subarray(r >> 2, r + 8 * t >> 2);
          p.uniform2iv(H(e), i);
        }
      }, Rc: function(e, t, r, i) {
        p.uniform3f(H(e), t, r, i);
      }, Qc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform3fv(H(e), R, r >> 2, 3 * t);
        else {
          if (96 >= t) for (var i = Te[3 * t - 1], o = 0; o < 3 * t; o += 3) i[o] = R[r + 4 * o >> 2], i[o + 1] = R[r + (4 * o + 4) >> 2], i[o + 2] = R[r + (4 * o + 8) >> 2];
          else i = R.subarray(r >> 2, r + 12 * t >> 2);
          p.uniform3fv(H(e), i);
        }
      }, Pc: function(e, t, r, i) {
        p.uniform3i(H(e), t, r, i);
      }, Oc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform3iv(H(e), w, r >> 2, 3 * t);
        else {
          if (96 >= t) for (var i = Ze[3 * t - 1], o = 0; o < 3 * t; o += 3) i[o] = w[r + 4 * o >> 2], i[o + 1] = w[r + (4 * o + 4) >> 2], i[o + 2] = w[r + (4 * o + 8) >> 2];
          else i = w.subarray(r >> 2, r + 12 * t >> 2);
          p.uniform3iv(H(e), i);
        }
      }, Nc: function(e, t, r, i, o) {
        p.uniform4f(H(e), t, r, i, o);
      }, Mc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform4fv(H(e), R, r >> 2, 4 * t);
        else {
          if (72 >= t) {
            var i = Te[4 * t - 1], o = R;
            r >>= 2;
            for (var s = 0; s < 4 * t; s += 4) {
              var l = r + s;
              i[s] = o[l], i[s + 1] = o[l + 1], i[s + 2] = o[l + 2], i[s + 3] = o[l + 3];
            }
          } else i = R.subarray(r >> 2, r + 16 * t >> 2);
          p.uniform4fv(H(e), i);
        }
      }, Ac: function(e, t, r, i, o) {
        p.uniform4i(H(e), t, r, i, o);
      }, Bc: function(e, t, r) {
        if (2 <= B.version) t && p.uniform4iv(H(e), w, r >> 2, 4 * t);
        else {
          if (72 >= t) for (var i = Ze[4 * t - 1], o = 0; o < 4 * t; o += 4) i[o] = w[r + 4 * o >> 2], i[o + 1] = w[r + (4 * o + 4) >> 2], i[o + 2] = w[r + (4 * o + 8) >> 2], i[o + 3] = w[r + (4 * o + 12) >> 2];
          else i = w.subarray(r >> 2, r + 16 * t >> 2);
          p.uniform4iv(H(e), i);
        }
      }, Cc: function(e, t, r, i) {
        if (2 <= B.version) t && p.uniformMatrix2fv(H(e), !!r, R, i >> 2, 4 * t);
        else {
          if (72 >= t) for (var o = Te[4 * t - 1], s = 0; s < 4 * t; s += 4) o[s] = R[i + 4 * s >> 2], o[s + 1] = R[i + (4 * s + 4) >> 2], o[s + 2] = R[i + (4 * s + 8) >> 2], o[s + 3] = R[i + (4 * s + 12) >> 2];
          else o = R.subarray(i >> 2, i + 16 * t >> 2);
          p.uniformMatrix2fv(H(e), !!r, o);
        }
      }, Dc: function(e, t, r, i) {
        if (2 <= B.version) t && p.uniformMatrix3fv(H(e), !!r, R, i >> 2, 9 * t);
        else {
          if (32 >= t) for (var o = Te[9 * t - 1], s = 0; s < 9 * t; s += 9) o[s] = R[i + 4 * s >> 2], o[s + 1] = R[i + (4 * s + 4) >> 2], o[s + 2] = R[i + (4 * s + 8) >> 2], o[s + 3] = R[i + (4 * s + 12) >> 2], o[s + 4] = R[i + (4 * s + 16) >> 2], o[s + 5] = R[i + (4 * s + 20) >> 2], o[s + 6] = R[i + (4 * s + 24) >> 2], o[s + 7] = R[i + (4 * s + 28) >> 2], o[s + 8] = R[i + (4 * s + 32) >> 2];
          else o = R.subarray(i >> 2, i + 36 * t >> 2);
          p.uniformMatrix3fv(H(e), !!r, o);
        }
      }, Ec: function(e, t, r, i) {
        if (2 <= B.version) t && p.uniformMatrix4fv(H(e), !!r, R, i >> 2, 16 * t);
        else {
          if (18 >= t) {
            var o = Te[16 * t - 1], s = R;
            i >>= 2;
            for (var l = 0; l < 16 * t; l += 16) {
              var f = i + l;
              o[l] = s[f], o[l + 1] = s[f + 1], o[l + 2] = s[f + 2], o[l + 3] = s[f + 3], o[l + 4] = s[f + 4], o[l + 5] = s[f + 5], o[l + 6] = s[f + 6], o[l + 7] = s[f + 7], o[l + 8] = s[f + 8], o[l + 9] = s[f + 9], o[l + 10] = s[f + 10], o[l + 11] = s[f + 11], o[l + 12] = s[f + 12], o[l + 13] = s[f + 13], o[l + 14] = s[f + 14], o[l + 15] = s[f + 15];
            }
          } else o = R.subarray(i >> 2, i + 64 * t >> 2);
          p.uniformMatrix4fv(H(e), !!r, o);
        }
      }, Fc: function(e) {
        e = fe[e], p.useProgram(e), p.Re = e;
      }, Gc: function(e, t) {
        p.vertexAttrib1f(e, t);
      }, Hc: function(e, t) {
        p.vertexAttrib2f(e, R[t >> 2], R[t + 4 >> 2]);
      }, Ic: function(e, t) {
        p.vertexAttrib3f(e, R[t >> 2], R[t + 4 >> 2], R[t + 8 >> 2]);
      }, Jc: function(e, t) {
        p.vertexAttrib4f(e, R[t >> 2], R[t + 4 >> 2], R[t + 8 >> 2], R[t + 12 >> 2]);
      }, kc: function(e, t) {
        p.vertexAttribDivisor(e, t);
      }, lc: function(e, t, r, i, o) {
        p.vertexAttribIPointer(e, t, r, i, o);
      }, Kc: function(e, t, r, i, o, s) {
        p.vertexAttribPointer(e, t, r, !!i, o, s);
      }, Lc: function(e, t, r, i) {
        p.viewport(e, t, r, i);
      }, qb: function(e, t, r, i) {
        p.waitSync(De[e], t, (r >>> 0) + 4294967296 * i);
      }, W: jn, F: Hn, E: Wn, X: Un, Ib: Nn, V: Sn, U: Yn, A: Vn, B: $n, D: On, L: kn, sb: (e, t, r, i) => Bn(e, t, r, i) };
      (function() {
        function e(r) {
          if (b = r = r.exports, nt = b.Yc, rr(), Q = b._c, ir.unshift(b.Zc), Me--, m.monitorRunDependencies && m.monitorRunDependencies(Me), Me == 0 && (Mt !== null && (clearInterval(Mt), Mt = null), We)) {
            var i = We;
            We = null, i();
          }
          return r;
        }
        var t = { a: bn };
        if (Me++, m.monitorRunDependencies && m.monitorRunDependencies(Me), m.instantiateWasm) try {
          return m.instantiateWasm(t, e);
        } catch (r) {
          Ae("Module.instantiateWasm callback failed with error: " + r), et(r);
        }
        return rn(t, function(r) {
          e(r.instance);
        }).catch(et), {};
      })();
      var Pe = m._free = (e) => (Pe = m._free = b.$c)(e), Ct = m._malloc = (e) => (Ct = m._malloc = b.ad)(e), Wr = (e) => (Wr = b.bd)(e);
      m.__embind_initialize_bindings = () => (m.__embind_initialize_bindings = b.cd)();
      var ne = (e, t) => (ne = b.dd)(e, t), ie = () => (ie = b.ed)(), oe = (e) => (oe = b.fd)(e);
      m.dynCall_viji = (e, t, r, i, o) => (m.dynCall_viji = b.gd)(e, t, r, i, o), m.dynCall_vijiii = (e, t, r, i, o, s, l) => (m.dynCall_vijiii = b.hd)(e, t, r, i, o, s, l), m.dynCall_viiiiij = (e, t, r, i, o, s, l, f) => (m.dynCall_viiiiij = b.id)(e, t, r, i, o, s, l, f), m.dynCall_jii = (e, t, r) => (m.dynCall_jii = b.jd)(e, t, r), m.dynCall_vij = (e, t, r, i) => (m.dynCall_vij = b.kd)(e, t, r, i), m.dynCall_iiij = (e, t, r, i, o) => (m.dynCall_iiij = b.ld)(e, t, r, i, o), m.dynCall_iiiij = (e, t, r, i, o, s) => (m.dynCall_iiiij = b.md)(e, t, r, i, o, s), m.dynCall_viij = (e, t, r, i, o) => (m.dynCall_viij = b.nd)(e, t, r, i, o), m.dynCall_viiij = (e, t, r, i, o, s) => (m.dynCall_viiij = b.od)(e, t, r, i, o, s), m.dynCall_ji = (e, t) => (m.dynCall_ji = b.pd)(e, t), m.dynCall_iij = (e, t, r, i) => (m.dynCall_iij = b.qd)(e, t, r, i), m.dynCall_jiiiiii = (e, t, r, i, o, s, l) => (m.dynCall_jiiiiii = b.rd)(e, t, r, i, o, s, l), m.dynCall_jiiiiji = (e, t, r, i, o, s, l, f) => (m.dynCall_jiiiiji = b.sd)(e, t, r, i, o, s, l, f), m.dynCall_iijj = (e, t, r, i, o, s) => (m.dynCall_iijj = b.td)(e, t, r, i, o, s), m.dynCall_iiiji = (e, t, r, i, o, s) => (m.dynCall_iiiji = b.ud)(e, t, r, i, o, s), m.dynCall_iiji = (e, t, r, i, o) => (m.dynCall_iiji = b.vd)(e, t, r, i, o), m.dynCall_iijjiii = (e, t, r, i, o, s, l, f, h) => (m.dynCall_iijjiii = b.wd)(e, t, r, i, o, s, l, f, h), m.dynCall_vijjjii = (e, t, r, i, o, s, l, f, h, g) => (m.dynCall_vijjjii = b.xd)(e, t, r, i, o, s, l, f, h, g), m.dynCall_jiji = (e, t, r, i, o) => (m.dynCall_jiji = b.yd)(e, t, r, i, o), m.dynCall_viijii = (e, t, r, i, o, s, l) => (m.dynCall_viijii = b.zd)(e, t, r, i, o, s, l), m.dynCall_iiiiij = (e, t, r, i, o, s, l) => (m.dynCall_iiiiij = b.Ad)(e, t, r, i, o, s, l), m.dynCall_iiiiijj = (e, t, r, i, o, s, l, f, h) => (m.dynCall_iiiiijj = b.Bd)(e, t, r, i, o, s, l, f, h), m.dynCall_iiiiiijj = (e, t, r, i, o, s, l, f, h, g) => (m.dynCall_iiiiiijj = b.Cd)(e, t, r, i, o, s, l, f, h, g);
      function kn(e, t, r, i, o) {
        var s = ie();
        try {
          Q.get(e)(t, r, i, o);
        } catch (l) {
          if (oe(s), l !== l + 0) throw l;
          ne(1, 0);
        }
      }
      function Hn(e, t, r) {
        var i = ie();
        try {
          return Q.get(e)(t, r);
        } catch (o) {
          if (oe(i), o !== o + 0) throw o;
          ne(1, 0);
        }
      }
      function Un(e, t, r, i, o) {
        var s = ie();
        try {
          return Q.get(e)(t, r, i, o);
        } catch (l) {
          if (oe(s), l !== l + 0) throw l;
          ne(1, 0);
        }
      }
      function On(e, t, r, i) {
        var o = ie();
        try {
          Q.get(e)(t, r, i);
        } catch (s) {
          if (oe(o), s !== s + 0) throw s;
          ne(1, 0);
        }
      }
      function jn(e, t) {
        var r = ie();
        try {
          return Q.get(e)(t);
        } catch (i) {
          if (oe(r), i !== i + 0) throw i;
          ne(1, 0);
        }
      }
      function Wn(e, t, r, i) {
        var o = ie();
        try {
          return Q.get(e)(t, r, i);
        } catch (s) {
          if (oe(o), s !== s + 0) throw s;
          ne(1, 0);
        }
      }
      function $n(e, t, r) {
        var i = ie();
        try {
          Q.get(e)(t, r);
        } catch (o) {
          if (oe(i), o !== o + 0) throw o;
          ne(1, 0);
        }
      }
      function Sn(e, t, r, i, o, s, l, f, h, g) {
        var P = ie();
        try {
          return Q.get(e)(t, r, i, o, s, l, f, h, g);
        } catch (E) {
          if (oe(P), E !== E + 0) throw E;
          ne(1, 0);
        }
      }
      function Vn(e, t) {
        var r = ie();
        try {
          Q.get(e)(t);
        } catch (i) {
          if (oe(r), i !== i + 0) throw i;
          ne(1, 0);
        }
      }
      function Nn(e, t, r, i, o, s, l) {
        var f = ie();
        try {
          return Q.get(e)(t, r, i, o, s, l);
        } catch (h) {
          if (oe(f), h !== h + 0) throw h;
          ne(1, 0);
        }
      }
      function Yn(e) {
        var t = ie();
        try {
          Q.get(e)();
        } catch (r) {
          if (oe(t), r !== r + 0) throw r;
          ne(1, 0);
        }
      }
      var At;
      We = function e() {
        At || $r(), At || (We = e);
      };
      function $r() {
        function e() {
          if (!At && (At = true, m.calledRun = true, !er)) {
            if (xt(ir), Jt(m), m.onRuntimeInitialized && m.onRuntimeInitialized(), m.postRun) for (typeof m.postRun == "function" && (m.postRun = [m.postRun]); m.postRun.length; ) {
              var t = m.postRun.shift();
              or.unshift(t);
            }
            xt(or);
          }
        }
        if (!(0 < Me)) {
          if (m.preRun) for (typeof m.preRun == "function" && (m.preRun = [m.preRun]); m.preRun.length; ) en();
          xt(nr), 0 < Me || (m.setStatus ? (m.setStatus("Running..."), setTimeout(function() {
            setTimeout(function() {
              m.setStatus("");
            }, 1), e();
          }, 1)) : e());
        }
      }
      if (m.preInit) for (typeof m.preInit == "function" && (m.preInit = [m.preInit]); 0 < m.preInit.length; ) m.preInit.pop()();
      return $r(), ge.ready;
    };
  })();
  typeof zr == "object" && typeof Kt == "object" ? Kt.exports = Zr : typeof define == "function" && define.amd && define([], () => Zr);
});
var ui_default = Jn();
export {
  ui_default as default
};
//# sourceMappingURL=ui-U67QCTBP.js.map
