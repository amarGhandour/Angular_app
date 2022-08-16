import {Component, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {CategoriesService} from "@services/categories.service";
import {ICategory} from "@/interfaces/icategory";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  pageSize: any;
  pageIndex: any;
  categories: ICategory[];
  length: any;
  pageEvent?: PageEvent;


  constructor(private categoriesService: CategoriesService, private toaster: ToastrService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories($event?: PageEvent) {
    this.pageEvent = $event;

    const observer = {
      next: (result) => {
        this.categories = result.data;
        this.length = result.meta.total;
        this.pageIndex = result.meta.current_page - 1;
        this.pageSize = result.meta.per_page;
      },
      error: (error) => {
        console.log(error)
      }
    }

    this.categoriesService.getAllCategoriesPaginated($event?.pageIndex).subscribe(observer);
  }

  deleteCategory(id) {
    const observer = {
      next: (result) => {
        this.toaster.success('Category successfully deleted.');
        this.categories = this.categories.filter(category => category.id != id);
        this.length--;
      },
      error: (error) => {
        console.log(error)
      }
    }

    if (confirm('Are you sure?'))
      this.categoriesService.deleteCategory(id).subscribe(observer);
  }
}
