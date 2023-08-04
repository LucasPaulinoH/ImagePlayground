// @ts-nocheck
import { ArithmeticOperation } from "../../types";
import { extractCanvasImageMatrix } from "../usualFunctions";

export const arithmeticOperation = (
  image1: HTMLCanvasElement,
  image2: HTMLCanvasElement,
  operation: ArithmeticOperation
): HTMLCanvasElement => {

  const matrix1 = extractCanvasImageMatrix(image1);
  const matrix2 = extractCanvasImageMatrix(image2);

  const resultingImageWidth = Math.max(image1.width, image2.width);
  const resultingImageHeight = Math.max(image1.height, image2.height);

  const offsetX = Math.floor((resultingImageWidth - image1.width) / 2);
  const offsetY = Math.floor((resultingImageHeight - image1.height) / 2);

  const resultingImageCanvas = document.createElement("canvas");
  resultingImageCanvas.width = resultingImageWidth;
  resultingImageCanvas.height = resultingImageHeight;

  const resultingCtx = resultingImageCanvas.getContext("2d");

  const resultingImageData = resultingCtx.createImageData(
    resultingImageWidth,
    resultingImageHeight
  );

  const resultingImageDataMatrix = resultingImageData.data;

  const startX = Math.max(0, offsetX);
  const startY = Math.max(0, offsetY);
  const endX = Math.min(resultingImageWidth, offsetX + image1.width);
  const endY = Math.min(resultingImageHeight, offsetY + image1.height);

  switch (operation) {
    case ArithmeticOperation.ADDITION:
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const i = (y * resultingImageWidth + x) * 4;
          const i1 = ((y - offsetY) * image1.width + (x - offsetX)) * 4;
          const i2 = (y * image2.width + x) * 4;
          resultingImageDataMatrix[i] = (matrix1[i1] || 0) + (matrix2[i2] || 0);
          resultingImageDataMatrix[i + 1] =
            (matrix1[i1 + 1] || 0) + (matrix2[i2 + 1] || 0);
          resultingImageDataMatrix[i + 2] =
            (matrix1[i1 + 2] || 0) + (matrix2[i2 + 2] || 0);
          resultingImageDataMatrix[i + 3] = 255;
        }
      }
      break;
    case ArithmeticOperation.SUBTRACTION:
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const i = (y * resultingImageWidth + x) * 4;
          const i1 = ((y - offsetY) * image1.width + (x - offsetX)) * 4;
          const i2 = (y * image2.width + x) * 4;
          resultingImageDataMatrix[i] = (matrix1[i1] || 0) - (matrix2[i2] || 0);

          resultingImageDataMatrix[i + 1] =
            (matrix1[i1 + 1] || 0) - (matrix2[i2 + 1] || 0);

          resultingImageDataMatrix[i + 2] =
            (matrix1[i1 + 2] || 0) - (matrix2[i2 + 2] || 0);

          resultingImageDataMatrix[i + 3] = 255;
        }
      }
      break;
    case ArithmeticOperation.MULTIPLICATION:
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const i = (y * resultingImageWidth + x) * 4;
          const i1 = ((y - offsetY) * image1.width + (x - offsetX)) * 4;
          const i2 = (y * image2.width + x) * 4;
          resultingImageDataMatrix[i] = (matrix1[i1] || 0) * (matrix2[i2] || 0);
          resultingImageDataMatrix[i + 1] =
            (matrix1[i1 + 1] || 0) * (matrix2[i2 + 1] || 0);
          resultingImageDataMatrix[i + 2] =
            (matrix1[i1 + 2] || 0) * (matrix2[i2 + 2] || 0);
          resultingImageDataMatrix[i + 3] = 255;
        }
      }
      break;
    case ArithmeticOperation.DIVISION:
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const i = (y * resultingImageWidth + x) * 4;
          const i1 = ((y - offsetY) * image1.width + (x - offsetX)) * 4;
          const i2 = (y * image2.width + x) * 4;
          resultingImageDataMatrix[i] =
            matrix2[i2] !== 0 ? (matrix1[i1] || 0) / (matrix2[i2] || 1) : 0;
          resultingImageDataMatrix[i + 1] =
            matrix2[i2 + 1] !== 0
              ? (matrix1[i1 + 1] || 0) / (matrix2[i2 + 1] || 1)
              : 0;
          resultingImageDataMatrix[i + 2] =
            matrix2[i2 + 2] !== 0
              ? (matrix1[i1 + 2] || 0) / (matrix2[i2 + 2] || 1)
              : 0;
          resultingImageDataMatrix[i + 3] = 255;
        }
      }
      break;
    default:
      console.warn("Invalid arithmetic operation.");
      break;
  }

  resultingCtx.putImageData(resultingImageData, 0, 0);
  return resultingImageCanvas;
};
