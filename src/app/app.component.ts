import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite
  ) {
    this.initializeApp();
    this.populateTable();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  populateTable() {
    this.sqlite.create({
      name: 'pricechecker.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // tslint:disable-next-line: max-line-length
      db.executeSql('CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY, plu TEXT, barcode TEXT, prodname TEXT, proddesc TEXT, price INT)', [])
      .then(res => console.log('Table created'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM product ORDER BY rowid DESC', [])
      .then(res => {
        if (res.rows.length === 0) {
          db.executeSql('INSERT INTO product VALUES (NULL, ?, ?, ?, ?, ?)', ['10001', '8998838350058', 'Kenko Stapler', 'Kenko Stapler HD-10D blue color', 1.2]);
          db.executeSql('INSERT INTO product VALUES (NULL, ?, ?, ?, ?, ?)', ['10002', '6935205316790', 'Deli Correction Fluid', 'Deli Correction Fluid 18ml metal trip and brush', 0.89]);
          db.executeSql('INSERT INTO product VALUES (NULL, ?, ?, ?, ?, ?)', ['10003', '8718696701959', 'Philips LED Bulb 10.5W', 'Philips LED Bulb 10.5W 1055 lumen Comfortable Brightness', 3.99]);
        }
      });
    }).catch(e => console.log(e));
  }
}
