import {
  LowPassFilters as LowPassFilter,
  LowPassFilters,
} from "../../types/filters";

export const executeLowPassFilter = (
  image: HTMLCanvasElement,
  lowPassFilterType: LowPassFilter
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (lowPassFilterType) {
    case LowPassFilters.MEAN_3X3:
      resultingImageCanvas = meanFilter(image, 3);
      break;
    case LowPassFilters.MEAN_5X5:
      resultingImageCanvas = meanFilter(image, 5);
      break;
    case LowPassFilters.MEDIAN_3X3:
      resultingImageCanvas = medianFilter(image, 3);
      break;
    case LowPassFilters.MEDIAN_5X5:
      resultingImageCanvas = medianFilter(image, 5);
      break;
    case LowPassFilters.MAXIMUM:
      resultingImageCanvas = maximum(image, 5);
      break;
    case LowPassFilters.MINIMUM:
      resultingImageCanvas = minimum(image, 5);
      break;
    case LowPassFilters.MODE:
      resultingImageCanvas = mode(image, 5);
      break;
    case LowPassFilters.KAWAHARA:
      resultingImageCanvas = kawahara(image);
      break;
    case LowPassFilters.TOMIRA_TSUJI:
      resultingImageCanvas = tomiraAndTsuji(image);
      break;
    case LowPassFilters.NAGAOE_MATSUYAMA:
      resultingImageCanvas = nagaoeMatsuyama(image);
      break;
    case LowPassFilters.SOMBOONKAEW:
      resultingImageCanvas = Somboonkaew(image);
      break;

    default:
      break;
  }

  return resultingImageCanvas;
};

const meanFilter = (
  image: HTMLCanvasElement,
  matrixSize: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const width = image.width;
  const height = image.height;

  const halfSize = Math.floor(matrixSize / 2);
  const kernelSize = matrixSize * matrixSize;

  const imageData = ctx.getImageData(0, 0, width, height);
  const newData = new Uint8ClampedArray(imageData.data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumRed = 0;
      let sumGreen = 0;
      let sumBlue = 0;

      for (let offsetY = -halfSize; offsetY <= halfSize; offsetY++) {
        for (let offsetX = -halfSize; offsetX <= halfSize; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const pixelIndex = (pixelY * width + pixelX) * 4;
            sumRed += imageData.data[pixelIndex];
            sumGreen += imageData.data[pixelIndex + 1];
            sumBlue += imageData.data[pixelIndex + 2];
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      newData[currentIndex] = sumRed / kernelSize;
      newData[currentIndex + 1] = sumGreen / kernelSize;
      newData[currentIndex + 2] = sumBlue / kernelSize;
      newData[currentIndex + 3] = imageData.data[currentIndex + 3];
    }
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  const newCtx = newCanvas.getContext("2d");
  const newImageData = new ImageData(newData, width, height);
  newCtx.putImageData(newImageData, 0, 0);

  return newCanvas;
};

const medianFilter = (
  image: HTMLCanvasElement,
  matrixSize: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const width = image.width;
  const height = image.height;

  const halfSize = Math.floor(matrixSize / 2);
  const kernelSize = matrixSize * matrixSize;

  const imageData = ctx.getImageData(0, 0, width, height);
  const newData = new Uint8ClampedArray(imageData.data.length);

  const values = new Array(kernelSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let valuesIndex = 0;

      for (let offsetY = -halfSize; offsetY <= halfSize; offsetY++) {
        for (let offsetX = -halfSize; offsetX <= halfSize; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const pixelIndex = (pixelY * width + pixelX) * 4;
            values[valuesIndex++] = imageData.data[pixelIndex];
          }
        }
      }

      values.length = valuesIndex;
      values.sort((a, b) => a - b);

      const currentIndex = (y * width + x) * 4;
      newData[currentIndex] = values[Math.floor(values.length / 2)];
      newData[currentIndex + 1] = values[Math.floor(values.length / 2)];
      newData[currentIndex + 2] = values[Math.floor(values.length / 2)];
      newData[currentIndex + 3] = imageData.data[currentIndex + 3];
    }
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  const newCtx = newCanvas.getContext("2d");
  const newImageData = new ImageData(newData, width, height);
  newCtx.putImageData(newImageData, 0, 0);

  return newCanvas;
};

const maximum = (
  image: HTMLCanvasElement,
  matrixSize: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const width = image.width;
  const height = image.height;

  const halfSize = Math.floor(matrixSize / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const newData = new Uint8ClampedArray(imageData.data.length);

  const getMaxValue = (values: number[]): number => {
    return Math.max(...values);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const values = [];

      for (let offsetY = -halfSize; offsetY <= halfSize; offsetY++) {
        for (let offsetX = -halfSize; offsetX <= halfSize; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const pixelIndex = (pixelY * width + pixelX) * 4;
            values.push(imageData.data[pixelIndex]);
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      newData[currentIndex] = getMaxValue(values);
      newData[currentIndex + 1] = getMaxValue(values);
      newData[currentIndex + 2] = getMaxValue(values);
      newData[currentIndex + 3] = imageData.data[currentIndex + 3];
    }
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  const newCtx = newCanvas.getContext("2d");
  const newImageData = new ImageData(newData, width, height);
  newCtx.putImageData(newImageData, 0, 0);

  return newCanvas;
};

const minimum = (
  image: HTMLCanvasElement,
  matrixSize: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const width = image.width;
  const height = image.height;

  const halfSize = Math.floor(matrixSize / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const newData = new Uint8ClampedArray(imageData.data.length);

  const getMinValue = (values: number[]): number => {
    return Math.min(...values);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const values = [];

      for (let offsetY = -halfSize; offsetY <= halfSize; offsetY++) {
        for (let offsetX = -halfSize; offsetX <= halfSize; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const pixelIndex = (pixelY * width + pixelX) * 4;
            values.push(imageData.data[pixelIndex]);
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      newData[currentIndex] = getMinValue(values);
      newData[currentIndex + 1] = getMinValue(values);
      newData[currentIndex + 2] = getMinValue(values);
      newData[currentIndex + 3] = imageData.data[currentIndex + 3];
    }
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  const newCtx = newCanvas.getContext("2d");
  const newImageData = new ImageData(newData, width, height);
  newCtx.putImageData(newImageData, 0, 0);

  return newCanvas;
};

const mode = (
  image: HTMLCanvasElement,
  matrixSize: number
): HTMLCanvasElement => {
  const ctx = image.getContext("2d");
  const width = image.width;
  const height = image.height;

  const halfSize = Math.floor(matrixSize / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const newData = new Uint8ClampedArray(imageData.data.length);

  const getModeValue = (values: number[]): number => {
    const counts = new Map<number, number>();
    let maxCount = 0;
    let mode = null;

    for (const value of values) {
      if (counts.has(value)) {
        counts.set(value, counts.get(value) + 1);
      } else {
        counts.set(value, 1);
      }

      if (counts.get(value) > maxCount) {
        maxCount = counts.get(value);
        mode = value;
      }
    }

    return mode;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const values = [];

      for (let offsetY = -halfSize; offsetY <= halfSize; offsetY++) {
        for (let offsetX = -halfSize; offsetX <= halfSize; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const pixelIndex = (pixelY * width + pixelX) * 4;
            values.push(imageData.data[pixelIndex]);
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      newData[currentIndex] = getModeValue(values);
      newData[currentIndex + 1] = getModeValue(values);
      newData[currentIndex + 2] = getModeValue(values);
      newData[currentIndex + 3] = imageData.data[currentIndex + 3];
    }
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  const newCtx = newCanvas.getContext("2d");
  const newImageData = new ImageData(newData, width, height);
  newCtx.putImageData(newImageData, 0, 0);

  return newCanvas;
};

const kawahara = (image: HTMLCanvasElement) => {};

const tomiraAndTsuji = (image: HTMLCanvasElement) => {};

const nagaoeMatsuyama = (image: HTMLCanvasElement) => {};

const Somboonkaew = (image: HTMLCanvasElement) => {};
