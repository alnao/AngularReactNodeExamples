import { User, UserService } from './../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {

  constructor(private route:ActivatedRoute, private userService:UserService) { }
  public user$: User;
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.user$= await this.userService.getUserById(id);
  }

}
