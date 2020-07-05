import { FormControl, Validators } from '@angular/forms'
import { XAxisPoint } from '../_graph/x-axis-point'

export class XAxisPointForm {
  xCoordinate = new FormControl()
  yCoordinate = new FormControl()
  xValue = new FormControl()

  constructor(
    xAxisPoint: XAxisPoint
  ) {
    this.xCoordinate.setValue(xAxisPoint.xCoordinate)
    this.yCoordinate.setValue(xAxisPoint.yCoordinate)
    this.xValue.setValue(xAxisPoint.xValue)

    this.xCoordinate.setValidators([Validators.required])
    this.yCoordinate.setValidators([Validators.required])
    this.xValue.setValidators([Validators.required])
  }
}