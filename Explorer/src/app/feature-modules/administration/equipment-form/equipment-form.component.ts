import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnChanges {

  @Output() equimpentUpdated = new EventEmitter<null>();
  @Input() equipment: Equipment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService) {
  }

  ngOnChanges(): void {
    this.equipmentForm.reset();
    if(this.shouldEdit) {
      this.equipmentForm.patchValue(this.equipment);
    }
  }

  equipmentForm = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
  });
  
  addEquipment(): void {
    const equipment: Equipment = {
      Name: this.equipmentForm.value.Name || "",
      Description: this.equipmentForm.value.Description || "",
    };
    this.service.addEquipment(equipment).subscribe({
      next: () => { this.equimpentUpdated.emit() }
    });
  }

  updateEquipment(): void {
    const equipment: Equipment = {
      Name: this.equipmentForm.value.Name || "",
      Description: this.equipmentForm.value.Description || "",
    };
    equipment.Id = this.equipment.Id;
    this.service.updateEquipment(equipment).subscribe({
      next: () => { this.equimpentUpdated.emit();}
    });
  }
}
