import { Component, OnInit, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { IonReorderGroup } from '@ionic/angular';
import { IonAccordionGroup } from '@ionic/angular';
import { PickerController } from '@ionic/angular';

import { File } from '@ionic-native/File/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  form:any = [];
  public isDisabled = true;
  cachefiles = [];
  cacheSize;
  cleanupDays=14;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;


  constructor(
    private userState:UserstateService,
    private file: File,
    private nativeStorage: NativeStorage,
    private pickerCtrl: PickerController
  ) {
    //this.form = this.form.concat(this.userState.AppHomescreen);
    console.log('in settings Constructor von settings.page');
    //this.form = this.userState.AppHomescreen;
    this.userState.homescreen.subscribe((form2)=>{
      //console.log(form2);
      this.form=form2;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.nativeStorage.getItem('settings_cache')
    .then(
      data => {
        //console.log('autocleanup aus setting:');
        //console.log(data);
        this.userState.cleanupDays = data.autocleanup;
        this.cleanupDays = data.autocleanup;
      },
      error => console.error(error)
    );
  }

  ionViewWillLeave() {
    this.accordionGroup.value = undefined;

    this.nativeStorage.setItem('settings_cache', {autocleanup: this.userState.cleanupDays} )
      .then(
        () => console.log('Stored item settings_cache!'),
        error => console.error('Error storing settings_cache', error)
    );
  }

  doReorder(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    //console.log('Before complete', this.form);
    //console.log('anzahl elemente='+this.form.length);

    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.form = ev.detail.complete(this.form);
  }

  modifyHomescreen() {
    this.isDisabled = false;
  }

  applyHomescreen() {
    this.isDisabled = true;
    //console.log('new layout', this.form);
    this.userState.saveHomeSettings(this.form);
  }
  resetHomescreen() {
    this.isDisabled = true;
    this.userState.resetHomeSettings();
    //console.log('resetted layout', this.form);
    //this.form = this.userState.h;
  }

  //local cache

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'days',
          options: [
            {
              text: 'löschen nach 2 Tagen',
              value: '2',
            },
            {
              text: 'löschen nach 7 Tagen',
              value: '7',
            },
            {
              text: 'löschen nach 14 Tagen',
              value: '14',
            },
            {
              text: 'löschen nach 30 Tagen',
              value: '30',
            },
          ],
        },
      ],
      buttons: [
        {
          text: 'Abbruch',
          role: 'abbruch',
        },
        {
          text: 'Ok',
          handler: (value) => {
            this.userState.cleanupDays = value.days.value;
            this.cleanupDays = value.days.value;
          },
        },
      ],
    });

    await picker.present();
  }

  private niceBytes(x){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }
  //read files that are on device storage
  async getFilesAndSize() {
    //console.log('=== get local files ===');

    this.cachefiles = [];
    let sizes = 0;

    await this.file.listDir(this.file.documentsDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        //console.log('local files in documentsDir=');
        //console.log(res);

        for(let file of res) {
          if(file.isFile == true) {
            file.getMetadata(function (metadata) {
              let name = file.name ;
              let size = metadata.size ;
              //console.log('Name: ' + name + ' / Size: ' + size) ;
              sizes += size ;
            });
            this.cachefiles.push(file);
          }
        }
        
      },
      err => console.log('error loading files in documentsDir: ', err)
    );

    await this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        //console.log('local files in dataDir=');
        //console.log(res);

        for(let file of res) {
          if(file.isFile == true) {
            file.getMetadata(function (metadata) {
              let name = file.name ;
              let size = metadata.size ;
              //console.log('Name: ' + name + ' / Size: ' + size) ;
              sizes += size ;
            });
            this.cachefiles.push(file);
          }
        }

      },
      err => console.log('error loading files in dataDir: ', err)
    );

    //console.log('total size: '+this.niceBytes(sizes));
    //console.log(sizes);
    this.cacheSize = this.niceBytes(sizes);
  }

  accordionGroupChange = (ev: any) => {
    if (ev.detail.value == "cache") {
      this.getFilesAndSize();
    }
  }

  async clearCache() {
    console.log('about to clear cachefiles');
    console.log(this.cachefiles);

    let success=false;
    for(let localfile of this.cachefiles) {
      console.log('datei');
      console.log(localfile.nativeURL);

      let pfad = localfile.nativeURL.substring(0,localfile.nativeURL.lastIndexOf('/')+1);
      let name = localfile.nativeURL.substring(localfile.nativeURL.lastIndexOf('/')+1);

      await this.file.removeFile( pfad, name ).then((ret) => {
        console.log('geachte Datei entfernt?');
        console.log(ret);
        success=true;
      }, (error) => {
        console.log('error deleting: '+error);
      });
    }

    //console.log('success ? '+success);
    if (success) {
      this.nativeStorage.remove('localSermons');
      this.userState.AppPageMedienInit = true;
      this.getFilesAndSize();
      this.cacheSize = "0 byte";
    }

  }


}
