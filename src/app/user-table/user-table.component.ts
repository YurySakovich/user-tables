import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  displayedColumns = ['account', 'firstName', 'lastName', 'alias'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource;
  name;
  length = 0;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }


  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  ngAfterViewInit() {
  }

  add(firstName, lastName) {
    this.exampleDatabase.addUser({ account: 'yura_sakovich@smartexlab.com', firstName: firstName, lastName: lastName, alias: 'yura-sakovich' })
  }

  remove() {
    this.exampleDatabase.removeUser();
  }
}

export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(UserArray);

  constructor() {
  }

  get data(): any[] {
    return this.dataChange.value;
  }

  /** Adds a new user to the database. */
  public addUser(user: any) {
    const copiedData = this.data.slice();
    copiedData.push(user);
    this.dataChange.next(copiedData);
  }

  /** Adds a new user to the database. */
  public removeUser() {
    const copiedData = this.data.slice();
    copiedData.shift();
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    return { account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' };
  }
}

export class ExampleDataSource extends DataSource<any> {

  /** Emits once if dataSource is disconnected  */
  disconnect$ = new Subject();
  /** Provides the current length (Use in paginator) */
  length: number;
  /** emits the filter value */
  _filterChange = new BehaviorSubject<string>('');

  constructor(private _exampleDatabase: ExampleDatabase,
    private _paginator: MatPaginator,
    private _sort: MatSort) {
    super();
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<any[]> {
    /** Holder for everything that affects displayed rows.  */
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange,
    ];

    /** Reset the Pagination to startpage if filtering is in progress.  */
    this._filterChange
      .takeUntil(this.disconnect$)
      .subscribe(() => this.resetPaginator());

    console.log(displayDataChanges, 'displayDataChanges')
    /** Provides the actual data.  */
    return Observable
      .merge(...displayDataChanges)
      .takeUntil(this.disconnect$)
      .map(() => this.getFreshData())
      .map((data) => this.getFilteredData(data))
      .map(data => this.getSortedData(data))
      .do(data => this.setLength(data))
      .map(data => this.paginate(data));
  }


  resetPaginator() {
    return this._paginator.pageIndex = 0;
  }

  getFreshData() {
    return this._exampleDatabase.data.slice();
  }

  getFilteredData(data) {
    if (this.filter === '') {
      return data;
    }
    return data.filter((item: any) => {
      const searchStr = (item.firstName + item.lastName + item.alias + item.account).toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  paginate(data: Array<any>) {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  }

  setLength(data) {
    return this.length = data.length;
  }

  getSortedData(data): any[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'lastName':
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;
        case 'alias':
          [propertyA, propertyB] = [a.alias, b.alias];
          break;
        case 'account':
          [propertyA, propertyB] = [a.account, b.account];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect() {
    this.disconnect$.next(true);
    this.disconnect$.complete();
  }

}

export const UserArray = [
  { account: 'yura_sakovich@smartexlab.com', firstName: 'Yura', lastName: 'Sakovich', alias: 'yura-sakovich' },
  { account: 'vasili_kisel@smartexlab.com', firstName: 'Vasili', lastName: 'Kisel', alias: 'vasili-kisel' },
  { account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' },
  { account: 'yura_sakovich@smartexlab.com', firstName: 'Yura', lastName: 'Sakovich', alias: 'yura-sakovich' },
  { account: 'vasili_kisel@smartexlab.com', firstName: 'Vasili', lastName: 'Kisel', alias: 'vasili-kisel' },
  { account: 'zinedin_zidan@smartexlab.com', firstName: 'Zinedin', lastName: 'Zidan', alias: 'zi-zu' }
]