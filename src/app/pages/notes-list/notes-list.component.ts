import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

notes:Note[] =new Array<Note>();

  constructor(private notesService:NotesService) { }

  ngOnInit(): void {
  this.notes=this.notesService.getAll();

  }

}
