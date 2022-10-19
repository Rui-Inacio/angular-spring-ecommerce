import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  loaded: boolean = false;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    
    // get the id param string. convert string to number using "+" symbol
    const productid: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productid).subscribe(
      data => {
        this.product = data;
        this.loaded = true;
      }
    )

  }

}
