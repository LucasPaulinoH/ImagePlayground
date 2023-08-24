import { HighPassFilters } from "../../types/filters";

export const executeHighPassFilter = (
  image: HTMLCanvasElement,
  highPassFilterType: HighPassFilters
): HTMLCanvasElement => {
  let resultingImageCanvas = null;

  switch (highPassFilterType) {
    case HighPassFilters.H1:
      resultingImageCanvas = h1(image);
      break;
    case HighPassFilters.H2:
      resultingImageCanvas = h2(image);
      break;
    case HighPassFilters.M1:
      resultingImageCanvas = m1(image);
      break;
    case HighPassFilters.M2:
      resultingImageCanvas = m2(image);
      break;
    case HighPassFilters.M3:
      resultingImageCanvas = m3(image);
      break;
    case HighPassFilters.HIGH_BOOST:
      resultingImageCanvas = highBoost(image);
      break;
    default:
      break;
  }

  return resultingImageCanvas;
};

const h1 = (image: HTMLCanvasElement): HTMLCanvasElement => {};
const h2 = (image: HTMLCanvasElement): HTMLCanvasElement => {};
const m1 = (image: HTMLCanvasElement): HTMLCanvasElement => {};
const m2 = (image: HTMLCanvasElement): HTMLCanvasElement => {};
const m3 = (image: HTMLCanvasElement): HTMLCanvasElement => {};
const highBoost = (image: HTMLCanvasElement): HTMLCanvasElement => {};
