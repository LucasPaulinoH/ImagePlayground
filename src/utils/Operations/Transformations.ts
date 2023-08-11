import { TransformationOperation } from "../../types";

export const transformationOperation = (
  image: HTMLCanvasElement,
  transformationType: TransformationOperation,
  rotationFactor?: number,
  xTranslationFactor?: number,
  yTranslationFactor?: number,
  xScaleFactor?: number,
  yScaleFactor?: number,
  xShearFactor?: number,
  yShearFactor?: number
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
      resultingImageCanva = scale(image, xScaleFactor ?? 0, yScaleFactor ?? 0);
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
      resultingImageCanva = shear(
        image,
        TransformationOperation.X_SHEAR,
        xShearFactor ?? 0
      );
      break;

    case TransformationOperation.Y_SHEAR:
      resultingImageCanva = shear(
        image,
        TransformationOperation.Y_SHEAR,
        yShearFactor ?? 0
      );
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

  translatedCanvas.width = image.width;
  translatedCanvas.height = image.height;

  translatedContext.translate(xDistance, yDistance);
  translatedContext.drawImage(image, 0, 0);
  translatedContext.setTransform(1, 0, 0, 1, 0, 0);

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

const shear = (
  image: HTMLCanvasElement,
  shearType: TransformationOperation,
  shearFactor: number
): HTMLCanvasElement => {
  const shearedCanvas = document.createElement("canvas");
  const shearedContext = shearedCanvas.getContext("2d");

  const shearedWidth = image.width + Math.abs(shearFactor) * image.height;
  const shearedHeight = image.height + Math.abs(shearFactor) * image.width;

  shearedCanvas.width = shearedWidth;
  shearedCanvas.height = shearedHeight;

  shearedContext.clearRect(0, 0, shearedCanvas.width, shearedCanvas.height);

  if (shearType === TransformationOperation.X_SHEAR) {
    if (shearFactor >= 0) {
      shearedContext.transform(1, 0, shearFactor, 1, 0, 0);
    } else {
      shearedContext.transform(1, 0, 0, 1, -shearFactor * image.height, 0);
    }
  } else if (shearType === TransformationOperation.Y_SHEAR) {
    if (shearFactor >= 0) {
      shearedContext.transform(1, shearFactor, 0, 1, 0, 0);
    } else {
      shearedContext.transform(1, 0, 0, 1, 0, -shearFactor * image.width);
    }
  }

  shearedContext.drawImage(image, 0, 0);
  shearedContext.setTransform(1, 0, 0, 1, 0, 0);

  return shearedCanvas;
};
