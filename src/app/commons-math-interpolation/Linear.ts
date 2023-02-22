import {UniFunction, checkStrictlyIncreasing, trimPoly, evaluatePolySegment} from "./Utils";
import interpolate from "b-spline/index";

/**
* Returns a linear bspline interpolating function for a dataset.
*
* @param xVals
*    The arguments of the interpolation points, in strictly increasing order.
* @param yVals
*    The values of the interpolation points.
* @returns
*    A function which interpolates the dataset.
*/
export function createLinearInterpolator(xVals: ArrayLike<number>, yVals: ArrayLike<number>) : UniFunction {
   if (xVals.length != yVals.length) {
      throw new Error("Dimension mismatch.");
   }
   if (xVals.length < 2) {
      throw new Error("Number of points is too small.");
   }

  // var interpolate = require('b-spline/index');
   const degree = 1;
   const points = [];
   const knots = [];

   let curKnot = 0;

   for (let i = 0; i < degree + 1; i++) {
      knots.push(curKnot);
   }
   for (let i = 0; i < xVals.length - degree - 1; i++) {
      curKnot++;
      knots.push(curKnot);
   }
   curKnot++;
   for (let i = 0; i < degree + 1; i++) {
      knots.push(curKnot);
   }

   for (let i = 0; i < xVals.length; i++) {
      points.push([xVals[i], yVals[i]]);
   }

   return (x: number) => interpolate(x, degree, points, knots);
}