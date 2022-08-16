import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {isUndefined} from "webpack-merge/dist/utils";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  httpOptions;
  params: HttpParams;

  constructor(private httpClient: HttpClient) {
    this.params = new HttpParams();
    this.httpOptions = {
      headers: new HttpHeaders({
        "Accept": "application/json"
      }),
      params: this.params,
      withCredentials: true
    };
  }

  getAllProductsPaginated(page?: any) {
    let url = `${environment.api}/products`;

    if (!isUndefined(page)) {
      this.httpOptions.params = this.httpOptions.params.set('page', page + 1);
    }

    console.log(this.httpOptions.params.toString());

    return this.httpClient.get(url, this.httpOptions)
  }

  addProduct(formData) {
    return this.httpClient.post(`${environment.api}/admin/products`, formData, this.httpOptions);
  }

  deleteProduct(id: number) {
    return this.httpClient.delete(`${environment.api}/admin/products/${id}`, this.httpOptions)
  }

  getProduct(id: string) {
    return this.httpClient.get(`${environment.api}/products/${id}`, this.httpOptions);
  }

  updateProduct(formData: FormData, id: any) {
    return this.httpClient.post(`${environment.api}/admin/products/${id}`, formData, this.httpOptions);
  }
}
