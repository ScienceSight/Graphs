import { FormControl, Validators } from '@angular/forms'
import { YAxisPoint } from '../_graph/y-axis-point'

export class YAxisPointForm {
  xCoordinate = new FormControl()
  yCoordinate = new FormControl()
  yValue = new FormControl()

  constructor(
    yAxisPoint: YAxisPoint
  ) {
    this.xCoordinate.setValue(yAxisPoint.xCoordinate)
    this.yCoordinate.setValue(yAxisPoint.yCoordinate)
    this.yValue.setValue(yAxisPoint.yValue)

    this.xCoordinate.setValidators([Validators.required])
    this.yCoordinate.setValidators([Validators.required])
    this.yValue.setValidators([Validators.required])
  }
}