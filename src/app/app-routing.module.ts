import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';
import {ForbiddenComponent} from "@modules/forbidden/forbidden.component";
import {ProductsComponent} from "@pages/products/products.component";
import {AddProductComponent} from "@pages/products/add-product/add-product.component";
import {UpdateProductComponent} from "@pages/products/update-product/update-product.component";
import {SlidersComponent} from "@pages/sliders/sliders.component";
import {CreateSliderComponent} from "@pages/sliders/create-slider/create-slider.component";
import {EditSliderComponent} from "@pages/sliders/edit-slider/edit-slider.component";
import {CategoriesComponent} from "@pages/categories/categories.component";
import {CreateCategoryComponent} from "@pages/categories/create-category/create-category.component";
import {EditCategoryComponent} from "@pages/categories/edit-category/edit-category.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'blank',
        component: BlankComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'products/create',
        component: AddProductComponent
      },
      {
        path: 'products/:id/edit',
        component: UpdateProductComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'categories/create',
        component: CreateCategoryComponent
      },
      {
        path: 'categories/:id/edit',
        component: EditCategoryComponent
      },
      {
        path: 'sliders',
        component: SlidersComponent
      },
      {
        path: 'sliders/create',
        component: CreateSliderComponent
      },
      {
        path: 'sliders/:id/edit',
        component: EditSliderComponent
      },
      {
        path: 'sub-menu-1',
        component: SubMenuComponent
      },
      {
        path: 'sub-menu-2',
        component: BlankComponent
      },
      {
        path: '',
        component: DashboardComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    canActivate: [NonAuthGuard]
  },
  {path: '403', component: ForbiddenComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
