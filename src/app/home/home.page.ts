import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  plu = '';
  barcode = '';
  name = '';
  description = '';
  price = null;
  productnumber = '';

  constructor(
    private barcodeScanner: BarcodeScanner,
    private sqlite: SQLite
  ) {}

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.matchProduct(barcodeData.text);
     }).catch(err => {
         console.log('Error', err);
     });
  }

  checkManually() {
    this.matchProduct(this.productnumber);
  }

  matchProduct(productnumber: string) {
    this.sqlite.create({
      name: 'pricechecker.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM product WHERE plu = ? OR barcode = ?', [productnumber, productnumber])
      .then(res => {
        if (res.rows.length > 0) {
          console.log(res.rows.item);
          console.log(res.rows.item(0));
          this.plu = res.rows.item(0).plu;
          this.barcode = res.rows.item(0).barcode;
          this.name = res.rows.item(0).prodname;
          this.description = res.rows.item(0).proddesc;
          this.price = res.rows.item(0).price;
        } else {
          console.log('product not found!');
        }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  clearForm() {
    this.plu = '';
    this.barcode = '';
    this.name = '';
    this.description = '';
    this.price = null;
    this.productnumber = '';
  }

}
