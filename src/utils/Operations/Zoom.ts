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
  const ctx = image.getContext('2d');
  const width = image.width;
  const height = image.height;
  
  const newWidth = Math.round(width * zoomFactor);
  const newHeight = Math.round(height * zoomFactor);
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = newWidth;
  resultCanvas.height = newHeight;
  const resultCtx = resultCanvas.getContext('2d');
  
  const srcData = ctx.getImageData(0, 0, width, height).data;
  const resultData = new Uint8ClampedArray(newWidth * newHeight * 4);
  
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = (x / zoomFactor) | 0;
      const srcY = (y / zoomFactor) | 0;
      
      const srcIndex = (srcY * width + srcX) * 4;
      const resultIndex = (y * newWidth + x) * 4;
      
      for (let c = 0; c < 4; c++) {
        resultData[resultIndex + c] = srcData[srcIndex + c];
      }
    }
  }
  
  const resultImageData = new ImageData(resultData, newWidth, newHeight);
  resultCtx.putImageData(resultImageData, 0, 0);
  
  return resultCanvas;
};

const interpolationZoomIn = (
  image: HTMLCanvasElement,
  zoomFactor: number
): HTMLCanvasElement => {
  const ctx = image.getContext('2d');
  const width = image.width;
  const height = image.height;
  
  const newWidth = Math.round(width * zoomFactor);
  const newHeight = Math.round(height * zoomFactor);
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = newWidth;
  resultCanvas.height = newHeight;
  const resultCtx = resultCanvas.getContext('2d');
  
  const srcData = ctx.getImageData(0, 0, width, height).data;
  const resultData = new Uint8ClampedArray(newWidth * newHeight * 4);
  
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = (x / zoomFactor);
      const srcY = (y / zoomFactor);
      
      const x1 = Math.floor(srcX);
      const y1 = Math.floor(srcY);
      const x2 = Math.ceil(srcX);
      const y2 = Math.ceil(srcY);
      
      const dx = srcX - x1;
      const dy = srcY - y1;
      
      const srcIndex1 = (y1 * width + x1) * 4;
      const srcIndex2 = (y1 * width + x2) * 4;
      const srcIndex3 = (y2 * width + x1) * 4;
      const srcIndex4 = (y2 * width + x2) * 4;
      
      const resultIndex = (y * newWidth + x) * 4;
      
      for (let c = 0; c < 4; c++) {
        const topInterp = srcData[srcIndex1 + c] * (1 - dx) + srcData[srcIndex2 + c] * dx;
        const bottomInterp = srcData[srcIndex3 + c] * (1 - dx) + srcData[srcIndex4 + c] * dx;
        resultData[resultIndex + c] = topInterp * (1 - dy) + bottomInterp * dy;
      }
    }
  }
  
  const resultImageData = new ImageData(resultData, newWidth, newHeight);
  resultCtx.putImageData(resultImageData, 0, 0);
  
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
