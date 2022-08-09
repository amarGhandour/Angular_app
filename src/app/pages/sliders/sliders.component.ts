import {Component, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {SlidersService} from "@services/sliders.service";
import {ISlider} from "@/interfaces/islider";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit {
  pageSize: any;
  pageIndex: any;
  sliders: ISlider[];
  length: any;
  pageEvent?: PageEvent;


  constructor(private slidersService: SlidersService, private toaster: ToastrService) {
  }

  ngOnInit(): void {
    this.getSliders();
  }

  getSliders($event?: PageEvent) {

    this.pageEvent = $event;

    const observer = {
      next: (result) => {
        this.sliders = result.data;
        this.length = result.meta.total;
        this.pageIndex = result.meta.current_page - 1;
        this.pageSize = result.meta.per_page;
      },
      error: (error) => {
        console.log(error)
      }
    }

    this.slidersService.getAllSlidersPaginated($event?.pageIndex).subscribe(observer);
  }

  deleteSlider(id) {
    const observer = {
      next: (result) => {
        this.toaster.success('Slider successfully deleted.');
        this.sliders = this.sliders.filter(slider => slider.id != id);
      },
      error: (error) => {
        console.log(error)
      }
    }

    if (confirm('Are you sure?'))
      this.slidersService.deleteSlider(id).subscribe(observer);
  }
}
