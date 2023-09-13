import { BorderDetectionFilter } from "../../types/filters";
import { applyMask, getPixelIndex } from "../usualFunctions";

export const executeBorderDetection = (
  image: HTMLCanvasElement,
  borderDetectionType: BorderDetectionFilter
) => {
  let resultingImageCanvas = null;

  switch (borderDetectionType) {
    case BorderDetectionFilter.ROBERTS:
      resultingImageCanvas = roberts(image, ROBERTS_X_MASK, ROBERTS_Y_MASK);
      break;
    case BorderDetectionFilter.CROSSED_ROBERTS:
      resultingImageCanvas = roberts(
        image,
        CROSSED_ROBERTS_X_MASK,
        CROSSED_ROBERTS_Y_MASK
      );
      break;
    case BorderDetectionFilter.PREWIIT_GX:
      resultingImageCanvas = prewiitGxGy(image, PREWIIT_GX_MASK);
      break;
    case BorderDetectionFilter.PREWIIT_GY:
      resultingImageCanvas = prewiitGxGy(image, PREWIIT_GY_MASK);
      break;
    case BorderDetectionFilter.MAGNITUDE_PREWIIT:
      resultingImageCanvas = magnitudePrewiit(image);
      break;
    case BorderDetectionFilter.SOBEL_GX:
      break;
    case BorderDetectionFilter.SOBEL_GY:
      break;
    case BorderDetectionFilter.MAGNITUDE_SOBEL:
      break;
    case BorderDetectionFilter.KRISH:
      break;
    case BorderDetectionFilter.ROBINSON:
      break;
    case BorderDetectionFilter.FREY_CHEN:
      break;
    case BorderDetectionFilter.LAPLACIAN_H1:
      break;
    case BorderDetectionFilter.LAPLACIAN_H2:
      break;
    default:
      console.warn("Invalid border detection filter selected.");
      break;
  }
  return resultingImageCanvas;
};

const ROBERTS_X_MASK = [1, 0, -1, 0];
const ROBERTS_Y_MASK = [1, -1, 0, 0];

const CROSSED_ROBERTS_X_MASK = [1, 0, 0, -1];
const CROSSED_ROBERTS_Y_MASK = [0, 1, -1, 0];

const PREWIIT_GX_MASK = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const PREWIIT_GY_MASK = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

const roberts = (
  image: HTMLCanvasElement,
  xMask: number[],
  yMask: number[]
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not available.");
  }

  canvas.width = image.width - 1;
  canvas.height = image.height - 1;

  const imgData = image
    .getContext("2d")
    .getImageData(0, 0, image.width, image.height);
  const newImgData = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 1; y < image.height; y++) {
    for (let x = 1; x < image.width; x++) {
      const pixel = getPixelIndex(x, y, image.width);
      const v1 = getPixelIndex(x + 1, y, image.width);
      const v2 = getPixelIndex(x, y + 1, image.width);
      const v3 = getPixelIndex(x + 1, y + 1, image.width);

      const rValues = [
        imgData.data[v1],
        imgData.data[v2],
        imgData.data[v3],
        imgData.data[pixel],
      ];
      const gValues = [
        imgData.data[v1 + 1],
        imgData.data[v2 + 1],
        imgData.data[v3 + 1],
        imgData.data[pixel + 1],
      ];
      const bValues = [
        imgData.data[v1 + 2],
        imgData.data[v2 + 2],
        imgData.data[v3 + 2],
        imgData.data[pixel + 2],
      ];

      const gRX = applyMask(xMask, rValues);
      const gRY = applyMask(yMask, rValues);
      const tR = Math.abs(gRX + gRY);

      const gGX = applyMask(xMask, gValues);
      const gGY = applyMask(yMask, gValues);
      const tG = Math.abs(gGX + gGY);

      const gBX = applyMask(xMask, bValues);
      const gBY = applyMask(yMask, bValues);
      const tB = Math.abs(gBX + gBY);

      setPixel(newImgData, x - 1, y - 1, tR, tG, tB, 255, canvas.width);
    }
  }

  ctx.putImageData(newImgData, 0, 0);
  return canvas;
};

const prewiitGxGy = (
  image: HTMLCanvasElement,
  mask: number[]
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const newImageData = new ImageData(image.width - 1, image.height - 1);

  for (let y = 1; y < image.height - 1; y++) {
    for (let x = 1; x < image.width - 1; x++) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const pixelIndex = ((y + j) * image.width + (x + i)) * 4;
          const maskValue = mask[(j + 1) * 3 + (i + 1)];

          sumR += imageData.data[pixelIndex] * maskValue;
          sumG += imageData.data[pixelIndex + 1] * maskValue;
          sumB += imageData.data[pixelIndex + 2] * maskValue;
        }
      }

      const resultIndex = ((y - 1) * (image.width - 1) + (x - 1)) * 4;
      newImageData.data[resultIndex] = Math.abs(sumR);
      newImageData.data[resultIndex + 1] = Math.abs(sumG);
      newImageData.data[resultIndex + 2] = Math.abs(sumB);
      newImageData.data[resultIndex + 3] = 255;
    }
  }

  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = image.width - 1;
  resultCanvas.height = image.height - 1;
  const resultCtx = resultCanvas.getContext("2d");
  resultCtx.putImageData(newImageData, 0, 0);

  return resultCanvas;
};

const magnitudePrewiit = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const newImageData = new ImageData(image.width - 1, image.height - 1);

  for (let y = 1; y < image.height - 1; y++) {
    for (let x = 1; x < image.width - 1; x++) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const pixelIndex = ((y + j) * image.width + (x + i)) * 4;
          const maskValueX = PREWIIT_GX_MASK[(j + 1) * 3 + (i + 1)];
          const maskValueY = PREWIIT_GY_MASK[(j + 1) * 3 + (i + 1)];

          sumR +=
            imageData.data[pixelIndex] * maskValueX +
            imageData.data[pixelIndex] * maskValueY;
          sumG +=
            imageData.data[pixelIndex + 1] * maskValueX +
            imageData.data[pixelIndex + 1] * maskValueY;
          sumB +=
            imageData.data[pixelIndex + 2] * maskValueX +
            imageData.data[pixelIndex + 2] * maskValueY;
        }
      }

      const resultIndex = ((y - 1) * (image.width - 1) + (x - 1)) * 4;
      const magnitude = Math.sqrt(sumR ** 2 + sumG ** 2 + sumB ** 2);

      newImageData.data[resultIndex] = magnitude;
      newImageData.data[resultIndex + 1] = magnitude;
      newImageData.data[resultIndex + 2] = magnitude;
      newImageData.data[resultIndex + 3] = 255;
    }
  }

  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = image.width - 1;
  resultCanvas.height = image.height - 1;
  const resultCtx = resultCanvas.getContext("2d");
  resultCtx.putImageData(newImageData, 0, 0);

  return resultCanvas;
};

function setPixel(
  imgData: ImageData,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number,
  width: number
) {
  const index = getPixelIndex(x, y, width);
  imgData.data[index] = r;
  imgData.data[index + 1] = g;
  imgData.data[index + 2] = b;
  imgData.data[index + 3] = a;
}
