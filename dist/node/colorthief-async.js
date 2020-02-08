function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getPixels = _interopDefault(require('get-pixels/node-pixels'));
var quantize = _interopDefault(require('quantize'));

var createPixelArray = function (imgData, pixelCount, quality) {
  var pixels = imgData;
  var pixelArray = [];

  for (var i = 0, offset = (void 0), r = (void 0), g = (void 0), b = (void 0), a = (void 0); i < pixelCount; i = i + quality) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3]; // If pixel is mostly opaque and not white

    if (typeof a === 'undefined' || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b]);
      }
    }
  }

  return pixelArray;
};
var validateOptions = function (options) {
  var ref = options || {};
  var colorCount = ref.colorCount;
  var quality = ref.quality;

  if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
    colorCount = 10;
  } else if (colorCount === 1) {
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
    colorCount: colorCount,
    quality: quality
  };
};
var getPaletteFromImageData = function (imageData, quantize$$1, options) {
  var ref = validateOptions(options);
  var colorCount = ref.colorCount;
  var quality = ref.quality;
  var pixelCount = imageData.width * imageData.height;
  var pixelArray = createPixelArray(imageData.data, pixelCount, quality); // Send array to quantize function which clusters values
  // using median cut algorithm

  var cmap = quantize$$1(pixelArray, colorCount);
  return cmap ? cmap.palette() : null;
};

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

var getColor = function (imagePath, quality, callback) {
  try {
    return Promise.resolve(getPaletteFromSource(imagePath, {
      quality: quality,
      colorCount: 5
    }).then(function (palette) {
      callback && callback(palette[0]);
      return palette[0];
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
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

var getPalette = function (imagePath, options, callback) {
  try {
    return Promise.resolve(getPaletteFromSource(imagePath, options).then(function (palette) {
      callback && callback(palette);
      return palette;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

var getPixelsAsync = function (img) { return new Promise(function (resolve, reject) {
  getPixels(img, function (error, data) {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
}); };

var getPaletteFromSource = function (imagePath, options) {
  try {
    return Promise.resolve(getPixelsAsync(imagePath).then(function (pixels) { return ({
      data: pixels.data,
      height: pixels.shape[0],
      width: pixels.shape[1]
    }); })).then(function (imageData) {
      var palette = getPaletteFromImageData(imageData, quantize, options);

      if (!palette) {
        throw new Error('Failed to get image color palette');
      }

      return palette;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.getColor = getColor;
exports.getPalette = getPalette;
//# sourceMappingURL=colorthief-async.js.map
