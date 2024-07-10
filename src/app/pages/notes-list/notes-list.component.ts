import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

notes:Note[] =new Array<Note>();
filteredNotes:Note[] =new Array<Note>();

@ViewChild('filterInput') filterInputElRef :ElementRef<HTMLInputElement>

  constructor(private notesService:NotesService) { }

  ngOnInit(): void {
  this.notes=this.notesService.getAll();
  this.filteredNotes=this.notesService.getAll();

  }
  deleteNote(note:Note){
   let noteId =this.notesService.getId(note);
   this.notesService.delete(noteId);
   this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteUrl(note:Note){
    let noteId =this.notesService.getId(note);
    return noteId;
  }


  filter(query:string){
    query=query.toLowerCase().trim();
    let allResults:Note[]=new Array<Note>();
    let terms:string[]= query.split('');
    terms=this.removeDuplicates(terms);

    terms.forEach(term=>{
      let reuslts:Note[] =this.relevantNotes(term);
      allResults = [...allResults,...reuslts]
    });

    let uniqueResults =this.removeDuplicates(allResults);
    this.filteredNotes=uniqueResults;

    this.sortByRelevancy(allResults);
  }

removeDuplicates(arr:Array<any>) :Array<any>{
  let uniqueResults:Set<any> =new Set<any>();
  arr.forEach(e=>uniqueResults.add(e));

  return Array.from(uniqueResults);

}

relevantNotes(query:string) : Array<Note>{

  query=query.toLowerCase().trim();
  let relevantNotes = this.notes.filter(note =>{
    if(note.title && note.title.toLowerCase().includes(query)){
      return true;
    }
    if(note.body && note.body.toLowerCase().includes(query))
    return false;
  })
  return relevantNotes

}

sortByRelevancy(searchResults:Note[]){
  let noteCountObj:Object ={};
  searchResults.forEach(note =>{
    let noteId=this.notesService.getId(note);
    if(noteCountObj[noteId]) {
      noteCountObj[noteId] +=1;
    }else{
      noteCountObj[noteId] =1;
    }
    
  })

  this.filteredNotes =this.filteredNotes.sort((a:Note,b:Note)=>{
    let aId = this.notesService.getId(a);
    let bId=this.notesService.getId(b);

    let aCount = noteCountObj[aId];
    let bCount =noteCountObj[bId];

    return bCount - aCount;
  })

}

}
