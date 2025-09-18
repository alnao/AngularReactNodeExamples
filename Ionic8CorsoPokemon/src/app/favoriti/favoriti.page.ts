import { Observable } from 'rxjs';
import { PokemonApiService, IPokemon } from './../services/pokemon-api.service';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarPage } from '../toolbar/toolbar.page';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx'; // Commentato per Ionic 8
@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.page.html',
  styleUrls: ['./favoriti.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ToolbarPage]
})
export class FavoritiPage implements OnInit {

  constructor(
    private service: PokemonApiService, 
    private toastController: ToastController,
    private alertController: AlertController
  ) { }
  elencoFavoriti$ : Promise<IPokemon[]>;
  
  ngOnInit() { }
  
  ionViewDidEnter() {//meglio usare ionViewDidEnter, perchè se già inizializzata non verrebbe aggiornata
    this.elencoFavoriti$=this.service.getFavoritesPokemon();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  async removeFavorites(pok: IPokemon){
    this.elencoFavoriti$=this.service.removePokemonFavorite(pok);
    this.presentToast(`${pok.name} rimosso dai preferiti! 🗑️`, 'warning');
  }

  async confirmRemoveFavorite(pok: IPokemon, slidingItem: any) {
    const alert = await this.alertController.create({
      header: 'Conferma rimozione',
      message: `Sei sicuro di voler rimuovere <strong>${pok.name}</strong> dai preferiti?`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Rimuovi',
          role: 'destructive',
          handler: () => {
            this.removeFavorites(pok);
            slidingItem.close();
          }
        }
      ]
    });

    await alert.present();
  }

  showPokemonDetails(pok: IPokemon) {
    // Naviga alla pagina dettagli del Pokemon
    this.presentToast(`Dettagli di ${pok.name} - Funzionalità in sviluppo`, 'primary');
  }

  getPokemonId(url: string): string {
    // Estrae l'ID dall'URL del Pokemon
    // URL format: https://pokeapi.co/api/v2/pokemon/1/
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  }

  async share(){
    const favorites = await this.service.getFavoritesPokemon();
    if (favorites.length === 0) {
      this.presentToast('Nessun Pokemon nei preferiti da condividere', 'warning');
      return;
    }
    
    const pokemonNames = favorites.map(p => p.name).join(', ');
    const shareText = `I miei Pokemon preferiti: ${pokemonNames}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I miei Pokemon preferiti',
          text: shareText,
          url: 'https://alnao.it'
        });
        this.presentToast('Condiviso con successo! 📤', 'success');
      } catch (error) {
        this.fallbackShare(shareText);
      }
    } else {
      this.fallbackShare(shareText);
    }
  }

  private fallbackShare(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.presentToast('Testo copiato negli appunti! 📋', 'secondary');
      });
    } else {
      this.presentToast('Condivisione non supportata su questo dispositivo', 'medium');
    }
  }

}
