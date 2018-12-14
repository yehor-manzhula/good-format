
const {isFunction, isPlainObject, isArray, get} = require('lodash');
const colors = require('colors');

const formatter = require('./formatter');

/**
 * Formats value with given color or style
 * 
 * @param  {*} key
 * @param  {String|Object|Function} color='' Color or style, theme object or style getter predicate
 * @returns {String}
 * 
 * @example
 * 
 * new GoodFormat({
 *      error: template`${font('error.message', 'red')}`
 * });
 */
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

/**
 * Adds theme methods to font formatter
 * 
 * @example
 * 
 * font.setTheme({
 *      error: ['red', 'bold']
 * });
 * 
 * new GoodFormat({
 *      error: template`${font.error('error.message')}`
 * });
 */
font.setTheme = theme => {
    colors.setTheme(theme);

    Object.keys(theme).forEach(name => {
        font[name] = key => font(key, theme[name]);
    });
};

/**
 * Available font styles
 */
const fontStyles = [
    'bold',
    'dim',
    'italic',
    'underline',
    'inverse',
    'hidden',
    'strikethrough'
];

/**
 * All the available colors could be found here 
 * {@link https://www.npmjs.com/package/colors|colors}
 */
const fontColors = Object.keys(colors.styles)
    .filter(style => !fontStyles.includes(style));

/**
 * Add colors and styles to font formatter
 *
 * @example
 * 
 * template`${font.red('error.message')}`
 * template`${font.bold('error.message')}`  
 */
[...fontColors, ...fontStyles].forEach(style => {
    font[style] = (key, additional) => {
        style += additional ? `.${additional}` : '';
        return font(key, style);
    };
});

/**
 * Add styles to colors methods of font formatter
 *
 * @example
 * 
 * template`${font.red.bold('error.message')}`  
 */
fontColors.forEach(color => {
    fontStyles.forEach(style => {
        font[color][style] = key => font[color](key, style);
    });
});

/**
 * Add colors to style methods of font formatter
 *
 * @example
 * 
 * template`${font.bold.red('error.message')}`  
 */
fontStyles.forEach(style => {
    fontColors.forEach(color => {
        font[style][color] = (key) => font[style](key, color);
    });
});

module.exports = font;
