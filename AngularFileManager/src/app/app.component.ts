import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

export function getRouterEvent(){
  return inject(Router).events/*.pipe( filter(e => e instanceof NavigationEnd) )*/;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  http=inject(HttpClient);//prova di angular14 senza costruttore ma inject con il metodo
  routerEvents=getRouterEvent();
  ngOnInit(){ 
    console.log("Http inject senza costruttore: ");
    console.log(this.http);
    this.routerEvents.subscribe( console.log );
  }

  title = 'file-manage';
  //variabili generiche
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  //metodo per controllare il formato del file
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  //metodo per il caricamento
  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
      this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, 3);
      };
      reader.onerror = function () {
      console.log('error is occured while reading file!');
      };
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }
  fileReset() {
    this.records = [];
  }
  //metodo per convertire una riga del file in un oggetto typescript CSVRecord
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 0; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(';');
      if (curruntRecord.length >= headerLength) {
      let csvRecord: CSVRecord = new CSVRecord();
      csvRecord.id = curruntRecord[0].trim();
      csvRecord.campo1 = curruntRecord[1].trim();
      csvRecord.campo2 = curruntRecord[2].trim();
      csvArr.push(csvRecord);
      }else{
      let csvRecord: CSVRecord = new CSVRecord();
      csvRecord.id ="Riga scatata per lunghezza errata len="+curruntRecord.length ;
      csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }
  public recordsOut: any[] = [];
  generateOut(){const stringaVuota="";const valoreUno="1";
    let rec = [];
    for (let i=1; i<=this.records.length;i++){
      let record : CSVRecord=this.records[i-1];
      let rigaC : string=record.id+";"+record.campo2+"\n";
      rec.push(rigaC);
    }
    this.recordsOut=rec;
  }
  downloadFile() {
    this.generateOut();
    var blob = new Blob(this.recordsOut, {type: 'text/txt' })
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
export class CSVRecord {
  public id: any;
  public campo1: any;
  public campo2: any;
}
