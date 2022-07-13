import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = true;
  incidents: Incident[] = [];
  numPages = 0;
  totalIncidents = 0;
  currentPage = this.route.snapshot.queryParamMap.get('page') || 1;
  
  titleFilter: string = this.route.snapshot.queryParamMap.get('titleFilter') || '';
  descriptionFilter: string = this.route.snapshot.queryParamMap.get('descriptionFilter') || '';
  usernameFilter: string = this.route.snapshot.queryParamMap.get('usernameFilter') || '';
  statusFilter: string = this.route.snapshot.queryParamMap.get('statusFilter') || 'All';
  order: string = this.route.snapshot.queryParamMap.get('order') || '-1';
  
  constructor(
    private dataservice: DataService,
    private route: ActivatedRoute,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    if(this.statusFilter == 'All') this.statusFilter = '';
    const queryString = `page=${this.currentPage}&titleFilter=${this.titleFilter}&descriptionFilter=${this.descriptionFilter}&usernameFilter=${this.usernameFilter}&statusFilter=${this.statusFilter}&order=${this.order}`;
    this.dataservice.getAllIncidents(queryString).subscribe((res: any) => {
      console.log(res);
      this.incidents = [];
      res.incidents.forEach((incident: any) => {        
        const newIncident = new Incident(incident.title, incident.description, incident.status, incident.username, incident._id, incident.updated);
        this.incidents.push(newIncident);
      });
      console.log(this.incidents);
      
      this.loading = false;
      
      this.totalIncidents = res.total;
      this.numPages = res.numberOfPages;
    });
  }

  pageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex+1;
    console.log(this.currentPage);
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.currentPage,
        titleFilter: this.titleFilter,
        descriptionFilter: this.descriptionFilter,
        usernameFilter: this.usernameFilter,
        statusFilter: this.statusFilter,
        order: this.order
      }
    });
    this.loadIncidents();
  }

  receiveMessage(msg: any) {
    console.log(msg);
    this.loadIncidents();
  }

}
