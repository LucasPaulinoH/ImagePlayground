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
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = image.width;
  resultCanvas.height = image.height;

  const ctx = resultCanvas.getContext("2d");

  if (ctx) {
    // Desenhe a imagem original no novo canvas
    ctx.drawImage(image, 0, 0);

    // Obtenha os pixels da imagem
    const imageData = ctx.getImageData(
      0,
      0,
      resultCanvas.width,
      resultCanvas.height
    );
    const data = imageData.data;

    // Percorra os pixels e aplique os intervalos de realce por partes
    for (let i = 0; i < data.length; i += 4) {
      const pixelValue = data[i]; // Considerando uma imagem em escala de cinza

      // Percorra os intervalos e verifique se o pixel está dentro de algum intervalo
      for (const interval of intervals) {
        if (pixelValue >= interval.min && pixelValue <= interval.max) {
          // Aplique o realce de contraste ajustando o valor do pixel
          // Neste exemplo, estamos ampliando o contraste multiplicando o valor do pixel
          const contrastFactor = 2.5; // Fator de ampliação de contraste
          data[i] = Math.min(pixelValue * contrastFactor, 255);
          break; // Pule para o próximo pixel após encontrar o intervalo correspondente
        }
      }
    }

    // Atualize os dados da imagem resultante
    ctx.putImageData(imageData, 0, 0);
  }

  return resultCanvas;
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
