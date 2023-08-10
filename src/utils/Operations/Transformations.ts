import { TransformationOperation } from "../../types";

export const transformationOperation = (
  image: HTMLCanvasElement,
  transformationType: TransformationOperation
) => {
  let resultingImageCanva: HTMLCanvasElement | null = null;

  switch (transformationType) {
    case TransformationOperation.ROTATION:
      break;
    case TransformationOperation.TRANSLATION:
      break;
    case TransformationOperation.SCALE:
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
