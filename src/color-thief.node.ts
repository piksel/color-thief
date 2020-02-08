import {ColorCallback, ColorRGB, ColorThiefOptions, PaletteCallback} from './models';
import {getPaletteFromImageData} from "./shared";
import * as ndarray from "ndarray";

import getPixels from "get-pixels/node-pixels";
// @ts-ignore
import quantize from "quantize"


/*
 * Color Thief Async v2.3.0
 * Originally by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Released under the MIT license
 * https://raw.githubusercontent.com/piksel/color-thief/master/LICENSE
 *
 * @license
 */

/*
 * getColor(imagePath[, quality, [, callback]])
 * returns Promise<{r: num, g: num, b: num}>
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar
 * colors and return the base color from the largest cluster.
 *
 * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster a color will be returned but the greater the likelihood that it will not be the visually
 * most dominant color.
 *
 * */
export const getColor = async (imagePath: string, quality?: number, callback?: ColorCallback): Promise<ColorRGB> =>
    getPaletteFromSource(imagePath, {quality, colorCount: 5}).then(palette => {
        callback && callback(palette[0]);
        return palette[0];
    });

/*
 * getPalette(imagePath[, { colorCount, quality}, callback])
 * returns Promise< [ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...] >
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar colors.
 *
 * colorCount determines the size of the palette; the number of colors returned. If not set, it
 * defaults to 10.
 *
 * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 *
 *
 */
export const getPalette = async (imagePath: string, options?: Partial<ColorThiefOptions>, callback?: PaletteCallback) =>
    getPaletteFromSource(imagePath, options).then(palette => {
        callback && callback(palette);
        return palette;
    });


const getPixelsAsync = (img: string) =>
    new Promise<ndarray>((resolve, reject) => {
        getPixels(img, (error: any, data: ndarray) => {
            if(error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    });

const getPaletteFromSource = async (imagePath: string, options?: Partial<ColorThiefOptions>) => {
    const imageData = await getPixelsAsync(imagePath).then(pixels => ({
        data: pixels.data as Uint8ClampedArray,
        height: pixels.shape[0],
        width: pixels.shape[1],
    }));
    const palette = getPaletteFromImageData(imageData, quantize, options);
    if(!palette) {
        throw new Error('Failed to get image color palette');
    }
    return palette;
};
