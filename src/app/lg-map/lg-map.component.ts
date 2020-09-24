import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { HttpClient } from '@angular/common/http'; 
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-lg-map',
  templateUrl: './lg-map.component.html',
  styleUrls: ['./lg-map.component.scss'],
})
export class LgMapComponent implements OnInit {

  constructor(public http: HttpClient,
              public plt: Platform,
              public router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.plt.ready().then(() => {
      this.http.get('https://oghuxxw1e6.execute-api.us-east-1.amazonaws.com/dev')
      // .pipe(map(res => JSON.parse(res.json())))
      .subscribe(restaurants => this.initMap(restaurants));
    });
  }

  initMap(restaurants) {
    const map = new Map('map').setView([33.6396965, -84.4304574], 23);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customMarkerIcon = icon({
      iconUrl: 'assets/images/custom-marker-icon.png',
      iconSize: [64, 64], 
      popupAnchor: [0, -20]
    });

    restaurants.forEach((restaurant) => {
      marker([restaurant.position.lat, restaurant.position.lgn], {icon: customMarkerIcon})
      .bindPopup(`<b>${restaurant.title}</b>`, { autoClose: false })
      .on('click', () => this.router.navigateByUrl('/restaurant'))
      .addTo(map).openPopup();
    });
  }

}


