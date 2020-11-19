import { Component } from '@angular/core';
//import * as firebase from 'firebase';
import { firebase } from '@firebase/app' ;
import '@firebase/auth' ;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(){
    var firebaseConfig = {
    apiKey: "AIzaSyCmiVcF5ZPW0qBEOZZ8vaAuC8A1403PmKM",
    authDomain: "bookshelves-e388e.firebaseapp.com",
    databaseURL: "https://bookshelves-e388e.firebaseio.com",
    projectId: "bookshelves-e388e",
    storageBucket: "bookshelves-e388e.appspot.com",
    messagingSenderId: "900179185086"
    //appId: "1:900179185086:web:2a148f74263bb83f5e7def",
    //measurementId: "G-MXE4ZWLH7R"
  };
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  }
}
