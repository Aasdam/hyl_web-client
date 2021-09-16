import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {PUBLIC_ROUTES, PublicLayoutComponent} from './layout/public-layout/public-layout.component';
import {SECURE_ROUTES, SecureLayoutComponent} from './layout/secure-layout/secure-layout.component';
import {RouterModule, Routes} from '@angular/router';
import { SidebarComponent } from './layout/secure-layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/secure-layout/footer/footer.component';
import { TopbarComponent } from './layout/secure-layout/topbar/topbar.component';
import { SigninComponent } from './auth/signin/signin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthGuard} from './guards/auth.guard';
import { SignoutComponent } from './auth/signout/signout.component';
import { ListItemComponent } from './item/list-item/list-item.component';
import {ItemService} from './item/item.service';
import { CategoryComponent } from './item/list-item/category/category.component';
import { ItemComponent } from './item/list-item/item/item.component';
import { SubItemComponent } from './item/list-item/item/sub-item/sub-item.component';
import { AddItemModalComponent } from './item/list-item/shared/add-item-modal/add-item-modal.component';
import { AddCategoryModalComponent } from './item/list-item/shared/add-category-modal/add-category-modal.component';
import { MoveModalComponent } from './item/list-item/shared/move-modal/move-modal.component';
import { DelModalComponent } from './item/list-item/shared/del-modal/del-modal.component';
import { RenameModalComponent } from './item/list-item/shared/rename-modal/rename-modal.component';
import { AddSubitemModalComponent } from './item/list-item/item/add-subitem-modal/add-subitem-modal.component';
import { ExpandSubitemModalComponent } from './item/list-item/item/sub-item/expand-subitem-modal/expand-subitem-modal.component';
import * as bootstrap from 'bootstrap'; // Ne pas supprimer
import * as $ from 'jquery'; // Ne pas supprimer
import { TrackingSheetComponent } from './item/list-item/item/sub-item/tracking-sheet/tracking-sheet.component';
import { AddTrackingSheetModalComponent } from './item/list-item/item/sub-item/add-tracking-sheet-modal/add-tracking-sheet-modal.component';
import {DatePipe} from '@angular/common';
import { ProfilComponent } from './user/profil/profil.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { ListLoanComponent } from './loan/list-loan/list-loan.component';
import { TableLoanComponent } from './loan/list-loan/table-loan/table-loan.component';
import {LoanService} from './loan/loan.service';
import { CloseLoanModalComponent } from './loan/list-loan/table-loan/close-loan-modal/close-loan-modal.component';
import { AddLoanModalComponent } from './loan/list-loan/add-loan-modal/add-loan-modal.component';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {ResponseErrorInterceptor} from './interceptors/response-error.interceptor';
import { MemoComponent } from './memo/memo.component';
import { AddMemoModalComponent } from './memo/add-memo-modal/add-memo-modal.component';
import { DeleteMemoModalComponent } from './memo/delete-memo-modal/delete-memo-modal.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '', component : PublicLayoutComponent , children: PUBLIC_ROUTES, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  { path: '', component : SecureLayoutComponent , children: SECURE_ROUTES, canActivate: [AuthGuard] },
  {path: '**', redirectTo: '/connexion'}
];


@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    SecureLayoutComponent,
    SidebarComponent,
    FooterComponent,
    TopbarComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    ListItemComponent,
    CategoryComponent,
    ItemComponent,
    SubItemComponent,
    AddItemModalComponent,
    AddCategoryModalComponent,
    MoveModalComponent,
    DelModalComponent,
    RenameModalComponent,
    AddSubitemModalComponent,
    ExpandSubitemModalComponent,
    TrackingSheetComponent,
    AddTrackingSheetModalComponent,
    ProfilComponent,
    ErrorPageComponent,
    ForgotPassComponent,
    ListLoanComponent,
    TableLoanComponent,
    CloseLoanModalComponent,
    AddLoanModalComponent,
    MemoComponent,
    AddMemoModalComponent,
    DeleteMemoModalComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ReactiveFormsModule,
    AuthService,
    HttpClient,
    ItemService,
    DatePipe,
    LoanService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
