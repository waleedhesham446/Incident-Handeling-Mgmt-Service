import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<any>();

  constructor(
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  titleFilter: string = this.route.snapshot.queryParamMap.get('titleFilter') || '';
  descriptionFilter: string = this.route.snapshot.queryParamMap.get('descriptionFilter') || '';
  usernameFilter: string = this.route.snapshot.queryParamMap.get('usernameFilter') || '';
  statusFilter: string = this.route.snapshot.queryParamMap.get('statusFilter') || 'All';
  order: string = this.route.snapshot.queryParamMap.get('order') || '-1';

  titleFormControl = new FormControl(this.titleFilter);
  descriptionFormControl = new FormControl(this.descriptionFilter);
  usernameFormControl = new FormControl(this.usernameFilter);
  orderFormControl = new FormControl(this.order);
  statusFormControl = new FormControl(this.statusFilter);

  redirectTo(uri: string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri], {
        queryParams: {
          titleFilter: this.titleFormControl.value,
          descriptionFilter: this.descriptionFormControl.value,
          usernameFilter: this.usernameFormControl.value,
          statusFilter: this.statusFormControl.value,
          order: this.orderFormControl.value
        }
      })
    );
  }
  
  onSubmit(): void {
    this.redirectTo('/home');
    // this.route.navigate(['/home']);
    // this.messageEvent.emit("filter");
  }
}
