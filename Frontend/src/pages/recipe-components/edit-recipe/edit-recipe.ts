import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { RecipeServiceProvider, Recipe } from '../../../providers/recipe-service/recipe-service';
import { LoadingServiceProvider } from '../../../providers/loading-service/loading-service';

import loadImage from 'blueimp-load-image';
import { UtilServiceProvider } from '../../../providers/util-service/util-service';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage({
  priority: 'low'
})
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
  providers: [ RecipeServiceProvider ]
})
export class EditRecipePage {

  recipe: Recipe;

  imageBlobURL: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public utilService: UtilServiceProvider,
    public loadingService: LoadingServiceProvider,
    public recipeService: RecipeServiceProvider,
    public domSanitizationService: DomSanitizer) {
    // this.recipe = <Recipe>{};
    this.recipe = navParams.get('recipe') || <Recipe>{};
  }

  ionViewDidLoad() {}

  ionViewWillEnter() {
    var textAreas = document.getElementsByTagName('textarea');
    for (var i = 0; i < textAreas.length; i++) {
      textAreas[i].style.height = textAreas[i].scrollHeight + 'px';
    }
  }

  updateTextAreaSize(event) {
    var el = event._elementRef.nativeElement.children[0];
    el.style.height = el.scrollHeight + 'px';
  }

  setFile(event) {
    let files = event.srcElement.files
    if (!files || !files[0]) {
      return
    }

    let MAX_FILE_SIZE_MB = 8;
    let ENABLE_LOCAL_CONVERSIONS = true;
    let isOverMaxSize = files[0].size / 1024 / 1024 > MAX_FILE_SIZE_MB; // Image is larger than MAX_FILE_SIZE_MB

    if (!isOverMaxSize) {
      // Image size is OK, upload the image directly for high quality server conversion
      console.log(`Image is under ${MAX_FILE_SIZE_MB}MB`);
      this.recipe.imageFile = files[0];
      this.imageBlobURL = this.domSanitizationService.bypassSecurityTrustUrl(
        (window.URL || (<any>window).webkitURL).createObjectURL(this.recipe.imageFile)
      );
    } else if (isOverMaxSize && ENABLE_LOCAL_CONVERSIONS) {
      // Image is too large, do some resizing before high quality server conversion
      console.log(`Image is over ${MAX_FILE_SIZE_MB}MB. Converting locally`);
      var loadingImage = loadImage(
        files[0],
        (renderedCanvas, exif) => {
          renderedCanvas.toBlob(myBlob => {
            myBlob.name = this.recipe.imageFile.name;
            this.recipe.imageFile = myBlob;
            this.imageBlobURL = this.domSanitizationService.bypassSecurityTrustUrl(
              (window.URL || (<any>window).webkitURL).createObjectURL(this.recipe.imageFile)
            );

            console.log('Local conversion complete');
          }, 'image/jpeg', 1);
        },
        {
          maxWidth: 800,
          maxHeight: 800,
          crop: true,
          canvas: true,
          orientation: true
        }
      );

      loadingImage.onerror = err => {
        // Image is too large and local conversion failed
        console.log(`Image is over ${MAX_FILE_SIZE_MB}MB. Local conversion failed`);
        this.toastCtrl.create({
          message: `The max image file size is ${MAX_FILE_SIZE_MB}MB. Please select a smaller image.`,
          duration: 6000
        }).present();
      };
    } else {
      // Image is too large and local conversions are not enabled
      console.log(`Image is over ${MAX_FILE_SIZE_MB}MB. Local conversion not enabled`);
      this.toastCtrl.create({
        message: `The max image file size is ${MAX_FILE_SIZE_MB}MB. Please select a smaller image.`,
        duration: 6000
      }).present();
    }
  }

  save() {
    if (!this.recipe.title || this.recipe.title.length === 0) {
      this.toastCtrl.create({
        message: 'Please provide a recipe title (the only required field).',
        duration: 6000
      }).present();
      return;
    }

    var loading = this.loadingService.start();

    if (this.recipe.id) {
      this.recipeService.update(this.recipe).subscribe(response => {
        this.navCtrl.setRoot('HomePage', { folder: 'main' }, { animate: false });
        this.navCtrl.push('RecipePage', {
          recipe: response,
          recipeId: response.id
        });

        loading.dismiss();
      }, err => {
        loading.dismiss();
        switch(err.status) {
          case 0:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.offlinePushMessage,
              duration: 5000
            }).present();
            break;
          case 401:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.unauthorized,
              duration: 6000
            }).present();
            break;
          default:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.unexpectedError,
              duration: 6000
            }).present();
            break;
        }
      });
    } else {
      this.recipeService.create(this.recipe).subscribe(response => {
        this.navCtrl.setRoot('HomePage', { folder: 'main' }, { animate: false });
        this.navCtrl.push('RecipePage', {
          recipe: response,
          recipeId: response.id
        });

        loading.dismiss();
      }, err => {
        loading.dismiss();
        switch(err.status) {
          case 0:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.offlinePushMessage,
              duration: 5000
            }).present();
            break;
          case 401:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.unauthorized,
              duration: 6000
            }).present();
            break;
          case 412:
            this.toastCtrl.create({
              message: 'Please provide a recipe title (the only required field).',
              duration: 6000
            }).present();
            break;
          default:
            this.toastCtrl.create({
              message: this.utilService.standardMessages.unexpectedError,
              duration: 6000
            }).present();
            break;
        }
      });
    }
  }

  filePicker() {
    document.getElementById('filePicker').click();
  }

  filePickerText() {
    if (this.recipe.imageFile) {
      return this.recipe.imageFile.name + ' Selected';
    } else if (this.recipe.image) {
      return 'Choose new image';
    } else {
      return 'Choose image';
    }
  }

}