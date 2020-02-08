import { ColorRGB, ColorThiefOptions } from "./models";
export declare const createPixelArray: (imgData: Uint8ClampedArray, pixelCount: number, quality: number) => number[][];
export declare const validateOptions: (options?: Partial<ColorThiefOptions> | undefined) => ColorThiefOptions;
export declare const getPaletteFromImageData: (imageData: ImageData, quantize: any, options?: Partial<ColorThiefOptions> | undefined) => ColorRGB[] | null;
