import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-price',
  templateUrl: './stock-price.component.html',
  styleUrls: ['./stock-price.component.css']
})
export class StockPriceComponent implements OnInit {
  stockCode: String = 'MSFT';
  price: number;

  @Output()
  lastPrice: EventEmitter<Number> = new EventEmitter();
  constructor() {
    setInterval(() => {
      const current_price = 100 * Math.random();
      this.price = current_price;
      this.lastPrice.emit(this.price);
    }, 1000);
  }

  ngOnInit() {
  }

}
