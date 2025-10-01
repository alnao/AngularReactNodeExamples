import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm} from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { trigger,state,style,transition,animate } from '@angular/animations';


@Component({
  selector: 'app-book',
  template: `
    <div class="container my-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="input-group mb-4">
            <span class="input-group-text bg-primary text-white"><i class="fa fa-search"></i></span>
            <input type="text" [(ngModel)]="term" class="form-control" name="search" autocomplete="off" placeholder="Cerca libro..." >
          </div>
          <ul class="list-group shadow-sm" *ngIf="!error">
            <li *ngFor="let book of books | filter:term" 
                class="list-group-item d-flex justify-content-between align-items-center"
                [ngClass]="{'active': bookEdit?.id===book?.id }">
              <div (click)="setActive(book)" class="flex-grow-1 cursor-pointer">
                <strong>{{book.title}}</strong>
                <span class="text-muted d-block small">{{book.author}}</span>
              </div>
              <div class="d-flex align-items-center">
                <span class="badge bg-{{book.price > 15 ? 'info' : 'success'}} me-2">
                  € {{book.price | number:'1.2-2'}}
                </span>
                <button class="btn btn-outline-info btn-sm me-2" [routerLink]="['/book',book.id]" title="Dettagli">
                  <i class="fa fa-info-circle"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" (click)="cancella($event,book)" title="Elimina">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </li>
          </ul>
          <div *ngIf="error" class="alert alert-danger mt-3">{{error.message}}</div>
        </div>
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <app-form [bookEdit]="bookEdit" [books]="books"
                (resetClick)="reset()" *ngIf="mostraForm"></app-form>
              <button (click)="showNew()" class="btn btn-primary w-100" *ngIf="!mostraForm">
                <i class="fa fa-plus"></i> Inserisci nuovo libro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .list-group-item.active, .list-group-item.active:focus {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: #fff;
    }
    .list-group-item .badge {
      font-size: 1em;
    }
  `],
  animations:[
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