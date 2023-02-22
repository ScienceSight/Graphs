import { UntypedFormControl, Validators } from '@angular/forms'
import { YAxisPoint } from '../_graph/y-axis-point'

export class YAxisPointForm {
  yValue = new UntypedFormControl()
  xCoordinate = new UntypedFormControl()
  yCoordinate = new UntypedFormControl()
  isLogScale = new UntypedFormControl()
  logBase = new UntypedFormControl()

  constructor(
    yAxisPoint: YAxisPoint
  ) {
    this.yValue.setValue(yAxisPoint.yValue)
    this.xCoordinate.setValue(yAxisPoint.xCoordinate)
    this.yCoordinate.setValue(yAxisPoint.yCoordinate)
    this.logBase.setValue(yAxisPoint.logBase)

    if(yAxisPoint.isLogScale)
    {
      this.isLogScale.setValue(yAxisPoint.isLogScale)
    }
    else
    {
      this.isLogScale.setValue(false)
    }

    this.yValue.setValidators([Validators.required])
    this.xCoordinate.setValidators([Validators.required])
    this.yCoordinate.setValidators([Validators.required])
  }
}