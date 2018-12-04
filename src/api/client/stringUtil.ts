import Long = require("long")
export function zeroPad(input: string, length: number) {
    return (Array(length + 1).join("0") + input).slice(-length)
}

export function hycontoString(val: Long): string {
    const int = val.divide(1000000000)
    const sub = val.modulo(1000000000)
    if (sub.isZero()) {
        return int.toString()
    }

    let decimals = sub.toString()
    while (decimals.length < 9) {
        decimals = "0" + decimals
    }

    while (decimals.charAt(decimals.length - 1) === "0") {
        decimals = decimals.substr(0, decimals.length - 1)
    }

    return int.toString() + "." + decimals
}

export function hyconfromString(val: string): Long {
    if (val === "" || val === undefined || val === null) { return Long.fromNumber(0, true) }
    if (val[val.length - 1] === ".") { val += "0" }
    const arr = val.toString().split(".")
    let hycon = Long.fromString(arr[0], true).multiply(Math.pow(10, 9)).toUnsigned()
    if (arr.length > 1) {
        arr[1] = arr[1].length > 9 ? arr[1].slice(0, 9) : arr[1]
        const subCon = Long.fromString(arr[1], true).multiply(Math.pow(10, 9 - arr[1].length))
        hycon = strictAdd(hycon, subCon)
    }
    return hycon.toUnsigned()
}
export function encodingMnemonic(str: string): string {
    return str.normalize("NFKD")
}

// TODO - After making long caclulate util lib, delete this one.
export function strictAdd(a: Long, b: Long) {
    const maxB = Long.MAX_UNSIGNED_VALUE.subtract(a)
    const maxA = Long.MAX_UNSIGNED_VALUE.subtract(b)
    if (b.greaterThan(maxB) || a.greaterThan(maxA)) {
        throw new Error("Overflow")
    }
    return a.add(b)
}

export function strictSub(a: Long, b: Long) {
    if (a.lessThan(b) || b.greaterThan(a)) {
        throw new Error("Underflow")
    }
    return a.sub(b)
}
