import { Component, OnInit } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';

@Component({
  selector: 'app-an-button',styles: [],
  template: `
    <button class="anButton" 
      [@buttonAnimated]="state" 
      (mouseover)="state='over'"
      (mouseout)="state='out'"
      >Label</button>
  `,
  animations:[
    trigger('buttonAnimated',[
      state('over',style({backgroundColor:'red'})),
      state('out',style({backgroundColor:'blue'})),
      state('selected',style({backgroundColor:'yellow'})),
      transition("out<=>over",[animate('2s')])
    ])
  ]
})
export class AnButtonComponent implements OnInit {
  state : string ="out";
  constructor() { }
  ngOnInit(): void {}
}
