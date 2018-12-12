
const {isFunction, isPlainObject, isArray, get} = require('lodash');
const colors = require('colors');

const formatter = require('./formatter');

function font(key, color = '') {
    return formatter(value => {
        let colorName = color;
        
        if (isFunction(color)) {
            colorName = color(value);
        }
        
        if (isPlainObject(color)) {
            const normalizedValue = `${value}`.trim();
            colorName = color[normalizedValue];
        }

        let colorizer;

        if (isArray(color)) {
            colorizer = value => {
                let output = value;
                // Apply all the colors
                color.forEach(item => {
                    output = colors[item](output);
                });

                return output;
            };
        } else {
            colorizer = get(colors, colorName);
        }

        return colorizer ? colorizer(value) : value;
    })(key);
}

// Add to font object custom methods
font.setTheme = theme => {
    colors.setTheme(theme);

    Object.keys(theme).forEach(name => {
        font[name] = key => font(key, theme[name]);
    });
};

const fontStyles = [
    'bold',
    'dim',
    'italic',
    'underline',
    'inverse',
    'hidden',
    'strikethrough'
];

const fontColors = Object.keys(colors.styles)
    .filter(style => !fontStyles.includes(style));

// Add colors and styles to font
// .font
// .green    
[...fontColors, ...fontStyles].forEach(style => {
    font[style] = (key, additional) => {
        style += additional ? `.${additional}` : '';
        return font(key, style);
    };
});

fontColors.forEach(color => {
    // Add styles to colors
    // font.green.bold
    fontStyles.forEach(style => {
        font[color][style] = key => font[color](key, style);
    });
});

fontStyles.forEach(style => {
    // Added colors to styles
    // font.bold.green
    fontColors.forEach(color => {
        font[style][color] = (key) => font[style](key, color);
    });
});

module.exports = font;
