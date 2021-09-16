import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  fakeGrp: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  fakeSubmit() {

  }
}
