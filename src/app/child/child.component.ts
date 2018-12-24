import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input()
  name: String;
  @Input()
  price: Number;

  constructor() {
    // setInterval(() => {
    //   this.name = 'Apple';
    // }, 3000);
  }

  ngOnInit() {
  }

}
