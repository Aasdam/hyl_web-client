import { Component, OnInit } from '@angular/core';
import {FileReader} from './confs/file-reader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  ngOnInit() {
    FileReader.readCssFiles();
    FileReader.readJavascriptBaseFiles();
  }
}
