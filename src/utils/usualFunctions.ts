// @ts-nocheck
const GUIDE_HEIGHT = 8;

export const extractCanvasImageMatrix = (
  image: HTMLCanvasElement
): Uint8ClampedArray => {
  const ctx = image.getContext("2d");
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return imageData.data;
};

export const generateHistogramFromImage = (imageData: Uint8ClampedArray) => {
  const dataBuffer = new Uint32Array(imageData.buffer);
  const histBrightness = new Array(256).fill(0);

  for (let ind = 0; ind < dataBuffer.length; ind++) {
    const rgbArray = [
      dataBuffer[ind] & 0xff,
      (dataBuffer[ind] >> 8) & 0xff,
      (dataBuffer[ind] >> 16) & 0xff,
    ];

    rgbArray.forEach((component) => histBrightness[component]++);
  }
  const maxBrightness = Math.max(...histBrightness);

  const histogramCanvas = document.createElement("canvas");
  histogramCanvas.width = 256;
  histogramCanvas.height = 150;
  const context = histogramCanvas.getContext("2d")!;

  const startY = histogramCanvas.height - GUIDE_HEIGHT;
  const dx = histogramCanvas.width / 256;
  const dy = startY / maxBrightness;

  context.lineWidth = dx;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, histogramCanvas.width, histogramCanvas.height);

  for (let ind = 0; ind < 256; ind++) {
    const x = ind * dx;

    // Value
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x, startY - histBrightness[ind] * dy);
    context.closePath();
    context.stroke();

    // Guide
    context.strokeStyle = `rgb(${ind}, ${ind}, ${ind})`;
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x, histogramCanvas.height);
    context.closePath();
    context.stroke();
  }

  return histogramCanvas;
};
