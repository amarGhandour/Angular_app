import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SlidersService} from "@services/sliders.service";

@Component({
  selector: 'app-create-slider',
  templateUrl: './create-slider.component.html',
  styleUrls: ['./create-slider.component.scss']
})
export class CreateSliderComponent implements OnInit {

  createSliderForm: FormGroup;

  errors: any = {};

  file: any = null;

  sliderImageSrc: any = null;

  constructor(private slidersService: SlidersService,
              private fb: FormBuilder,
              private router: Router,
              private toaster: ToastrService) {
    this.createSliderForm = fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      image: [null]
    });
    this.createSliderForm.get('status').setValue('');
  }

  get title() {
    return this.createSliderForm.get('title');
  }

  get description() {
    return this.createSliderForm.get('description');
  }

  get status() {
    return this.createSliderForm.get('status');
  }

  ngOnInit(): void {
  }

  createSliderSubmit() {

    if (this.createSliderForm.invalid)
      return;

    const formData = new FormData();

    if (this.file != null)
      formData.append('image', this.file, this.file?.name);

    formData.append('title', this.title.value);
    formData.append('description', this.description.value);
    formData.append('status', this.createSliderForm.get('status').value);

    const observer = {
      next: (result) => {
        this.router.navigate(['/sliders']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.createSliderForm.controls) {
            this.createSliderForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.slidersService.addSlider(formData).subscribe(observer);
  }

  onChooseImage($event) {
    this.file = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.sliderImageSrc = reader.result;

    reader.readAsDataURL(this.file);
  }

}
