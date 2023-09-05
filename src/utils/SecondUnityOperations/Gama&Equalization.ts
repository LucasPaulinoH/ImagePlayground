import {
  extractCanvasImageMatrix,
  generateHistogramFromImage,
} from "../usualFunctions";

export const executeGammaCorrection = (
  image: HTMLCanvasElement,
  gammaFactor: number
): HTMLCanvasElement => {

  gammaFactor = 1/gammaFactor ;
  
  const imageMatrix = extractCanvasImageMatrix(image);

  const resultingImageMatrix = new Uint8ClampedArray(imageMatrix.length);

  for (let i = 0; i < imageMatrix.length; i += 4) {
    if ((i + 1) % 4 === 0) {
      resultingImageMatrix[i] = imageMatrix[i];
      resultingImageMatrix[i + 1] = imageMatrix[i + 1];
      resultingImageMatrix[i + 2] = imageMatrix[i + 2];
      resultingImageMatrix[i + 3] = 255;
    } else {
      resultingImageMatrix[i] =
        Math.pow(imageMatrix[i] / 255, gammaFactor) * 255;
      resultingImageMatrix[i + 1] =
        Math.pow(imageMatrix[i + 1] / 255, gammaFactor) * 255;
      resultingImageMatrix[i + 2] =
        Math.pow(imageMatrix[i + 2] / 255, gammaFactor) * 255;
      resultingImageMatrix[i + 3] = imageMatrix[i + 3];
    }
  }

  const gammaCorrectedCanvas = document.createElement("canvas");
  gammaCorrectedCanvas.width = image.width;
  gammaCorrectedCanvas.height = image.height;

  const ctx = gammaCorrectedCanvas.getContext("2d");

  if (ctx) {
    const gammaCorrectedImageData = new ImageData(
      resultingImageMatrix,
      image.width,
      image.height
    );
    ctx.putImageData(gammaCorrectedImageData, 0, 0);
  }

  return gammaCorrectedCanvas;
};

export const equalizationOperation = (
  image: HTMLCanvasElement
): HTMLCanvasElement[] => {
  const resultingImagesArray: HTMLCanvasElement[] = [];

  const originalImageMatrix = extractCanvasImageMatrix(image);

  const originalImageHistogram =
    generateHistogramFromImage(originalImageMatrix);

  const equalizedImage = equalizeImage(image);
  const equalizedImageMatrix = extractCanvasImageMatrix(equalizedImage);

  const equalizedImageHistogram =
    generateHistogramFromImage(equalizedImageMatrix);

  resultingImagesArray.push(originalImageHistogram);
  resultingImagesArray.push(equalizedImage);
  resultingImagesArray.push(equalizedImageHistogram);
  return resultingImagesArray;
};

const equalizeImage = (image: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = image.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2D context from canvas.");
  }

  const originalImageData = ctx.getImageData(0, 0, image.width, image.height);
  const originalPixels = originalImageData.data;
  const numPixels = originalPixels.length / 4; // Each pixel is represented by 4 values (RGBA)
  const histogram = new Array(256).fill(0);

  // Calculate histogram
  for (let i = 0; i < numPixels; i++) {
    const r = originalPixels[i * 4];
    const g = originalPixels[i * 4 + 1];
    const b = originalPixels[i * 4 + 2];
    const grayValue = Math.round(0.2989 * r + 0.587 * g + 0.114 * b); // Convert to grayscale
    histogram[grayValue]++;
  }

  // Calculate cumulative distribution function
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  // Equalize the image
  const equalizedImageData = ctx.createImageData(image.width, image.height);
  const equalizedPixels = equalizedImageData.data;
  for (let i = 0; i < numPixels; i++) {
    const r = originalPixels[i * 4];
    const g = originalPixels[i * 4 + 1];
    const b = originalPixels[i * 4 + 2];
    const grayValue = Math.round(0.2989 * r + 0.587 * g + 0.114 * b); // Convert to grayscale
    const equalizedValue = (cdf[grayValue] / numPixels) * 255;
    equalizedPixels[i * 4] = equalizedValue;
    equalizedPixels[i * 4 + 1] = equalizedValue;
    equalizedPixels[i * 4 + 2] = equalizedValue;
    equalizedPixels[i * 4 + 3] = originalPixels[i * 4 + 3]; // Alpha value
  }

  equalizedImageData.data.set(equalizedPixels);
  const equalizedCanvas = document.createElement("canvas");
  equalizedCanvas.width = image.width;
  equalizedCanvas.height = image.height;
  const equalizedCtx = equalizedCanvas.getContext("2d");

  if (!equalizedCtx) {
    throw new Error("Could not get 2D context for equalized canvas.");
  }

  equalizedCtx.putImageData(equalizedImageData, 0, 0);
  return equalizedCanvas;
};
