import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { InterpolationType } from "../../_models/_graph/interpolation-type"
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap'
import { SubgraphForm } from 'src/app/_models/_forms/subgraph-form'
import { ButtonsState } from 'src/app/_models/_graph/buttons-state'

@Component({
  selector: 'subgraph',
  templateUrl: './subgraph.component.html',
  styleUrls: ['./subgraph.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubgraphComponent implements OnInit {
  @Input() subgraphForm: FormGroup
  @Input() index: number
  @Output() deleteSubgraph: EventEmitter<number> = new EventEmitter()
  @Output() toggleAccordian: EventEmitter<string> = new EventEmitter()
  @Output() interpolationTypeChanged: EventEmitter<string> = new EventEmitter()
  @Output() togglePointButton: EventEmitter<ButtonsState> = new EventEmitter()

  interpolationType = InterpolationType;

  isOpened = false;

  constructor() { }

  ngOnInit() { 
    this.subgraphForm.controls['id'].setValue(this.index);
  }
 
  delete() {
    this.deleteSubgraph.emit(this.index);
  }

  onChange(newValue: string) {
    console.log(newValue);
    this.interpolationTypeChanged.emit(newValue);
  }
}