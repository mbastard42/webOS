import { Component } from '@angular/core';
import { OsComponent } from '../features/os/os.component';
import { WindowComponent } from '../features/window/window.component';
import { IconComponent } from '../features/icon/icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    OsComponent,
    IconComponent,
    WindowComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

}
