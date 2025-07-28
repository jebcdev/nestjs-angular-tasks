import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontTasksLayoutHeader } from './components/';

@Component({
  selector: 'front-tasks-layout',
  imports: [RouterOutlet, FrontTasksLayoutHeader],
  templateUrl: './front-tasks-layout.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontTasksLayout {}

export default FrontTasksLayout;
