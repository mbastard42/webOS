import { Component } from '@angular/core';
import { WindowComponent } from '../window/window.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    WindowComponent,
    IconComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  constructor() {}
}
