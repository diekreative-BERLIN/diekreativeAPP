import { Component } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-erlebt',
  templateUrl: './erlebt.page.html',
  styleUrls: ['./erlebt.page.scss'],
})
export class ErlebtPage {
  inputErlebt: string = "";
  useErlebt: string = "";
  isChecked;

  constructor(
    public emailComposer: EmailComposer
  ) { }


  sendTestimony() {

    
    //this.emailComposer.requestPermission().then(yesNo => {
      //console.log('requestPermission');
      //if (this.email != null && this.email.length > 0) 
        //this.emailComposer.isAvailable().then((available: boolean) => {
          //console.log('available='+available);
          //if (available) {
          if(this.inputErlebt && this.useErlebt && this.isChecked) {
            let email = {
              to: 'zeugnis@diekreative.org',
              subject: 'was ich mit Gott erlebt habe',
              body: 'Hallo, ich habe folgendes erlebt:\n\n'+this.inputErlebt+
                    '\n\nDas Zeugnis darf in anonymisierter Form verwendet werden? '+this.useErlebt+
                    '\n\nDie Datenschutzbestimmungen (https://diekreative.org/dataprivacy) wurden akzeptiert.'+
                    '\n\nversendet mit der Zeugnisfunktion aus der diekreative App',
              isHtml: false
            };

            // Send a text message using default options
            this.emailComposer.open(email);
          }
          //}
        //});
      //});

    }

}
