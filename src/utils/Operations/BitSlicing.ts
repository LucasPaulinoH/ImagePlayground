export const executeBitSlicing = (
    image: HTMLCanvasElement,
    factor: number
  ): HTMLCanvasElement[] => {
    const resultingImagesArray: HTMLCanvasElement[] = [];
  
    // Obtém o contexto 2D do canvas da imagem original
    const context = image.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context for the image.');
    }
  
    // Obtém a largura e a altura da imagem
    const width = image.width;
    const height = image.height;
  
    // Itera através de cada bit no fator
    for (let bit = 0; bit < factor; bit++) {
      // Cria um novo canvas para cada imagem resultante
      const newCanvas = document.createElement('canvas');
      newCanvas.width = width;
      newCanvas.height = height;
  
      const newContext = newCanvas.getContext('2d');
      if (!newContext) {
        throw new Error('Could not get 2D context for the new canvas.');
      }
  
      // Obtém os dados da imagem original
      const imageData = context.getImageData(0, 0, width, height);
      const pixelData = imageData.data;
  
      // Itera através de cada pixel e ajusta o valor do canal vermelho (R) com base no bit atual
      for (let i = 0; i < pixelData.length; i += 4) {
        const pixelValue = pixelData[i];
        const newPixelValue = (pixelValue >> bit) & 1; // Obtém o valor do bit atual
        pixelData[i] = newPixelValue * 255; // Define o canal R com base no bit atual
        pixelData[i + 1] = pixelData[i + 2] = pixelData[i]; // Mantém os canais G e B iguais ao R
      }
  
      // Define os novos dados de pixel no contexto da nova imagem
      newContext.putImageData(imageData, 0, 0);
  
      // Adiciona a nova imagem ao array de imagens resultantes
      resultingImagesArray.push(newCanvas);
    }
  
    return resultingImagesArray;
  };