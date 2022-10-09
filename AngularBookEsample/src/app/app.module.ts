import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookComponent } from './componets/book/book.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import {HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './shared/form/form.component';
import { BookDetailComponent } from './componets/book-detail/book-detail.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnButtonComponent } from './shared/an-button/an-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    BookDetailComponent,
    AnButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    ,NgbModule,HttpClientModule,
    FormsModule,BrowserAnimationsModule, ReactiveFormsModule
,Ng2SearchPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
