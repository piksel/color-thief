import { ColorCallback, ColorRGB, ColorThiefOptions, PaletteCallback } from './models';
export declare const getColor: (imagePath: string, quality?: number | undefined, callback?: ColorCallback | undefined) => Promise<ColorRGB>;
export declare const getPalette: (imagePath: string, options?: Partial<ColorThiefOptions> | undefined, callback?: PaletteCallback | undefined) => Promise<ColorRGB[]>;
