export const convertPGMDataToCanvas = (pgmData: string): HTMLCanvasElement => {
  const lines = pgmData.trim().split("\n");

  const [_header, widthHeight, _maxVal, ...pixelDataArray] = lines;
  const [width, height] = widthHeight.split(" ").map(Number);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;

  const pixelArray = pixelDataArray
    .map((line) => line.trim().split(" ").map(Number))
    .flat();

  const imageData = context.createImageData(canvas.width, canvas.height);
  const pixelCount = pixelArray.length;

  for (let i = 0, j = 0; i < pixelCount; i++, j += 4) {
    const pixelValue = pixelArray[i];
    imageData.data[j] = pixelValue;
    imageData.data[j + 1] = pixelValue;
    imageData.data[j + 2] = pixelValue;
    imageData.data[j + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
};
