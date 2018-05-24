import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DataBaseService } from './services/database.service';

const services: Array<any> = [
    DataBaseService
];

const modules: Array<any> = [
    RouterModule,
    HttpModule,
    BrowserAnimationsModule
];

@NgModule({
    imports: [
        ...modules
    ],
    declarations: [  ],
    exports: [  ],
    providers: [
        ...services
    ]
})
export class CoreModule {
}
