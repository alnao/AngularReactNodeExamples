import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/componets/book/book.component';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';


@Component({
  selector: 'app-form',
  template: `
<form class="ml-2 mr-2" #formBook="ngForm" (submit)="salva(formBook)">
  <div class="form-group">
    <label for="title">Titolo</label>
    <input [ngModel]="bookEdit?.title" type="text" class="form-control" id="title" name="title" placeholder="Titolo" required>
  </div>
  <div class="form-group">
    <label for="author">Autore</label>
    <input [ngModel]="bookEdit?.author" type="text" class="form-control" id="author" name="author" placeholder="Autore">
  </div>
  <div class="form-group">
    <label for="price">Prezzo</label>
    <input [ngModel]="bookEdit?.price" type="text" class="form-control" id="price" name="price" placeholder="Prezzo" required>
  </div>
  <div class="form-group">
    <label for="isbn">Isbn</label>
    <input [ngModel]="bookEdit?.isbn" type="text" class="form-control" id="isbn" name="isbn" placeholder="Isbn" required>
  </div>
  <div class="form-group">
    <label for="description">Description</label>
    <textarea [ngModel]="bookEdit?.description" class="form-control" id="description" name="description" placeholder="Descrizione"></textarea>
  </div>
  <button type="submit" class="btn btn-primary" [disabled]="formBook.invalid" >{{bookEdit ? 'Update' : 'Add'}}</button>
  <button type="reset"  class="btn btn-info ml-2" (click)="reset(formBook)">Reset</button>
</form>
  `,styles: []
})
export class FormComponent implements OnInit {
  @Input() bookEdit : Book;
  @Input() books : Book[];
  @Output() resetClick : EventEmitter<Book> = new EventEmitter<Book>();
  error : any;

  constructor(private bookService : BookService) {}

  ngOnInit(): void {}

  salva (form : NgForm){
    if (this.bookEdit ){//vecchio quindi uso il put
      this.bookService.update(form,this.bookEdit.id) //EX this.http.put<Book>(`${this.urlApi}/${this.bookEdit.id}`,form.value)//con post si fa così
        .subscribe( (response : Book) => {
        const index = this.books.findIndex( (element ) => element.id===this.bookEdit.id ) ;
        this.books[index] = response;
      });
    }else{ //nuovo quindi uso il post
      this.bookService.insert(form)//EX this.http.post<Book>(this.urlApi,form.value)//con post si fa così
        .subscribe( (response : Book) => {
        this.books.push(response);
      });
    }
    this.reset(form);
  }
  reset(form : NgForm){
    form.reset();
    this.bookEdit = null;
    this.resetClick.emit();
  }
}
