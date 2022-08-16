import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ICategory} from "@/interfaces/icategory";
import {CategoriesService} from "@services/categories.service";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  category!: ICategory

  editCategoryForm: FormGroup;

  errors: any = {};

  file: any = null;

  categoryImageSrc: any = null;

  constructor(private categoriesService: CategoriesService,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toaster: ToastrService) {
    this.editCategoryForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [null]
    });
  }

  get name() {
    return this.editCategoryForm.get('name');
  }


  get description() {
    return this.editCategoryForm.get('description');
  }


  ngOnInit(): void {
    this.getCategoryDetails();
  }

  editCategorySubmit() {

    if (this.editCategoryForm.invalid)
      return;

    const formData = new FormData();

    if (this.file != null)
      formData.append('image', this.file, this.file?.name);

    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    formData.append('_method', 'PUT');

    const observer = {
      next: (result) => {
        this.router.navigate(['/categories']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.editCategoryForm.controls) {
            this.editCategoryForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.categoriesService.updateSlider(formData, this.category.id).subscribe(observer);
  }

  onChooseImage($event) {
    this.file = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.categoryImageSrc = reader.result;

    reader.readAsDataURL(this.file);
  }

  getCategoryDetails() {

    const observer = {
      next: (result) => {
        this.category = result.data;
        this.fillFormFields();
      },
      error: (error) => {
        console.log(error)
      }
    };

    this.categoriesService.getCategory(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(observer);
  }

  private fillFormFields() {
    this.categoryImageSrc = this.category.image;
    this.name.setValue(this.category?.name);
    this.description.setValue(this.category?.description);
  }
}
