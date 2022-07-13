import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-add-incident-dialog',
  templateUrl: './add-incident-dialog.component.html',
  styleUrls: ['./add-incident-dialog.component.css']
})
export class AddIncidentDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddIncidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Incident,
  ) {}

  ngOnInit(): void {
  }

}
