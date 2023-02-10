import { UntypedFormControl, Validators } from '@angular/forms'
import { XAxisPoint } from '../_graph/x-axis-point'

export class XAxisPointForm {
  xValue = new UntypedFormControl()
  xCoordinate = new UntypedFormControl()
  yCoordinate = new UntypedFormControl()
  isLogScale = new UntypedFormControl()
  logBase = new UntypedFormControl()

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