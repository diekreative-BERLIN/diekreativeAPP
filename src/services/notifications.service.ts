import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
//import {Firebase} from '@ionic-native/firebase';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Injectable()
export class NotificationsService {

  constructor(private firebase: FirebaseX,
              private platform: Platform) {
  }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }
    //this.saveToken(token);
    console.log('firebase token could be saved e.g. in firebase.. token is:');
    console.log(token);
  }

  /*
  private saveToken(token) {
    if (!token) return;
    const devicesDatabaseReference = this.angularFirestore.collection('device-tokens');
    const data = {
      token,
      userId: 'user-' + new Date().toISOString(),
    };
    return devicesDatabaseReference.doc(token).set(data);
  }
  */

  topicSubscription(topic) {
    this.firebase.subscribe(topic).then((res: any) => {
      console.log('Subscribed to topic: ' + topic, res);
    });
  }

  topicUnsubscription(topic) {
    this.firebase.unsubscribe(topic).then((res: any) => {
      console.log('Unsubscribed from topic: ' + topic, res)
    });
  }

  onNotifications() {
    this.firebase.onMessageReceived().subscribe(data => console.log(`FCM message: ${data}`));
    //return this.firebase.onNotificationOpen();
  }

}
