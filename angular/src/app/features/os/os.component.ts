import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskManagerService } from '../../core/services/task-manager.service';

@Component({
  selector: 'app-os',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './os.component.html',
  styleUrl: './os.component.scss'
})
export class OsComponent {

  constructor(private _taskManager:TaskManagerService) {}

  public taskbarWidth():number {
    return 0;
  }
}
