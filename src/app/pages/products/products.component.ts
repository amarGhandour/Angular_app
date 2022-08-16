import {Component, OnInit} from '@angular/core';
import {IProduct} from "@/interfaces/iproduct";
import {ProductsService} from "@services/products.service";
import {PageEvent} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {ICategory} from "@/interfaces/icategory";
import {CategoriesService} from "@services/categories.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {} as IDropdownSettings;

  products: IProduct[]
  categories: ICategory[]
  length: any;
  pageIndex: any;
  pageSize: any;
  pageEvent?: PageEvent;

  constructor(private productsService: ProductsService, private categoriesService: CategoriesService, private toaster: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
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

  getAllCategories() {
    const observer = {
      next: (result) => {
        this.categories = result.data;
        this.makeSelectItems();
      },
      error: (error) => {
        console.log('error occured');
      }
    }
    this.categoriesService.getAllCategories().subscribe(observer);
  }

  onItemDeselect($event: any) {
    this.productsService.httpOptions.params = this.productsService.params.delete('category', $event?.item_text);
    this.getProducts();
  }

  onItemSelect($event: any) {
    this.productsService.httpOptions.params = this.productsService.httpOptions.params.append('category', $event?.item_text);
    this.getProducts();
  }

  private makeSelectItems() {
    this.categories.forEach((category) => {
      this.dropdownList.push({item_id: category.id, item_text: category.name});
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: this.categories.length,
      allowSearchFilter: true
    };
  }
}
