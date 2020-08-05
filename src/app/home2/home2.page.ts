import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  Environment,
  GoogleMapOptions,
  LocationService,
  LatLng,
  CameraPosition,
  ILatLng,
  Polygon,
  PolylineOptions,
  Polyline
} from '@ionic-native/google-maps';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
})
export class Home2Page implements OnInit {

  map: GoogleMap;
  lat: number = 0;
  lng: number = 0;
  distancia: number = 0;
  contador: number = 0;
  points: ILatLng[] = [];
  tempo: Date;
  tempoIni: any;
  tempoFin: any;
  tempoDecorrido: any;
  velocidade: number = 0;

  constructor(
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform) {
    this.platform.ready().then(() => {
      this.loadMap();
    });
    
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      // this.presentToast('' + data.coords.latitude);
      this.calcDistancia(data);
      this.contador++;
    });
    this.tempo = new Date();
    this.tempoIni = this.tempo;
  }

  async presentToast(mensagem: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  ngOnInit() {

  }

  loadMap() {

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAMYuYlagbJbL0jQBqH_P6O0ANUBq74v0k',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAMYuYlagbJbL0jQBqH_P6O0ANUBq74v0k'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 0,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    /*
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 25,
          tilt: 30
        }
      };

      this.map = GoogleMaps.create('map_canvas', mapOptions);

      let marker: Marker = this.map.addMarkerSync({
        title: 'Eu',
        icon: 'red',
        animation: 'DROP',
        position: myLocation.latLng
      });
    });
    */
  }

  calcDistancia(data: Geoposition) {
    if (this.lat == 0 && this.lng == 0) {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
    } else {
      if (data.coords.latitude > this.lat || data.coords.longitude > this.lng) {
        let d1 = data.coords.longitude - this.lat;
        let d2 = data.coords.longitude - this.lng;
        let d = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2));
        if (d > 20) {
          var agora = new Date();
          this.tempoDecorrido += ((agora.getTime() - this.tempo.getTime()) / 1000);
          this.tempo = agora;
          this.tempoFin = agora;
          this.velocidade = parseFloat(((d/100) / this.tempoDecorrido).toFixed(2));
          this.distancia += parseFloat((d/100).toFixed(2));
          this.lat = data.coords.latitude;
          this.lng = data.coords.longitude;
          this.points.push({lat: this.lat, lng: this.lng});
          //this.criarMarker();
          this.criarTrilha();
        }
        
      }
    }
    //this.presentToast('Distância (' + this.contador + ') : ' + this.distancia);
  }

  criarMarker() {
    let cameraPos: CameraPosition<ILatLng> = {
      target: { lat: this.lat, lng: this.lng },
      zoom: 20
    };

    this.map.moveCamera(cameraPos);
    let marker: Marker = this.map.addMarkerSync({
      title: 'Eu',
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.lng
      }
    });
  }

  criarTrilha() {
    let cameraPos: CameraPosition<ILatLng> = {
      target: { lat: this.lat, lng: this.lng },
      zoom: 20
    };

    this.map.moveCamera(cameraPos);

    let options: PolylineOptions = {
      points: this.points,
      color: '#AA00FF',
      width: 10,
      geodesic: true,
      clickable: true
    };
    

    this.map.addPolyline(options).then((polyline: Polyline) => {
      
    });
  }

  /*calcDistancia() {
    if (this.lat == 0 && this.lng == 0) {
      this.lat = latLng.lat;
      this.lng = latLng.lng;
    }  else {
      this.distancia = Math.sqrt(Math.pow(latLng.lat - this.lat, 2) + Math.pow(latLng.lng - this.lng, 2));
      this.lat = latLng.lat;
      this.lng = latLng.lng;
    }
  }*/

}
