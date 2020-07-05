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

    if(subgraph.interpolationType)
    {
      this.interpolationType.setValue(subgraph.interpolationType)
    }
    else
    {
      this.interpolationType.setValue(InterpolationType.BSpline)
    }

    this.name.setValue(subgraph.name)
    this.knots.setValue(subgraph.knots)
    this.coordinates.setValue(subgraph.coordinates)
  }
}