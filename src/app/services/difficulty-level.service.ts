import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DifficultyLevel } from '../models/difficultyLevel.model';

@Injectable({
  providedIn: 'root'
})
export class DifficultyLevelService {

  private apiUrl = "http://localhost:3000/difficultyLevels";

  constructor(private http: HttpClient) {}


  getDifficultyLevels(): Observable<DifficultyLevel[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
