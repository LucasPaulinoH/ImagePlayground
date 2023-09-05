import { HalftoningFilters } from "../../types/filters";

export const executeHalftoning = (image: HTMLCanvasElement, halftone: HalftoningFilters) => {
    let resultingImageCanvas = null;

    switch (halftone) {
      case HalftoningFilters.ORDERED_DOT_PLOT_2X2:
        resultingImageCanvas = orderedDotPlot2x2(image)
        break;
      case HalftoningFilters.ORDERED_DOT_PLOT_2X3:
        resultingImageCanvas = orderedDotPlot2x3(image)
        break;
      case HalftoningFilters.ORDERED_DOT_PLOT_3X3:
        resultingImageCanvas = orderedDotPlot3x3(image)
        break;
      case HalftoningFilters.DITHERING:
        resultingImageCanvas = dithering(image)
        break;
      case HalftoningFilters.FLOYD_STEINBERG:
        resultingImageCanvas = floydAndSteinberg(image)
        break;
      case HalftoningFilters.ROGERS:
        resultingImageCanvas = rogers(image)
        break;
      case HalftoningFilters.JARVIS_JUDICE_NINKE:
        resultingImageCanvas = jarvisJudiceAndNinke(image)
        break;
      case HalftoningFilters.STUCKI:
        resultingImageCanvas = stucki(image)
        break;
      case HalftoningFilters.STEVENSONE_ARCE:
        resultingImageCanvas = stevensoneArce(image)
        break;
      default:
        console.warn("Invalid halftoning filter selected.")
        break;
    } 
    return resultingImageCanvas;
}

const orderedDotPlot2x2= (image: HTMLCanvasElement) => {
  
}

const orderedDotPlot2x3= (image: HTMLCanvasElement) => {
  
}

const orderedDotPlot3x3= (image: HTMLCanvasElement) => {

}

const dithering = (image: HTMLCanvasElement) => {

}

const floydAndSteinberg = (image: HTMLCanvasElement) => {

}

const rogers = (image: HTMLCanvasElement) => {

}

const jarvisJudiceAndNinke = (image: HTMLCanvasElement) => {

}

const stucki = (image: HTMLCanvasElement) => {

}

const stevensoneArce = (image: HTMLCanvasElement) => {

}