import { ColorCallback, ColorRGB, ColorThiefOptions, PaletteCallback } from "./models";
declare type Source = CanvasImageSource | string;
export declare const getColor: (sourceImage: Source, quality: number, callback: ColorCallback) => Promise<ColorRGB>;
export declare const getPalette: (sourceImage: Source, options?: ColorThiefOptions | undefined, callback?: PaletteCallback | undefined) => Promise<ColorRGB[]>;
export {};
