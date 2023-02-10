import { UntypedFormControl, Validators } from '@angular/forms'
import { Subgraph } from '../../_models/_graph/subgraph'
import {InterpolationType} from "../../_models/_graph/interpolation-type"

export class SubgraphForm {
  id = new UntypedFormControl()
  interpolationType = new UntypedFormControl()
  name = new UntypedFormControl()
  knots = new UntypedFormControl()
  coordinates = new UntypedFormControl()

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