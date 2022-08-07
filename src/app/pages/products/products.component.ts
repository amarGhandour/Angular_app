import {Component, OnInit} from '@angular/core';
import {IProduct} from "@/interfaces/iproduct";
import {ProductsService} from "@services/products.service";
import {PageEvent} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: IProduct[]
  length: any;
  pageIndex: any;
  pageSize: any;
  pageEvent?: PageEvent;

  constructor(private productsService: ProductsService, private toaster: ToastrService) {
  }

  ngOnInit(): void {

    this.getProducts();
  }


  getProducts($event?: PageEvent) {
    this.pageEvent = $event;
    const observer = {
      next: (result) => {
        if (result.success) {
          this.products = result.data;
          this.length = result.meta.total;
          this.pageIndex = result.meta.current_page - 1;
          this.pageSize = result.meta.per_page;
        }
      },
      error: (err) => {
        if (err.status == 0)
          this.products = [];
      }
    };

    this.productsService.getAllProductsPaginated($event?.pageIndex).subscribe(observer);
  }

  deleteProduct(id: number) {
    console.log('delete product');
    const observer = {
      next: () => {
        this.toaster.success('Product successfully deleted.')
        this.products = this.products.filter((product: IProduct) => {
          return product.id != id;
        });
      },
      error: (err) => {
        this.toaster.error('Error occurred. Try again.')
      }
    };

    this.productsService.deleteProduct(id).subscribe(observer);
  }

}
