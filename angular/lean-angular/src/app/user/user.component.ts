import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  name = "";

  constructor() { }

  ngOnInit() {
  }

  showEvent(event) {
    this.name = event.target.value;
  }

  color() {
    return this.name.length % 2 == 0 ? 'red' : 'blue';
  }

  type() {
    return this.name.length % 2 ? 'circle' : 'square';
  }

}
