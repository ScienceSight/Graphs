import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'

@Component({
  selector: 'x-axis-point',
  templateUrl: './x-axis-point.component.html',
  styleUrls: ['./x-axis-point.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisPointComponent implements OnInit {
  @Input() xAxisPointForm: UntypedFormGroup
  @Input() index: number
  @Output() deleteXAxisPoint: EventEmitter<number> = new EventEmitter()
  @Output() toggleXAxisPointButton: EventEmitter<MouseEvent> = new EventEmitter()

  constructor() { }

  ngOnInit() { 
  }
 
  delete() {
    this.deleteXAxisPoint.emit(this.index);
  }

  tryToggle(event: MouseEvent) {
    this.toggleXAxisPointButton.emit(event);
  }
}