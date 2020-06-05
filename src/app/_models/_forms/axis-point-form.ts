import { FormControl, Validators } from '@angular/forms'
import { AxisPoint } from '../_graph/point'

export class AxisPointForm {
  xCoordinate = new FormControl()
  yCoordinate = new FormControl()
  xValue = new FormControl()
  yValue = new FormControl()

  constructor(
    axisPoint: AxisPoint
  ) {
    this.xCoordinate.setValue(axisPoint.xCoordinate)
    //this.id.setValidators([Validators.required])

    this.yCoordinate.setValue(axisPoint.yCoordinate)
    //this.interpolationType.setValidators([Validators.required])

    this.xValue.setValue(axisPoint.xValue)
    // //this.xAxisName.setValidators([Validators.required])

    this.yValue.setValue(axisPoint.yValue)
    // //this.yAxisName.setValidators([Validators.required])
  }
}