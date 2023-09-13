import { BorderDetectionFilter } from "../../types/filters";
import { applyMask, calculateMax, getPixelIndex } from "../usualFunctions";

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
      resultingImageCanvas = magnitude(image, PREWIIT_GX_MASK, PREWIIT_GY_MASK);
      break;
    case BorderDetectionFilter.SOBEL_GX:
      resultingImageCanvas = sobelGxGy(image, SOBEL_GX_MASK);
      break;
    case BorderDetectionFilter.SOBEL_GY:
      resultingImageCanvas = sobelGxGy(image, SOBEL_GY_MASK);
      break;
    case BorderDetectionFilter.MAGNITUDE_SOBEL:
      resultingImageCanvas = magnitude(image, SOBEL_GX_MASK, SOBEL_GY_MASK);
      break;
    case BorderDetectionFilter.KRISH:
      resultingImageCanvas = krish(image);
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

const SOBEL_GX_MASK = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
const SOBEL_GY_MASK = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

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

const sobelGxGy = (
  image: HTMLCanvasElement,
  mask: number[]
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const imgData = ctx.getImageData(0, 0, image.width, image.height);

  const newImgData = new ImageData(image.width - 1, image.height - 1);

  for (let y = 1; y < image.height - 1; y++) {
    for (let x = 1; x < image.width - 1; x++) {
      const valuesR = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const pixelIndex = getPixelIndex(x + dx, y + dy, imgData.width);
          valuesR.push(imgData.data[pixelIndex]);
        }
      }
      const gXR = Math.abs(applyMask(mask, valuesR));
      const pixelIndex = getPixelIndex(x, y, newImgData.width);
      newImgData.data[pixelIndex] = gXR;
      newImgData.data[pixelIndex + 1] = gXR;
      newImgData.data[pixelIndex + 2] = gXR;
      newImgData.data[pixelIndex + 3] = 255;
    }
  }

  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = newImgData.width;
  resultCanvas.height = newImgData.height;
  const resultCtx = resultCanvas.getContext("2d");
  resultCtx.putImageData(newImgData, 0, 0);

  return resultCanvas;
};

const magnitude = (
  image: HTMLCanvasElement,
  gxMask: number[],
  gyMask: number[]
): HTMLCanvasElement => {
  let gxCanvas = null;
  let gyCanvas = null;

  if (gxMask == PREWIIT_GX_MASK) {
    gxCanvas = prewiitGxGy(image, gxMask);
    gyCanvas = prewiitGxGy(image, gyMask);
  } else {
    gxCanvas = sobelGxGy(image, gxMask);
    gyCanvas = sobelGxGy(image, gyMask);
  }

  const gxCtx = gxCanvas.getContext("2d");
  const gyCtx = gyCanvas.getContext("2d");

  const gxData = gxCtx.getImageData(0, 0, gxCanvas.width, gxCanvas.height);
  const gyData = gyCtx.getImageData(0, 0, gyCanvas.width, gyCanvas.height);

  const newImgData = new ImageData(gxCanvas.width, gxCanvas.height);

  for (let i = 0; i < gxData.data.length; i += 4) {
    const gxValue = gxData.data[i];
    const gyValue = gyData.data[i];

    const magnitude = Math.sqrt(gxValue * gxValue + gyValue * gyValue);

    newImgData.data[i] = magnitude;
    newImgData.data[i + 1] = magnitude;
    newImgData.data[i + 2] = magnitude;
    newImgData.data[i + 3] = 255;
  }

  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = gxCanvas.width;
  resultCanvas.height = gxCanvas.height;
  const resultCtx = resultCanvas.getContext("2d");
  resultCtx.putImageData(newImgData, 0, 0);

  return resultCanvas;
};

const krish = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = image.getContext('2d');
  const srcImage = ctx.getImageData(0, 0, image.width, image.height);
  const newImgData = new ImageData(image.width - 1, image.height - 1);
  
  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];
  
  const mascaras: number[][] = [
    [5, -3, -3, 5, 0, -3, 5, -3, -3],
    [-3, -3, -3, 5, 0, -3, 5, 5, -3],
    [-3, -3, -3, -3, 0, -3, 5, 5, 5],
    [-3, -3, -3, -3, 0, 5, -3, 5, 5],
    [-3, -3, 5, -3, 0, 5, -3, -3, 5],
    [-3, 5, 5, -3, 0, 5, -3, -3, -3],
    [5, 5, 5, -3, 0, -3, -3, -3, -3],
    [5, 5, -3, 5, 0, -3, -3, -3, -3],
  ];

  for (let y = 1; y < image.height; y++) {
    for (let x = 1; x < image.width; x++) {
      const v0 = getPixelIndex(x - 1, y - 1, image.width);
      const v1 = getPixelIndex(x, y - 1, image.width);
      const v2 = getPixelIndex(x + 1, y - 1, image.width);
      const v3 = getPixelIndex(x - 1, y, image.width);
      const pixel = getPixelIndex(x, y, image.width); // Pixel atual
      const v5 = getPixelIndex(x + 1, y, image.width);
      const v6 = getPixelIndex(x - 1, y + 1, image.width);
      const v7 = getPixelIndex(x, y + 1, image.width);
      const v8 = getPixelIndex(x + 1, y + 1, image.width);

      const valoresR = [
        srcImage.data[v0],
        srcImage.data[v1],
        srcImage.data[v2],
        srcImage.data[v3],
        srcImage.data[pixel],
        srcImage.data[v5],
        srcImage.data[v6],
        srcImage.data[v7],
        srcImage.data[v8],
      ];

      const valoresG = [
        srcImage.data[v0 + 1],
        srcImage.data[v1 + 1],
        srcImage.data[v2 + 1],
        srcImage.data[v3 + 1],
        srcImage.data[pixel + 1],
        srcImage.data[v5 + 1],
        srcImage.data[v6 + 1],
        srcImage.data[v7 + 1],
        srcImage.data[v8 + 1],
      ];

      const valoresB = [
        srcImage.data[v0 + 2],
        srcImage.data[v1 + 2],
        srcImage.data[v2 + 2],
        srcImage.data[v3 + 2],
        srcImage.data[pixel + 2],
        srcImage.data[v5 + 2],
        srcImage.data[v6 + 2],
        srcImage.data[v7 + 2],
        srcImage.data[v8 + 2],
      ];

      const valuesR = mascaras.map((mascara) => applyMask(mascara, valoresR));
      const valuesG = mascaras.map((mascara) => applyMask(mascara, valoresG));
      const valuesB = mascaras.map((mascara) => applyMask(mascara, valoresB));

      reds.push(calculateMax(valuesR));
      greens.push(calculateMax(valuesG));
      blues.push(calculateMax(valuesB));
    }
  }

  let j = 0;
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j];
    newImgData.data[i + 1] = greens[j];
    newImgData.data[i + 2] = blues[j];
    newImgData.data[i + 3] = 255;
    j++;
  }

  const canvas = document.createElement('canvas');
  const newCtx = canvas.getContext('2d');
  canvas.width = image.width - 1;
  canvas.height = image.height - 1;
  newCtx.putImageData(newImgData, 0, 0);
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
