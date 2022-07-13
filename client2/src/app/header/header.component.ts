import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddAdminDialogComponent } from '../add-admin-dialog/add-admin-dialog.component';
import { AddIncidentDialogComponent } from '../add-incident-dialog/add-incident-dialog.component';
import { AdminData } from '../adminData.model';
import { DataService } from '../data.service';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<any>();

  isAdmin = false;

  adminData = new AdminData();

  incidentData = new Incident();

  constructor(
    public dialog: MatDialog,
    private dataservice: DataService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin') || '');
  }

  openAdminDialog(): void {
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {
      width: '250px',
      data: {username: this.adminData.username, password: this.adminData.password},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.dataservice.addAdmin({
          token: localStorage.getItem('token'),
          admin: result
        }).subscribe((res: any) => {
          alert(res.message);
        }, (err) => {
          alert(err.error.message);
        });
      }
    });
  }

  openIncidentDialog(): void {
    const dialogRef = this.dialog.open(AddIncidentDialogComponent, {
      width: '250px',
      data: {title: this.incidentData.title, description: this.incidentData.description},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.dataservice.addIncident({
          incident: result,
          token: localStorage.getItem('token')
        }).subscribe((res: any) => {
          console.log(res);
          this.messageEvent.emit(res.newIncident);
        }, (err) => {
          console.log(err);
          
        });
      }
    });
  }

  goHome(): void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/home']));
  }

}
