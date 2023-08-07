import { PseudocoloringOperation } from "../../types";

export const pseudocoloringOperation = (
  image: HTMLCanvasElement,
  operationType: PseudocoloringOperation
) => {
  let resultingImageCanva: HTMLCanvasElement | null = null;

  switch (operationType) {
    case PseudocoloringOperation.DENSITY_SLICING:
      resultingImageCanva = densitySlicing(image);
      break;
    case PseudocoloringOperation.REDISTRIBUTION:
      resultingImageCanva = colorRedistribution(image);
      break;

    default:
      console.warn("Invalid pseudocoloring operation.");
      break;
  }

  return resultingImageCanva;
};

const densitySlicing = (image: HTMLCanvasElement): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
  
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < imageData.data.length; i += 4) {
        const intensity = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
  
        if (intensity < 85) {
          // Low intensity range (0-84)
          imageData.data[i] = 255;     // Red
          imageData.data[i + 1] = 0;   // Green
          imageData.data[i + 2] = 0;   // Blue
        } else if (intensity < 170) {
          // Medium intensity range (85-169)
          imageData.data[i] = 0;       // Red
          imageData.data[i + 1] = 255; // Green
          imageData.data[i + 2] = 0;   // Blue
        } else {
          // High intensity range (170-255)
          imageData.data[i] = 0;       // Red
          imageData.data[i + 1] = 0;   // Green
          imageData.data[i + 2] = 255; // Blue
        }
      }
  
      ctx.putImageData(imageData, 0, 0);
    }
  
    return canvas;
  };


const colorRedistribution = (image: HTMLCanvasElement): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      // Get the individual color channels
      const red = imageData.data[i];
      const green = imageData.data[i + 1];
      const blue = imageData.data[i + 2];

      // Calculate the new color values based on original channels
      const newRed = (green + blue) / 2;
      const newGreen = (red + blue) / 2;
      const newBlue = (red + green) / 2;

      // Apply the new color values
      imageData.data[i] = newRed;
      imageData.data[i + 1] = newGreen;
      imageData.data[i + 2] = newBlue;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
};
