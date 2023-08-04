import { ZoomOperation } from "../../types";

export const zoomOperation = (
  image: HTMLCanvasElement,
  zoomOperation: ZoomOperation,
  zoomFactor: number
) => {
  let resultingImageCanva: HTMLCanvasElement | null = null;

  switch (zoomOperation) {
    case ZoomOperation.REPLICATION:
      resultingImageCanva = replicationZoomIn(image, zoomFactor);
      break;
    case ZoomOperation.INTERPOLATION:
      resultingImageCanva = interpolationZoomIn(image, zoomFactor);
      break;
    case ZoomOperation.DELETION:
      resultingImageCanva = deletionZoomOut(image, zoomFactor);
      break;
    case ZoomOperation.MEAN_VALUE:
      resultingImageCanva = meanValueZoomOut(image, zoomFactor);
      break;
    default:
      console.warn("Invalid zoom operation.");
      break;
  }

  return resultingImageCanva;
};

const replicationZoomIn = (
  image: HTMLCanvasElement,
  zoomFactor: number
): HTMLCanvasElement => {
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = image.width * zoomFactor;
  resultCanvas.height = image.height * zoomFactor;
  const resultContext = resultCanvas.getContext("2d");

  if (!resultContext) {
    throw new Error("Could not create canvas context.");
  }

  for (let y = 0; y < resultCanvas.height; y++) {
    for (let x = 0; x < resultCanvas.width; x++) {
      const srcX = Math.floor(x / zoomFactor);
      const srcY = Math.floor(y / zoomFactor);
      const pixel = image.getContext("2d")?.getImageData(srcX, srcY, 1, 1).data;
      if (pixel) {
        resultContext.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`;
        resultContext.fillRect(x, y, 1, 1);
      }
    }
  }

  return resultCanvas;
};

const interpolationZoomIn = (
  image: HTMLCanvasElement,
  zoomFactor: number
): HTMLCanvasElement => {
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = image.width * zoomFactor;
  resultCanvas.height = image.height * zoomFactor;
  const resultContext = resultCanvas.getContext("2d");

  if (!resultContext) {
    throw new Error("Could not create canvas context.");
  }

  for (let y = 0; y < resultCanvas.height; y++) {
    for (let x = 0; x < resultCanvas.width; x++) {
      const srcX = x / zoomFactor;
      const srcY = y / zoomFactor;

      const x1 = Math.floor(srcX);
      const x2 = Math.ceil(srcX);
      const y1 = Math.floor(srcY);
      const y2 = Math.ceil(srcY);

      const dx = srcX - x1;
      const dy = srcY - y1;

      const pixel1 = image.getContext("2d")?.getImageData(x1, y1, 1, 1).data;
      const pixel2 = image.getContext("2d")?.getImageData(x2, y1, 1, 1).data;
      const pixel3 = image.getContext("2d")?.getImageData(x1, y2, 1, 1).data;
      const pixel4 = image.getContext("2d")?.getImageData(x2, y2, 1, 1).data;

      if (pixel1 && pixel2 && pixel3 && pixel4) {
        const pixel = [
          pixel1[0] * (1 - dx) * (1 - dy) +
            pixel2[0] * dx * (1 - dy) +
            pixel3[0] * (1 - dx) * dy +
            pixel4[0] * dx * dy,
          pixel1[1] * (1 - dx) * (1 - dy) +
            pixel2[1] * dx * (1 - dy) +
            pixel3[1] * (1 - dx) * dy +
            pixel4[1] * dx * dy,
          pixel1[2] * (1 - dx) * (1 - dy) +
            pixel2[2] * dx * (1 - dy) +
            pixel3[2] * (1 - dx) * dy +
            pixel4[2] * dx * dy,
          pixel1[3] * (1 - dx) * (1 - dy) +
            pixel2[3] * dx * (1 - dy) +
            pixel3[3] * (1 - dx) * dy +
            pixel4[3] * dx * dy,
        ];

        resultContext.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`;
        resultContext.fillRect(x, y, 1, 1);
      }
    }
  }

  return resultCanvas;
};

const deletionZoomOut = (
  image: HTMLCanvasElement,
  zoomFactor: number
): HTMLCanvasElement => {
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = Math.ceil(image.width / zoomFactor);
  resultCanvas.height = Math.ceil(image.height / zoomFactor);
  const resultContext = resultCanvas.getContext("2d");

  if (!resultContext) {
    throw new Error("Could not create canvas context.");
  }

  for (let y = 0; y < resultCanvas.height; y++) {
    for (let x = 0; x < resultCanvas.width; x++) {
      const srcX = Math.floor(x * zoomFactor);
      const srcY = Math.floor(y * zoomFactor);
      const pixel = image.getContext("2d")?.getImageData(srcX, srcY, 1, 1).data;
      if (pixel) {
        resultContext.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`;
        resultContext.fillRect(x, y, 1, 1);
      }
    }
  }

  return resultCanvas;
};

const meanValueZoomOut = (
  image: HTMLCanvasElement,
  zoomFactor: number
): HTMLCanvasElement => {
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = Math.ceil(image.width / zoomFactor);
  resultCanvas.height = Math.ceil(image.height / zoomFactor);
  const resultContext = resultCanvas.getContext("2d");

  if (!resultContext) {
    throw new Error("Could not create canvas context.");
  }

  for (let y = 0; y < resultCanvas.height; y++) {
    for (let x = 0; x < resultCanvas.width; x++) {
      const srcX = Math.floor(x * zoomFactor);
      const srcY = Math.floor(y * zoomFactor);

      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      for (let j = 0; j < zoomFactor; j++) {
        for (let i = 0; i < zoomFactor; i++) {
          const pixel = image
            .getContext("2d")
            ?.getImageData(srcX + i, srcY + j, 1, 1).data;
          if (pixel) {
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
            a += pixel[3];
          }
        }
      }

      const numPixels = zoomFactor * zoomFactor;
      r = Math.floor(r / numPixels);
      g = Math.floor(g / numPixels);
      b = Math.floor(b / numPixels);
      a = Math.floor(a / numPixels);

      resultContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      resultContext.fillRect(x, y, 1, 1);
    }
  }

  return resultCanvas;
};
