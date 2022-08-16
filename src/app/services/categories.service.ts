import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {isUndefined} from "webpack-merge/dist/utils";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  httpOptions: any;
  params: HttpParams;

  private baseUrl = `${environment.api}/admin/categories`;

  constructor(private httpClient: HttpClient) {
    this.params = new HttpParams();

    this.httpOptions = {
      headers: new HttpHeaders(),
      params: this.params,
      withCredentials: true
    };
  }

  getAllCategories() {
    return this.httpClient.get(`${environment.api}/categories?all=1`, this.httpOptions)
  }

  getAllCategoriesPaginated(page?: number) {
    if (!isUndefined((page)))
      this.params = this.params.set('page', page);

    return this.httpClient.get(`${environment.api}/categories`, this.httpOptions)
  }

  deleteCategory(id: string) {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, this.httpOptions)
  }

  addCategory(formData: FormData) {
    return this.httpClient.post(this.baseUrl, formData, this.httpOptions);
  }

  getCategory(id: string) {
    return this.httpClient.get(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  updateSlider(formData: FormData, id: number) {
    return this.httpClient.post(`${this.baseUrl}/${id}`, formData, this.httpOptions);

  }
}
