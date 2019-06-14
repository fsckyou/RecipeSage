import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { RecipeService } from '@/services/recipe.service';
import { LoadingService } from '@/services/loading.service';
import { UtilService } from '@/services/util.service';

@Component({
  selector: 'page-import-pepperplate',
  templateUrl: 'import-pepperplate.page.html',
  styleUrls: ['import-pepperplate.page.scss'],
  providers: [ RecipeService ]
})
export class ImportPepperplatePage {

  username: string = '';
  password: string = '';

  errorMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public loadingService: LoadingService,
    public toastCtrl: ToastController,
    public utilService: UtilService,
    public recipeService: RecipeService) {
  }


  scrapePepperplate() {
    if (this.username.trim().length === 0) {
      this.errorMessage = 'Please enter your pepperplate email/username.';
      return;
    }

    if (this.password.trim().length === 0) {
      this.errorMessage = 'Please enter your pepperplate password.';
      return;
    }

    var loading = this.loadingService.start();

    this.recipeService.scrapePepperplate({
      username: this.username,
      password: this.password
    }).then(async response => {
      loading.dismiss();

      (await this.toastCtrl.create({
        message: 'We\'ll start importing your recipes shortly! We\'ll alert you when the process begins.',
        duration: 6000
      })).present();

      // this.navCtrl.setRoot('HomePage', { folder: 'main' }, {animate: true, direction: 'forward'});
    }).catch(async err => {
      loading.dismiss();
      switch(err.status) {
        case 0:
          (await this.toastCtrl.create({
            message: this.utilService.standardMessages.offlinePushMessage,
            duration: 5000
          })).present();
          break;
        case 401:
          (await this.toastCtrl.create({
            message: this.utilService.standardMessages.unauthorized,
            duration: 6000
          })).present();
          break;
        default:
          (await this.toastCtrl.create({
            message: this.utilService.standardMessages.unexpectedError,
            duration: 6000
          })).present();
          break;
      }
    });
  }

}