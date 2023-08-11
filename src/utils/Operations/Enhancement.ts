import { EnhancementOperation, Interval } from "../../types";

export const enhancementOperation = (
  image: HTMLCanvasElement,
  enhancementOperation: EnhancementOperation,
  intervals?: Interval[]
) => {
  let resultingImageCanva: HTMLCanvasElement | null = null;
  const defaultInterval: Interval[] = [{ min: 0, max: 255 }];

  switch (enhancementOperation) {
    case EnhancementOperation.INTERVAL:
      resultingImageCanva = interval(image, intervals ?? defaultInterval);
      break;
    case EnhancementOperation.LOG:
      resultingImageCanva = log(image);
      break;
    case EnhancementOperation.SQUARE_ROOT:
      resultingImageCanva = squareRoot(image);
      break;
    case EnhancementOperation.EXPONENTIAL:
      resultingImageCanva = exponential(image, 0.1);
      break;
    case EnhancementOperation.SQUARED:
      resultingImageCanva = squared(image);
      break;
    case EnhancementOperation.BINARY:
      resultingImageCanva = binary(image);
      break;
    case EnhancementOperation.REVERSE:
      resultingImageCanva = reverse(image);
      break;
    default:
      console.warn("Invalid enhancement operation.");
      break;
  }

  return resultingImageCanva;
};

const interval = (
  image: HTMLCanvasElement,
  intervals: Interval[]
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  intervals.forEach((interval) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const grayscaleValue = 0.2989 * r + 0.587 * g + 0.114 * b;

      if (grayscaleValue >= interval.min && grayscaleValue <= interval.max) {
        const darknessFactor = 0.5; 
        const newR = r * darknessFactor;
        const newG = g * darknessFactor;
        const newB = b * darknessFactor;

        data[i] = Math.min(255, Math.max(0, newR));
        data[i + 1] = Math.min(255, Math.max(0, newG));
        data[i + 2] = Math.min(255, Math.max(0, newB));
      }
    }
  });

  context.putImageData(imageData, 0, 0);

  return canvas;
};

const binary = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const originalContext = image.getContext("2d");
  const imageData = originalContext.getImageData(
    0,
    0,
    image.width,
    image.height
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = (r + g + b) / 3;

    const threshold = 128;

    const newGray = gray < threshold ? 0 : 255;

    data[i] = newGray;
    data[i + 1] = newGray;
    data[i + 2] = newGray;
  }

  const resultingImage = document.createElement("canvas");
  resultingImage.width = image.width;
  resultingImage.height = image.height;

  const resultingContext = resultingImage.getContext("2d");
  resultingContext.putImageData(imageData, 0, 0);

  return resultingImage;
};

const reverse = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const originalContext = image.getContext("2d");
  const imageData = originalContext.getImageData(
    0,
    0,
    image.width,
    image.height
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = 255 - r;
    data[i + 1] = 255 - g;
    data[i + 2] = 255 - b;
  }

  const invertedImage = document.createElement("canvas");
  invertedImage.width = image.width;
  invertedImage.height = image.height;

  const invertedContext = invertedImage.getContext("2d");
  invertedContext.putImageData(imageData, 0, 0);

  return invertedImage;
};

const log = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;
  const factor = 255 / Math.log(1 + 255);

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhancedValue = factor * Math.log(1 + grayscale);

    data[i] = enhancedValue;
    data[i + 1] = enhancedValue;
    data[i + 2] = enhancedValue;
  }

  ctx.putImageData(imageData, 0, 0);

  const resultingImage = document.createElement("canvas");
  resultingImage.width = canvas.width;
  resultingImage.height = canvas.height;
  const resultCtx = resultingImage.getContext("2d");
  resultCtx.drawImage(canvas, 0, 0);

  return resultingImage;
};

const squareRoot = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhancedValue = Math.sqrt(grayscale) * (255 / Math.sqrt(255));

    data[i] = enhancedValue;
    data[i + 1] = enhancedValue;
    data[i + 2] = enhancedValue;
  }

  ctx.putImageData(imageData, 0, 0);

  const resultingImage = document.createElement("canvas");
  resultingImage.width = canvas.width;
  resultingImage.height = canvas.height;
  const resultCtx = resultingImage.getContext("2d");
  resultCtx.drawImage(canvas, 0, 0);

  return resultingImage;
};

const exponential = (
  image: HTMLCanvasElement,
  alpha: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhancedValue = 255 * (1 - Math.exp((-alpha * grayscale) / 255));

    data[i] = enhancedValue;
    data[i + 1] = enhancedValue;
    data[i + 2] = enhancedValue;
  }

  ctx.putImageData(imageData, 0, 0);

  const resultingImage = document.createElement("canvas");
  resultingImage.width = canvas.width;
  resultingImage.height = canvas.height;
  const resultCtx = resultingImage.getContext("2d");
  resultCtx.drawImage(canvas, 0, 0);

  return resultingImage;
};

const squared = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhancedValue = Math.pow(grayscale, 2) * (255 / Math.pow(255, 2));

    data[i] = enhancedValue;
    data[i + 1] = enhancedValue;
    data[i + 2] = enhancedValue;
  }

  ctx.putImageData(imageData, 0, 0);

  const resultingImage = document.createElement("canvas");
  resultingImage.width = canvas.width;
  resultingImage.height = canvas.height;
  const resultCtx = resultingImage.getContext("2d");
  resultCtx.drawImage(canvas, 0, 0);

  return resultingImage;
};
