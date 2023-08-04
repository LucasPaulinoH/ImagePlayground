// @ts-nocheck
export const extractCanvasImageMatrix = (image: HTMLCanvasElement): Uint8ClampedArray =>{
    const ctx = image.getContext("2d");
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    return imageData.data;
}
