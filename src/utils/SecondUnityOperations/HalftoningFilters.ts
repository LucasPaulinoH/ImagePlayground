import { HalftoningFilter } from "../../types/filters";

export const executeHalftoning = (
  image: HTMLCanvasElement,
  halftone: HalftoningFilter
) => {
  let resultingImageCanvas = null;

  switch (halftone) {
    case HalftoningFilter.ORDERED_DOT_PLOT_2X2:
      resultingImageCanvas = orderedDotPlot2x2(image);
      break;
    case HalftoningFilter.ORDERED_DOT_PLOT_2X3:
      resultingImageCanvas = orderedDotPlot2x3(image);
      break;
    case HalftoningFilter.ORDERED_DOT_PLOT_3X3:
      resultingImageCanvas = orderedDotPlot3x3(image);
      break;
    case HalftoningFilter.FLOYD_STEINBERG:
      resultingImageCanvas = nonDitheringHalftoning(image, FLOY_STEINBERG_MATRIX);
      break;
    case HalftoningFilter.ROGERS:
      resultingImageCanvas = nonDitheringHalftoning(image, ROGERS_MATRIX);
      break;
    case HalftoningFilter.JARVIS_JUDICE_NINKE:
      resultingImageCanvas = nonDitheringHalftoning(image, JARVIS_JUDICE_NINKE_MATRIX);
      break;
    case HalftoningFilter.STUCKI:
      resultingImageCanvas = nonDitheringHalftoning(image, STUCKI_MATRIX);
      break;
    case HalftoningFilter.STEVENSONE_ARCE:
      resultingImageCanvas = nonDitheringHalftoning(image, STEVENSON_ARCE_MATRIX);
      break;
    default:
      console.warn("Invalid halftoning filter selected.");
      break;
  }
  return resultingImageCanvas;
};

const ORDERED_DOT_PLOT_2x2_MATRIX = [
  [0, 2],
  [3, 1],
];

const ORDERED_DOT_PLOT_2x3_MATRIX = [
  [3, 0, 4],
  [5, 2, 1],
];

const ORDERED_DOT_PLOT_3x3_MATRIX = [
  [6, 8, 4],
  [1, 0, 3],
  [5, 2, 7],
];

const FLOY_STEINBERG_MATRIX = [
  [1, 0, 7 / 16],
  [-1, 1, 3 / 16],
  [0, 1, 5 / 16],
  [1, 1, 1 / 16],
];
const ROGERS_MATRIX = [
  [1, 0, 3 / 8],
  [0, 1, 3 / 8],
  [1, 1, 2 / 8],
];

const JARVIS_JUDICE_NINKE_MATRIX = [
  [1, 0, 7 / 48],
  [2, 0, 5 / 48],
  [-2, 1, 3 / 48],
  [-1, 1, 5 / 48],
  [0, 1, 7 / 48],
  [1, 1, 5 / 48],
  [2, 1, 3 / 48],
  [-2, 2, 1 / 48],
  [-1, 2, 3 / 48],
  [0, 2, 5 / 48],
  [1, 2, 3 / 48],
  [2, 2, 1 / 48]
];

const STUCKI_MATRIX = [
  [1, 0, 8 / 42],
  [2, 0, 4 / 42],
  [-2, 1, 2 / 42],
  [-1, 1, 4 / 42],
  [0, 1, 8 / 42],
  [1, 1, 4 / 42],
  [2, 1, 2 / 42],
  [-2, 2, 1 / 42],
  [-1, 2, 2 / 42],
  [0, 2, 4 / 42],
  [1, 2, 2 / 42],
  [2, 2, 1 / 42]
];

const STEVENSON_ARCE_MATRIX = [
  [2, 0, 32 / 200],
  [-3, 1, 12 / 200],
  [-1, 1, 26 / 200],
  [1, 1, 30 / 200],
  [3, 1, 16 / 200],
  [-2, 2, 12 / 200],
  [0, 2, 26 / 200],
  [2, 2, 12 / 200],
  [-3, 3, 5 / 200],
  [-1, 3, 12 / 200],
  [1, 3, 12 / 200],
  [3, 3, 5 / 200]
];

const applyOrderedDotPlot = (
  matrix: number[][],
  image: HTMLCanvasElement
): HTMLCanvasElement => {
  const canvas = createCanvasFromImage(image);
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const pixelIndex = (y * canvas.width + x) * 4;
        const grayValue =
          (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        const threshold =
          (matrix[y % matrix.length][x % matrix[0].length] * 255) /
          (matrix.length * matrix[0].length);
        const newColor = grayValue > threshold ? 255 : 0;

        data[pixelIndex] = newColor;
        data[pixelIndex + 1] = newColor;
        data[pixelIndex + 2] = newColor;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
};

const orderedDotPlot2x2 = (image: HTMLCanvasElement): HTMLCanvasElement =>
  applyOrderedDotPlot(ORDERED_DOT_PLOT_2x2_MATRIX, image);

const orderedDotPlot2x3 = (image: HTMLCanvasElement): HTMLCanvasElement =>
  applyOrderedDotPlot(ORDERED_DOT_PLOT_2x3_MATRIX, image);

const orderedDotPlot3x3 = (image: HTMLCanvasElement): HTMLCanvasElement =>
  applyOrderedDotPlot(ORDERED_DOT_PLOT_3x3_MATRIX, image)

const nonDitheringHalftoning = (
  image: HTMLCanvasElement,
  matrix: number[][]
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context is not supported.");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imgData = ctx.getImageData(0, 0, image.width, image.height);

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixel = getPixelIndex(x, y, image.width);
      const oldR = imgData.data[pixel];
      const oldG = imgData.data[pixel + 1];
      const oldB = imgData.data[pixel + 2];

      const newR = oldR < 128 ? 0 : 255;
      const newG = oldG < 128 ? 0 : 255;
      const newB = oldB < 128 ? 0 : 255;

      imgData.data[pixel] = newR;
      imgData.data[pixel + 1] = newG;
      imgData.data[pixel + 2] = newB;
      imgData.data[pixel + 3] = 255;

      const erroR = oldR - newR;
      const erroG = oldG - newG;
      const erroB = oldB - newB;

      for (const [dx, dy, factor] of matrix) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < image.width &&
          newY >= 0 &&
          newY < image.height
        ) {
          const newPixelOffset = getPixelIndex(newX, newY, image.width);

          imgData.data[newPixelOffset] = Math.min(
            255,
            Math.max(0, imgData.data[newPixelOffset] + erroR * factor)
          );
          imgData.data[newPixelOffset + 1] = Math.min(
            255,
            Math.max(0, imgData.data[newPixelOffset + 1] + erroG * factor)
          );
          imgData.data[newPixelOffset + 2] = Math.min(
            255,
            Math.max(0, imgData.data[newPixelOffset + 2] + erroB * factor)
          );
          imgData.data[newPixelOffset + 3] = 255;
        }
      }
    }
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.putImageData(imgData, 0, 0);

  return canvas;
};

function createCanvasFromImage(image: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(image, 0, 0);
  }
  return canvas;
}

function getPixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}
