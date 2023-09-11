// @ts-nocheck
import {
  LowPassFilter as LowPassFilter,
  LowPassFilter,
} from "../../types/filters";

export const executeLowPassFilter = (
  image: HTMLCanvasElement,
  lowPassFilterType: LowPassFilter
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (lowPassFilterType) {
    case LowPassFilter.MEAN_3X3:
      resultingImageCanvas = meanFilter(image, 3);
      break;
    case LowPassFilter.MEAN_5X5:
      resultingImageCanvas = meanFilter(image, 5);
      break;
    case LowPassFilter.MEDIAN_3X3:
      resultingImageCanvas = medianFilter(image, 3);
      break;
    case LowPassFilter.MEDIAN_5X5:
      resultingImageCanvas = medianFilter(image, 5);
      break;
    case LowPassFilter.MAXIMUM:
      resultingImageCanvas = maximum(image, 5);
      break;
    case LowPassFilter.MINIMUM:
      resultingImageCanvas = minimum(image, 5);
      break;
    case LowPassFilter.MODE:
      resultingImageCanvas = mode(image, 5);
      break;
    case LowPassFilter.KAWAHARA:
      resultingImageCanvas = kawahara(image);
      break;
    case LowPassFilter.TOMIRA_TSUJI:
      resultingImageCanvas = tomiraAndTsuji(image);
      break;
    case LowPassFilter.NAGAOE_MATSUYAMA:
      resultingImageCanvas = nagaoeMatsuyama(image);
      break;
    case LowPassFilter.SOMBOONKAEW:
      resultingImageCanvas = Somboonkaew(image);
      break;

    default:
      break;
  }

  return resultingImageCanvas;
};

export const meanFilter = (
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

const kawahara = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context is not supported.");
  }

  canvas.width = image.width - 2;
  canvas.height = image.height - 2;

  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imgData = ctx.getImageData(0, 0, image.width, image.height);

  const newImgData = new ImageData(image.width - 2, image.height - 2);
  const reds = [];
  const greens = [];
  const blues = [];

  for (let y = 2; y <= image.height - 1; y++) {
    for (let x = 2; x <= image.width - 1; x++) {
      const v0 = getPixelIndex(x - 2, y - 2, image.width);
      const v1 = getPixelIndex(x - 1, y - 2, image.width);
      const v2 = getPixelIndex(x, y - 2, image.width);
      const v3 = getPixelIndex(x + 1, y - 2, image.width);
      const v4 = getPixelIndex(x + 2, y - 2, image.width);
      const v5 = getPixelIndex(x - 2, y - 1, image.width);
      const v6 = getPixelIndex(x - 1, y - 1, image.width);
      const v7 = getPixelIndex(x, y - 1, image.width);
      const v8 = getPixelIndex(x + 1, y - 1, image.width);
      const v9 = getPixelIndex(x + 2, y - 1, image.width);
      const v10 = getPixelIndex(x - 2, y, image.width);
      const v11 = getPixelIndex(x - 1, y, image.width);
      const pixel = getPixelIndex(x, y, image.width);
      const v13 = getPixelIndex(x + 1, y, image.width);
      const v14 = getPixelIndex(x + 2, y, image.width);
      const v15 = getPixelIndex(x - 2, y + 1, image.width);
      const v16 = getPixelIndex(x - 1, y + 1, image.width);
      const v17 = getPixelIndex(x, y + 1, image.width);
      const v18 = getPixelIndex(x + 1, y + 1, image.width);
      const v19 = getPixelIndex(x + 2, y + 1, image.width);
      const v20 = getPixelIndex(x - 2, y + 2, image.width);
      const v21 = getPixelIndex(x - 1, y + 2, image.width);
      const v22 = getPixelIndex(x, y + 2, image.width);
      const v23 = getPixelIndex(x + 1, y + 2, image.width);
      const v24 = getPixelIndex(x + 2, y + 2, image.width);

      const red1 = [
        imgData.data[v0],
        imgData.data[v1],
        imgData.data[v2],
        imgData.data[v5],
        imgData.data[v6],
        imgData.data[v7],
        imgData.data[v10],
        imgData.data[v11],
        imgData.data[pixel],
      ];

      const red2 = [
        imgData.data[v2],
        imgData.data[v3],
        imgData.data[v4],
        imgData.data[v7],
        imgData.data[v8],
        imgData.data[v9],
        imgData.data[pixel],
        imgData.data[v13],
        imgData.data[v14],
      ];

      const red3 = [
        imgData.data[v10],
        imgData.data[v11],
        imgData.data[pixel],
        imgData.data[v15],
        imgData.data[v16],
        imgData.data[v17],
        imgData.data[v20],
        imgData.data[v21],
        imgData.data[v22],
      ];

      const red4 = [
        imgData.data[pixel],
        imgData.data[v13],
        imgData.data[v14],
        imgData.data[v17],
        imgData.data[v18],
        imgData.data[v19],
        imgData.data[v22],
        imgData.data[v23],
        imgData.data[v24],
      ];

      const mediasR = [
        calculateAverage(red1),
        calculateAverage(red2),
        calculateAverage(red3),
        calculateAverage(red4),
      ];

      const varianciasR = [
        calculateVariance(red1),
        calculateVariance(red2),
        calculateVariance(red3),
        calculateVariance(red4),
      ];

      const kuwaR = mediasR[calculateMinimalVariance(varianciasR)];

      // Médias de Green
      const green1 = [
        imgData.data[v0 + 1],
        imgData.data[v1 + 1],
        imgData.data[v2 + 1],
        imgData.data[v5 + 1],
        imgData.data[v6 + 1],
        imgData.data[v7 + 1],
        imgData.data[v10 + 1],
        imgData.data[v11 + 1],
        imgData.data[pixel + 1],
      ];

      const green2 = [
        imgData.data[v2 + 1],
        imgData.data[v3 + 1],
        imgData.data[v4 + 1],
        imgData.data[v7 + 1],
        imgData.data[v8 + 1],
        imgData.data[v9 + 1],
        imgData.data[pixel + 1],
        imgData.data[v13 + 1],
        imgData.data[v14 + 1],
      ];

      const green3 = [
        imgData.data[v10 + 1],
        imgData.data[v11 + 1],
        imgData.data[pixel + 1],
        imgData.data[v15 + 1],
        imgData.data[v16 + 1],
        imgData.data[v17 + 1],
        imgData.data[v20 + 1],
        imgData.data[v21 + 1],
        imgData.data[v22 + 1],
      ];

      const green4 = [
        imgData.data[pixel + 1],
        imgData.data[v13 + 1],
        imgData.data[v14 + 1],
        imgData.data[v17 + 1],
        imgData.data[v18 + 1],
        imgData.data[v19 + 1],
        imgData.data[v22 + 1],
        imgData.data[v23 + 1],
        imgData.data[v24 + 1],
      ];

      const mediasG = [
        calculateAverage(green1),
        calculateAverage(green2),
        calculateAverage(green3),
        calculateAverage(green4),
      ];

      const varianciasG = [
        calculateVariance(green1),
        calculateVariance(green2),
        calculateVariance(green3),
        calculateVariance(green4),
      ];

      const kuwaG = mediasG[calculateMinimalVariance(varianciasG)];

      // Médias de Blue
      const blue1 = [
        imgData.data[v0 + 2],
        imgData.data[v1 + 2],
        imgData.data[v2 + 2],
        imgData.data[v5 + 2],
        imgData.data[v6 + 2],
        imgData.data[v7 + 2],
        imgData.data[v10 + 2],
        imgData.data[v11 + 2],
        imgData.data[pixel + 2],
      ];

      const blue2 = [
        imgData.data[v2 + 2],
        imgData.data[v3 + 2],
        imgData.data[v4 + 2],
        imgData.data[v7 + 2],
        imgData.data[v8 + 2],
        imgData.data[v9 + 2],
        imgData.data[pixel + 2],
        imgData.data[v13 + 2],
        imgData.data[v14 + 2],
      ];

      const blue3 = [
        imgData.data[v10 + 2],
        imgData.data[v11 + 2],
        imgData.data[pixel + 2],
        imgData.data[v15 + 2],
        imgData.data[v16 + 2],
        imgData.data[v17 + 2],
        imgData.data[v20 + 2],
        imgData.data[v21 + 2],
        imgData.data[v22 + 2],
      ];

      const blue4 = [
        imgData.data[pixel + 2],
        imgData.data[v13 + 2],
        imgData.data[v14 + 2],
        imgData.data[v17 + 2],
        imgData.data[v18 + 2],
        imgData.data[v19 + 2],
        imgData.data[v22 + 2],
        imgData.data[v23 + 2],
        imgData.data[v24 + 2],
      ];

      const mediasB = [
        calculateAverage(blue1),
        calculateAverage(blue2),
        calculateAverage(blue3),
        calculateAverage(blue4),
      ];

      const varianciasB = [
        calculateVariance(blue1),
        calculateVariance(blue2),
        calculateVariance(blue3),
        calculateVariance(blue4),
      ];

      const kuwaB = mediasB[calculateMinimalVariance(varianciasB)];

      reds.push(kuwaR);
      greens.push(kuwaG);
      blues.push(kuwaB);
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

  canvas.width = image.width - 2;
  canvas.height = image.height - 2;
  ctx.putImageData(newImgData, 0, 0);

  return canvas;
};

const tomiraAndTsuji = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = image.width - 2;
  canvas.height = image.height - 2;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const newImgData = new ImageData(canvas.width, canvas.height);

  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];

  for (let y = 2; y <= canvas.height - 1; y++) {
    for (let x = 2; x <= canvas.width - 1; x++) {
      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      //Médias de R
      var red1 = [imgData.data[v0],imgData.data[v1],imgData.data[v2],imgData.data[v5],
      imgData.data[v6],imgData.data[v7],imgData.data[v10],imgData.data[v11],imgData.data[pixel]]
      
      var red2 = [imgData.data[v2],imgData.data[v3],imgData.data[v4],imgData.data[v7],
      imgData.data[v8],imgData.data[v9],imgData.data[pixel],imgData.data[v13],imgData.data[v14]]
      
      var red3 = [imgData.data[v10],imgData.data[v11],imgData.data[pixel],imgData.data[v15],
      imgData.data[v16],imgData.data[v17],imgData.data[v20],imgData.data[v21],imgData.data[v22]]
      
      var red4 = [imgData.data[pixel],imgData.data[v13],imgData.data[v14],imgData.data[v17],
      imgData.data[v18],imgData.data[v19],imgData.data[v22],imgData.data[v23],imgData.data[v24]]

      var red5 = [imgData.data[v6],imgData.data[v7],imgData.data[v8],imgData.data[v11],
      imgData.data[pixel],imgData.data[v13],imgData.data[v16],imgData.data[v17],imgData.data[v18]]

      var mediasR = [calcularMedia(red1), calcularMedia(red2), calcularMedia(red3), calcularMedia(red4), calcularMedia(red5)]

      var varianciasR = [calcularVariancia(red1), calcularVariancia(red2), calcularVariancia(red3), calcularVariancia(red4), calcularVariancia(red5)]
      var kuwaR = mediasR[calcularMinimoVariancia(varianciasR)]

      //Médias de Green
      var green1 = [imgData.data[v0+1] ,imgData.data[v1+1] ,imgData.data[v2+1] ,imgData.data[v5+1] ,
      imgData.data[v6+1] ,imgData.data[v7+1] ,imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ]
      
      var green2 = [imgData.data[v2+1] ,imgData.data[v3+1] ,imgData.data[v4+1] ,imgData.data[v7+1] ,
      imgData.data[v8+1] ,imgData.data[v9+1] ,imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ]
      
      var green3 = [imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ,imgData.data[v15+1] ,
      imgData.data[v16+1] ,imgData.data[v17+1] ,imgData.data[v20+1] ,imgData.data[v21+1] ,imgData.data[v22+1] ]
      
      var green4 = [imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ,imgData.data[v17+1] ,
      imgData.data[v18+1] ,imgData.data[v19+1] ,imgData.data[v22+1] ,imgData.data[v23+1] ,imgData.data[v24+1] ]

      var green5 = [imgData.data[v6+1],imgData.data[v7+1],imgData.data[v8+1],imgData.data[v11+1],
      imgData.data[pixel+1],imgData.data[v13+1],imgData.data[v16+1],imgData.data[v17+1],imgData.data[v18+1]]

      var mediasG = [calcularMedia(green1), calcularMedia(green2), calcularMedia(green3), calcularMedia(green4), calcularMedia(green5)]

      var varianciasG = [calcularVariancia(green1), calcularVariancia(green2), calcularVariancia(green3), calcularVariancia(green4), calcularVariancia(green5)]
      var kuwaG = mediasG[calcularMinimoVariancia(varianciasG)]

      //Médias de Blue
      var blue1 = [imgData.data[v0+2] ,imgData.data[v1+2] ,imgData.data[v2+2] ,imgData.data[v5+2] ,
      imgData.data[v6+2] ,imgData.data[v7+2] ,imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ]
      
      var blue2 = [imgData.data[v2+2] ,imgData.data[v3+2] ,imgData.data[v4+2] ,imgData.data[v7+2] ,
      imgData.data[v8+2] ,imgData.data[v9+2] ,imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ]
      
      var blue3 = [imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ,imgData.data[v15+2] ,
      imgData.data[v16+2] ,imgData.data[v17+2] ,imgData.data[v20+2] ,imgData.data[v21+2] ,imgData.data[v22+2] ]
      
      var blue4 = [imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ,imgData.data[v17+2] ,
      imgData.data[v18+2] ,imgData.data[v19+2] ,imgData.data[v22+2] ,imgData.data[v23+2] ,imgData.data[v24+2] ]

      var blue5 = [imgData.data[v6+2],imgData.data[v7+2],imgData.data[v8+2],imgData.data[v11+2],
      imgData.data[pixel+2],imgData.data[v13+2],imgData.data[v16+2],imgData.data[v17+2],imgData.data[v18+2]]

      var mediasB = [calcularMedia(blue1), calcularMedia(blue2), calcularMedia(blue3), calcularMedia(blue4), calcularMedia(blue5)]

      var varianciasB = [calcularVariancia(blue1), calcularVariancia(blue2), calcularVariancia(blue3), calcularVariancia(blue4), calcularVariancia(blue5)]
      var kuwaB = mediasB[calcularMinimoVariancia(varianciasB)]

      reds.push(kuwaR)
      greens.push(kuwaG)
      blues.push(kuwaB)
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

  ctx.putImageData(newImgData, 0, 0);

  return canvas;
};

const nagaoeMatsuyama = (image: HTMLCanvasElement) => {};

const Somboonkaew = (image: HTMLCanvasElement) => {};

function calculateMinimalVariance(values: number[]): number {
  let min = values[0];
  let pos = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] < min) {
      min = values[i];
      pos = i;
    }
  }
  return pos;
}

function calculateVariance(values: number[]): number {
  let sumation = 0;
  const average = calculateAverage(values);
  for (let i = 0; i < values.length; i++) {
    sumation += Math.pow(values[i] - average, 2);
  }
  return sumation / values.length;
}

function calculateAverage(values: number[]): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / 9;
}

function getPixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}
