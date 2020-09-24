import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChurchapiService } from '../connectors/churchapi.service'
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  constructor(public modalController:ModalController, public churchapiService:ChurchapiService, private userService: UserstateService) { }
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
    console.log("login test");
    this.churchapiService.login(this.username,this.password).then((res)=>{
      console.log("LBUBB");
      console.log("login: "+JSON.stringify(JSON.parse(res.data)));

      this.userService.userLogginSuccessful(JSON.parse(res.data).data.personId);
      this.dismiss();
    }).catch((err)=>{
      console.log("error here: "+JSON.stringify(err))
    })
  }
}


