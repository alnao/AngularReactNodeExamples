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
      <div *ngIf="book" class="row m-5" >
        <div class="col-12 _NO_mx-auto" [formGroup]="bookForm">

        <p>
          <label for="id">ID</label>
          <input type="text" id="id" name="id" formControlName="id">
        </p>
        <p>
          <label for="title">title</label>
          <input type="text" id="title" name="title" formControlName="title" >
        </p>
          <div [hidden]="!bookForm.get('title').errors?.minlength">
            Min length allowed is {{bookForm.get('title').errors?.minlength.requiredLength}}
              , actual {{bookForm.get('title').errors?.minlength.actualLength}}
          </div>
          <div [hidden]="!bookForm.get('title').errors?.required">
            title is required
          </div>
        <p>
          <label for="author">author</label>
          <input type="text" id="author" name="author" formControlName="author">
        </p>
        <p>
          <label for="price">price</label>
          <input type="text" id="price" name="price" formControlName="price">
        </p>
        <p>
          <label for="isbn">isbn</label>
          <input type="text" id="isbn" name="isbn" formControlName="isbn">
        </p>
        <p>
          <label for="description">description</label>
          <input type="text" id="description" name="description" formControlName="description">
        </p>
        <p>
          <label for="type">type</label>
          <select id="type" name="type" formControlName="type">
            <option [ngValue]="book.type" *ngFor="let el of typeList" [selected]="el===book.type">
              {{el}}
            </option>
          </select>

        </p>
        <p>
          <button type="submit" class="btn btn-primary" [disabled]="!bookForm.valid" (click)="onSubmit()">Submit</button>
        </p>

      </div>
      <button class="btn btn-info" (click)="goBack()">Indietro</button>
      </div>


    <div style=" m-5">
      <h3>Form Status</h3>
      <b>valid : </b>{{bookForm.valid}}
      <b>invalid : </b>{{bookForm.invalid}}
      <b>touched : </b>{{bookForm.touched}}
      <b>untouched : </b>{{bookForm.untouched}}
      <b>pristine : </b>{{bookForm.pristine}}
      <b>dirty : </b>{{bookForm.dirty}}
      <b>disabled : </b>{{bookForm.disabled}}
      <b>enabled : </b>{{bookForm.enabled}}
      <h3>Form Value</h3>
      {{bookForm.value |json}}
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
      let books : Book[] = res;
      this.book = books.filter (el => el.id===id)[0];
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
