import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ICategory} from "@/interfaces/icategory";
import {CategoriesService} from "@services/categories.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsService} from "@services/products.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {} as IDropdownSettings;

  categories: ICategory[];

  createProductForm: FormGroup;

  errors: any = {};

  file: any

  productImageSrc: any = null;

  constructor(private categoriesService: CategoriesService,
              private productsService: ProductsService,
              private fb: FormBuilder,
              private router: Router,
              private toaster: ToastrService) {
    this.createProductForm = fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      featured: ['', [Validators.required]],
      image: [null]
    });
    this.createProductForm.get('featured').setValue('');
  }

  get name() {
    return this.createProductForm.get('name');
  }

  get description() {
    return this.createProductForm.get('description');
  }

  get price() {
    return this.createProductForm.get('price');
  }

  get quantity() {
    return this.createProductForm.get('quantity');
  }

  ngOnInit(): void {
    this.getAllCategories();
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

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  addProductSubmit() {

    if (this.createProductForm.invalid)
      return;

    let categories = [];
    this.selectedItems.forEach((item) => {
      categories.push(item.item_id);
    });

    const formData = new FormData();
    formData.append('image', this.file, this.file.name);
    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    formData.append('quantity', this.quantity.value);
    formData.append('price', this.price.value);
    formData.append('featured', this.createProductForm.get('featured').value);

    for (let category of categories) {
      formData.append(`categories[]`, category);
    }

    const observer = {
      next: (result) => {
        this.router.navigate(['/products']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.createProductForm.controls) {
            this.createProductForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.productsService.addProduct(formData).subscribe(observer);
  }

  onChooseImage($event) {
    this.file = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.productImageSrc = reader.result;

    reader.readAsDataURL(this.file);
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
