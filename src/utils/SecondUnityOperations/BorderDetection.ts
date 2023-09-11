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
      break;
    case BorderDetectionFilter.PREWIIT_GY:
      break;
    case BorderDetectionFilter.MAGNITUDE_PREWIITE:
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
