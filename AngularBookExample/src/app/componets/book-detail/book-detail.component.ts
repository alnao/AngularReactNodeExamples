import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { Location } from '@angular/common';
import { Book } from '../book/book.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'


@Component({
    selector: 'app-book-detail',
    template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white text-center fs-5">
              Modifica / Inserimento libro
            </div>
            <div class="card-body">
              <form [formGroup]="bookForm" *ngIf="book" autocomplete="off">
                <div class="row g-3">
                  <div class="col-md-2">
                    <label for="id" class="form-label">ID</label>
                    <input type="text" id="id" name="id" formControlName="id" class="form-control" readonly>
                  </div>
                  <div class="col-md-6">
                    <label for="title" class="form-label">Titolo <span class="text-danger">*</span></label>
                    <input type="text" id="title" name="title" formControlName="title" class="form-control" [ngClass]="{'is-invalid': bookForm.get('title').invalid && bookForm.get('title').touched}">
                    <div class="invalid-feedback" *ngIf="bookForm.get('title').errors?.minlength">
                      Minimo {{bookForm.get('title').errors?.minlength.requiredLength}} caratteri, attuale {{bookForm.get('title').errors?.minlength.actualLength}}
                    </div>
                    <div class="invalid-feedback" *ngIf="bookForm.get('title').errors?.required">
                      Il titolo è obbligatorio
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label for="author" class="form-label">Autore</label>
                    <input type="text" id="author" name="author" formControlName="author" class="form-control">
                  </div>
                  <div class="col-md-3">
                    <label for="price" class="form-label">Prezzo</label>
                    <input type="number" id="price" name="price" formControlName="price" class="form-control">
                  </div>
                  <div class="col-md-3">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input type="text" id="isbn" name="isbn" formControlName="isbn" class="form-control">
                  </div>
                  <div class="col-md-6">
                    <label for="description" class="form-label">Descrizione</label>
                    <input type="text" id="description" name="description" formControlName="description" class="form-control">
                  </div>
                  <div class="col-md-4">
                    <label for="type" class="form-label">Genere <span class="text-danger">*</span></label>
                    <select id="type" name="type" formControlName="type" class="form-select">
                      <option [ngValue]="book.type" *ngFor="let el of typeList" [selected]="el===book.type">{{el}}</option>
                    </select>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-4">
                  <button type="button" class="btn btn-secondary" (click)="goBack()"><i class="fa fa-arrow-left me-2"></i>Indietro</button>
                  <button type="submit" class="btn btn-primary px-4" [disabled]="!bookForm.valid" (click)="onSubmit()">
                    <i class="fa fa-save me-2"></i>Salva
                  </button>
                </div>
              </form>
              <div *ngIf="error" class="alert alert-danger mt-3">{{error}}</div>
            </div>
            <div class="card-footer bg-light">
              <div class="row">
                <div class="col-md-6">
                  <h6 class="mb-1">Stato Form</h6>
                  <ul class="list-group list-group-flush small">
                    <li class="list-group-item">valid: <b>{{bookForm.valid}}</b></li>
                    <li class="list-group-item">invalid: <b>{{bookForm.invalid}}</b></li>
                    <li class="list-group-item">touched: <b>{{bookForm.touched}}</b></li>
                    <li class="list-group-item">untouched: <b>{{bookForm.untouched}}</b></li>
                    <li class="list-group-item">pristine: <b>{{bookForm.pristine}}</b></li>
                    <li class="list-group-item">dirty: <b>{{bookForm.dirty}}</b></li>
                    <li class="list-group-item">disabled: <b>{{bookForm.disabled}}</b></li>
                    <li class="list-group-item">enabled: <b>{{bookForm.enabled}}</b></li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6 class="mb-1">Valore Form</h6>
                  <pre class="bg-light border rounded p-2 small">{{bookForm.value | json}}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    `,
    styles: [``]
})
export class BookDetailComponent implements OnInit {
  book : Book;
  error : string;
  bookForm = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    firstName: new FormControl(),
    author: new FormControl(),
    price: new FormControl(),
    isbn: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
 });
  custumValidatorsMin10 = Validators.minLength(10);

  typeList: string[] = [    'romantic','yellow','storic'  ];
  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private location : Location
  ) { 
    this.bookForm = this.formBuilder.group({
      id :['',  [Validators.required]],
      title :['', [Validators.required, this.custumValidatorsMin10]],
      author :[''],
      price :[''],
      isbn :[''],
      description :[''],
      type :['',  [Validators.required]]
    })
   }
  
  
  goBack():void{
    this.location.back();
  }
  onSubmit() {
    console.log(this.bookForm.value);
    this.bookService.update(this.bookForm,this.book.id)//
      .subscribe ( (res : Book) =>{
        console.log("done" +  res)
        this.goBack();
      },(error) => { console.log(error); this.error=error;});
  }
  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params.id);
    let id=this.activatedRoute.snapshot.params.id;
    console.log(id);
    this.bookService.getAll()//getId(id)
    .subscribe ( (res : Book[]) =>{
      console.log(res);
      let books : Book[] = res;
      this.book = books.filter (el => ''+el.id===''+id)[0];
      //load data into form
      this.bookForm.controls['id'].setValue(this.book.id);
      this.bookForm.controls['title'].setValue(this.book.title);
      this.bookForm.controls['author'].setValue(this.book.author);
      this.bookForm.controls['price'].setValue(this.book.price);
      this.bookForm.controls['isbn'].setValue(this.book.isbn);
      this.bookForm.controls['description'].setValue(this.book.description);
      this.bookForm.controls['type'].setValue(this.book.type);
    },(error) => { console.log(error); this.error=error;});

  }

}
