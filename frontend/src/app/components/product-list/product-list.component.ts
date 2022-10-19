import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryd: number = 1;
  searchMode: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const keyWord : string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(keyWord).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    this.currentCategoryd = 1;

    if (hasCategoryId){
      this.currentCategoryd = +this.route.snapshot.paramMap.get('id')!;
    }

    this.productService.getProductList(this.currentCategoryd).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
