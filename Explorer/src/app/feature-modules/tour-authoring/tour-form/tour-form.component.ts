import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';


@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnChanges{

  @Output() toursUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService) { }

  ngOnChanges(): void {
    this.tourForm.reset();
    if(this.shouldEdit) {
      const tourPatch = {
        Name: this.tour.Name || null,
        Description: this.tour.Description || null,
        Difficulty: this.tour.Difficulty?.toString() || null,
        Tags: this.tour.Tags || null
      };
      this.tourForm.patchValue(tourPatch);
    }
  }

  tourForm = new FormGroup({
    Name: new FormControl('',[Validators.required]),
    Description: new FormControl('',[Validators.required]),
    Difficulty: new FormControl('',[Validators.required]),
    Tags: new FormControl([] as string[], [Validators.required])
  });


  addTour(): void {
    console.log(this.tourForm.value);
    const tour: Tour = {
      Name: this.tourForm.value.Name || "",
      Description: this.tourForm.value.Description || "",
      Difficulty: parseInt(this.tourForm.value.Difficulty || "0"),
      Tags: this.tourForm.value.Tags ? this.tourForm.value.Tags : []
    };
    this.service.addTour(tour).subscribe({
      next: () => { this.toursUpdated.emit() }
    });
  }

  addTag(tag: string): void {
    const tagArray = this.tourForm.get('Tags');
    if (tagArray && tagArray.value) {
      const tags = tagArray.value;
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
        tagArray.setValue(tags);
      }
    }
    else if(this.shouldEdit == false){
      const tagArray: string[] = []; 
      if (tag) {
        tagArray.push(tag);
        this.tourForm.setControl('Tags', new FormControl(tagArray));
      }
    }
  }

  removeTag(index: number): void {
    const tagArray = this.tourForm.get('Tags');
    if (tagArray && tagArray.value) {
      const tags = tagArray.value;
      tags.splice(index, 1);
      tagArray.setValue(tags);
    }
  }
  
  updateTour(): void {
    const tour: Tour = {
      Name: this.tourForm.value.Name || "",
      Description: this.tourForm.value.Description || "",
      Difficulty: parseInt(this.tourForm.value.Difficulty || "0"),
      Tags: this.tourForm.value.Tags ? this.tourForm.value.Tags : []
    };

    this.tour.Name = tour.Name;
    this.tour.Description = tour.Description;
    this.tour.Difficulty = tour.Difficulty;
    this.tour.Tags = tour.Tags;

    this.service.updateTour(this.tour).subscribe({
      next: () => { this.toursUpdated.emit();}
    });
  }

}
