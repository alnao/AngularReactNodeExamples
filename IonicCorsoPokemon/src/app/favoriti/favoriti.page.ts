import { Observable } from 'rxjs';
import { PokemonApiService, IPokemon } from './../services/pokemon-api.service';
import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.page.html',
  styleUrls: ['./favoriti.page.scss'],
})
export class FavoritiPage implements OnInit {

  constructor(private service: PokemonApiService,
      private socialSharing: SocialSharing) { }
  elencoFavoriti$ : Promise<IPokemon[]>;
  ngOnInit() { }
  ionViewDidEnter() {//meglio usare ionViewDidEnter, perchè se già inizializzata non verrebbe aggiornata
    this.elencoFavoriti$=this.service.getFavoritesPokemon();
  }

  removeFavorites(pok: IPokemon){
    this.elencoFavoriti$=this.service.removePokemonFavorite(pok);
  }

  share(){console.log("share");
    this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
      console.log("share success");
    }).catch((e) => {
      console.log("share success error " + e);
    });
    /*
    this.socialSharing.shareWithOptions(
      {message:'Body', subject:'Subject'}
    ).then((result) => {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    }).catch((msg) => {
      console.log("Sharing failed with message: " + msg);
    });*/

  }

}
