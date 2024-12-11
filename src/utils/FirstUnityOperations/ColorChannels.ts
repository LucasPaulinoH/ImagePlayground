import { ColorChannel, RgbConversion } from "../../types";
import { extractCanvasImageMatrix as extractMatrixFromCanvasImage } from "../usualFunctions";

export const rgbColorChannelOperation = (
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
      resultingImages.push(
        ...RGBToYUV(originalImageMatrix, image.width, image.height)
      );
      break;
    case RgbConversion.CMYK:
      resultingImages.push(
        ...RGBToCMYK(originalImageMatrix, image.width, image.height)
      );
      1;
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
    const image = ctx.createImageData(width, height);
    image.data.set(channel);
    ctx.putImageData(image, 0, 0);
    return canvas;
  };

  return [
    createCanvasFromChannel(hsbChannels.hue),
    createCanvasFromChannel(hsbChannels.saturation),
    createCanvasFromChannel(hsbChannels.brightness),
  ];
};

const RGBToYUV = (
  image: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement[] => {
  const yCanvas = document.createElement("canvas");
  const uCanvas = document.createElement("canvas");
  const vCanvas = document.createElement("canvas");

  yCanvas.width = uCanvas.width = vCanvas.width = width;
  yCanvas.height = uCanvas.height = vCanvas.height = height;

  const yContext = yCanvas.getContext("2d");
  const uContext = uCanvas.getContext("2d");
  const vContext = vCanvas.getContext("2d");

  if (!yContext || !uContext || !vContext) {
    throw new Error("Canvas context not supported");
  }

  const yImageData = yContext.createImageData(width, height);
  const uImageData = uContext.createImageData(width, height);
  const vImageData = vContext.createImageData(width, height);

  for (let i = 0; i < image.length; i += 4) {
    const r = image[i];
    const g = image[i + 1];
    const b = image[i + 2];

    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const u = -0.14713 * r - 0.28886 * g + 0.436 * b + 128;
    const v = 0.615 * r - 0.51498 * g - 0.10001 * b + 128;

    yImageData.data[i] = y;
    yImageData.data[i + 1] = y;
    yImageData.data[i + 2] = y;
    yImageData.data[i + 3] = 255;

    uImageData.data[i] = u;
    uImageData.data[i + 1] = u;
    uImageData.data[i + 2] = u;
    uImageData.data[i + 3] = 255;

    vImageData.data[i] = v;
    vImageData.data[i + 1] = v;
    vImageData.data[i + 2] = v;
    vImageData.data[i + 3] = 255;
  }

  yContext.putImageData(yImageData, 0, 0);
  uContext.putImageData(uImageData, 0, 0);
  vContext.putImageData(vImageData, 0, 0);

  return [yCanvas, uCanvas, vCanvas];
};

const RGBToCMYK = (
  image: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement[] => {
  const canvasArray: HTMLCanvasElement[] = [];

  const cyanCanvas = document.createElement("canvas");
  const magentaCanvas = document.createElement("canvas");
  const yellowCanvas = document.createElement("canvas");
  const keyCanvas = document.createElement("canvas");

  cyanCanvas.width =
    magentaCanvas.width =
    yellowCanvas.width =
    keyCanvas.width =
      width;
  cyanCanvas.height =
    magentaCanvas.height =
    yellowCanvas.height =
    keyCanvas.height =
      height;

  const cyanContext = cyanCanvas.getContext("2d")!;
  const magentaContext = magentaCanvas.getContext("2d")!;
  const yellowContext = yellowCanvas.getContext("2d")!;
  const keyContext = keyCanvas.getContext("2d")!;

  const cyanImageData = new Uint8ClampedArray(width * height * 4);
  const magentaImageData = new Uint8ClampedArray(width * height * 4);
  const yellowImageData = new Uint8ClampedArray(width * height * 4);
  const keyImageData = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < image.length; i += 4) {
    const red = image[i];
    const green = image[i + 1];
    const blue = image[i + 2];

    const maxRGB = Math.max(red, green, blue);
    const key = 255 - maxRGB;

    cyanImageData.set([0, green, blue, 255], i);
    magentaImageData.set([red, 0, blue, 255], i);
    yellowImageData.set([red, green, 0, 255], i);
    keyImageData.set([key, key, key, 255], i);
  }

  cyanContext.putImageData(new ImageData(cyanImageData, width, height), 0, 0);
  magentaContext.putImageData(
    new ImageData(magentaImageData, width, height),
    0,
    0
  );
  yellowContext.putImageData(
    new ImageData(yellowImageData, width, height),
    0,
    0
  );
  keyContext.putImageData(new ImageData(keyImageData, width, height), 0, 0);

  canvasArray.push(cyanCanvas, magentaCanvas, yellowCanvas, keyCanvas);

  return canvasArray;
};
