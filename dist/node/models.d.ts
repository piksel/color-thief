export interface ColorRGB {
    r: number;
    g: number;
    b: number;
}
export interface ColorThiefOptions {
    colorCount: number;
    quality: number;
}
export declare type PaletteCallback = (palette: ColorRGB[] | null) => void;
export declare type ColorCallback = (color: ColorRGB | null) => void;
