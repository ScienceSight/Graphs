import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'

@Component({
  selector: 'y-axis-point',
  templateUrl: './y-axis-point.component.html',
  styleUrls: ['./y-axis-point.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YAxisPointComponent implements OnInit {
  @Input() yAxisPointForm: UntypedFormGroup
  @Input() index: number
  @Output() deleteYAxisPoint: EventEmitter<number> = new EventEmitter()
  @Output() toggleYAxisPointButton: EventEmitter<MouseEvent> = new EventEmitter()

  constructor() { }

  ngOnInit() { 
  }
 
  delete() {
    this.deleteYAxisPoint.emit(this.index);
  }

  tryToggle(event: MouseEvent) {
    this.toggleYAxisPointButton.emit(event);
  }
}