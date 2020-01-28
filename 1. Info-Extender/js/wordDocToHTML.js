var mammoth = require("mammoth");

function wordToHTML(path) {
    return mammoth.convertToHtml({ path: path })
        .then(result => {
            return new Promise((resolve, reject) => {
                var html = result.value; // The generated HTML
                var messages = result.messages; // Any messages, such as warnings during conversion
                setTimeout(resolve, 4000, result);
            })
        })
}

module.exports = wordToHTML;
