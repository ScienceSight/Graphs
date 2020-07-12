import { FormControl, Validators } from '@angular/forms'
import { XAxisPoint } from '../_graph/x-axis-point'

export class XAxisPointForm {
  xValue = new FormControl()
  xCoordinate = new FormControl()
  yCoordinate = new FormControl()
  isLogScale = new FormControl()
  logBase = new FormControl()

  constructor(
    xAxisPoint: XAxisPoint
  ) {
    this.xValue.setValue(xAxisPoint.xValue)
    this.xCoordinate.setValue(xAxisPoint.xCoordinate)
    this.yCoordinate.setValue(xAxisPoint.yCoordinate)
    this.logBase.setValue(xAxisPoint.logBase)

    if(xAxisPoint.isLogScale)
    {
      this.isLogScale.setValue(xAxisPoint.isLogScale)
    }
    else
    {
      this.isLogScale.setValue(false)
    }

    this.xValue.setValidators([Validators.required])
    this.xCoordinate.setValidators([Validators.required])
    this.yCoordinate.setValidators([Validators.required])
  }
}