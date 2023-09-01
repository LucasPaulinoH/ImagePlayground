import { HighPassFilters } from "../../types/filters";
import { extractCanvasImageMatrix } from "../usualFunctions";
import { meanFilter } from "./LowPassFilters";

export const executeHighPassFilter = (
  image: HTMLCanvasElement,
  highPassFilterType: HighPassFilters,
  factor?: number
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (highPassFilterType) {
    case HighPassFilters.H1:
      resultingImageCanvas = highPassFilter(image, h1Mask);
      break;
    case HighPassFilters.H2:
      resultingImageCanvas = highPassFilter(image, h2Mask);
      break;
    case HighPassFilters.M1:
      resultingImageCanvas = highPassFilter(image, m1Mask);
      break;
    case HighPassFilters.M2:
      resultingImageCanvas = highPassFilter(image, m2Mask);
      break;
    case HighPassFilters.M3:
      resultingImageCanvas = highPassFilter(image, m3Mask);
      break;
    case HighPassFilters.HIGH_BOOST:
      resultingImageCanvas = highBoost(image, 2);
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
  const lowPassImageResult = meanFilter(image, 3);

  const resultContext = lowPassImageResult.getContext('2d')!;
  const resultImageData = resultContext.getImageData(
    0,
    0,
    image.width,
    image.height,
  );

  const parsedFactor = amplificationFactor - 1;
  
  for (let i = 0; i < resultImageData.data.length; i++) {
    if((i % 4) !== 3){
      resultImageData.data[i] =
      (1 + parsedFactor) * resultImageData.data[i] -
      resultImageData.data[i + 12 + 4 + (i % 4)];
    }
  }

  resultContext.putImageData(resultImageData, 0, 0);
  return lowPassImageResult;
};
