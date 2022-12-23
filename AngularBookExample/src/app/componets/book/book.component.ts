import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm} from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { trigger,state,style,transition,animate } from '@angular/animations';





@Component({
  selector: 'app-book',
  template: `
    <div class="conteiner m-2"><div class="row"><div class="col-lg-8 ">
      <div class="search-book m-4">
        <input type="text" [(ngModel)]="term" class="form-control" name="search" autocomplete="off" placeholder="&#1442; Filtro ricerca" >
      </div>
      <ul class="list-group ml-2 m-4" *ngIf="! this.error" >
        <li *ngFor="let book of books | filter:term" class="list-group-item" 
        [ngClass]="{'active' : bookEdit?.id===book?.id }" >
          <span (click)="setActive(book)">{{book.title}}</span>
          <div class="pull-right" >
            <span [style.color]="book.price > 15 ? 'red' : null">€ {{book.price | number:'1.2-2'}}</span>
            <i class="fa fa-info-circle ml-2" aria-hidden="true" [routerLink]="['/book',book.id]" ></i> 
            <i class="fa fa-trash ml-2" (click)="cancella($event,book)"></i>
          </div>
        </li>
      </ul>
      <div *ngIf="this.error" class="alert alert-danger">{{error.message}}</div>
    </div>
      <div class="col-lg-4" >
        <app-form [bookEdit]="bookEdit" [books]="books"
          (resetClick)="reset()"  *ngIf="mostraForm"
        ></app-form>
        <button (click)="showNew()" class="btn btn-info"  *ngIf="!mostraForm">
          Insert new</button>  
      </div>
      
    </div></div>


  `,styles: []
  ,animations:[
    trigger('collapsable',[
      state('opened',style({height:'*'})),
      state('closed',style({height:0,padding:0})),
      transition('opened <=> closed', [animate('2s')]),
    ])
  ]
})
export class BookComponent implements OnInit {
  state= 'opened';//del CardComponent
  toogle(){this.state= this.state==='opened' ? 'closed' : 'opened';}//del CardComponent

  books : Book[];
  error : any;
  term : string;
  bookEdit : Book;
  mostraForm : boolean;

  constructor(private bookService : BookService) {}
  ngOnInit(): void {
    this.mostraForm=false;
    this.bookService.getAll().subscribe ( (res : Book[]) =>{
        this.books = res;
      },(error) => { console.log(error); this.error=error;});
  }
  cancella(event ,book : Book){console.log(book)
    event.stopPropagation();
    this.bookService.delete(book.id).subscribe(()=>{
        //const index = this.books.indexOf(book);
        const index = this.books.findIndex( (element ) => element.id===book.id ) ;
        this.books.splice(index,1);//indiceDa e quanti da rimuovere
      },(error) => { console.log(error);this.error=error;});
  }
  setActive(book : Book){
    this.bookEdit = book;
    this.mostraForm=true;
  }
  reset(){
    this.bookEdit = null;
    this.mostraForm=false;
  }
  showNew(){
    this.bookEdit = null;
    this.mostraForm=true;
  }
  
}
export interface Book{
    id :number;
    title:string;
    author : string;
    price : number;
    isbn : string;
    description : string;
    type: string;
}