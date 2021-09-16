import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {LoanModel} from '../../model/loan.model';
import {DataTablesService} from '../../../shared/services/datatables/data-tables.service';

@Component({
  selector: 'app-table-loan',
  templateUrl: './table-loan.component.html',
  styleUrls: ['./table-loan.component.scss']
})
export class TableLoanComponent implements OnInit, AfterViewInit {
  @Input() etat: string;
  @Input() private loans: LoanModel[];

  constructor(private dataTablesService: DataTablesService) { }

  ngOnInit() {
    this.dataTablesService.initDatatables();
  }

  ngAfterViewInit(): void {
    const interval = setInterval( () => {
      this.datatablesPluginAdjustment();
      clearInterval(interval);
    }, 400);
  }

  private datatablesPluginAdjustment() {
    this.dataTablesService.datatablesPluginAdjustment('trHead');
  }
}
