import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switch';

import {Modal, TwoButtonPreset} from 'angular2-modal/plugins/bootstrap';
import {ToastsManager} from 'ng2-toastr';
import {DialogRef} from 'angular2-modal';

import {Client} from './client.model';

export enum PopupResult {
  Ok,
  Cancel
}

export class ConfirmationResult<T> {

  constructor(public popupResult: PopupResult,
              public data: T) {
  }
}

@Injectable()
export class ClientService {
  private apiUrl = 'http://192.168.1.104:4300/api/clients';

  public activeClient: Client;

  private static assignIdToNickName(client: Client) {
    if (client._id) {
      client.nickName = client._id;
    }
  }

  private static extractData(res: Response) {
    const body = res.json();
    const data = body.data || {};
    if (Array.isArray(data)) {
      data.map((client) => ClientService.assignIdToNickName(client));
    } else {
      ClientService.assignIdToNickName(data);
    }
    return data;
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

  private static getJSONHeader() {
    return new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
  }

  public static hasClient(clientList: Client[], client: Client): boolean {
    let found = false;
    for (const c of clientList) {
      if (c._id === client._id) {
        found = true;
        break;
      }
    }
    return found;
  }

  constructor(private http: Http,
              private modal: Modal,
              private toastr: ToastsManager) {
  }

  getAll(): Observable<Client[]> {
    return this.http.get(this.apiUrl)
      .map((res) => ClientService.extractData(res) as Array<Client>)
      .catch(ClientService.handleError);
  }

  get(_id: number): Observable<Client> {
    return this.http.get(this.apiUrl + '/' + _id)
      .map((res) => ClientService.extractData(res) as Client)
      .catch(ClientService.handleError);
  }

  create(client: Client): Observable<Client> {
    if (client.nickName) {
      client._id = client.nickName;
    }
    const request = this.http.post(this.apiUrl, JSON.stringify(client), ClientService.getJSONHeader());
    return this.handleResponse(request, 'created successfully', 'An error occurred');
  }

  update(_id: string, client: Client): Observable<Client> {
    const request = this.http.put(this.apiUrl + '/' + _id, JSON.stringify(client), ClientService.getJSONHeader());
    return this.handleResponse(request, 'updated successfully', 'An error occurred');
  }

  delete(_id: string): Observable<Client> {
    const request = this.http.delete(this.apiUrl + '/' + _id);
    return this.handleResponse(request, 'deleted successfully', 'An Error occurred');
  }

  deleteConfirmation(clientId: string): Observable<ConfirmationResult<Client>> {
    return this.deletePopup(clientId)
      .map((result) => {
        if (result === PopupResult.Ok) {
          return this.delete(clientId)
            .map((client) => new ConfirmationResult(result, client));
        } else {
          return Observable.create((obj) => obj.next(new ConfirmationResult(PopupResult.Cancel, null)));
        }
      }).switch();
  }

  deletePopup(clientId): Observable<PopupResult> {
    return Observable.fromPromise(this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Delete Client Confirmation')
      .body('<p>Are you sure you want to delete?</p><p>' + clientId + '</p>')
      .okBtn('Delete')
      .okBtnClass('btn btn-danger')
      .open()
      .catch(err => alert('ERROR'))
      .then((dialog: DialogRef<TwoButtonPreset>) => dialog.result)
      .then(() => PopupResult.Ok)
      .catch(() => PopupResult.Cancel)
    );
  }

  private handleResponse(apiCall: Observable<Response>, successMessage: string, errorMessage: string) {
    return apiCall
      .map(
        (res: Response) => {
          const client = ClientService.extractData(res) as Client;
          if (client) {
            this.activeClient = client;
            this.toastr.success(client._id + ' ' + successMessage);
          }
          return client;
        }
      )
      .catch(
        (res: Response) => {
          this.toastr.error(errorMessage);
          return ClientService.handleError(res);
        }
      );
  }
}

@Injectable()
export class ClientGetResolve implements Resolve<Client> {

  constructor(private router: Router,
              private clientService: ClientService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> | Promise<Client> {
    const clientId = route.params['id'];
    return this.clientService.get(clientId).map(
      client => {
        if (client) {
          return client;
        } else {
          this.router.navigate(['404']);
          return client;
        }
      }
    );
  }
}

@Injectable()
export class ClientGetAllResolve implements Resolve<Client[]> {

  constructor(private clientService: ClientService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client[]
    | Observable<Client[]>
    | Promise<Client[]> {
    return this.clientService.getAll();
  }
}
