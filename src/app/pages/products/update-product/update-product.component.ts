import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ICategory} from "@/interfaces/icategory";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "@services/categories.service";
import {ProductsService} from "@services/products.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {IProduct} from "@/interfaces/iproduct";

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {

  dropdownList = [];

  selectedItems = [];

  dropdownSettings: IDropdownSettings = {} as IDropdownSettings;

  categories: ICategory[];

  editProductForm: FormGroup;

  errors: any = {};

  file: any

  productImageSrc: any = null;

  product!: IProduct;

  constructor(private categoriesService: CategoriesService,
              private productsService: ProductsService,
              private fb: FormBuilder,
              private router: Router,
              private toaster: ToastrService,
              private activateRouteService: ActivatedRoute) {
    this.editProductForm = fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      featured: ['', [Validators.required]],
      image: [null]
    });
    this.editProductForm.get('featured').setValue('');
  }

  get name() {
    return this.editProductForm.get('name');
  }

  get description() {
    return this.editProductForm.get('description');
  }

  get price() {
    return this.editProductForm.get('price');
  }

  get quantity() {
    return this.editProductForm.get('quantity');
  }

  ngOnInit(): void {

    this.getProductDetails();

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

  editProductSubmit() {

    if (this.editProductForm.invalid)
      return;

    let categories = [];
    this.selectedItems.forEach((item) => {
      categories.push(item.item_id);
    });

    const formData = new FormData();

    if (this.file != null)
      formData.append('image', this.file, this.file.name);

    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    formData.append('quantity', this.quantity.value);
    formData.append('price', this.price.value);
    formData.append('featured', this.editProductForm.get('featured').value);
    formData.append('_method', 'PUT');

    for (let category of categories) {
      formData.append(`categories[]`, category);
    }

    console.log(formData.get('name'));

    // return;

    const observer = {
      next: (result) => {
        this.router.navigate(['/products']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.editProductForm.controls) {
            this.editProductForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.productsService.updateProduct(formData, this.product?.id).subscribe(observer);
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

  private getProductDetails() {

    const observer = {
      next: (result) => {
        console.log(result.data)
        this.product = result.data;

        this.product.categories.forEach((category) => {
          this.selectedItems.push({item_id: category.id, item_text: category.name})
        });

        this.productImageSrc = this.product.image;

        this.editProductForm.get('featured').setValue(this.product?.featured);
        this.editProductForm.get('name').setValue(this.product?.name);
        this.editProductForm.get('description').setValue(this.product?.description);
        this.editProductForm.get('price').setValue(this.product?.price);
        this.editProductForm.get('quantity').setValue(this.product?.price);

      },
      error: (error) => {
        console.log(error)
      }
    }

    this.productsService.getProduct(this.activateRouteService.snapshot.paramMap.get('id')).subscribe(observer);
  }
}
