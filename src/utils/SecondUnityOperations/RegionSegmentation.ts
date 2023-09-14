export const executeRegionSegmentation = (
  image: HTMLCanvasElement,
  threshold: number,
  seeds: number
): HTMLCanvasElement => {
    const resultImage = document.createElement('canvas');
    resultImage.width = image.width;
    resultImage.height = image.height;
    const resultCtx = resultImage.getContext('2d');
    if (!resultCtx) {
      throw new Error('Não foi possível obter o contexto 2D da nova imagem.');
    }
  
    // Obtenha os dados da imagem original
    const imageData = image.getContext('2d').getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
  
    // Crie um array de sementes com cores aleatórias
    const seedColors: number[][] = [];
    for (let i = 0; i < seeds; i++) {
      const color = [
        Math.floor(Math.random() * 256), // Red
        Math.floor(Math.random() * 256), // Green
        Math.floor(Math.random() * 256), // Blue
      ];
      seedColors.push(color);
    }
  
    // Implemente a lógica de segmentação por região aqui
    const resultImageData = resultCtx.createImageData(image.width, image.height);
    const resultData = resultImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const pixelValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
  
      // Determine a qual semente este pixel pertence com base no threshold
      let closestSeedIndex = -1;
      let minDifference = Infinity;
      for (let j = 0; j < seedColors.length; j++) {
        const seedValue = (seedColors[j][0] + seedColors[j][1] + seedColors[j][2]) / 3;
        const difference = Math.abs(pixelValue - seedValue);
        if (difference <= threshold && difference < minDifference) {
          minDifference = difference;
          closestSeedIndex = j;
        }
      }
  
      // Pinte o pixel na nova imagem com a cor da semente correspondente
      if (closestSeedIndex !== -1) {
        resultData[i] = seedColors[closestSeedIndex][0];
        resultData[i + 1] = seedColors[closestSeedIndex][1];
        resultData[i + 2] = seedColors[closestSeedIndex][2];
        resultData[i + 3] = 255; // Defina a opacidade como 255
      }
    }
  
    // Coloque os dados na nova imagem
    resultCtx.putImageData(resultImageData, 0, 0);
  
    // Retorne a nova imagem
    return resultImage;
};
