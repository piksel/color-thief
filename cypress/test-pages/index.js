var images = [
    'black.png',
    'red.png',
    'rainbow-horizontal.png',
    'rainbow-vertical.png',
    // 'transparent.png',
    // 'white.png',
];

// Render example images
var examplesHTML = Mustache.to_html(document.getElementById('image-tpl').innerHTML, images);
document.getElementById('example-images').innerHTML = examplesHTML;

// Once images are loaded, process them
document.querySelectorAll('.image').forEach((image) => {
    const section = image.closest('.image-section');
    if (this.complete) {
        showColorsForImage(image, section);
    } else {
        image.addEventListener('load', function() {
            showColorsForImage(image, section);
        });
    }
})

// Run Color Thief functions and display results below image.
// We also log execution time of functions for display.
const showColorsForImage = async function(image, section) {
    // getColor(img)
    let start = Date.now();
    let result = await ColorThief.getColor(image);
    let elapsedTime = Date.now() - start;
    const colorHTML = Mustache.to_html(document.getElementById('color-tpl').innerHTML, {
        color: result,
        colorStr: result.toString(),
        elapsedTime
    })

    // getPalette(img)
    let paletteHTML = '';
    let colorCounts = [2, 3, 5, 7, 10, 20];
    Promise.all(colorCounts.map((colorCount) => {
        let start = Date.now();
        return ColorThief.getPalette(image, {colorCount}).then(result => {
            let elapsedTime = Date.now() - start;
            return Mustache.to_html(document.getElementById('palette-tpl').innerHTML, {
                colorCount,
                palette: result,
                paletteStr: result.toString(),
                elapsedTime
            })
        })
    })).then(results => {
        const outputEl = section.querySelector('.output');
        outputEl.innerHTML += colorHTML + results.join('');
    });

};
