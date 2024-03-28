exports.addSlashes = (text) => {
    return text.replace(/'/g, "\\'");
};


exports.leftPadWithZero = (number) => {
    return String(number).padStart(5,'0')
}