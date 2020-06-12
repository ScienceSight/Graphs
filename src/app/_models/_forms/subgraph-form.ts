import { FormControl, Validators } from '@angular/forms'
import { Subgraph } from '../../_models/_graph/subgraph'
import {InterpolationType} from "../../_models/_graph/interpolation-type"

export class SubgraphForm {
  id = new FormControl()
  interpolationType = new FormControl()
  name = new FormControl()
  knots = new FormControl()
  coordinates = new FormControl()

  isOpened: boolean;

  constructor(
    subgraph: Subgraph
  ) {
    this.id.setValue(subgraph.id)
    //this.id.setValidators([Validators.required])

    if(subgraph.interpolationType)
    {
      this.interpolationType.setValue(subgraph.interpolationType)
    }
    else
    {
      this.interpolationType.setValue(InterpolationType.BSpline)
    }
    //this.interpolationType.setValidators([Validators.required])

    this.name.setValue(subgraph.name)
    //this.xAxisName.setValidators([Validators.required])

    this.knots.setValue(subgraph.knots)
    //this.knots.setValidators([Validators.required])

    this.coordinates.setValue(subgraph.coordinates)
    //this.coordinates.setValidators([Validators.required])
  }
}