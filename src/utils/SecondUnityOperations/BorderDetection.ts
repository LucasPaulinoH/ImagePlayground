import { BorderDetectionFilter } from "../../types/filters";

export const executeBorderDetection = (
  image: HTMLCanvasElement,
  borderDetectionType: BorderDetectionFilter
) => {
  let resultingImageCanvas = null;

  switch (borderDetectionType) {
    case BorderDetectionFilter.ROBERTS:
      break;
    case BorderDetectionFilter.CROSSED_ROBERTS:
      break;
    case BorderDetectionFilter.PREWIIT_GX:
      break;
    case BorderDetectionFilter.PREWIIT_GY:
      break;
    case BorderDetectionFilter.MAGNITUDE_PREWIITE:
      break;
    case BorderDetectionFilter.SOBEL_GX:
      break;
    case BorderDetectionFilter.SOBEL_GY:
      break;
    case BorderDetectionFilter.MAGNITUDE_SOBEL:
      break;
    case BorderDetectionFilter.KRISH:
      break;
    case BorderDetectionFilter.ROBINSON:
      break;
    case BorderDetectionFilter.FREY_CHEN:
      break;
    case BorderDetectionFilter.LAPLACIAN_H1:
      break;
    case BorderDetectionFilter.LAPLACIAN_H2:
      break;
    default:
      console.warn("Invalid border detection filter selected.");
      break;
  }
  return resultingImageCanvas;
};
