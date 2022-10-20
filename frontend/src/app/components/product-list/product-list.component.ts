import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryd: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  previousKeyWord: string = '';

  // pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

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

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  handleSearchProducts(){
    const keyWord : string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyWord != keyWord){
      this.pageNumber = 1;
    }

    this.productService.searchProductsPaginate(keyWord, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());

  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    this.currentCategoryd = 1;

    if (hasCategoryId){
      this.currentCategoryd = +this.route.snapshot.paramMap.get('id')!;
    }

    if (this.previousCategoryId != this.currentCategoryd){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryd;

    // pageNumber is pageNumber - 1 because Spring paginate is 0 based (starts in 0) while angular paagination is 1 based (starts in 1)
    this.productService.getProductListPaginate(this.currentCategoryd, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
  }

}
