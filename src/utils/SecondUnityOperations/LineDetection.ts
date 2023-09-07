import { LineDetectionFilter } from "../../types/filters";

export const executeLineDetection = (
    image: HTMLCanvasElement,
    lineDetectionType: LineDetectionFilter
  ) => {
    let resultingImageCanvas = null;
  
    switch (lineDetectionType) {
      case LineDetectionFilter.HORIZONTAL:
        break;
      case LineDetectionFilter.VERTICAL:
        break;
      case LineDetectionFilter.DEGREES_45:
        break;
      case LineDetectionFilter.DEGREES_135:
        break;
      default:
        console.warn("Invalid line detection filter selected.");
        break;
    }
    return resultingImageCanvas;
  };
  