// @ts-nocheck
import { ColorChannel, RgbConversion } from "../../types";
import { extractCanvasImageMatrix as extractMatrixFromCanvasImage } from "../usualFunctions";

export const colorChannelOperation = (
  image: HTMLCanvasElement,
  channel: ColorChannel
): HTMLCanvasElement => {
  const originalImageMatrix = extractMatrixFromCanvasImage(image);

  const resultingImageCanvas = document.createElement("canvas");
  resultingImageCanvas.width = image.width;
  resultingImageCanvas.height = image.height;
  const resultingCtx = resultingImageCanvas.getContext("2d");
  const resultingImageData = resultingCtx.createImageData(
    image.width,
    image.height
  );
  const resultingImageDataMatrix = resultingImageData.data;

  for (let i = 0; i < originalImageMatrix.length; i += 4) {
    const red = originalImageMatrix[i];
    const green = originalImageMatrix[i + 1];
    const blue = originalImageMatrix[i + 2];

    switch (channel) {
      case ColorChannel.RED:
        resultingImageDataMatrix[i] = red;
        resultingImageDataMatrix[i + 1] = 0;
        resultingImageDataMatrix[i + 2] = 0;
        resultingImageDataMatrix[i + 3] = 255;
        break;
      case ColorChannel.GREEN:
        resultingImageDataMatrix[i] = 0;
        resultingImageDataMatrix[i + 1] = green;
        resultingImageDataMatrix[i + 2] = 0;
        resultingImageDataMatrix[i + 3] = 255;
        break;
      case ColorChannel.BLUE:
        resultingImageDataMatrix[i] = 0;
        resultingImageDataMatrix[i + 1] = 0;
        resultingImageDataMatrix[i + 2] = blue;
        resultingImageDataMatrix[i + 3] = 255;
        break;
      default:
        console.warn("Invalid color channel.");
        break;
    }
  }

  resultingCtx.putImageData(resultingImageData, 0, 0);
  return resultingImageCanvas;
};

export const rgbConvertion = (
  image: HTMLCanvasElement,
  conversionType: RgbConversion
): HTMLCanvasElement[] => {
  const resultingImages: HTMLCanvasElement[] = [];

  const originalImageMatrix = extractMatrixFromCanvasImage(image);

  switch (conversionType) {
    case RgbConversion.HSB:
      resultingImages.push(
        ...RGBToHSB(originalImageMatrix, image.width, image.height)
      );
      break;
    case RgbConversion.YUV:
      //resultingImages.push(RGBToYUV(originalImageMatrix));
      break;
    case RgbConversion.CMYK:
      //resultingImages.push(RGBToCMYK(originalImageMatrix));
      break;
    default:
      console.warn("Invalid color channel.");
      break;
  }

  return resultingImages;
};

const RGBToHSB = (
  image: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement[] => {
  const hsbChannels = {
    hue: new Uint8ClampedArray(image.length),
    saturation: new Uint8ClampedArray(image.length),
    brightness: new Uint8ClampedArray(image.length),
  };

  const rgbToHsb = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    let saturation = 0;
    let brightness = max;

    if (delta !== 0) {
      saturation = delta / max;

      const deltaR = ((max - r) / 6 + delta / 2) / delta;
      const deltaG = ((max - g) / 6 + delta / 2) / delta;
      const deltaB = ((max - b) / 6 + delta / 2) / delta;

      if (r === max) hue = deltaB - deltaG;
      else if (g === max) hue = 1 / 3 + deltaR - deltaB;
      else if (b === max) hue = 2 / 3 + deltaG - deltaR;

      if (hue < 0) hue += 1;
      if (hue > 1) hue -= 1;
    }

    return {
      hue: hue * 360,
      saturation: saturation * 100,
      brightness: brightness * 100,
    };
  };

  for (let i = 0; i < image.length; i += 4) {
    const r = image[i];
    const g = image[i + 1];
    const b = image[i + 2];

    const { hue, saturation, brightness } = rgbToHsb(r, g, b);
    
    hsbChannels.hue[i] =
      hsbChannels.hue[i + 1] =
      hsbChannels.hue[i + 2] =
        (hue / 360) * 255;
    hsbChannels.hue[i + 3] = 255;

    hsbChannels.saturation[i] =
      hsbChannels.saturation[i + 1] =
      hsbChannels.saturation[i + 2] =
        (saturation / 100) * 255;
    hsbChannels.saturation[i + 3] = 255;

    hsbChannels.brightness[i] =
      hsbChannels.brightness[i + 1] =
      hsbChannels.brightness[i + 2] =
        (brightness / 100) * 255;
    hsbChannels.brightness[i + 3] = 255;
  }

  const createCanvasFromChannel = (channel: Uint8ClampedArray) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(channel);
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  return [
    createCanvasFromChannel(hsbChannels.hue),
    createCanvasFromChannel(hsbChannels.saturation),
    createCanvasFromChannel(hsbChannels.brightness),
  ];
};

const RGBToYUV = (image: Uint8ClampedArray): HTMLCanvasElement[] => {
  return [];
};

const RGBToCMYK = (image: Uint8ClampedArray): HTMLCanvasElement[] => {
  return [];
};
