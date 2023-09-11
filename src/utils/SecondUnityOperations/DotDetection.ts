import { applyMask, getPixelIndex } from "../usualFunctions";

export const executeDotDetection = (
  image: HTMLCanvasElement,
  factor: number
): HTMLCanvasElement => {
  factor = factor * 10;

  const ctx = image.getContext("2d", { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  const newImgData = new ImageData(image.width - 1, image.height - 1);

  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];

  const mask = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

  for (let y = 1; y <= image.height - 1; y++) {
    for (let x = 1; x <= image.width - 1; x++) {
      const v0 = getPixelIndex(x - 1, y - 1, image.width);
      const v1 = getPixelIndex(x, y - 1, image.width);
      const v2 = getPixelIndex(x + 1, y - 1, image.width);
      const v3 = getPixelIndex(x - 1, y, image.width);
      const pixel = getPixelIndex(x, y, image.width);
      const v5 = getPixelIndex(x + 1, y, image.width);
      const v6 = getPixelIndex(x - 1, y + 1, image.width);
      const v7 = getPixelIndex(x, y + 1, image.width);
      const v8 = getPixelIndex(x + 1, y + 1, image.width);

      const valoresR = [
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
      const valoresG = [
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
      const valoresB = [
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

      const aR = applyMask(mask, valoresR);
      const aG = applyMask(mask, valoresG);
      const aB = applyMask(mask, valoresB);

      if (aR < factor) {
        reds.push(0);
      } else {
        reds.push(aR);
      }
      if (aG < factor) {
        greens.push(0);
      } else {
        greens.push(aG);
      }
      if (aB < factor) {
        blues.push(0);
      } else {
        blues.push(aB);
      }
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
  const resultCtx = resultCanvas.getContext("2d");
  resultCanvas.width = image.width - 1;
  resultCanvas.height = image.height - 1;
  resultCtx.putImageData(newImgData, 0, 0);

  return resultCanvas;
};
