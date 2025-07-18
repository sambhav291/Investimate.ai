import {
  AnnotationLayer,
  AnnotationMode,
  GlobalWorkerOptions,
  TextLayer,
  getDocument,
  pdf_exports
} from "./chunk-2FI3C5CE.js";
import {
  require_jsx_runtime
} from "./chunk-AO33BGRN.js";
import {
  require_react
} from "./chunk-TAMO26DO.js";
import {
  __commonJS,
  __toESM
} from "./chunk-SNAQBZPT.js";

// node_modules/warning/warning.js
var require_warning = __commonJS({
  "node_modules/warning/warning.js"(exports, module) {
    "use strict";
    var __DEV__ = true;
    var warning9 = function() {
    };
    if (__DEV__) {
      printWarning = function printWarning2(format, args) {
        var len = arguments.length;
        args = new Array(len > 1 ? len - 1 : 0);
        for (var key = 1; key < len; key++) {
          args[key - 1] = arguments[key];
        }
        var argIndex = 0;
        var message = "Warning: " + format.replace(/%s/g, function() {
          return args[argIndex++];
        });
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x) {
        }
      };
      warning9 = function(condition, format, args) {
        var len = arguments.length;
        args = new Array(len > 2 ? len - 2 : 0);
        for (var key = 2; key < len; key++) {
          args[key - 2] = arguments[key];
        }
        if (format === void 0) {
          throw new Error(
            "`warning(condition, format, ...args)` requires a warning message argument"
          );
        }
        if (!condition) {
          printWarning.apply(null, [format].concat(args));
        }
      };
    }
    var printWarning;
    module.exports = warning9;
  }
});

// node_modules/react-pdf/dist/Document.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_react3 = __toESM(require_react(), 1);

// node_modules/make-event-props/dist/index.js
var clipboardEvents = ["onCopy", "onCut", "onPaste"];
var compositionEvents = [
  "onCompositionEnd",
  "onCompositionStart",
  "onCompositionUpdate"
];
var focusEvents = ["onFocus", "onBlur"];
var formEvents = ["onInput", "onInvalid", "onReset", "onSubmit"];
var imageEvents = ["onLoad", "onError"];
var keyboardEvents = ["onKeyDown", "onKeyPress", "onKeyUp"];
var mediaEvents = [
  "onAbort",
  "onCanPlay",
  "onCanPlayThrough",
  "onDurationChange",
  "onEmptied",
  "onEncrypted",
  "onEnded",
  "onError",
  "onLoadedData",
  "onLoadedMetadata",
  "onLoadStart",
  "onPause",
  "onPlay",
  "onPlaying",
  "onProgress",
  "onRateChange",
  "onSeeked",
  "onSeeking",
  "onStalled",
  "onSuspend",
  "onTimeUpdate",
  "onVolumeChange",
  "onWaiting"
];
var mouseEvents = [
  "onClick",
  "onContextMenu",
  "onDoubleClick",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp"
];
var dragEvents = [
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop"
];
var selectionEvents = ["onSelect"];
var touchEvents = ["onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart"];
var pointerEvents = [
  "onPointerDown",
  "onPointerMove",
  "onPointerUp",
  "onPointerCancel",
  "onGotPointerCapture",
  "onLostPointerCapture",
  "onPointerEnter",
  "onPointerLeave",
  "onPointerOver",
  "onPointerOut"
];
var uiEvents = ["onScroll"];
var wheelEvents = ["onWheel"];
var animationEvents = [
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration"
];
var transitionEvents = ["onTransitionEnd"];
var otherEvents = ["onToggle"];
var changeEvents = ["onChange"];
var allEvents = [
  ...clipboardEvents,
  ...compositionEvents,
  ...focusEvents,
  ...formEvents,
  ...imageEvents,
  ...keyboardEvents,
  ...mediaEvents,
  ...mouseEvents,
  ...dragEvents,
  ...selectionEvents,
  ...touchEvents,
  ...pointerEvents,
  ...uiEvents,
  ...wheelEvents,
  ...animationEvents,
  ...transitionEvents,
  ...changeEvents,
  ...otherEvents
];
function makeEventProps(props, getArgs) {
  const eventProps = {};
  for (const eventName of allEvents) {
    const eventHandler = props[eventName];
    if (!eventHandler) {
      continue;
    }
    if (getArgs) {
      eventProps[eventName] = (event) => eventHandler(event, getArgs(eventName));
    } else {
      eventProps[eventName] = eventHandler;
    }
  }
  return eventProps;
}

// node_modules/make-cancellable-promise/dist/index.js
function makeCancellablePromise(promise) {
  let isCancelled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((value) => !isCancelled && resolve(value)).catch((error) => !isCancelled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCancelled = true;
    }
  };
}

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
var clsx_default = clsx;

// node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var isProduction = false;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}

// node_modules/react-pdf/dist/Document.js
var import_warning2 = __toESM(require_warning(), 1);

// node_modules/dequal/dist/index.mjs
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
  for (key of iter.keys()) {
    if (dequal(key, tar)) return key;
  }
}
function dequal(foo, bar) {
  var ctor, len, tmp;
  if (foo === bar) return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();
    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && dequal(foo[len], bar[len])) ;
      }
      return len === -1;
    }
    if (ctor === Set) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len;
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp) return false;
        }
        if (!bar.has(tmp)) return false;
      }
      return true;
    }
    if (ctor === Map) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len[0];
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp) return false;
        }
        if (!dequal(len[1], bar.get(tmp))) {
          return false;
        }
      }
      return true;
    }
    if (ctor === ArrayBuffer) {
      foo = new Uint8Array(foo);
      bar = new Uint8Array(bar);
    } else if (ctor === DataView) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo.getInt8(len) === bar.getInt8(len)) ;
      }
      return len === -1;
    }
    if (ArrayBuffer.isView(foo)) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo[len] === bar[len]) ;
      }
      return len === -1;
    }
    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
      }
      return Object.keys(bar).length === len;
    }
  }
  return foo !== foo && bar !== bar;
}

// node_modules/react-pdf/dist/DocumentContext.js
var import_react = __toESM(require_react(), 1);
var documentContext = (0, import_react.createContext)(null);
var DocumentContext_default = documentContext;

// node_modules/react-pdf/dist/Message.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function Message({ children, type }) {
  return (0, import_jsx_runtime.jsx)("div", { className: `react-pdf__message react-pdf__message--${type}`, children });
}

// node_modules/react-pdf/dist/LinkService.js
var DEFAULT_LINK_REL = "noopener noreferrer nofollow";
var LinkService = class {
  constructor() {
    this.externalLinkEnabled = true;
    this.externalLinkRel = void 0;
    this.externalLinkTarget = void 0;
    this.isInPresentationMode = false;
    this.pdfDocument = void 0;
    this.pdfViewer = void 0;
  }
  setDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setExternalLinkRel(externalLinkRel) {
    this.externalLinkRel = externalLinkRel;
  }
  setExternalLinkTarget(externalLinkTarget) {
    this.externalLinkTarget = externalLinkTarget;
  }
  setHistory() {
  }
  get pagesCount() {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  }
  get page() {
    invariant(this.pdfViewer, "PDF viewer is not initialized.");
    return this.pdfViewer.currentPageNumber || 0;
  }
  set page(value) {
    invariant(this.pdfViewer, "PDF viewer is not initialized.");
    this.pdfViewer.currentPageNumber = value;
  }
  get rotation() {
    return 0;
  }
  set rotation(_value) {
  }
  goToDestination(dest) {
    return new Promise((resolve) => {
      invariant(this.pdfDocument, "PDF document not loaded.");
      invariant(dest, "Destination is not specified.");
      if (typeof dest === "string") {
        this.pdfDocument.getDestination(dest).then(resolve);
      } else if (Array.isArray(dest)) {
        resolve(dest);
      } else {
        dest.then(resolve);
      }
    }).then((explicitDest) => {
      invariant(Array.isArray(explicitDest), `"${explicitDest}" is not a valid destination array.`);
      const destRef = explicitDest[0];
      new Promise((resolve) => {
        invariant(this.pdfDocument, "PDF document not loaded.");
        if (destRef instanceof Object) {
          this.pdfDocument.getPageIndex(destRef).then((pageIndex) => {
            resolve(pageIndex);
          }).catch(() => {
            invariant(false, `"${destRef}" is not a valid page reference.`);
          });
        } else if (typeof destRef === "number") {
          resolve(destRef);
        } else {
          invariant(false, `"${destRef}" is not a valid destination reference.`);
        }
      }).then((pageIndex) => {
        const pageNumber = pageIndex + 1;
        invariant(this.pdfViewer, "PDF viewer is not initialized.");
        invariant(pageNumber >= 1 && pageNumber <= this.pagesCount, `"${pageNumber}" is not a valid page number.`);
        this.pdfViewer.scrollPageIntoView({
          dest: explicitDest,
          pageIndex,
          pageNumber
        });
      });
    });
  }
  navigateTo(dest) {
    this.goToDestination(dest);
  }
  goToPage(pageNumber) {
    const pageIndex = pageNumber - 1;
    invariant(this.pdfViewer, "PDF viewer is not initialized.");
    invariant(pageNumber >= 1 && pageNumber <= this.pagesCount, `"${pageNumber}" is not a valid page number.`);
    this.pdfViewer.scrollPageIntoView({
      pageIndex,
      pageNumber
    });
  }
  addLinkAttributes(link, url, newWindow) {
    link.href = url;
    link.rel = this.externalLinkRel || DEFAULT_LINK_REL;
    link.target = newWindow ? "_blank" : this.externalLinkTarget || "";
  }
  getDestinationHash() {
    return "#";
  }
  getAnchorUrl() {
    return "#";
  }
  setHash() {
  }
  executeNamedAction() {
  }
  cachePageRef() {
  }
  isPageVisible() {
    return true;
  }
  isPageCached() {
    return true;
  }
  executeSetOCGState() {
  }
};

// node_modules/react-pdf/dist/PasswordResponses.js
var PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
var PasswordResponses_default = PasswordResponses;

// node_modules/react-pdf/dist/shared/utils.js
var import_warning = __toESM(require_warning(), 1);
var isBrowser = typeof window !== "undefined";
var isLocalFileSystem = isBrowser && window.location.protocol === "file:";
function isDefined(variable) {
  return typeof variable !== "undefined";
}
function isProvided(variable) {
  return isDefined(variable) && variable !== null;
}
function isString(variable) {
  return typeof variable === "string";
}
function isArrayBuffer(variable) {
  return variable instanceof ArrayBuffer;
}
function isBlob(variable) {
  invariant(isBrowser, "isBlob can only be used in a browser environment");
  return variable instanceof Blob;
}
function isDataURI(variable) {
  return isString(variable) && /^data:/.test(variable);
}
function dataURItoByteString(dataURI) {
  invariant(isDataURI(dataURI), "Invalid data URI.");
  const [headersString = "", dataString = ""] = dataURI.split(",");
  const headers = headersString.split(";");
  if (headers.indexOf("base64") !== -1) {
    return atob(dataString);
  }
  return unescape(dataString);
}
function getDevicePixelRatio() {
  return isBrowser && window.devicePixelRatio || 1;
}
var allowFileAccessFromFilesTip = "On Chromium based browsers, you can use --allow-file-access-from-files flag for debugging purposes.";
function displayCORSWarning() {
  (0, import_warning.default)(!isLocalFileSystem, `Loading PDF as base64 strings/URLs may not work on protocols other than HTTP/HTTPS. ${allowFileAccessFromFilesTip}`);
}
function displayWorkerWarning() {
  (0, import_warning.default)(!isLocalFileSystem, `Loading PDF.js worker may not work on protocols other than HTTP/HTTPS. ${allowFileAccessFromFilesTip}`);
}
function cancelRunningTask(runningTask) {
  if (runningTask === null || runningTask === void 0 ? void 0 : runningTask.cancel)
    runningTask.cancel();
}
function makePageCallback(page, scale) {
  Object.defineProperty(page, "width", {
    get() {
      return this.view[2] * scale;
    },
    configurable: true
  });
  Object.defineProperty(page, "height", {
    get() {
      return this.view[3] * scale;
    },
    configurable: true
  });
  Object.defineProperty(page, "originalWidth", {
    get() {
      return this.view[2];
    },
    configurable: true
  });
  Object.defineProperty(page, "originalHeight", {
    get() {
      return this.view[3];
    },
    configurable: true
  });
  return page;
}
function isCancelException(error) {
  return error.name === "RenderingCancelledException";
}
function loadFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        return reject(new Error("Error while reading a file."));
      }
      resolve(reader.result);
    };
    reader.onerror = (event) => {
      if (!event.target) {
        return reject(new Error("Error while reading a file."));
      }
      const { error } = event.target;
      if (!error) {
        return reject(new Error("Error while reading a file."));
      }
      switch (error.code) {
        case error.NOT_FOUND_ERR:
          return reject(new Error("Error while reading a file: File not found."));
        case error.SECURITY_ERR:
          return reject(new Error("Error while reading a file: Security error."));
        case error.ABORT_ERR:
          return reject(new Error("Error while reading a file: Aborted."));
        default:
          return reject(new Error("Error while reading a file."));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// node_modules/react-pdf/dist/shared/hooks/useResolver.js
var import_react2 = __toESM(require_react(), 1);
function reducer(state, action) {
  switch (action.type) {
    case "RESOLVE":
      return { value: action.value, error: void 0 };
    case "REJECT":
      return { value: false, error: action.error };
    case "RESET":
      return { value: void 0, error: void 0 };
    default:
      return state;
  }
}
function useResolver() {
  return (0, import_react2.useReducer)(reducer, { value: void 0, error: void 0 });
}

// node_modules/react-pdf/dist/Document.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var { PDFDataRangeTransport } = pdf_exports;
var defaultOnPassword = (callback, reason) => {
  switch (reason) {
    case PasswordResponses_default.NEED_PASSWORD: {
      const password = prompt("Enter the password to open this PDF file.");
      callback(password);
      break;
    }
    case PasswordResponses_default.INCORRECT_PASSWORD: {
      const password = prompt("Invalid password. Please try again.");
      callback(password);
      break;
    }
    default:
  }
};
function isParameterObject(file) {
  return typeof file === "object" && file !== null && ("data" in file || "range" in file || "url" in file);
}
var Document = (0, import_react3.forwardRef)(function Document2(_a, ref) {
  var { children, className, error = "Failed to load PDF file.", externalLinkRel, externalLinkTarget, file, inputRef, imageResourcesPath, loading = "Loading PDF…", noData = "No PDF file specified.", onItemClick, onLoadError: onLoadErrorProps, onLoadProgress, onLoadSuccess: onLoadSuccessProps, onPassword = defaultOnPassword, onSourceError: onSourceErrorProps, onSourceSuccess: onSourceSuccessProps, options, renderMode, rotate, scale } = _a, otherProps = __rest(_a, ["children", "className", "error", "externalLinkRel", "externalLinkTarget", "file", "inputRef", "imageResourcesPath", "loading", "noData", "onItemClick", "onLoadError", "onLoadProgress", "onLoadSuccess", "onPassword", "onSourceError", "onSourceSuccess", "options", "renderMode", "rotate", "scale"]);
  const [sourceState, sourceDispatch] = useResolver();
  const { value: source, error: sourceError } = sourceState;
  const [pdfState, pdfDispatch] = useResolver();
  const { value: pdf, error: pdfError } = pdfState;
  const linkService = (0, import_react3.useRef)(new LinkService());
  const pages = (0, import_react3.useRef)([]);
  const prevFile = (0, import_react3.useRef)(void 0);
  const prevOptions = (0, import_react3.useRef)(void 0);
  if (file && file !== prevFile.current && isParameterObject(file)) {
    (0, import_warning2.default)(!dequal(file, prevFile.current), `File prop passed to <Document /> changed, but it's equal to previous one. This might result in unnecessary reloads. Consider memoizing the value passed to "file" prop.`);
    prevFile.current = file;
  }
  if (options && options !== prevOptions.current) {
    (0, import_warning2.default)(!dequal(options, prevOptions.current), `Options prop passed to <Document /> changed, but it's equal to previous one. This might result in unnecessary reloads. Consider memoizing the value passed to "options" prop.`);
    prevOptions.current = options;
  }
  const viewer = (0, import_react3.useRef)({
    // Handling jumping to internal links target
    scrollPageIntoView: (args) => {
      const { dest, pageNumber, pageIndex = pageNumber - 1 } = args;
      if (onItemClick) {
        onItemClick({ dest, pageIndex, pageNumber });
        return;
      }
      const page = pages.current[pageIndex];
      if (page) {
        page.scrollIntoView();
        return;
      }
      (0, import_warning2.default)(false, `An internal link leading to page ${pageNumber} was clicked, but neither <Document> was provided with onItemClick nor it was able to find the page within itself. Either provide onItemClick to <Document> and handle navigating by yourself or ensure that all pages are rendered within <Document>.`);
    }
  });
  (0, import_react3.useImperativeHandle)(ref, () => ({
    linkService,
    pages,
    viewer
  }), []);
  function onSourceSuccess() {
    if (onSourceSuccessProps) {
      onSourceSuccessProps();
    }
  }
  function onSourceError() {
    if (!sourceError) {
      return;
    }
    (0, import_warning2.default)(false, sourceError.toString());
    if (onSourceErrorProps) {
      onSourceErrorProps(sourceError);
    }
  }
  function resetSource() {
    sourceDispatch({ type: "RESET" });
  }
  (0, import_react3.useEffect)(resetSource, [file, sourceDispatch]);
  const findDocumentSource = (0, import_react3.useCallback)(async () => {
    if (!file) {
      return null;
    }
    if (typeof file === "string") {
      if (isDataURI(file)) {
        const fileByteString = dataURItoByteString(file);
        return { data: fileByteString };
      }
      displayCORSWarning();
      return { url: file };
    }
    if (file instanceof PDFDataRangeTransport) {
      return { range: file };
    }
    if (isArrayBuffer(file)) {
      return { data: file };
    }
    if (isBrowser) {
      if (isBlob(file)) {
        const data = await loadFromFile(file);
        return { data };
      }
    }
    invariant(typeof file === "object", "Invalid parameter in file, need either Uint8Array, string or a parameter object");
    invariant(isParameterObject(file), "Invalid parameter object: need either .data, .range or .url");
    if ("url" in file && typeof file.url === "string") {
      if (isDataURI(file.url)) {
        const { url } = file, otherParams = __rest(file, ["url"]);
        const fileByteString = dataURItoByteString(url);
        return Object.assign({ data: fileByteString }, otherParams);
      }
      displayCORSWarning();
    }
    return file;
  }, [file]);
  (0, import_react3.useEffect)(() => {
    const cancellable = makeCancellablePromise(findDocumentSource());
    cancellable.promise.then((nextSource) => {
      sourceDispatch({ type: "RESOLVE", value: nextSource });
    }).catch((error2) => {
      sourceDispatch({ type: "REJECT", error: error2 });
    });
    return () => {
      cancelRunningTask(cancellable);
    };
  }, [findDocumentSource, sourceDispatch]);
  (0, import_react3.useEffect)(() => {
    if (typeof source === "undefined") {
      return;
    }
    if (source === false) {
      onSourceError();
      return;
    }
    onSourceSuccess();
  }, [source]);
  function onLoadSuccess() {
    if (!pdf) {
      return;
    }
    if (onLoadSuccessProps) {
      onLoadSuccessProps(pdf);
    }
    pages.current = new Array(pdf.numPages);
    linkService.current.setDocument(pdf);
  }
  function onLoadError() {
    if (!pdfError) {
      return;
    }
    (0, import_warning2.default)(false, pdfError.toString());
    if (onLoadErrorProps) {
      onLoadErrorProps(pdfError);
    }
  }
  (0, import_react3.useEffect)(function resetDocument() {
    pdfDispatch({ type: "RESET" });
  }, [pdfDispatch, source]);
  (0, import_react3.useEffect)(function loadDocument() {
    if (!source) {
      return;
    }
    const documentInitParams = options ? Object.assign(Object.assign({}, source), options) : source;
    const destroyable = getDocument(documentInitParams);
    if (onLoadProgress) {
      destroyable.onProgress = onLoadProgress;
    }
    if (onPassword) {
      destroyable.onPassword = onPassword;
    }
    const loadingTask = destroyable;
    const loadingPromise = loadingTask.promise.then((nextPdf) => {
      pdfDispatch({ type: "RESOLVE", value: nextPdf });
    }).catch((error2) => {
      if (loadingTask.destroyed) {
        return;
      }
      pdfDispatch({ type: "REJECT", error: error2 });
    });
    return () => {
      loadingPromise.finally(() => loadingTask.destroy());
    };
  }, [options, pdfDispatch, source]);
  (0, import_react3.useEffect)(() => {
    if (typeof pdf === "undefined") {
      return;
    }
    if (pdf === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [pdf]);
  (0, import_react3.useEffect)(function setupLinkService() {
    linkService.current.setViewer(viewer.current);
    linkService.current.setExternalLinkRel(externalLinkRel);
    linkService.current.setExternalLinkTarget(externalLinkTarget);
  }, [externalLinkRel, externalLinkTarget]);
  const registerPage = (0, import_react3.useCallback)((pageIndex, ref2) => {
    pages.current[pageIndex] = ref2;
  }, []);
  const unregisterPage = (0, import_react3.useCallback)((pageIndex) => {
    delete pages.current[pageIndex];
  }, []);
  const childContext = (0, import_react3.useMemo)(() => ({
    imageResourcesPath,
    linkService: linkService.current,
    onItemClick,
    pdf,
    registerPage,
    renderMode,
    rotate,
    scale,
    unregisterPage
  }), [imageResourcesPath, onItemClick, pdf, registerPage, renderMode, rotate, scale, unregisterPage]);
  const eventProps = (0, import_react3.useMemo)(
    () => makeEventProps(otherProps, () => pdf),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps, pdf]
  );
  function renderChildren() {
    return (0, import_jsx_runtime2.jsx)(DocumentContext_default.Provider, { value: childContext, children });
  }
  function renderContent() {
    if (!file) {
      return (0, import_jsx_runtime2.jsx)(Message, { type: "no-data", children: typeof noData === "function" ? noData() : noData });
    }
    if (pdf === void 0 || pdf === null) {
      return (0, import_jsx_runtime2.jsx)(Message, { type: "loading", children: typeof loading === "function" ? loading() : loading });
    }
    if (pdf === false) {
      return (0, import_jsx_runtime2.jsx)(Message, { type: "error", children: typeof error === "function" ? error() : error });
    }
    return renderChildren();
  }
  return (0, import_jsx_runtime2.jsx)("div", Object.assign({
    className: clsx_default("react-pdf__Document", className),
    // Assertion is needed for React 18 compatibility
    ref: inputRef
  }, eventProps, { children: renderContent() }));
});
var Document_default = Document;

// node_modules/react-pdf/dist/Outline.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var import_react8 = __toESM(require_react(), 1);
var import_warning3 = __toESM(require_warning(), 1);

// node_modules/react-pdf/dist/OutlineContext.js
var import_react4 = __toESM(require_react(), 1);
var outlineContext = (0, import_react4.createContext)(null);
var OutlineContext_default = outlineContext;

// node_modules/react-pdf/dist/OutlineItem.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);

// node_modules/react-pdf/dist/Ref.js
var Ref = class {
  constructor({ num, gen }) {
    this.num = num;
    this.gen = gen;
  }
  toString() {
    let str = `${this.num}R`;
    if (this.gen !== 0) {
      str += this.gen;
    }
    return str;
  }
};

// node_modules/react-pdf/dist/shared/hooks/useCachedValue.js
var import_react5 = __toESM(require_react(), 1);
function useCachedValue(getter) {
  const ref = (0, import_react5.useRef)(void 0);
  const currentValue = ref.current;
  if (isDefined(currentValue)) {
    return () => currentValue;
  }
  return () => {
    const value = getter();
    ref.current = value;
    return value;
  };
}

// node_modules/react-pdf/dist/shared/hooks/useDocumentContext.js
var import_react6 = __toESM(require_react(), 1);
function useDocumentContext() {
  return (0, import_react6.useContext)(DocumentContext_default);
}

// node_modules/react-pdf/dist/shared/hooks/useOutlineContext.js
var import_react7 = __toESM(require_react(), 1);
function useOutlineContext() {
  return (0, import_react7.useContext)(OutlineContext_default);
}

// node_modules/react-pdf/dist/OutlineItem.js
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function OutlineItem(props) {
  const documentContext2 = useDocumentContext();
  const outlineContext2 = useOutlineContext();
  invariant(outlineContext2, "Unable to find Outline context.");
  const mergedProps = Object.assign(Object.assign(Object.assign({}, documentContext2), outlineContext2), props);
  const { item, linkService, onItemClick, pdf } = mergedProps, otherProps = __rest2(mergedProps, ["item", "linkService", "onItemClick", "pdf"]);
  invariant(pdf, "Attempted to load an outline, but no document was specified. Wrap <Outline /> in a <Document /> or pass explicit `pdf` prop.");
  const getDestination = useCachedValue(() => {
    if (typeof item.dest === "string") {
      return pdf.getDestination(item.dest);
    }
    return item.dest;
  });
  const getPageIndex = useCachedValue(async () => {
    const destination = await getDestination();
    if (!destination) {
      throw new Error("Destination not found.");
    }
    const [ref] = destination;
    return pdf.getPageIndex(new Ref(ref));
  });
  const getPageNumber = useCachedValue(async () => {
    const pageIndex = await getPageIndex();
    return pageIndex + 1;
  });
  function onClick(event) {
    event.preventDefault();
    invariant(onItemClick || linkService, "Either onItemClick callback or linkService must be defined in order to navigate to an outline item.");
    if (onItemClick) {
      Promise.all([getDestination(), getPageIndex(), getPageNumber()]).then(([dest, pageIndex, pageNumber]) => {
        onItemClick({
          dest,
          pageIndex,
          pageNumber
        });
      });
    } else if (linkService) {
      linkService.goToDestination(item.dest);
    }
  }
  function renderSubitems() {
    if (!item.items || !item.items.length) {
      return null;
    }
    const { items: subitems } = item;
    return (0, import_jsx_runtime3.jsx)("ul", { children: subitems.map((subitem, subitemIndex) => (0, import_jsx_runtime3.jsx)(OutlineItem, Object.assign({ item: subitem, pdf }, otherProps), typeof subitem.dest === "string" ? subitem.dest : subitemIndex)) });
  }
  return (0, import_jsx_runtime3.jsxs)("li", { children: [(0, import_jsx_runtime3.jsx)("a", { href: "#", onClick, children: item.title }), renderSubitems()] });
}

// node_modules/react-pdf/dist/Outline.js
var __rest3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function Outline(props) {
  const documentContext2 = useDocumentContext();
  const mergedProps = Object.assign(Object.assign({}, documentContext2), props);
  const { className, inputRef, onItemClick, onLoadError: onLoadErrorProps, onLoadSuccess: onLoadSuccessProps, pdf } = mergedProps, otherProps = __rest3(mergedProps, ["className", "inputRef", "onItemClick", "onLoadError", "onLoadSuccess", "pdf"]);
  invariant(pdf, "Attempted to load an outline, but no document was specified. Wrap <Outline /> in a <Document /> or pass explicit `pdf` prop.");
  const [outlineState, outlineDispatch] = useResolver();
  const { value: outline, error: outlineError } = outlineState;
  function onLoadSuccess() {
    if (typeof outline === "undefined" || outline === false) {
      return;
    }
    if (onLoadSuccessProps) {
      onLoadSuccessProps(outline);
    }
  }
  function onLoadError() {
    if (!outlineError) {
      return;
    }
    (0, import_warning3.default)(false, outlineError.toString());
    if (onLoadErrorProps) {
      onLoadErrorProps(outlineError);
    }
  }
  (0, import_react8.useEffect)(function resetOutline() {
    outlineDispatch({ type: "RESET" });
  }, [outlineDispatch, pdf]);
  (0, import_react8.useEffect)(function loadOutline() {
    if (!pdf) {
      return;
    }
    const cancellable = makeCancellablePromise(pdf.getOutline());
    const runningTask = cancellable;
    cancellable.promise.then((nextOutline) => {
      outlineDispatch({ type: "RESOLVE", value: nextOutline });
    }).catch((error) => {
      outlineDispatch({ type: "REJECT", error });
    });
    return () => cancelRunningTask(runningTask);
  }, [outlineDispatch, pdf]);
  (0, import_react8.useEffect)(() => {
    if (outline === void 0) {
      return;
    }
    if (outline === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [outline]);
  const childContext = (0, import_react8.useMemo)(() => ({
    onItemClick
  }), [onItemClick]);
  const eventProps = (0, import_react8.useMemo)(
    () => makeEventProps(otherProps, () => outline),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps, outline]
  );
  if (!outline) {
    return null;
  }
  function renderOutline() {
    if (!outline) {
      return null;
    }
    return (0, import_jsx_runtime4.jsx)("ul", { children: outline.map((item, itemIndex) => (0, import_jsx_runtime4.jsx)(OutlineItem, { item, pdf }, typeof item.dest === "string" ? item.dest : itemIndex)) });
  }
  return (0, import_jsx_runtime4.jsx)("div", Object.assign({ className: clsx_default("react-pdf__Outline", className), ref: inputRef }, eventProps, { children: (0, import_jsx_runtime4.jsx)(OutlineContext_default.Provider, { value: childContext, children: renderOutline() }) }));
}

// node_modules/react-pdf/dist/Page.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var import_react16 = __toESM(require_react(), 1);

// node_modules/merge-refs/dist/index.js
function mergeRefs() {
  var inputRefs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    inputRefs[_i] = arguments[_i];
  }
  var filteredInputRefs = inputRefs.filter(Boolean);
  if (filteredInputRefs.length <= 1) {
    var firstRef = filteredInputRefs[0];
    return firstRef || null;
  }
  return function mergedRefs(ref) {
    for (var _i2 = 0, filteredInputRefs_1 = filteredInputRefs; _i2 < filteredInputRefs_1.length; _i2++) {
      var inputRef = filteredInputRefs_1[_i2];
      if (typeof inputRef === "function") {
        inputRef(ref);
      } else if (inputRef) {
        inputRef.current = ref;
      }
    }
  };
}

// node_modules/react-pdf/dist/Page.js
var import_warning8 = __toESM(require_warning(), 1);

// node_modules/react-pdf/dist/PageContext.js
var import_react9 = __toESM(require_react(), 1);
var pageContext = (0, import_react9.createContext)(null);
var PageContext_default = pageContext;

// node_modules/react-pdf/dist/Page/Canvas.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var import_react13 = __toESM(require_react(), 1);
var import_warning5 = __toESM(require_warning(), 1);

// node_modules/react-pdf/dist/StructTree.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var import_react12 = __toESM(require_react(), 1);
var import_warning4 = __toESM(require_warning(), 1);

// node_modules/react-pdf/dist/StructTreeItem.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var import_react10 = __toESM(require_react(), 1);

// node_modules/react-pdf/dist/shared/constants.js
var PDF_ROLE_TO_HTML_ROLE = {
  // Document level structure types
  Document: null,
  // There's a "document" role, but it doesn't make sense here.
  DocumentFragment: null,
  // Grouping level structure types
  Part: "group",
  Sect: "group",
  // XXX: There's a "section" role, but it's abstract.
  Div: "group",
  Aside: "note",
  NonStruct: "none",
  // Block level structure types
  P: null,
  // H<n>,
  H: "heading",
  Title: null,
  FENote: "note",
  // Sub-block level structure type
  Sub: "group",
  // General inline level structure types
  Lbl: null,
  Span: null,
  Em: null,
  Strong: null,
  Link: "link",
  Annot: "note",
  Form: "form",
  // Ruby and Warichu structure types
  Ruby: null,
  RB: null,
  RT: null,
  RP: null,
  Warichu: null,
  WT: null,
  WP: null,
  // List standard structure types
  L: "list",
  LI: "listitem",
  LBody: null,
  // Table standard structure types
  Table: "table",
  TR: "row",
  TH: "columnheader",
  TD: "cell",
  THead: "columnheader",
  TBody: null,
  TFoot: null,
  // Standard structure type Caption
  Caption: null,
  // Standard structure type Figure
  Figure: "figure",
  // Standard structure type Formula
  Formula: null,
  // standard structure type Artifact
  Artifact: null
};
var HEADING_PATTERN = /^H(\d+)$/;

// node_modules/react-pdf/dist/shared/structTreeUtils.js
function isPdfRole(role) {
  return role in PDF_ROLE_TO_HTML_ROLE;
}
function isStructTreeNode(node) {
  return "children" in node;
}
function isStructTreeNodeWithOnlyContentChild(node) {
  if (!isStructTreeNode(node)) {
    return false;
  }
  return node.children.length === 1 && 0 in node.children && "id" in node.children[0];
}
function getRoleAttributes(node) {
  const attributes = {};
  if (isStructTreeNode(node)) {
    const { role } = node;
    const matches = role.match(HEADING_PATTERN);
    if (matches) {
      attributes.role = "heading";
      attributes["aria-level"] = Number(matches[1]);
    } else if (isPdfRole(role)) {
      const htmlRole = PDF_ROLE_TO_HTML_ROLE[role];
      if (htmlRole) {
        attributes.role = htmlRole;
      }
    }
  }
  return attributes;
}
function getBaseAttributes(node) {
  const attributes = {};
  if (isStructTreeNode(node)) {
    if (node.alt !== void 0) {
      attributes["aria-label"] = node.alt;
    }
    if (node.lang !== void 0) {
      attributes.lang = node.lang;
    }
    if (isStructTreeNodeWithOnlyContentChild(node)) {
      const [child] = node.children;
      if (child) {
        const childAttributes = getBaseAttributes(child);
        return Object.assign(Object.assign({}, attributes), childAttributes);
      }
    }
  } else {
    if ("id" in node) {
      attributes["aria-owns"] = node.id;
    }
  }
  return attributes;
}
function getAttributes(node) {
  if (!node) {
    return null;
  }
  return Object.assign(Object.assign({}, getRoleAttributes(node)), getBaseAttributes(node));
}

// node_modules/react-pdf/dist/StructTreeItem.js
function StructTreeItem({ className, node }) {
  const attributes = (0, import_react10.useMemo)(() => getAttributes(node), [node]);
  const children = (0, import_react10.useMemo)(() => {
    if (!isStructTreeNode(node)) {
      return null;
    }
    if (isStructTreeNodeWithOnlyContentChild(node)) {
      return null;
    }
    return node.children.map((child, index) => {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable here
        (0, import_jsx_runtime5.jsx)(StructTreeItem, { node: child }, index)
      );
    });
  }, [node]);
  return (0, import_jsx_runtime5.jsx)("span", Object.assign({ className }, attributes, { children }));
}

// node_modules/react-pdf/dist/shared/hooks/usePageContext.js
var import_react11 = __toESM(require_react(), 1);
function usePageContext() {
  return (0, import_react11.useContext)(PageContext_default);
}

// node_modules/react-pdf/dist/StructTree.js
function StructTree() {
  const pageContext2 = usePageContext();
  invariant(pageContext2, "Unable to find Page context.");
  const { onGetStructTreeError: onGetStructTreeErrorProps, onGetStructTreeSuccess: onGetStructTreeSuccessProps } = pageContext2;
  const [structTreeState, structTreeDispatch] = useResolver();
  const { value: structTree, error: structTreeError } = structTreeState;
  const { customTextRenderer, page } = pageContext2;
  function onLoadSuccess() {
    if (!structTree) {
      return;
    }
    if (onGetStructTreeSuccessProps) {
      onGetStructTreeSuccessProps(structTree);
    }
  }
  function onLoadError() {
    if (!structTreeError) {
      return;
    }
    (0, import_warning4.default)(false, structTreeError.toString());
    if (onGetStructTreeErrorProps) {
      onGetStructTreeErrorProps(structTreeError);
    }
  }
  (0, import_react12.useEffect)(function resetStructTree() {
    structTreeDispatch({ type: "RESET" });
  }, [structTreeDispatch, page]);
  (0, import_react12.useEffect)(function loadStructTree() {
    if (customTextRenderer) {
      return;
    }
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getStructTree());
    const runningTask = cancellable;
    cancellable.promise.then((nextStructTree) => {
      structTreeDispatch({ type: "RESOLVE", value: nextStructTree });
    }).catch((error) => {
      structTreeDispatch({ type: "REJECT", error });
    });
    return () => cancelRunningTask(runningTask);
  }, [customTextRenderer, page, structTreeDispatch]);
  (0, import_react12.useEffect)(() => {
    if (structTree === void 0) {
      return;
    }
    if (structTree === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [structTree]);
  if (!structTree) {
    return null;
  }
  return (0, import_jsx_runtime6.jsx)(StructTreeItem, { className: "react-pdf__Page__structTree structTree", node: structTree });
}

// node_modules/react-pdf/dist/Page/Canvas.js
var ANNOTATION_MODE = AnnotationMode;
function Canvas(props) {
  const pageContext2 = usePageContext();
  invariant(pageContext2, "Unable to find Page context.");
  const mergedProps = Object.assign(Object.assign({}, pageContext2), props);
  const { _className, canvasBackground, devicePixelRatio = getDevicePixelRatio(), onRenderError: onRenderErrorProps, onRenderSuccess: onRenderSuccessProps, page, renderForms, renderTextLayer, rotate, scale } = mergedProps;
  const { canvasRef } = props;
  invariant(page, "Attempted to render page canvas, but no page was specified.");
  const canvasElement = (0, import_react13.useRef)(null);
  function onRenderSuccess() {
    if (!page) {
      return;
    }
    if (onRenderSuccessProps) {
      onRenderSuccessProps(makePageCallback(page, scale));
    }
  }
  function onRenderError(error) {
    if (isCancelException(error)) {
      return;
    }
    (0, import_warning5.default)(false, error.toString());
    if (onRenderErrorProps) {
      onRenderErrorProps(error);
    }
  }
  const renderViewport = (0, import_react13.useMemo)(() => page.getViewport({ scale: scale * devicePixelRatio, rotation: rotate }), [devicePixelRatio, page, rotate, scale]);
  const viewport = (0, import_react13.useMemo)(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  (0, import_react13.useEffect)(function drawPageOnCanvas() {
    if (!page) {
      return;
    }
    page.cleanup();
    const { current: canvas } = canvasElement;
    if (!canvas) {
      return;
    }
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    canvas.style.visibility = "hidden";
    const renderContext = {
      annotationMode: renderForms ? ANNOTATION_MODE.ENABLE_FORMS : ANNOTATION_MODE.ENABLE,
      canvasContext: canvas.getContext("2d", { alpha: false }),
      viewport: renderViewport
    };
    if (canvasBackground) {
      renderContext.background = canvasBackground;
    }
    const cancellable = page.render(renderContext);
    const runningTask = cancellable;
    cancellable.promise.then(() => {
      canvas.style.visibility = "";
      onRenderSuccess();
    }).catch(onRenderError);
    return () => cancelRunningTask(runningTask);
  }, [canvasBackground, page, renderForms, renderViewport, viewport]);
  const cleanup = (0, import_react13.useCallback)(() => {
    const { current: canvas } = canvasElement;
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }, []);
  (0, import_react13.useEffect)(() => cleanup, [cleanup]);
  return (0, import_jsx_runtime7.jsx)("canvas", { className: `${_className}__canvas`, dir: "ltr", ref: mergeRefs(canvasRef, canvasElement), style: {
    display: "block",
    userSelect: "none"
  }, children: renderTextLayer ? (0, import_jsx_runtime7.jsx)(StructTree, {}) : null });
}

// node_modules/react-pdf/dist/Page/TextLayer.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var import_react14 = __toESM(require_react(), 1);
var import_warning6 = __toESM(require_warning(), 1);
function isTextItem(item) {
  return "str" in item;
}
function TextLayer2() {
  const pageContext2 = usePageContext();
  invariant(pageContext2, "Unable to find Page context.");
  const { customTextRenderer, onGetTextError, onGetTextSuccess, onRenderTextLayerError, onRenderTextLayerSuccess, page, pageIndex, pageNumber, rotate, scale } = pageContext2;
  invariant(page, "Attempted to load page text content, but no page was specified.");
  const [textContentState, textContentDispatch] = useResolver();
  const { value: textContent, error: textContentError } = textContentState;
  const layerElement = (0, import_react14.useRef)(null);
  (0, import_warning6.default)(Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--react-pdf-text-layer"), 10) === 1, "TextLayer styles not found. Read more: https://github.com/wojtekmaj/react-pdf#support-for-text-layer");
  function onLoadSuccess() {
    if (!textContent) {
      return;
    }
    if (onGetTextSuccess) {
      onGetTextSuccess(textContent);
    }
  }
  function onLoadError() {
    if (!textContentError) {
      return;
    }
    (0, import_warning6.default)(false, textContentError.toString());
    if (onGetTextError) {
      onGetTextError(textContentError);
    }
  }
  (0, import_react14.useEffect)(function resetTextContent() {
    textContentDispatch({ type: "RESET" });
  }, [page, textContentDispatch]);
  (0, import_react14.useEffect)(function loadTextContent() {
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getTextContent());
    const runningTask = cancellable;
    cancellable.promise.then((nextTextContent) => {
      textContentDispatch({ type: "RESOLVE", value: nextTextContent });
    }).catch((error) => {
      textContentDispatch({ type: "REJECT", error });
    });
    return () => cancelRunningTask(runningTask);
  }, [page, textContentDispatch]);
  (0, import_react14.useEffect)(() => {
    if (textContent === void 0) {
      return;
    }
    if (textContent === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [textContent]);
  const onRenderSuccess = (0, import_react14.useCallback)(() => {
    if (onRenderTextLayerSuccess) {
      onRenderTextLayerSuccess();
    }
  }, [onRenderTextLayerSuccess]);
  const onRenderError = (0, import_react14.useCallback)((error) => {
    (0, import_warning6.default)(false, error.toString());
    if (onRenderTextLayerError) {
      onRenderTextLayerError(error);
    }
  }, [onRenderTextLayerError]);
  function onMouseDown() {
    const layer = layerElement.current;
    if (!layer) {
      return;
    }
    layer.classList.add("selecting");
  }
  function onMouseUp() {
    const layer = layerElement.current;
    if (!layer) {
      return;
    }
    layer.classList.remove("selecting");
  }
  const viewport = (0, import_react14.useMemo)(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  (0, import_react14.useLayoutEffect)(function renderTextLayer() {
    if (!page || !textContent) {
      return;
    }
    const { current: layer } = layerElement;
    if (!layer) {
      return;
    }
    layer.innerHTML = "";
    const textContentSource = page.streamTextContent({ includeMarkedContent: true });
    const parameters = {
      container: layer,
      textContentSource,
      viewport
    };
    const cancellable = new TextLayer(parameters);
    const runningTask = cancellable;
    cancellable.render().then(() => {
      const end = document.createElement("div");
      end.className = "endOfContent";
      layer.append(end);
      const layerChildren = layer.querySelectorAll('[role="presentation"]');
      if (customTextRenderer) {
        let index = 0;
        textContent.items.forEach((item, itemIndex) => {
          if (!isTextItem(item)) {
            return;
          }
          const child = layerChildren[index];
          if (!child) {
            return;
          }
          const content = customTextRenderer(Object.assign({
            pageIndex,
            pageNumber,
            itemIndex
          }, item));
          child.innerHTML = content;
          index += item.str && item.hasEOL ? 2 : 1;
        });
      }
      onRenderSuccess();
    }).catch(onRenderError);
    return () => cancelRunningTask(runningTask);
  }, [
    customTextRenderer,
    onRenderError,
    onRenderSuccess,
    page,
    pageIndex,
    pageNumber,
    textContent,
    viewport
  ]);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: False positive caused by non interactive wrapper listening for bubbling events
    (0, import_jsx_runtime8.jsx)("div", { className: clsx_default("react-pdf__Page__textContent", "textLayer"), onMouseUp, onMouseDown, ref: layerElement })
  );
}

// node_modules/react-pdf/dist/Page/AnnotationLayer.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var import_react15 = __toESM(require_react(), 1);
var import_warning7 = __toESM(require_warning(), 1);
function AnnotationLayer2() {
  const documentContext2 = useDocumentContext();
  const pageContext2 = usePageContext();
  invariant(pageContext2, "Unable to find Page context.");
  const mergedProps = Object.assign(Object.assign({}, documentContext2), pageContext2);
  const { imageResourcesPath, linkService, onGetAnnotationsError: onGetAnnotationsErrorProps, onGetAnnotationsSuccess: onGetAnnotationsSuccessProps, onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps, onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps, page, pdf, renderForms, rotate, scale = 1 } = mergedProps;
  invariant(pdf, "Attempted to load page annotations, but no document was specified. Wrap <Page /> in a <Document /> or pass explicit `pdf` prop.");
  invariant(page, "Attempted to load page annotations, but no page was specified.");
  invariant(linkService, "Attempted to load page annotations, but no linkService was specified.");
  const [annotationsState, annotationsDispatch] = useResolver();
  const { value: annotations, error: annotationsError } = annotationsState;
  const layerElement = (0, import_react15.useRef)(null);
  (0, import_warning7.default)(Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--react-pdf-annotation-layer"), 10) === 1, "AnnotationLayer styles not found. Read more: https://github.com/wojtekmaj/react-pdf#support-for-annotations");
  function onLoadSuccess() {
    if (!annotations) {
      return;
    }
    if (onGetAnnotationsSuccessProps) {
      onGetAnnotationsSuccessProps(annotations);
    }
  }
  function onLoadError() {
    if (!annotationsError) {
      return;
    }
    (0, import_warning7.default)(false, annotationsError.toString());
    if (onGetAnnotationsErrorProps) {
      onGetAnnotationsErrorProps(annotationsError);
    }
  }
  (0, import_react15.useEffect)(function resetAnnotations() {
    annotationsDispatch({ type: "RESET" });
  }, [annotationsDispatch, page]);
  (0, import_react15.useEffect)(function loadAnnotations() {
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getAnnotations());
    const runningTask = cancellable;
    cancellable.promise.then((nextAnnotations) => {
      annotationsDispatch({ type: "RESOLVE", value: nextAnnotations });
    }).catch((error) => {
      annotationsDispatch({ type: "REJECT", error });
    });
    return () => {
      cancelRunningTask(runningTask);
    };
  }, [annotationsDispatch, page]);
  (0, import_react15.useEffect)(() => {
    if (annotations === void 0) {
      return;
    }
    if (annotations === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [annotations]);
  function onRenderSuccess() {
    if (onRenderAnnotationLayerSuccessProps) {
      onRenderAnnotationLayerSuccessProps();
    }
  }
  function onRenderError(error) {
    (0, import_warning7.default)(false, `${error}`);
    if (onRenderAnnotationLayerErrorProps) {
      onRenderAnnotationLayerErrorProps(error);
    }
  }
  const viewport = (0, import_react15.useMemo)(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  (0, import_react15.useEffect)(function renderAnnotationLayer() {
    if (!pdf || !page || !linkService || !annotations) {
      return;
    }
    const { current: layer } = layerElement;
    if (!layer) {
      return;
    }
    const clonedViewport = viewport.clone({ dontFlip: true });
    const annotationLayerParameters = {
      accessibilityManager: null,
      // TODO: Implement this
      annotationCanvasMap: null,
      // TODO: Implement this
      annotationEditorUIManager: null,
      // TODO: Implement this
      div: layer,
      l10n: null,
      // TODO: Implement this
      page,
      structTreeLayer: null,
      // TODO: Implement this
      viewport: clonedViewport
    };
    const renderParameters = {
      annotations,
      annotationStorage: pdf.annotationStorage,
      div: layer,
      imageResourcesPath,
      linkService,
      page,
      renderForms,
      viewport: clonedViewport
    };
    layer.innerHTML = "";
    try {
      new AnnotationLayer(annotationLayerParameters).render(renderParameters);
      onRenderSuccess();
    } catch (error) {
      onRenderError(error);
    }
    return () => {
    };
  }, [annotations, imageResourcesPath, linkService, page, pdf, renderForms, viewport]);
  return (0, import_jsx_runtime9.jsx)("div", { className: clsx_default("react-pdf__Page__annotations", "annotationLayer"), ref: layerElement });
}

// node_modules/react-pdf/dist/Page.js
var __rest4 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var defaultScale = 1;
function Page(props) {
  const documentContext2 = useDocumentContext();
  const mergedProps = Object.assign(Object.assign({}, documentContext2), props);
  const { _className = "react-pdf__Page", _enableRegisterUnregisterPage = true, canvasBackground, canvasRef, children, className, customRenderer: CustomRenderer, customTextRenderer, devicePixelRatio, error = "Failed to load the page.", height, inputRef, loading = "Loading page…", noData = "No page specified.", onGetAnnotationsError: onGetAnnotationsErrorProps, onGetAnnotationsSuccess: onGetAnnotationsSuccessProps, onGetStructTreeError: onGetStructTreeErrorProps, onGetStructTreeSuccess: onGetStructTreeSuccessProps, onGetTextError: onGetTextErrorProps, onGetTextSuccess: onGetTextSuccessProps, onLoadError: onLoadErrorProps, onLoadSuccess: onLoadSuccessProps, onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps, onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps, onRenderError: onRenderErrorProps, onRenderSuccess: onRenderSuccessProps, onRenderTextLayerError: onRenderTextLayerErrorProps, onRenderTextLayerSuccess: onRenderTextLayerSuccessProps, pageIndex: pageIndexProps, pageNumber: pageNumberProps, pdf, registerPage, renderAnnotationLayer: renderAnnotationLayerProps = true, renderForms = false, renderMode = "canvas", renderTextLayer: renderTextLayerProps = true, rotate: rotateProps, scale: scaleProps = defaultScale, unregisterPage, width } = mergedProps, otherProps = __rest4(mergedProps, ["_className", "_enableRegisterUnregisterPage", "canvasBackground", "canvasRef", "children", "className", "customRenderer", "customTextRenderer", "devicePixelRatio", "error", "height", "inputRef", "loading", "noData", "onGetAnnotationsError", "onGetAnnotationsSuccess", "onGetStructTreeError", "onGetStructTreeSuccess", "onGetTextError", "onGetTextSuccess", "onLoadError", "onLoadSuccess", "onRenderAnnotationLayerError", "onRenderAnnotationLayerSuccess", "onRenderError", "onRenderSuccess", "onRenderTextLayerError", "onRenderTextLayerSuccess", "pageIndex", "pageNumber", "pdf", "registerPage", "renderAnnotationLayer", "renderForms", "renderMode", "renderTextLayer", "rotate", "scale", "unregisterPage", "width"]);
  const [pageState, pageDispatch] = useResolver();
  const { value: page, error: pageError } = pageState;
  const pageElement = (0, import_react16.useRef)(null);
  invariant(pdf, "Attempted to load a page, but no document was specified. Wrap <Page /> in a <Document /> or pass explicit `pdf` prop.");
  const pageIndex = isProvided(pageNumberProps) ? pageNumberProps - 1 : pageIndexProps !== null && pageIndexProps !== void 0 ? pageIndexProps : null;
  const pageNumber = pageNumberProps !== null && pageNumberProps !== void 0 ? pageNumberProps : isProvided(pageIndexProps) ? pageIndexProps + 1 : null;
  const rotate = rotateProps !== null && rotateProps !== void 0 ? rotateProps : page ? page.rotate : null;
  const scale = (0, import_react16.useMemo)(() => {
    if (!page) {
      return null;
    }
    let pageScale = 1;
    const scaleWithDefault = scaleProps !== null && scaleProps !== void 0 ? scaleProps : defaultScale;
    if (width || height) {
      const viewport = page.getViewport({ scale: 1, rotation: rotate });
      if (width) {
        pageScale = width / viewport.width;
      } else if (height) {
        pageScale = height / viewport.height;
      }
    }
    return scaleWithDefault * pageScale;
  }, [height, page, rotate, scaleProps, width]);
  (0, import_react16.useEffect)(function hook() {
    return () => {
      if (!isProvided(pageIndex)) {
        return;
      }
      if (_enableRegisterUnregisterPage && unregisterPage) {
        unregisterPage(pageIndex);
      }
    };
  }, [_enableRegisterUnregisterPage, pdf, pageIndex, unregisterPage]);
  function onLoadSuccess() {
    if (onLoadSuccessProps) {
      if (!page || !scale) {
        return;
      }
      onLoadSuccessProps(makePageCallback(page, scale));
    }
    if (_enableRegisterUnregisterPage && registerPage) {
      if (!isProvided(pageIndex) || !pageElement.current) {
        return;
      }
      registerPage(pageIndex, pageElement.current);
    }
  }
  function onLoadError() {
    if (!pageError) {
      return;
    }
    (0, import_warning8.default)(false, pageError.toString());
    if (onLoadErrorProps) {
      onLoadErrorProps(pageError);
    }
  }
  (0, import_react16.useEffect)(function resetPage() {
    pageDispatch({ type: "RESET" });
  }, [pageDispatch, pdf, pageIndex]);
  (0, import_react16.useEffect)(function loadPage() {
    if (!pdf || !pageNumber) {
      return;
    }
    const cancellable = makeCancellablePromise(pdf.getPage(pageNumber));
    const runningTask = cancellable;
    cancellable.promise.then((nextPage) => {
      pageDispatch({ type: "RESOLVE", value: nextPage });
    }).catch((error2) => {
      pageDispatch({ type: "REJECT", error: error2 });
    });
    return () => cancelRunningTask(runningTask);
  }, [pageDispatch, pdf, pageNumber]);
  (0, import_react16.useEffect)(() => {
    if (page === void 0) {
      return;
    }
    if (page === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [page, scale]);
  const childContext = (0, import_react16.useMemo)(() => (
    // Technically there cannot be page without pageIndex, pageNumber, rotate and scale, but TypeScript doesn't know that
    page && isProvided(pageIndex) && pageNumber && isProvided(rotate) && isProvided(scale) ? {
      _className,
      canvasBackground,
      customTextRenderer,
      devicePixelRatio,
      onGetAnnotationsError: onGetAnnotationsErrorProps,
      onGetAnnotationsSuccess: onGetAnnotationsSuccessProps,
      onGetStructTreeError: onGetStructTreeErrorProps,
      onGetStructTreeSuccess: onGetStructTreeSuccessProps,
      onGetTextError: onGetTextErrorProps,
      onGetTextSuccess: onGetTextSuccessProps,
      onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps,
      onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps,
      onRenderError: onRenderErrorProps,
      onRenderSuccess: onRenderSuccessProps,
      onRenderTextLayerError: onRenderTextLayerErrorProps,
      onRenderTextLayerSuccess: onRenderTextLayerSuccessProps,
      page,
      pageIndex,
      pageNumber,
      renderForms,
      renderTextLayer: renderTextLayerProps,
      rotate,
      scale
    } : null
  ), [
    _className,
    canvasBackground,
    customTextRenderer,
    devicePixelRatio,
    onGetAnnotationsErrorProps,
    onGetAnnotationsSuccessProps,
    onGetStructTreeErrorProps,
    onGetStructTreeSuccessProps,
    onGetTextErrorProps,
    onGetTextSuccessProps,
    onRenderAnnotationLayerErrorProps,
    onRenderAnnotationLayerSuccessProps,
    onRenderErrorProps,
    onRenderSuccessProps,
    onRenderTextLayerErrorProps,
    onRenderTextLayerSuccessProps,
    page,
    pageIndex,
    pageNumber,
    renderForms,
    renderTextLayerProps,
    rotate,
    scale
  ]);
  const eventProps = (0, import_react16.useMemo)(
    () => makeEventProps(otherProps, () => page ? scale ? makePageCallback(page, scale) : void 0 : page),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps, page, scale]
  );
  const pageKey = `${pageIndex}@${scale}/${rotate}`;
  function renderMainLayer() {
    switch (renderMode) {
      case "custom": {
        invariant(CustomRenderer, `renderMode was set to "custom", but no customRenderer was passed.`);
        return (0, import_jsx_runtime10.jsx)(CustomRenderer, {}, `${pageKey}_custom`);
      }
      case "none":
        return null;
      case "canvas":
      default:
        return (0, import_jsx_runtime10.jsx)(Canvas, { canvasRef }, `${pageKey}_canvas`);
    }
  }
  function renderTextLayer() {
    if (!renderTextLayerProps) {
      return null;
    }
    return (0, import_jsx_runtime10.jsx)(TextLayer2, {}, `${pageKey}_text`);
  }
  function renderAnnotationLayer() {
    if (!renderAnnotationLayerProps) {
      return null;
    }
    return (0, import_jsx_runtime10.jsx)(AnnotationLayer2, {}, `${pageKey}_annotations`);
  }
  function renderChildren() {
    return (0, import_jsx_runtime10.jsxs)(PageContext_default.Provider, { value: childContext, children: [renderMainLayer(), renderTextLayer(), renderAnnotationLayer(), children] });
  }
  function renderContent() {
    if (!pageNumber) {
      return (0, import_jsx_runtime10.jsx)(Message, { type: "no-data", children: typeof noData === "function" ? noData() : noData });
    }
    if (pdf === null || page === void 0 || page === null) {
      return (0, import_jsx_runtime10.jsx)(Message, { type: "loading", children: typeof loading === "function" ? loading() : loading });
    }
    if (pdf === false || page === false) {
      return (0, import_jsx_runtime10.jsx)(Message, { type: "error", children: typeof error === "function" ? error() : error });
    }
    return renderChildren();
  }
  return (0, import_jsx_runtime10.jsx)("div", Object.assign({
    className: clsx_default(_className, className),
    "data-page-number": pageNumber,
    // Assertion is needed for React 18 compatibility
    ref: mergeRefs(inputRef, pageElement),
    style: {
      "--scale-round-x": "1px",
      "--scale-round-y": "1px",
      "--scale-factor": "1",
      "--user-unit": `${scale}`,
      "--total-scale-factor": "calc(var(--scale-factor) * var(--user-unit))",
      backgroundColor: canvasBackground || "white",
      position: "relative",
      minWidth: "min-content",
      minHeight: "min-content"
    }
  }, eventProps, { children: renderContent() }));
}

// node_modules/react-pdf/dist/Thumbnail.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var __rest5 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function Thumbnail(props) {
  const documentContext2 = useDocumentContext();
  const mergedProps = Object.assign(Object.assign({}, documentContext2), props);
  const { className, linkService, onItemClick, pageIndex: pageIndexProps, pageNumber: pageNumberProps, pdf } = mergedProps;
  invariant(pdf, "Attempted to load a thumbnail, but no document was specified. Wrap <Thumbnail /> in a <Document /> or pass explicit `pdf` prop.");
  const pageIndex = isProvided(pageNumberProps) ? pageNumberProps - 1 : pageIndexProps !== null && pageIndexProps !== void 0 ? pageIndexProps : null;
  const pageNumber = pageNumberProps !== null && pageNumberProps !== void 0 ? pageNumberProps : isProvided(pageIndexProps) ? pageIndexProps + 1 : null;
  function onClick(event) {
    event.preventDefault();
    if (!isProvided(pageIndex) || !pageNumber) {
      return;
    }
    invariant(onItemClick || linkService, "Either onItemClick callback or linkService must be defined in order to navigate to an outline item.");
    if (onItemClick) {
      onItemClick({
        pageIndex,
        pageNumber
      });
    } else if (linkService) {
      linkService.goToPage(pageNumber);
    }
  }
  const { className: classNameProps, onItemClick: onItemClickProps } = props, pageProps = __rest5(props, ["className", "onItemClick"]);
  return (0, import_jsx_runtime11.jsx)("a", { className: clsx_default("react-pdf__Thumbnail", className), href: pageNumber ? "#" : void 0, onClick, children: (0, import_jsx_runtime11.jsx)(Page, Object.assign({}, pageProps, { _className: "react-pdf__Thumbnail__page", _enableRegisterUnregisterPage: false, renderAnnotationLayer: false, renderTextLayer: false })) });
}

// node_modules/react-pdf/dist/index.js
displayWorkerWarning();
GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";
export {
  Document_default as Document,
  Outline,
  Page,
  PasswordResponses_default as PasswordResponses,
  Thumbnail,
  pdf_exports as pdfjs,
  useDocumentContext,
  useOutlineContext,
  usePageContext
};
//# sourceMappingURL=react-pdf.js.map
