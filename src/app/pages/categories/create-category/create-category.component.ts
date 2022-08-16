import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CategoriesService} from "@services/categories.service";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  createCategoryForm: FormGroup;

  errors: any = {};

  file: any = null;

  categoryImgSrc: any = null;

  constructor(private categoriesService: CategoriesService,
              private fb: FormBuilder,
              private router: Router,
              private toaster: ToastrService) {
    this.createCategoryForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [null]
    });
  }

  get name() {
    return this.createCategoryForm.get('name');
  }

  get description() {
    return this.createCategoryForm.get('description');
  }

  ngOnInit(): void {
  }

  createCategorySubmit() {

    if (this.createCategoryForm.invalid)
      return;

    const formData = new FormData();

    if (this.file != null)
      formData.append('image', this.file, this.file?.name);

    formData.append('name', this.name.value);
    formData.append('description', this.description.value);

    const observer = {
      next: (result) => {
        this.router.navigate(['/categories']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.createCategoryForm.controls) {
            this.createCategoryForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.categoriesService.addCategory(formData).subscribe(observer);
  }

  onChooseImage($event) {
    this.file = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.categoryImgSrc = reader.result;

    reader.readAsDataURL(this.file);
  }
}
