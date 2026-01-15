import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  template: ''
})
export class AdminHomeComponent implements OnInit {
  router = inject(Router);
  
  ngOnInit() {
    this.router.navigate(['/admin/dashboard']);
  }
}
