// @ts-nocheck
import { HighPassFilter } from "../../types/filters";
import { meanFilter } from "./LowPassFilters";

export const executeHighPassFilter = (
  image: HTMLCanvasElement,
  highPassFilterType: HighPassFilter,
  factor?: number
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (highPassFilterType) {
    case HighPassFilter.H1:
      resultingImageCanvas = highPassFilter(image, h1Mask);
      break;
    case HighPassFilter.H2:
      resultingImageCanvas = highPassFilter(image, h2Mask);
      break;
    case HighPassFilter.M1:
      resultingImageCanvas = highPassFilter(image, m1Mask);
      break;
    case HighPassFilter.M2:
      resultingImageCanvas = highPassFilter(image, m2Mask);
      break;
    case HighPassFilter.M3:
      resultingImageCanvas = highPassFilter(image, m3Mask);
      break;
    case HighPassFilter.HIGH_BOOST:
      resultingImageCanvas = highBoost(image, factor);
      break;
    default:
      break;
  }

  return resultingImageCanvas;
};

const h1Mask = [
  [0, -1, 0],
  [-1, 4, -1],
  [0, -1, 0],
];

const h2Mask = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

const m1Mask = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1],
];

const m2Mask = [
  [1, -2, 1],
  [-2, 5, -2],
  [1, -2, 1],
];

const m3Mask = [
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0],
];

const highPassFilter = (
  image: HTMLCanvasElement,
  mask: number[][]
): HTMLCanvasElement => {
  const ctxIn = image.getContext("2d");
  const canvasOut = document.createElement("canvas");
  const ctxOut = canvasOut.getContext("2d");

  if (!ctxIn || !ctxOut) {
    throw new Error("Não foi possível obter os contextos 2D dos canvas.");
  }

  canvasOut.width = image.width;
  canvasOut.height = image.height;

  const imageDataIn = ctxIn.getImageData(0, 0, image.width, image.height);
  const dataIn = imageDataIn.data;

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const pixelX = x + i;
          const pixelY = y + j;

          if (
            pixelX >= 0 &&
            pixelX < image.width &&
            pixelY >= 0 &&
            pixelY < image.height
          ) {
            const index = (pixelY * image.width + pixelX) * 4;
            const maskValue = mask[j + 1][i + 1];

            r += dataIn[index] * maskValue;
            g += dataIn[index + 1] * maskValue;
            b += dataIn[index + 2] * maskValue;
          }
        }
      }

      ctxOut.fillStyle = `rgba(${r}, ${g}, ${b}, 255)`;
      ctxOut.fillRect(x, y, 1, 1);
    }
  }

  return canvasOut;
};

const highBoost = (
  image: HTMLCanvasElement,
  amplificationFactor: number
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error("Canvas 2D context is not supported.");
  }

  canvas.width = image.width - 1;
  canvas.height = image.height - 1;

  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imgData = ctx.getImageData(0, 0, image.width, image.height);

  const mask = [-1, -1, -1, -1, (9 * amplificationFactor) - 1, -1, -1, -1, -1];

  const reds = [];
  const greens = [];
  const blues = [];

  for (let y = 1; y <= image.height - 1; y++) {
    for (let x = 1; x <= image.width - 1; x++) {
      const v0 = getPixelIndex(x - 1, y - 1, image.width);
      const v1 = getPixelIndex(x, y - 1, image.width);
      const v2 = getPixelIndex(x + 1, y - 1, image.width);
      const v3 = getPixelIndex(x - 1, y, image.width);
      const pixel = getPixelIndex(x, y, image.width);
      const v5 = getPixelIndex(x + 1, y, image.width);
      const v6 = getPixelIndex(x - 1, y + 1, image.width);
      const v7 = getPixelIndex(x, y + 1, image.width);
      const v8 = getPixelIndex(x + 1, y + 1, image.width);

      const rValues = [
        imgData.data[v0],
        imgData.data[v1],
        imgData.data[v2],
        imgData.data[v3],
        imgData.data[pixel],
        imgData.data[v5],
        imgData.data[v6],
        imgData.data[v7],
        imgData.data[v8]
      ];

      const gValues = [
        imgData.data[v0 + 1],
        imgData.data[v1 + 1],
        imgData.data[v2 + 1],
        imgData.data[v3 + 1],
        imgData.data[pixel + 1],
        imgData.data[v5 + 1],
        imgData.data[v6 + 1],
        imgData.data[v7 + 1],
        imgData.data[v8 + 1]
      ];

      const bValues = [
        imgData.data[v0 + 2],
        imgData.data[v1 + 2],
        imgData.data[v2 + 2],
        imgData.data[v3 + 2],
        imgData.data[pixel + 2],
        imgData.data[v5 + 2],
        imgData.data[v6 + 2],
        imgData.data[v7 + 2],
        imgData.data[v8 + 2]
      ];

      const aR = applyMask(mask, rValues);
      const aG = applyMask(mask, gValues);
      const aB = applyMask(mask, bValues);

      reds.push(aR);
      greens.push(aG);
      blues.push(aB);
    }
  }

  let j = 0;
  const newImgData = new ImageData(image.width - 1, image.height - 1);
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j];
    newImgData.data[i + 1] = greens[j];
    newImgData.data[i + 2] = blues[j];
    newImgData.data[i + 3] = 255;
    j++;
  }

  canvas.width = image.width - 1;
  canvas.height = image.height - 1;
  ctx.putImageData(newImgData, 0, 0);

  return canvas;
};

function applyMask(mask: number[], values: number[]): number {
  let sum = 0;
  for (let i = 0; i < mask.length; i++) {
    sum += mask[i] * values[i];
  }
  return sum;
}

function getPixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}
