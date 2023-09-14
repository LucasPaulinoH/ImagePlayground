import { ThresholdingType } from "../../types/filters";
import { binary } from "../FirstUnityOperations/Enhancement";

export const executeThresholding = (
  image: HTMLCanvasElement,
  thresholdingType: ThresholdingType,
  gapSize?: number,
  k?: number
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (thresholdingType) {
    case ThresholdingType.GLOBAL:
      resultingImageCanvas = binary(image);
      break;
    case ThresholdingType.LOCAL_AVERAGE:
      resultingImageCanvas = localAverage(image, gapSize ?? 1);
      break;
    case ThresholdingType.LOCAL_MEDIAN:
      resultingImageCanvas = localMedian(image, gapSize ?? 1);
      break;
    case ThresholdingType.LOCAL_MIN_MAX:
      resultingImageCanvas = localMinMax(image, gapSize ?? 1);
      break;
    case ThresholdingType.NI_BLACK:
      resultingImageCanvas = niblack(image,  gapSize ?? 1, k ?? 1);
      break;
    default:
      break;
  }

  return resultingImageCanvas;
};

const localAverage = (
  image: HTMLCanvasElement,
  gapSize: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Coudn't get canvas context.");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  const imageData = image
    .getContext("2d")
    .getImageData(0, 0, image.width, image.height);
  const pixels = imageData.data;
  const newData = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const centerX = x;
      const centerY = y;
      const halfGapSize = Math.floor(gapSize / 2);
      let sum = 0;
      let count = 0;

      for (let offsetY = -halfGapSize; offsetY <= halfGapSize; offsetY++) {
        for (let offsetX = -halfGapSize; offsetX <= halfGapSize; offsetX++) {
          const pixelX = centerX + offsetX;
          const pixelY = centerY + offsetY;

          if (
            pixelX >= 0 &&
            pixelX < image.width &&
            pixelY >= 0 &&
            pixelY < image.height
          ) {
            const index = (pixelY * image.width + pixelX) * 4;
            const grayValue =
              (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
            sum += grayValue;
            count++;
          }
        }
      }

      const average = sum / count;
      const currentIndex = (y * image.width + x) * 4;

      if (pixels[currentIndex] > average) {
        newData[currentIndex] = 255;
        newData[currentIndex + 1] = 255;
        newData[currentIndex + 2] = 255;
        newData[currentIndex + 3] = 255;
      } else {
        newData[currentIndex] = 0;
        newData[currentIndex + 1] = 0;
        newData[currentIndex + 2] = 0;
        newData[currentIndex + 3] = 255;
      }
    }
  }

  const newImageData = new ImageData(newData, image.width, image.height);
  ctx.putImageData(newImageData, 0, 0);

  return canvas;
};

const localMedian = (
  image: HTMLCanvasElement,
  gapSize: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Coudn't get canvas context.");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  const imageData = image
    .getContext("2d")
    .getImageData(0, 0, image.width, image.height);
  const pixels = imageData.data;
  const newData = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const centerX = x;
      const centerY = y;
      const halfGapSize = Math.floor(gapSize / 2);
      const values = [];

      for (let offsetY = -halfGapSize; offsetY <= halfGapSize; offsetY++) {
        for (let offsetX = -halfGapSize; offsetX <= halfGapSize; offsetX++) {
          const pixelX = centerX + offsetX;
          const pixelY = centerY + offsetY;

          if (
            pixelX >= 0 &&
            pixelX < image.width &&
            pixelY >= 0 &&
            pixelY < image.height
          ) {
            const index = (pixelY * image.width + pixelX) * 4;
            const grayValue =
              (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
            values.push(grayValue);
          }
        }
      }

      values.sort((a, b) => a - b);
      const median = values[Math.floor(values.length / 2)];
      const currentIndex = (y * image.width + x) * 4;

      if (pixels[currentIndex] > median) {
        newData[currentIndex] = 255;
        newData[currentIndex + 1] = 255;
        newData[currentIndex + 2] = 255;
        newData[currentIndex + 3] = 255;
      } else {
        newData[currentIndex] = 0;
        newData[currentIndex + 1] = 0;
        newData[currentIndex + 2] = 0;
        newData[currentIndex + 3] = 255;
      }
    }
  }

  const newImageData = new ImageData(newData, image.width, image.height);
  ctx.putImageData(newImageData, 0, 0);

  return canvas;
};

const localMinMax = (
  image: HTMLCanvasElement,
  gapSize: number
): HTMLCanvasElement => {
  gapSize = gapSize / 2;
  const ctxInput = image.getContext("2d");

  const resultingCanvas = document.createElement("canvas");
  const ctxResult = resultingCanvas.getContext("2d");

  resultingCanvas.width = image.width;
  resultingCanvas.height = image.height;

  const imageDataInput = ctxInput.getImageData(0, 0, image.width, image.height);
  const dataInput = imageDataInput.data;

  const dataResult = new Uint8ClampedArray(dataInput.length);

  for (let i = 0; i < dataInput.length; i += 4) {
    const r = dataInput[i];
    const g = dataInput[i + 1];
    const b = dataInput[i + 2];

    let minR = 255;
    let maxR = 0;
    let minG = 255;
    let maxG = 0;
    let minB = 255;
    let maxB = 0;

    for (let x = -gapSize; x <= gapSize; x++) {
      for (let y = -gapSize; y <= gapSize; y++) {
        const px = Math.min(
          Math.max(0, i + (x + y * image.width) * 4),
          dataInput.length - 4
        );
        const neighborR = dataInput[px];
        const neighborG = dataInput[px + 1];
        const neighborB = dataInput[px + 2];

        minR = Math.min(minR, neighborR);
        maxR = Math.max(maxR, neighborR);
        minG = Math.min(minG, neighborG);
        maxG = Math.max(maxG, neighborG);
        minB = Math.min(minB, neighborB);
        maxB = Math.max(maxB, neighborB);
      }
    }

    const minAvg = (minR + minG + minB) / 3;
    const maxAvg = (maxR + maxG + maxB) / 3;

    const thresholdedValue = (r + g + b) / 3 >= (minAvg + maxAvg) / 2 ? 255 : 0;

    dataResult[i] = thresholdedValue;
    dataResult[i + 1] = thresholdedValue;
    dataResult[i + 2] = thresholdedValue;
    dataResult[i + 3] = 255;
  }

  const imageDataResult = new ImageData(dataResult, image.width, image.height);
  ctxResult.putImageData(imageDataResult, 0, 0);

  return resultingCanvas;
};

const niblack = (
  image: HTMLCanvasElement,
  gapSize: number,
  ponderationFactor: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get 2D context of the canvas.");
  }

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const { data } = imageData;
  const width = imageData.width;
  const height = imageData.height;
  const resultingImageCanvas = document.createElement("canvas");
  const outputCtx = resultingImageCanvas.getContext("2d");

  if (!outputCtx) {
    throw new Error("Failed to get 2D context of the output canvas.");
  }

  resultingImageCanvas.width = width;
  resultingImageCanvas.height = height;

  const calculateLocalMean = (x: number, y: number): number => {
    let sum = 0;
    let count = 0;

    for (let i = -gapSize; i <= gapSize; i++) {
      for (let j = -gapSize; j <= gapSize; j++) {
        const px = x + i;
        const py = y + j;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          sum += data[(py * width + px) * 4];
          count++;
        }
      }
    }

    return sum / count;
  };

  const calculateLocalStandardDeviation = (
    x: number,
    y: number,
    mean: number
  ): number => {
    let sumOfSquares = 0;
    let count = 0;

    for (let i = -gapSize; i <= gapSize; i++) {
      for (let j = -gapSize; j <= gapSize; j++) {
        const px = x + i;
        const py = y + j;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          const value = data[(py * width + px) * 4];
          sumOfSquares += (value - mean) ** 2;
          count++;
        }
      }
    }

    return Math.sqrt(sumOfSquares / count);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mean = calculateLocalMean(x, y);
      const standardDeviation = calculateLocalStandardDeviation(x, y, mean);
      const threshold = mean + ponderationFactor * standardDeviation;
      const pixelIndex = (y * width + x) * 4;
      const pixelValue = data[pixelIndex];

      if (pixelValue < threshold) {
        data[pixelIndex] = 0;
        data[pixelIndex + 1] = 0;
        data[pixelIndex + 2] = 0;
      } else {
        data[pixelIndex] = 255;
        data[pixelIndex + 1] = 255;
        data[pixelIndex + 2] = 255;
      }
    }
  }

  outputCtx.putImageData(imageData, 0, 0);

  return resultingImageCanvas;
};
