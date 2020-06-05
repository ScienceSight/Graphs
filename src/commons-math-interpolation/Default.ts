import {UniFunction} from "./Utils";

export function createDefaultInterpolator(xVals: ArrayLike<number>, yVals: ArrayLike<number>) : UniFunction {
    if (xVals.length != yVals.length) {
        throw new Error("Dimension mismatch.");
    }
    if (xVals.length < 2) {
        throw new Error("Number of points is too small.");
    }

    const xValsCopy = Float64Array.from(xVals);                       // clone to break dependency on passed values
    const yValsCopy = Float64Array.from(yVals);                       // clone to break dependency on passed values

    return (i: number) => {
        var result = result || [];
        result[0] = xValsCopy[i];
        result[1] = yValsCopy[i];
        return result;
    };
 }