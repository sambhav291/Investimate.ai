import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

GlobalWorkerOptions.workerPort = new pdfjsWorker.default();
