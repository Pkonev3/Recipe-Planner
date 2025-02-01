import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  private apiUrl = 'http://localhost:3000/units';

  constructor(private http: HttpClient) {}

  getUnits(): Observable<Unit[]>{
    return this.http.get<Unit[]>(this.apiUrl);
  }
}
