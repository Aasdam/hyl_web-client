import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {FileReader} from '../../../../../confs/file-reader';
import {ItemService} from '../../../../item.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {DataTablesService} from '../../../../../shared/services/datatables/data-tables.service';

@Component({
  selector: 'app-tracking-sheet',
  templateUrl: './tracking-sheet.component.html',
  styleUrls: ['./tracking-sheet.component.scss']
})
export class TrackingSheetComponent implements OnInit, AfterViewInit {

  @Input() subitem: SubItemComponent;

  constructor(private itemService: ItemService,
              private router: Router,
              private datePipe: DatePipe,
              private dataTablesService: DataTablesService) { }

  ngOnInit() {
    this.dataTablesService.initDatatables();
    FileReader.readJavascriptJqueryConfirmFile();
  }

  ngAfterViewInit(): void {
    if (this.subitem.trackingSheets && this.subitem.trackingSheets.length > 0) {
      this.datatablesPluginAdjustment();
    }
  }

  sortDateTable() {
    $('#thDate' + this.subitem.id + this.subitem.getClassNameFirstLetter()).get()[0].click();
  }

  datatablesPluginAdjustment() {
    this.dataTablesService.datatablesPluginAdjustment(
        'trHead' + this.subitem.id + this.subitem.getClassNameFirstLetter(),
        'expandSubItemModal' + this.subitem.id);
  }

  onCLickDeleteTrackingSheet(trackingSheet: {id: bigint, date: Date, comment: string}) {
    const trackingSheetComponent: TrackingSheetComponent = this;
    // @ts-ignore
    $.confirm({
      title: ('Confirmer la suppression du commentaire en date du '
              + trackingSheetComponent.datePipe.transform(trackingSheet.date, 'dd/MM/yyyy')),
      content: trackingSheet.comment,
      type: 'red',
      typeAnimated: true,
      columnClass: 'large',
      buttons: {
        cancel: {
          text: 'Annuler',
          btnClass: 'btn-danger'
        },
        confirm: {
          text: 'Supprimer le commentaire',
          btnClass: 'btn-primary',
          action() {
            trackingSheetComponent.deleteTrackingSheets([trackingSheet]);
          }
        }
      }
    });
  }

  onClickDeleteAllTrackingSheet() {
    const trackingSheetComponent: TrackingSheetComponent = this;
    // @ts-ignore
    $.confirm({
      title: 'Confirmer la suppression',
      content: 'Attention ! Tous les commentaires de ' + this.subitem.reference
          + ' seront supprimés et ne pourront plus être récupérés par la suite.',
      type: 'red',
      typeAnimated: true,
      columnClass: 'large',
      buttons: {
        cancel: {
          text: 'Annuler',
          btnClass: 'btn-danger'
        },
        confirm: {
          text: 'Supprimer tous les commentaires',
          btnClass: 'btn-primary',
          action() {
            if (trackingSheetComponent.subitem.trackingSheets && trackingSheetComponent.subitem.trackingSheets.length > 0) {
              trackingSheetComponent.deleteTrackingSheetsByIdsSubItem(trackingSheetComponent.subitem.id);
            }
          }
        }
      }
    });
  }

  deleteTrackingSheets( trackingSheets: {id: bigint, date: Date, comment: string}[] ) {
    const refresh = this.subitem.trackingSheets.length !== 1;
    this.itemService.deleteTrackingSheets(trackingSheets).then(
      () => {
        if (refresh) { this.refreshDataTable(); }
      },
      reason => {
        console.log(reason);
        this.router.navigate(['/erreur']);
    });
  }

  deleteTrackingSheetsByIdsSubItem( id: bigint ) {
    this.itemService.deleteTrackingSheetsByIdSubItem(id).catch(
       reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        });
  }

  private refreshDataTable() {
     this.dataTablesService.refreshDataTable(this.subitem, true);
  }
}
