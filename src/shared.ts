import {ColorRGB, ColorThiefOptions} from "./models";



export const createPixelArray = (imgData: Uint8ClampedArray, pixelCount: number, quality: number) => {
    const pixels = imgData;
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

        // If pixel is mostly opaque and not white
        if (typeof a === 'undefined' || a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }
    return pixelArray;
};

export const validateOptions = (options?: Partial<ColorThiefOptions>): ColorThiefOptions => {
    let { colorCount, quality } = options || {};

    if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
        colorCount = 10;
    } else if (colorCount === 1 ) {
        throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
        colorCount = Math.max(colorCount, 2);
        colorCount = Math.min(colorCount, 20);
    }

    if (typeof quality === 'undefined' || Number.isInteger(quality)) {
        quality = 10;
    } else if (quality < 1) {
        quality = 10;
    }

    return {
        colorCount,
        quality
    }
}

export const getPaletteFromImageData = (imageData: ImageData, quantize: any, options?: Partial<ColorThiefOptions>): ColorRGB[] | null => {
    const {
        colorCount,
        quality
    } = validateOptions(options);

    const pixelCount = imageData.width * imageData.height;

    const pixelArray = createPixelArray(imageData.data, pixelCount, quality);

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap = quantize(pixelArray, colorCount);
    return cmap ? cmap.palette() : null;
}
