import { FormControl, Validators } from '@angular/forms'
import { YAxisPoint } from '../_graph/y-axis-point'

export class YAxisPointForm {
  yValue = new FormControl()
  xCoordinate = new FormControl()
  yCoordinate = new FormControl()
  isLogScale = new FormControl()
  logBase = new FormControl()

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