import {Injectable} from '@angular/core';
import {FileReader} from '../../../confs/file-reader';
import {SubItemComponent} from '../../../item/list-item/item/sub-item/sub-item.component';
import {isUndefined} from 'util';


@Injectable({
  providedIn: 'root'
})
export class DataTablesService {

  constructor() { }

  initDatatables() {
    FileReader.readJavascriptDatatablesFiles();
  }

  datatablesPluginAdjustment(trHeadSortingId: string, modalToFocusId?: string) {
    let modal;
    if (modalToFocusId) {
      modal = $('#' + modalToFocusId).get()[0];
      modal.addEventListener('focus', event);
    } else {
      event();
    }

    function event() {
      // @ts-ignore
      $('#dataTable').addClass('w-100').DataTable().columns.adjust();

      // ******************************************************************* HAUT-GAUCHE - SELECTION DU NOMBRE D'ITEM A AFFICHER
      const div = document.getElementById('dataTable_length');
      const label = div.getElementsByTagName('label');
      const select = div.getElementsByTagName('select');
      label[0].className = label[0].className + ' mt-1 d-inline-flex align-items-center';
      select[0].className = select[0].className + ' mr-2 ml-2';

      // ******************************************************************* HAUT-DROIT - INPUT 'RECHERCHER'
      const div0 = document.getElementById('dataTable_filter');
      const label0 = div0.getElementsByTagName('label');
      const input0 = div0.getElementsByTagName('input');
      input0[0].className = 'form-control mb-3';
      input0[0].placeholder = 'Rechercher ...';
      div0.insertBefore(input0[0], label0[0]);
      div0.removeChild(label0[0]);

      // ******************************************************************* BAS-GAUCHE - INFO NOMBRE D'ITEMS AFFICHES
      const div2 = document.getElementById('dataTable_info');
      div2.className = div2.className + ' small mt-3';

      // ******************************************************************* BAS-DROIT - PAGINATION
      const div1 = document.getElementById('dataTable_paginate');
      const ul1 = div1.getElementsByTagName('ul');
      const trHeadSorting = document.getElementById(trHeadSortingId);
      div1.className = div1.className + ' text-right mt-1 mr-1';
      ul1[0].className = ul1[0].className + ' d-inline-flex';
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(ul1[0].parentElement, 'click');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(select[0], 'click');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(input0[0], 'input');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(trHeadSorting, 'click');
      function addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(listener: HTMLElement, eventName: string) {
        listener.addEventListener(eventName, () => {
          ul1[0].className += ' d-inline-flex';
        });
      }

      if (modalToFocusId) {
        modal.removeEventListener('focus', event);
      }
    }
  }

  refreshDataTable(subitem: SubItemComponent, deletetion: boolean) {
     // @ts-ignore
      const table0 = $('#dataTable').DataTable();
      const page = table0.page();
      const length = table0.page.len();
      const search = table0.search();

      const interval = setInterval(() => {
      $('#dataTable_length').parent().parent().remove();
      $('#dataTable_info').parent().parent().remove();
      this.initDatatables();

      const interval0 = setInterval(() => {
        // @ts-ignore
        const table = $('#dataTable').DataTable();
        table.page.len(length);
        table.page( !isUndefined(table.page.info()) && table.page.info().recordsDisplay % length === 0 && deletetion ? page - 1 : page);
        table.search(search);
        table.draw(false);
        this.datatablesPluginAdjustment(
            'trHead' + subitem.id + subitem.getClassNameFirstLetter());

        clearInterval(interval0);
      }, 200);

      clearInterval(interval);
    }, 200);
  }

}
