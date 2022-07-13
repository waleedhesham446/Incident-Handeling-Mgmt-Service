import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiBaseAddress: string = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getAllIncidents(queryString: string) {
    return this.http.get(`${this.apiBaseAddress}/incident/all?${queryString}`).pipe(catchError(
      (error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  getIncident(id: string) {
    return this.http.get(`${this.apiBaseAddress}/incident/one/${id}`).pipe(catchError(
      (error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  getAllUsers() {
    return this.http.get(`${this.apiBaseAddress}/user/all`).pipe(catchError(
      (error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  loginAsAdmin(data: any) {
    return this.http.post(`${this.apiBaseAddress}/admin/login`, data).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  loginAsUser(data: any) {
    return this.http.post(`${this.apiBaseAddress}/user/signin`, data).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiBaseAddress}/user/signup`, data).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  addAdmin(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }
    return this.http.post(`${this.apiBaseAddress}/admin/addAdmin`, data.admin, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  addIncident(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }
    return this.http.post(`${this.apiBaseAddress}/admin/incident/raise`, data.incident, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  assignIncident(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }

    return this.http.put(`${this.apiBaseAddress}/admin/incident/assign/${data.incidentId}`, { userId: data.userId }, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  deleteIncident(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }

    return this.http.delete(`${this.apiBaseAddress}/admin/incident/delete/${data.incidentId}`, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  acknowledgeIncident(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }

    return this.http.put(`${this.apiBaseAddress}/user/acknowledge/${data.incidentId}`, { }, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }

  resolveIncident(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
      }),
    }

    return this.http.put(`${this.apiBaseAddress}/user/resolve/${data.incidentId}`, { comment: data.comment }, httpOptions).pipe(catchError(
      (error) => {
        return throwError(() => error);
      })
    );
  }
}
