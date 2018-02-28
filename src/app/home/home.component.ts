import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { User } from '../shared/user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
cashInApi:any;
cashOutApiNatural:any;
cashOutApijuridical:any;
naturalCostumers:any = [];
juridicalCostumers:any = [];
result:any = [];
currentDate: number = Date.now();
user: User = new User();
transformdate: string;
cashOut:any = [];
cashIn:any = [];
lookup:any = [];
operations = [
  { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
  { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
  { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
  { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
  { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
  { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
  { "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
  { "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
  { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
];

  constructor(private http: HttpClient,
  private datepipe: DatePipe) {
  }

  ngOnInit() {
    this.transformdate = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log(this.transformdate);
            // this.user.date = this.transformdate;
            // console.log(this.user);
            //cash out natural
    this.http.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural').subscribe(cashOutApiNatural => {
      this.cashOutApiNatural = cashOutApiNatural;
      console.log(this.cashOutApiNatural);
    });
    // cash out juridical
    this.http.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical').subscribe(cashOutApijuridical => {
      this.cashOutApijuridical = cashOutApijuridical;
      console.log(this.cashOutApijuridical);
    });
    // cash in
    this.http.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in').subscribe(cashInApi => {
        this.cashInApi = cashInApi;
        console.log(this.cashInApi);
      });
  }
  // patikrinu ar cash out ar cash in, jei cash in iskart paskaiciuoju komisinius ir isidedu i result masyva,
   // jei cash out, susipusinu atskirai juridical ir natural vartotojus
  checkTransaction(){
    for(let i = 0; i < this.operations.length; i++){
      if(this.operations[i].type === "cash_out"){
          if(this.operations[i].user_type === "natural"){
            this.naturalCostumers.push(this.operations[i]);
          } else {
            this.juridicalCostumers.push(this.operations[i]);
          }
      } else{
        let x = this.operations[i].operation.amount * this.cashInApi.percents / 100
        if(x >= this.cashInApi.max.amount){
          x = this.cashInApi.max.amount;
          this.result.push(x);
        } else{
          this.result.push(x);
        }
      }
    }
    console.log(this.naturalCostumers);
    console.log(this.juridicalCostumers);
    console.log(this.result);
  }
  checkUser(){
    for(let i = 0; i < this.naturalCostumers.length; i++){
      if(!this.lookup.length || this.lookup.find(x => x.user_id !== this.naturalCostumers[i].user_id)){
        this.lookup.push(this.naturalCostumers[i]);
        console.log(this.lookup);
        console.log(this.lookup[i].operation.amount);
        console.log(this.naturalCostumers[i].user_id);
      } else{
          if(this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id)){
            this.lookup[0].operation.amount = this.lookup[0].operation.amount + this.naturalCostumers[i].operation.amount;
            console.log(this.lookup[0].operation.amount);
          }
        }
      }
      // console.log(this.lookup);
    }

    // lyg pavyko sioje funkcijoje jau pasiemus pagal viena user_id sudeti jam visas sumas dar be datos tikrinimo
    usersById(){
      for(let i = 0; i < this.naturalCostumers.length; i++){
        if(!this.lookup.length){
          this.lookup.push(this.naturalCostumers[i]);
          // console.log(i)
        }else if(this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id)){
          let look = this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id);
          // console.log(this.lookup.indexOf(look));
          this.lookup[this.lookup.indexOf(look)].operation.amount = this.lookup[this.lookup.indexOf(look)].operation.amount + this.naturalCostumers[i].operation.amount;
          console.log(this.lookup);
        }
        // if(!this.lookup.length || this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id)){
        //   this.lookup.push(this.naturalCostumers[i]);
        //   let look = this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id);
        //   this.lookup[this.lookup.indexOf(look)].operation.amount = this.lookup[this.lookup.indexOf(look)].operation.amount + this.naturalCostumers[i].operation.amount;
        //   // console.log(this.lookup.indexOf(look))
        //   console.log(this.lookup);
        // }

        // console.log(this.lookup);
      }
    }
    // usersById(){
    //   for(let i = 0; i < this.naturalCostumers.length - 1; i++){
    //     if(!this.lookup.length || this.lookup.find(x => x.user_id !== this.naturalCostumers[i].user_id)){
    //       this.lookup.push(this.naturalCostumers[i]);
    //     }
    //
    //     console.log(this.lookup);
    //   }
    // }
    // usersOperations(){
    //   for(let i = 0; i < this.naturalCostumers.length - 1; i++){
    //     if(this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id)){
    //       let look = this.lookup.find(x => x.user_id === this.naturalCostumers[i].user_id);
    //       console.log(this.lookup.indexOf(look));
    //       this.lookup[this.lookup.indexOf(look)].operation.amount = this.lookup[this.lookup.indexOf(look)].operation.amount + this.naturalCostumers[i].operation.amount;
    //       console.log(this.lookup);
    //     }
    //
    //   }
    //
    // }

}
