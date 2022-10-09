import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm} from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { trigger,state,style,transition,animate } from '@angular/animations';





@Component({
  selector: 'app-book',
  template: `<h1>Books</h1>
    <div class="conteiner"><div class="row"><div class="col-lg-6">
      <div class="search-book">
        <input type="text" [(ngModel)]="term" class="form-control" name="search" autocomplete="off" placeholder="&#1442; Cerca" >
      </div>
      <ul class="list-group ml-2" *ngIf="! this.error" >
        <li *ngFor="let book of books | filter:term" class="list-group-item" 
        [ngClass]="{'active' : bookEdit?.id===book?.id }">
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
      <div class="col-lg-6 " >
        <app-form [bookEdit]="bookEdit" [books]="books"
          (resetClick)="reset()"
        ></app-form>
      </div>
    </div></div>
    <hr />
    <app-an-button></app-an-button>
    <hr />
    <div class="card bg-dark text-white mb-1 mr-1">
      <div class="card-headers" (click)="toogle()">
        Titolo
      </div>
      <div class="card-body overflow-hidden" [@collapsable]='state'>
        qui un bel testo<br />anche lungo<p>lungo</p>ma forse non troppo
      </div>
    </div>  
    <hr />

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

  constructor(private bookService : BookService) {}
  ngOnInit(): void {
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
  }
  reset(){
    this.bookEdit = null;
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