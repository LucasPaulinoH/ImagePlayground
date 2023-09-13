// @ts-nocheck
const GUIDE_HEIGHT = 8;

export const extractCanvasImageMatrix = (
  image: HTMLCanvasElement
): Uint8ClampedArray => {
  const ctx = image.getContext("2d");
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return imageData.data;
};

export const generateHistogramFromImage = (imageMatrix: Uint8ClampedArray) => {
  const dataBuffer = new Uint32Array(imageMatrix.buffer);
  const histogramBrightness = new Array(256).fill(0);

  for (let i = 0; i < dataBuffer.length; i++) {
    const rgbArray = [
      dataBuffer[i] & 0xff,
      (dataBuffer[i] >> 8) & 0xff,
      (dataBuffer[i] >> 16) & 0xff,
    ];

    rgbArray.forEach((component) => histogramBrightness[component]++);
  }
  const maxBrightness = Math.max(...histogramBrightness);

  const histogramCanvas = document.createElement("canvas");
  histogramCanvas.width = 300;
  histogramCanvas.height = 180;
  const context = histogramCanvas.getContext("2d")!;

  const startY = histogramCanvas.height - GUIDE_HEIGHT;
  const dx = histogramCanvas.width / 256;
  const dy = startY / maxBrightness;

  context.lineWidth = dx;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, histogramCanvas.width, histogramCanvas.height);

  for (let i = 0; i < 256; i++) {
    const x = i * dx;

    context.strokeStyle = "#031D44";
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x, startY - histogramBrightness[i] * dy);
    context.closePath();
    context.stroke();

    context.strokeStyle = `rgb(${i}, ${i}, ${i})`;
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x, histogramCanvas.height);
    context.closePath();
    context.stroke();
  }

  return histogramCanvas;
};

export const getPixelIndex = (x: number, y: number, width: number): number => {
  return (y * width + x) * 4;
};

export const applyMask = (mask: number[], values: number[]): number => {
  let sum = 0;
  for (let i = 0; i < mask.length; i++) {
    sum += mask[i] * values[i];
  }
  return sum;
};

export const calculateMax = (values: number[]): number => {
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
};

export const calculateMinimalVariance = (values: number[]): number => {
  let min = values[0];
  let pos = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] < min) {
      min = values[i];
      pos = i;
    }
  }
  return pos;
};

export const calculateVariance = (values: number[]): number => {
  let sumation = 0;
  const average = calculateAverage(values);
  for (let i = 0; i < values.length; i++) {
    sumation += Math.pow(values[i] - average, 2);
  }
  return sumation / values.length;
};

export const calculateAverage = (values: number[]): number => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / 9;
};
