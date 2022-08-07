import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() meta;
  currentPage: any;
  lastPage: any;
  perPage: any;
  links: any;

  constructor() {
  }

  ngOnInit(): void {
    this.currentPage = this.meta.current_page;
    this.lastPage = this.meta.last_page;
    this.perPage = this.meta.per_page;
    this.links = this.meta.links;
  }

  ngOnChanges(): void {
    this.currentPage = this.meta.current_page;
    this.lastPage = this.meta.last_page;
    this.perPage = this.meta.per_page;
    this.links = this.meta.links;
  }


}
