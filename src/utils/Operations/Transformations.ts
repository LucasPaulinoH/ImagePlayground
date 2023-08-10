import { TransformationOperation } from "../../types";

export const transformationOperation = (
  image: HTMLCanvasElement,
  transformationType: TransformationOperation,
  rotationFactor?: number,
  xTranslationFactor?: number,
  yTranslationFactor?: number,
  xScaleFactor?: number,
  yScaleFactor?: number
) => {
  let resultingImageCanva: HTMLCanvasElement | null = null;

  switch (transformationType) {
    case TransformationOperation.ROTATION:
      resultingImageCanva = rotation(image, rotationFactor ?? 0);
      break;
    case TransformationOperation.TRANSLATION:
      resultingImageCanva = translation(
        image,
        xTranslationFactor ?? 0,
        yTranslationFactor ?? 0
      );
      break;
    case TransformationOperation.SCALE:
      resultingImageCanva = scale(
        image,
        xScaleFactor ?? 0,
        yScaleFactor ?? 0
      );
      break;
    case TransformationOperation.HORIZONTAL_REFLECTION:
      resultingImageCanva = reflection(
        image,
        TransformationOperation.HORIZONTAL_REFLECTION
      );
      break;
    case TransformationOperation.VERTICAL_REFLECTION:
      resultingImageCanva = reflection(
        image,
        TransformationOperation.VERTICAL_REFLECTION
      );
      break;
    case TransformationOperation.X_SHEAR:
      break;

    case TransformationOperation.Y_SHEAR:
      break;
    default:
      console.warn("Invalid transformation operation.");
      break;
  }

  return resultingImageCanva;
};

const rotation = (
  image: HTMLCanvasElement,
  rotation: number
): HTMLCanvasElement => {
  const rotatedCanvas = document.createElement("canvas");
  const rotatedContext = rotatedCanvas.getContext("2d");

  const width = image.width;
  const height = image.height;
  const diagonal = Math.sqrt(width ** 2 + height ** 2);
  const rotatedWidth = Math.ceil(diagonal);
  const rotatedHeight = Math.ceil(diagonal);

  rotatedCanvas.width = rotatedWidth;
  rotatedCanvas.height = rotatedHeight;

  const centerX = rotatedWidth / 2;
  const centerY = rotatedHeight / 2;

  rotatedContext.translate(centerX, centerY);
  rotatedContext.rotate((rotation * Math.PI) / 180);
  rotatedContext.drawImage(image, -width / 2, -height / 2);

  rotatedContext.setTransform(1, 0, 0, 1, 0, 0);

  return rotatedCanvas;
};

const translation = (
  image: HTMLCanvasElement,
  xDistance: number,
  yDistance: number
): HTMLCanvasElement => {
  const translatedCanvas = document.createElement("canvas");
  const translatedContext = translatedCanvas.getContext("2d");

  // Set the canvas dimensions based on the original image size
  translatedCanvas.width = image.width;
  translatedCanvas.height = image.height;

  // Translate the context by the specified distances
  translatedContext.translate(xDistance, yDistance);

  // Draw the original image onto the translated canvas
  translatedContext.drawImage(image, 0, 0);

  // Reset transformations
  translatedContext.setTransform(1, 0, 0, 1, 0, 0);

  // Return the translated canvas
  return translatedCanvas;
};

const scale = (
  image: HTMLCanvasElement,
  xScale: number,
  yScale: number
): HTMLCanvasElement => {
  const scaledCanvas = document.createElement("canvas");
  const scaledContext = scaledCanvas.getContext("2d");

  const scaledWidth = image.width * xScale;
  const scaledHeight = image.height * yScale;

  scaledCanvas.width = scaledWidth;
  scaledCanvas.height = scaledHeight;

  scaledContext.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);

  scaledContext.drawImage(image, 0, 0, scaledWidth, scaledHeight);

  return scaledCanvas;
};

const reflection = (
  image: HTMLCanvasElement,
  reflectionType: TransformationOperation
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not supported");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  if (reflectionType === TransformationOperation.HORIZONTAL_REFLECTION) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(image, 0, 0);

  return canvas;
};
