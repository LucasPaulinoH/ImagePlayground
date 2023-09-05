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

const orderedDotPlot2x2= (image: HTMLCanvasElement): HTMLCanvasElement => {
    const ctxIn = image.getContext("2d");

  if (!ctxIn) {
    throw new Error("Não foi possível obter o contexto do canvas de entrada.");
  }

  // Cria um novo canvas para a imagem resultante
  const resultCanvas = document.createElement("canvas");
  const ctxOut = resultCanvas.getContext("2d");

  if (!ctxOut) {
    throw new Error("Não foi possível obter o contexto do canvas de saída.");
  }

  // Define o tamanho do canvas de saída igual ao tamanho do canvas de entrada
  resultCanvas.width = image.width;
  resultCanvas.height = image.height;

  // Define uma matriz de meios-tons 2x2 (pode ser personalizada)
  const thresholdMatrix = [[15, 135], [195, 75]];

  // Percorre a imagem pixel a pixel e aplica a técnica de meios-tons
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixelData = ctxIn.getImageData(x, y, 1, 1).data;
      const grayValue = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
      const threshold = thresholdMatrix[y % 2][x % 2];
      const newPixelValue = grayValue < threshold ? 0 : 255;

      ctxOut.fillStyle = `rgb(${newPixelValue}, ${newPixelValue}, ${newPixelValue})`;
      ctxOut.fillRect(x, y, 1, 1);
    }
  }

  return resultCanvas;
}

const orderedDotPlot2x3= (image: HTMLCanvasElement) => {
    const ctxIn = image.getContext("2d");

    if (!ctxIn) {
      throw new Error("Não foi possível obter o contexto do canvas de entrada.");
    }
  
    const resultCanvas = document.createElement("canvas");
    const ctxOut = resultCanvas.getContext("2d");
  
    if (!ctxOut) {
      throw new Error("Não foi possível obter o contexto do canvas de saída.");
    }
  
    resultCanvas.width = image.width;
    resultCanvas.height = image.height;
  
    const thresholdMatrix = [[15, 135, 45], [195, 75, 105]];
  
    const inputImageData = ctxIn.getImageData(0, 0, image.width, image.height);
    const outputImageData = ctxOut.createImageData(image.width, image.height);
  
    for (let i = 0; i < inputImageData.data.length; i += 4) {
      const x = (i / 4) % image.width;
      const y = Math.floor(i / (4 * image.width));
      const grayValue = (inputImageData.data[i] + inputImageData.data[i + 1] + inputImageData.data[i + 2]) / 3;
      const threshold = thresholdMatrix[y % 2][x % 3];
      const newPixelValue = grayValue < threshold ? 0 : 255;
  
      outputImageData.data[i] = newPixelValue;
      outputImageData.data[i + 1] = newPixelValue;
      outputImageData.data[i + 2] = newPixelValue;
      outputImageData.data[i + 3] = 255;
    }
  
    ctxOut.putImageData(outputImageData, 0, 0);
  
    return resultCanvas;
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