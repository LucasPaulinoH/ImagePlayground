import { LineDetectionFilter } from "../../types/filters";
import { reverse } from "../FirstUnityOperations/Enhancement";
import { applyMask, getPixelIndex } from "../usualFunctions";

export const executeLineDetection = (
  image: HTMLCanvasElement,
  lineDetectionType: LineDetectionFilter
) => {
  let resultingImageCanvas = null;

  switch (lineDetectionType) {
    case LineDetectionFilter.HORIZONTAL:
      resultingImageCanvas = lineDetection(image, HORIZONTAL_MATRIX);
      break;
    case LineDetectionFilter.VERTICAL:
      resultingImageCanvas = lineDetection(image, VERTICAL_MATRIX);
      break;
    case LineDetectionFilter.DEGREES_45:
      resultingImageCanvas = lineDetection(image, DEGREES_45_MATRIX);
      break;
    case LineDetectionFilter.DEGREES_135:
      resultingImageCanvas = lineDetection(image, DEGREES_135_MATRIX);
      break;
    default:
      console.warn("Invalid line detection filter selected.");
      break;
  }
  return reverse(resultingImageCanvas);
};

const HORIZONTAL_MATRIX = [-1, -1, -1, 2, 2, 2, -1, -1, -1];

const VERTICAL_MATRIX = [-1, 2, -1, -1, 2, -1, -1, 2, -1];

const DEGREES_45_MATRIX = [-1, -1, 2, -1, 2, -1, 2, -1, -1];

const DEGREES_135_MATRIX = [2, -1, -1, -1, 2, -1, -1, -1, 2];

const lineDetection = (
  image: HTMLCanvasElement,
  matrix: number[]
): HTMLCanvasElement => {
  const ctx = image.getContext("2d")!;
  const imgData = ctx.getImageData(0, 0, image.width, image.height);

  const newImgData = new ImageData(imgData.width - 1, imgData.height - 1);

  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];

  for (let y = 1; y <= imgData.height - 1; y++) {
    for (let x = 1; x <= imgData.width - 1; x++) {
      const v0 = getPixelIndex(x - 1, y - 1, imgData.width);
      const v1 = getPixelIndex(x, y - 1, imgData.width);
      const v2 = getPixelIndex(x + 1, y - 1, imgData.width);
      const v3 = getPixelIndex(x - 1, y, imgData.width);
      const pixel = getPixelIndex(x, y, imgData.width);
      const v5 = getPixelIndex(x + 1, y, imgData.width);
      const v6 = getPixelIndex(x - 1, y + 1, imgData.width);
      const v7 = getPixelIndex(x, y + 1, imgData.width);
      const v8 = getPixelIndex(x + 1, y + 1, imgData.width);

      const rValues = [
        imgData.data[v0],
        imgData.data[v1],
        imgData.data[v2],
        imgData.data[v3],
        imgData.data[pixel],
        imgData.data[v5],
        imgData.data[v6],
        imgData.data[v7],
        imgData.data[v8],
      ];

      const gValues = [
        imgData.data[v0 + 1],
        imgData.data[v1 + 1],
        imgData.data[v2 + 1],
        imgData.data[v3 + 1],
        imgData.data[pixel + 1],
        imgData.data[v5 + 1],
        imgData.data[v6 + 1],
        imgData.data[v7 + 1],
        imgData.data[v8 + 1],
      ];

      const bValues = [
        imgData.data[v0 + 2],
        imgData.data[v1 + 2],
        imgData.data[v2 + 2],
        imgData.data[v3 + 2],
        imgData.data[pixel + 2],
        imgData.data[v5 + 2],
        imgData.data[v6 + 2],
        imgData.data[v7 + 2],
        imgData.data[v8 + 2],
      ];

      const aR = applyMask(matrix, rValues);
      const aG = applyMask(matrix, gValues);
      const aB = applyMask(matrix, bValues);

      reds.push(aR);
      greens.push(aG);
      blues.push(aB);
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

  const resultCanvas = document.createElement("canvas");
  const resultCtx = resultCanvas.getContext("2d")!;
  resultCanvas.width = imgData.width - 1;
  resultCanvas.height = imgData.height - 1;
  resultCtx.putImageData(newImgData, 0, 0);

  return resultCanvas;
};
