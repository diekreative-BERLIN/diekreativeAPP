import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { IonReorderGroup } from '@ionic/angular';
import { IonAccordionGroup } from '@ionic/angular';
import { PickerController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Subscription } from 'rxjs';
import { Campus, CampusService } from '../campus.service';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsPage implements OnInit, OnDestroy {
  form:any = [];
  /** Wert der Option "Alle Standorte" in der Radio-Gruppe (null lässt sich dort nicht auswählen). */
  readonly alleStandorte = 'alle';
  campusse: Campus[] = [];
  aktiverCampusId: number | null = null;
  campusLaedt = false;
  private campusAbos: Subscription[] = [];
  public isDisabled = true;
  cachefiles = [];
  cacheSize;
  cleanupDays=14;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;


  constructor(
    private userState:UserstateService,
    private pickerCtrl: PickerController,
    private campusService: CampusService
  ) {
    //this.form = this.form.concat(this.userState.AppHomescreen);
    console.log('in settings Constructor von settings.page');
    //this.form = this.userState.AppHomescreen;
    this.userState.homescreen.subscribe((form2)=>{
      //console.log(form2);
      this.form=form2;
    });
    this.campusAbos.push(
      this.campusService.campusse.subscribe((liste) => this.campusse = liste),
      this.campusService.aktiverCampusId.subscribe((id) => this.aktiverCampusId = id)
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.campusAbos.forEach((abo) => abo.unsubscribe());
  }

  // Standort

  get aktiverCampusName(): string {
    return this.campusService.campusName(this.aktiverCampusId);
  }

  istInListe(id: number): boolean {
    return this.campusse.some((c) => c.id === id);
  }

  campusGewaehlt(ev: any) {
    const wert = ev.detail.value;
    const id = (wert === this.alleStandorte || wert == null) ? null : Number(wert);
    if (id !== this.aktiverCampusId) {
      this.campusService.setzeCampus(id);
    }
  }

  /** Beim Öffnen des Standort-Bereichs die Liste auffrischen (klappt nur angemeldet). */
  private async aktualisiereCampusse() {
    if (!this.userState.loggedin) {
      return;
    }
    this.campusLaedt = this.campusse.length === 0;
    await this.campusService.ladeCampusse(this.userState.logintoken);
    this.campusLaedt = false;
  }

  ionViewWillEnter() {
    Preferences.get({ key: 'settings_cache' }).then((value) => {
        //console.log('autocleanup aus setting:');
        //console.log(value);
        const data = JSON.parse(value.value);
        if (value.value != null) {
          this.userState.cleanupDays = data.autocleanup;
          this.cleanupDays = data.autocleanup;
        }
      },
      error => console.error(error)
    );
  }

  ionViewWillLeave() {
    this.accordionGroup.value = undefined;

    Preferences.set({ key: 'settings_cache', value: JSON.stringify({autocleanup: this.userState.cleanupDays}) }).then(
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
  //checks if user has permissionID to display Element X on homescreen
  hasPermission(permissionID) {
    return this.userState.hasPermission(permissionID);
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
    
      await Filesystem.readdir({
        directory: Directory.Data,
        //directory: Directory.Documents,
        path: MEDIA_FOLDER_NAME
      }).then( res => {
        console.log('local files in documentsDir=');
        console.log(res);

        for(let file of res.files) {
          if(file.type == 'file') {
              let name = file.name ;
              let size = file.size ;
              console.log('Name: ' + name + ' / Size: ' + size) ;
              sizes += size ;
              this.cachefiles.push(file);
          }
          }
      },
      err => console.log('error loading files in documentsDir: ', err)
    );

    //console.log('total size: '+this.niceBytes(sizes));
    //console.log(sizes);
    this.cacheSize = this.niceBytes(sizes);
  }

  accordionGroupChange = (ev: any) => {
    if (ev.detail.value == "cache") {
      this.getFilesAndSize();
    }
    if (ev.detail.value == "standort") {
      this.aktualisiereCampusse();
    }
  }

  async clearCache() {
    //console.log('about to clear cachefiles');
    //console.log(this.cachefiles);

    let success=false;
    for(let localfile of this.cachefiles) {
      //console.log('datei');
      //console.log(localfile);

      let name = localfile.name;

      await Filesystem.deleteFile({
          //directory: Directory.Documents,
          directory: Directory.Data,
          path: MEDIA_FOLDER_NAME + '/' + name,
        }).then(() => {
        console.log('gecachte Datei entfernt!');
        success=true;
      }, (error) => {
        console.log('error deleting: '+error);
      });
    }

    //console.log('success ? '+success);
    if (success) {
      await Preferences.remove({ key: 'localSermons'});
      this.userState.AppPageMedienInit = true;
      this.getFilesAndSize();
      this.cacheSize = "0 byte";
    }

  }


}
