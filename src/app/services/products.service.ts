import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  httpOptions;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Accept": "application/json"
      }),
      withCredentials: true
    };
  }

  getAllProductsPaginated(page) {
    let url = `${environment.api}/products`;
    if (page > 0) {
      url += `?page=${page + 1}`
    }
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
