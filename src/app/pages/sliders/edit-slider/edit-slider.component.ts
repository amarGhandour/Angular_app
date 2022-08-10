import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SlidersService} from "@services/sliders.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ISlider} from "@/interfaces/islider";

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.scss']
})
export class EditSliderComponent implements OnInit {

  slider!: ISlider

  editSliderForm: FormGroup;

  errors: any = {};

  file: any = null;

  sliderImageSrc: any = null;

  constructor(private slidersService: SlidersService,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toaster: ToastrService) {
    this.editSliderForm = fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      image: [null]
    });
    this.editSliderForm.get('status').setValue('');
  }

  get title() {
    return this.editSliderForm.get('title');
  }

  get description() {
    return this.editSliderForm.get('description');
  }

  get status() {
    return this.editSliderForm.get('status');
  }

  ngOnInit(): void {
    this.getSliderDetails();
  }

  editSliderSubmit() {

    if (this.editSliderForm.invalid)
      return;

    const formData = new FormData();

    if (this.file != null)
      formData.append('image', this.file, this.file?.name);

    formData.append('title', this.title.value);
    formData.append('description', this.description.value);
    formData.append('status', this.editSliderForm.get('status').value);
    formData.append('_method', 'PUT');

    const observer = {
      next: (result) => {
        this.router.navigate(['/sliders']);
        this.toaster.success(result.message)
      },
      error: (response) => {
        if (response.status == 422) {
          for (let controlsKey in this.editSliderForm.controls) {
            this.editSliderForm.controls[controlsKey].markAsPristine();
          }
          this.errors = response.error.errors;
        }
        console.log(response);
      }
    };

    this.slidersService.updateSlider(formData, this.slider.id).subscribe(observer);
  }

  onChooseImage($event) {
    this.file = $event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.sliderImageSrc = reader.result;

    reader.readAsDataURL(this.file);
  }

  getSliderDetails() {

    const observer = {
      next: (result) => {
        this.slider = result.data;
        this.fillFormFields();
      },
      error: (error) => {
        console.log(error)
      }
    };

    this.slidersService.getSlider(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(observer);
  }

  private fillFormFields() {
    this.sliderImageSrc = this.slider.image;
    this.title.setValue(this.slider?.title);
    this.description.setValue(this.slider?.description);
    this.status.setValue(this.slider?.status);
  }
}
