import { UserService, User } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(private userService:UserService) { }
  public users$ : Promise<User[]>;
  ngOnInit() {
    this.users$=this.userService.getUsers();

    //OLD MOD, NO USED
    //this.userService.getUsers().subscribe(
    //  res=>this.users= res['results']
    //);
  }
}
