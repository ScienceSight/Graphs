export {createLinearInterpolator} from "./Linear";
export {createBSplineInterpolator} from "./BSpline";
export {UniFunction} from "./Utils";

import {createLinearInterpolator} from "./Linear";
import {createBSplineInterpolator} from "./BSpline";
import {createDefaultInterpolator} from './Default';
import {UniFunction} from "./Utils";

export type InterpolationMethod = "linear" | "bSpline" | "none";

export function createInterpolator (interpolationMethod: InterpolationMethod, xVals: ArrayLike<number>, yVals: ArrayLike<number>) : UniFunction {
   switch (interpolationMethod) {
      case "linear":          return createLinearInterpolator(xVals, yVals);
      case "bSpline":         return createBSplineInterpolator(xVals, yVals);
      case "none":            return createDefaultInterpolator(xVals, yVals);
      default:                throw new Error(`Unknown interpolation method "${interpolationMethod}".`);
   }
}

export function createInterpolatorWithFallback (interpolationMethod: InterpolationMethod, xVals: ArrayLike<number>, yVals: ArrayLike<number>) : UniFunction {
   const n = xVals.length;
   let method = interpolationMethod;
   if (n < 3 && method == "bSpline") 
   {
      method = "linear";
   }
   if (n < 2) 
   {
      const c = (n == 1) ? yVals[0] : 0;
      return (_x: number) => c;
   }
   return createInterpolator(method, xVals, yVals);
}