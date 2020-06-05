import { FormControl, Validators } from '@angular/forms'
import { Subgraph } from '../../_models/_graph/subgraph'
import {InterpolationType} from "../../_models/_graph/interpolation-type"

export class SubgraphForm {
  id = new FormControl()
  interpolationType = new FormControl()
  name = new FormControl()
  // xAxisName = new FormControl()
  // yAxisName = new FormControl()
  // originPoint = new FormControl()
  // xAxisPoint = new FormControl()
  // yAxisPoint = new FormControl()
  knots = new FormControl()
  coordinates = new FormControl()

  isOpened: boolean;


  constructor(
    subgraph: Subgraph
  ) {
    this.id.setValue(subgraph.id)
    //this.id.setValidators([Validators.required])

    this.interpolationType.setValue(InterpolationType.BSpline)
    //this.interpolationType.setValidators([Validators.required])

    this.name.setValue(subgraph.name)
    //this.xAxisName.setValidators([Validators.required])

    // this.xAxisName.setValue(subgraph.xAxisName)
    // //this.xAxisName.setValidators([Validators.required])

    // this.yAxisName.setValue(subgraph.yAxisName)
    // //this.yAxisName.setValidators([Validators.required])

    // this.originPoint.setValue(subgraph.originPoint)
    // //this.originPoint.setValidators([Validators.required])

    // this.xAxisPoint.setValue(subgraph.xAxisPoint)
    // //this.xAxisPoint.setValidators([Validators.required])

    // this.yAxisPoint.setValue(subgraph.yAxisPoint)
    // //this.yAxisPoint.setValidators([Validators.required])

    this.knots.setValue(subgraph.knots)
    //this.knots.setValidators([Validators.required])

    this.coordinates.setValue(subgraph.coordinates)
    //this.coordinates.setValidators([Validators.required])
  }

  public setValue()
  {

  }
}