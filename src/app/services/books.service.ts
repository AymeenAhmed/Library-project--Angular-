import { Injectable } from '@angular/core';
import firebase from 'firebase';
//import { firebase } from '@firebase/app' ;

import {  Subject } from 'rxjs';
import { Book } from '../models/book.model';
//import '@firebase.database.DataSnapshot' ;
 
//import {DataSnapshot } from '../node_modules/firebase/database/DataSnapshot' ;

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [] ;
  booksSubject = new Subject<Book[]>();

  emitBooks() {
    this.booksSubject.next(this.books);
  }
  saveBooks(){
    firebase.database().ref('/books').set(this.books);
  //ref() retourne une refrnce depuis la db
  //set() elle ecrit et remplace les donnés au node donné put()
  }
  //récuperation de la liste entiere des livres pour recuperé un seul livre
  
  getBooks() {
    firebase.database().ref('/books')
    .on('value',(data ) => {
      this.books = data.val() ? data.val() : [] ;
      this.emitBooks();
    }
    );
  }
  getSingleBook(id: number) { // recupere un livre selon l'id
    return new Promise (
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then( // once fait une seuls requette de donnés retourne un promise
          (data) => {
            resolve(data.val()) ;
            }, (error) => {
              reject(error) ;
            }
        );
      }
    )
  }
 //DataSnapshot : c un objet correspondant au nose demandé,comportant +eurs membres et methodes
  constructor() {
    this.getBooks() ;
  }

 //creation d'un nouveau livre et supprimer un livre existant
 createNewBook(newBook: Book) {
  this.books.push(newBook) ;
  this.saveBooks();
  this.emitBooks();
  }

  removeBook(book: Book) {
    if(book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
}

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
}

}
