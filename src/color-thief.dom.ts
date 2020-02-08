
import {getPaletteFromImageData} from './shared';
import {ColorCallback, ColorRGB, ColorThiefOptions, PaletteCallback} from "./models";
// @ts-ignore
import quantize from '../node_modules/quantize';
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

type Source = CanvasImageSource | string;



    /*
     * getColor(sourceImage[, quality, [, callback]])
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
    export const getColor = (sourceImage: Source, quality: number, callback: ColorCallback): Promise<ColorRGB> =>
        getPaletteFromSource(sourceImage, {quality, colorCount: 5}).then(palette => {
            callback && callback(palette[0]);
            return palette[0];
        });

    /*
     * getPalette(sourceImage[, { colorCount, quality}, [callback]])
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
    export const getPalette = (sourceImage: Source, options?: ColorThiefOptions, callback?: PaletteCallback) =>
        getPaletteFromSource(sourceImage, options).then(palette => {
                callback && callback(palette);
            return palette;
        });


const getPaletteFromSource = (sourceImage: Source, options?: ColorThiefOptions): Promise<ColorRGB[]> =>
    getCanvasSource(sourceImage).then(canvasSource => {
        const imageData = dataFromImage(canvasSource);
        const palette = getPaletteFromImageData(imageData, quantize, options);
        if(!palette) {
            throw new Error('Failed to get image color palette');
        }
        return palette;
    });

const dataFromImage = (image: CanvasImageSource) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if(context == null) {
        throw new Error('Failed to get canvas context')
    }
    const width = canvas.width = getSourceSize(image.width);
    const height = canvas.height = getSourceSize(image.height);
    context.drawImage(image, 0, 0, width, height);
    return context.getImageData(0, 0, width, height);
};

const getCanvasSource = (imageSource: CanvasImageSource | string): Promise<CanvasImageSource> => new Promise((resolve, reject) => {
    if((typeof imageSource === 'string')) {
        const timeout = setTimeout(() => {
            reject('Timed out waiting for image to load');
        }, 10000);
        const imageElement = document.createElement("img");
        imageElement.addEventListener('load', () => {
            clearTimeout(timeout);
            resolve(imageElement);
        });
        imageElement.src = imageSource;
    }
    else {
        resolve(imageSource);
    }
});

const getSourceSize = (value: number | SVGAnimatedLength): number =>
    typeof value !== 'number'  ? value.baseVal.value : value;
