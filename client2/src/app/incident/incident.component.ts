import { Component, Input, OnInit } from '@angular/core';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent implements OnInit {
  @Input() incidentTitle: string = '';
  @Input() incidentDescription: string = '';
  @Input() incidentStatus: string = '';
  @Input() incidentUserName: string = '';
  @Input() incidentId: string = '';
  @Input() updated: string = '';

  incident = new Incident();

  statusColorsMap: any = {
    'Not Assigned': 'red',
    'Assigned': 'orange',
    'Acknowledged': 'yellow',
    'Resolved': 'green',
  };
  
  constructor() {
    
  }

  ngOnInit(): void {
    this.incident.init(this.incidentTitle, this.incidentDescription, this.incidentStatus, this.incidentUserName, this.incidentId, this.updated);
  }

}
