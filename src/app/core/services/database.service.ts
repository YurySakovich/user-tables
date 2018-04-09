import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import * as moment from 'moment';

declare var require: any;
import 'rxjs/add/observable/of';
import { from } from 'rxjs/observable/from';
import { Subscriber } from 'rxjs/Rx';
import { ResponseContentType } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
export class DataBaseService {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(UserArray);

    constructor(private http: Http) {
    }

    get data(): any[] {
        return this.dataChange.value;
    }

    get getData(): BehaviorSubject<any[]> {
        return this.dataChange;
    }

    /** Adds a new user to the database. */
    public addUser(user: any) {
        const copiedData = this.data.slice();
        copiedData.push(user);
        this.dataChange.next(copiedData);
    }

    /** Adds a new user to the database. */
    public removeUser(id) {
        const copiedData = this.data.slice().filter((el) => {
            if(el.id !== id)
            return el;
        });

        this.dataChange.next(copiedData);
    }

    /** Builds and returns a new User. */
    private createNewUser() {
        return { id: this.data.values, account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' };
    }
}

export const UserArray = [
    { id: 0, account: 'yura_sakovich@smartexlab.com', firstName: 'Yura', lastName: 'Sakovich', alias: 'yura-sakovich' },
    { id: 1, account: 'vasili_kisel@smartexlab.com', firstName: 'Vasili', lastName: 'Kisel', alias: 'vasili-kisel' },
    { id: 2, account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' },
    { id: 3, account: 'yura_sakovich@smartexlab.com', firstName: 'Yura', lastName: 'Sakovich', alias: 'yura-sakovich' },
    { id: 4, account: 'vasili_kisel@smartexlab.com', firstName: 'Vasili', lastName: 'Kisel', alias: 'vasili-kisel' },
    { id: 5, account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' }
]