import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChurchapiService } from '../connectors/churchapi.service'
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginModalPage implements OnInit {

  constructor(
    public modalController:ModalController,
    public churchapiService:ChurchapiService,
    private userService: UserstateService
  ) { }
  username;
  password;

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  login(){
    console.log('  in login-modal.page > login()')
    this.churchapiService.login(this.username,this.password).then((res)=>{
      console.log("Ergebnis: "+JSON.stringify(res));
      console.log("login status: "+  JSON.stringify(res.status)) ;
      if (JSON.stringify(res.status) == "200") {
        //console.log("person ID: "+  JSON.stringify(res.data.data.personId)) ;
        this.userService.userLoginSuccessful(JSON.stringify(res.data.data.personId),this.username,this.password);
        this.dismiss();
      } else {
        alert('Logindaten sind ungültig. Benutzername oder Passwort stimmen nicht oder Zugang gesperrt.\n\nBitte prüfe auch ob Wlan oder mobile Daten aktiviert sind, da ein Login bei fehlender Verbindung nicht möglich ist.')
      }
    }).catch((err)=>{
      console.log("error here: "+JSON.stringify(err));
      alert('Logindaten sind ungültig. Benutzername oder Passwort stimmen nicht oder Zugang gesperrt.\n\nBitte prüfe auch ob Wlan oder mobile Daten aktiviert sind, da ein Login bei fehlender Verbindung nicht möglich ist.')
    })
  }
}


