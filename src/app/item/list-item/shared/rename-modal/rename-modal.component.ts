import {Component, Input, OnInit} from '@angular/core';
import {CategoryComponent} from '../../category/category.component';
import {ItemComponent} from '../../item/item.component';
import {AsyncValidatorFn, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../item.service';
import {Router} from '@angular/router';
import {CheckAtomicCategoryName} from '../../../../shared/form-validators/async/atomic-category-name.async-validator';
import {CheckAtomicItemName} from '../../../../shared/form-validators/async/atomic-item-name.async-validator';
import {SubItemComponent} from '../../item/sub-item/sub-item.component';
import {CheckAtomicSubItemRef} from '../../../../shared/form-validators/async/atomic-subitem-ref.async-validator';
import {CheckNoWiteSpace} from '../../../../shared/form-validators/sync/no-whitespace.validator';
import {CharacterRepetition} from '../../../../shared/form-validators/sync/character-repetition.validator';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.scss']
})
export class RenameModalComponent implements OnInit {

  @Input() whoRename: CategoryComponent | ItemComponent | SubItemComponent;

  private renameForm: FormGroup;
  private disabledButton;

  private maxlengthCategoryName = '15';
  private minlengthCategoryName = '3';
  private maxlengthItemName = '15';
  private minlengthItemName = '3';
  private minlengthSubItemReference = '6';
  private maxlengthSubItemReference = '15';

  private minlength = '';
  private maxlength = '';
  private validators: Validators[] = [];
  private asyncValidators: AsyncValidatorFn[] = [];

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initParameters();
    this.initRenameForm();
  }

  initParameters() {
    if ( this.whoRename instanceof CategoryComponent) {
      this.minlength = this.minlengthCategoryName;
      this.maxlength = this.maxlengthCategoryName;
      this.validators = [Validators.required, Validators.minLength(Number(this.minlength)), CheckNoWiteSpace(), CharacterRepetition(3)];
      this.asyncValidators = [CheckAtomicCategoryName(this.itemService)];
    } else if ( this.whoRename instanceof ItemComponent) {
      this.minlength = this.minlengthItemName;
      this.maxlength = this.maxlengthItemName;
      this.validators = [Validators.required, Validators.minLength(Number(this.minlength)), CheckNoWiteSpace(), CharacterRepetition(3)];
      this.asyncValidators = [CheckAtomicItemName(this.itemService)];
    } else if ( this.whoRename instanceof SubItemComponent) {
      this.minlength = this.minlengthSubItemReference;
      this.maxlength = this.maxlengthSubItemReference;
      this.validators = [Validators.required, Validators.minLength(Number(this.minlength)), CheckNoWiteSpace(), CharacterRepetition(3)];
      this.asyncValidators = [CheckAtomicSubItemRef(this.itemService)];
    }
  }

  initRenameForm() {
    this.disabledButton = false;
    this.renameForm = this.formBuilder.group({
      name: ['', this.validators, this.asyncValidators]
    });
  }

  onSubmitRenameForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      if (this.whoRename instanceof CategoryComponent) {
        this.itemService.renameCategory(this.whoRename, this.renameForm.controls.name.value).then(
            value => {
              this.initRenameForm();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else if (this.whoRename instanceof ItemComponent) {
        this.itemService.renameItem(this.whoRename, this.renameForm.controls.name.value).then(
            () => {
              this.initRenameForm();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else if (this.whoRename instanceof SubItemComponent) {
        this.itemService.renameSubItem(this.whoRename, this.renameForm.controls.name.value).then(
            () => {
              this.initRenameForm();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else {
        this.router.navigate(['/erreur']);
      }
    }
  }

}
