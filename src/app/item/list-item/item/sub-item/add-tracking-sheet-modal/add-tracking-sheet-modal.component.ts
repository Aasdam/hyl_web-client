import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../../item.service';
import {Router} from '@angular/router';
import {DataTablesService} from '../../../../../shared/services/datatables/data-tables.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-add-tracking-sheet-modal',
  templateUrl: './add-tracking-sheet-modal.component.html',
  styleUrls: ['./add-tracking-sheet-modal.component.scss']
})
export class AddTrackingSheetModalComponent implements OnInit {

  @Input() subitem: SubItemComponent;

  private addTrackingSheetForm: FormGroup;
  private minlengthComment = '15';
  private maxlengthComment = '150';

  private disabledButton;

  constructor(private formBuilder: FormBuilder,
              private itemService: ItemService,
              private router: Router,
              private dataTablesService: DataTablesService) { }

  ngOnInit() {
    this.initTrackingSheetForm();
  }

  initTrackingSheetForm() {
    this.disabledButton = false;
    this.addTrackingSheetForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(Number(this.minlengthComment))]]
    });
  }

  onSubmitAddTrackingSheetForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;

      // Evite bug lors de chargement de 'initDatable()' dans
      // 'dataTablesService.refreshDataTableBis()' si la recherche n'affiche aucun résultat
      // @ts-ignore
      const table = $('#dataTable').DataTable();
      if (!isUndefined(table.page.info()) && table.page.info().recordsDisplay === 0) {
        table.search('').draw(false);
      }

      this.itemService.createTrackingSheet(this.subitem, this.addTrackingSheetForm.controls.comment.value).then(
          value => {
            this.initTrackingSheetForm();
            const interval0 = setInterval(() => {
              this.dataTablesService.refreshDataTable(this.subitem, false);
              clearInterval(interval0);
            }, 200);
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    }
  }
}
