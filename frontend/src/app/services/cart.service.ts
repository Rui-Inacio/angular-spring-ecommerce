import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem){

    // check if id already exists
    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem | undefined;

    if (this.cartItems.length > 0){
      
      this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
      // for (let tempCartItem of this.cartItems){
      //   if (tempCartItem.id === cartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

    }

    if (existingCartItem != undefined){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();


  }

  computeCartTotals() {

    let totalQuantity: number = 0;
    let totalPrice: number = 0;

    for(let tempCartItem of this.cartItems){
      totalPrice += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantity += tempCartItem.quantity;
    }  

    // publish new values
    // all subscribers will receive 

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

  }

}
