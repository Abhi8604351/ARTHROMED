import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';
import { AdminProductsComponent } from './pages/admin/admin-products.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';
import { ProductFormComponent } from './pages/admin/product-form/product-form.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public & Customer Routes
  {
    path: '',
    component: HomeComponent,
    title: 'ArthroMed | Premier Breg & Orthopedic Solutions'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us | Arthromed Healthcare'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Product Catalog | ArthroMed Orthopedic Care'
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    title: 'Product Specifications | ArthroMed'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Welcome Back | Connect with Us | ArthroMed'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Connect with Us | Create Account | ArthroMed'
  },

  // Isolated Admin Routes
  {
    path: 'admin',
    redirectTo: 'admin/products',
    pathMatch: 'full'
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    title: 'Clinical Administration Sign In | ArthroMed'
  },

  // Protected Admin Routes (Protected by adminGuard)
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [adminGuard],
    title: 'Inventory Administration | ArthroMed Control Panel'
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [adminGuard],
    title: 'User Management & Security | ArthroMed Control Panel'
  },
  {
    path: 'admin/products/new',
    component: ProductFormComponent,
    canActivate: [adminGuard],
    title: 'Register New Product | ArthroMed Admin'
  },
  {
    path: 'admin/products/edit/:id',
    component: ProductFormComponent,
    canActivate: [adminGuard],
    title: 'Edit Product | ArthroMed Admin'
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
