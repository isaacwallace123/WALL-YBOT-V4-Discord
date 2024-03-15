const Suffixes = [
    [""],
    ["K"],
    ["M"],
    ["B"],
    ["T"],
    ["Q"],
    ["QN"],
];

module.exports = (number) => {
    if (!number) return 0;

    try {
        const characterlength = Number(number.toString().length) - 1;
        const divisible = Math.floor(characterlength / 3);
        const MathPart = Math.floor(number / (Math.pow(100, divisible)));

        return MathPart / Math.pow(10, divisible) + Suffixes[divisible];
    } catch (err) {
        console.log(err);
    }
}