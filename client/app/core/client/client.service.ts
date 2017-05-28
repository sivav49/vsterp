import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Client} from './client.model';

@Injectable()
export class ClientService {
  private apiUrl = 'http://192.168.1.104:4300/api/client';

  private static extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  private static handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText || ''} ${JSON.stringify(error)}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(error);
  }

  constructor(private http: Http) {
  }

  getAll(): Observable<Client[]> {
    return this.http.get(this.apiUrl).map(
      (res) => {
        const clients = ClientService.extractData(res);
        return clients;
      })
      .catch(ClientService.handleError);
  }

  getClient(index: number): Observable<Client> {
    return this.http.get(this.apiUrl + '/' + index).map(
      (res) => {
        const client = ClientService.extractData(res);
        return client;
      })
      .catch(ClientService.handleError);
  }
}
