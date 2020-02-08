export interface ColorRGB {
    r: number;
    g: number;
    b: number;
}

export interface ColorThiefOptions {
    colorCount: number;
    quality: number;
}

export type PaletteCallback = (palette: ColorRGB[] | null) => void;
export type ColorCallback = (color: ColorRGB | null) => void;
