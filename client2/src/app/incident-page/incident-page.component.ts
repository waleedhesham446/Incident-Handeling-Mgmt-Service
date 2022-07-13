import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-incident-page',
  templateUrl: './incident-page.component.html',
  styleUrls: ['./incident-page.component.css']
})
export class IncidentPageComponent implements OnInit {

  loading = true;

  incidentId = this.route.snapshot.paramMap.get('id') || '';

  incident = new Incident();

  usernames: any = [];

  assignable = false;
  acknowledgable = false;
  resolvable = true;
  isAdmin: boolean = false;

  commentFormControl = new FormControl('');
  usernameFormControl = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private dataservice: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isAdmin = (localStorage.getItem('isAdmin') == 'true');
    this.dataservice.getIncident(this.incidentId).subscribe((res: any) => {
      console.log(res);
      
      this.incident.init(res.incident[0].title, res.incident[0].description, res.incident[0].status, res.incident[0].username, res.incident[0]._id, res.incident[0].updated, res.incident[0].comment);
      this.assignable = (this.incident.status == 'Not Assigned' || this.incident.status == 'Assigned');
      this.loading = false;

      const myUsername = localStorage.getItem('username');
      
      this.acknowledgable = (this.incident.status == 'Assigned' && this.incident.userName == myUsername);

      this.resolvable = (this.incident.status == 'Acknowledged' && this.incident.userName == myUsername);
    });

    this.dataservice.getAllUsers().subscribe((res: any) => {
      console.log(res);
      res.users.forEach((user: any) => {
        console.log(user);
        
        this.usernames.push({
          name: user.username,
          id: user._id
        })
      });
    });
  }

  assignIncident(): void {
    console.log(this.usernameFormControl.value);
    let token = localStorage.getItem('token');
    this.dataservice.assignIncident({ 
      token,
      incidentId: this.incidentId,
      userId: this.usernameFormControl.value,
    }).subscribe((res: any) => {
      console.log(res);
      
    });
  }

  deleteIncident(): void {
    let token = localStorage.getItem('token');
    this.dataservice.deleteIncident({ 
      token,
      incidentId: this.incidentId,
    }).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/home']);
    });
  }

  acknowledge(): void {
    this.dataservice.acknowledgeIncident({
      token: localStorage.getItem('token'),
      incidentId: this.incidentId
    }).subscribe((res) => {
      console.log(res);
      this.acknowledgable = false;
      this.resolvable = true;
      this.incident.status = 'Acknowledged';
    });
  }


  resolve(): void {
    console.log(this.commentFormControl.value);
    this.dataservice.resolveIncident({
      token: localStorage.getItem('token'),
      incidentId: this.incidentId,
      comment: this.commentFormControl.value,
    }).subscribe((res) => {
      console.log(res);
      this.resolvable = false;
      this.incident.comment = this.commentFormControl.value || "";
    });
  }
}
