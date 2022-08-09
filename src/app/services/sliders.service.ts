import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SlidersService {

  httpOptions;

  constructor(private httpClient: HttpClient) {
    const headers = new HttpHeaders();
    this.httpOptions = {
      headers: headers,
      withCredentials: true
    }
  }

  getAllSlidersPaginated(page) {
    let url = `${environment.api}/admin/sliders`;
    if (page > 0) {
      url += `?page=${page + 1}`
    }
    return this.httpClient.get(url, this.httpOptions);
  }

  addSlider(formData: FormData) {
    return this.httpClient.post(`${environment.api}/admin/sliders`, formData, this.httpOptions);
  }

  deleteSlider(id) {
    return this.httpClient.delete(`${environment.api}/admin/sliders/${id}`, this.httpOptions);
  }

  updateSlider(formData: FormData, id: string) {
    return this.httpClient.post(`${environment.api}/admin/sliders/${id}`, formData, this.httpOptions);
  }

  getSlider(id: string) {
    return this.httpClient.get(`${environment.api}/admin/sliders/${id}`, this.httpOptions);
  }
}
