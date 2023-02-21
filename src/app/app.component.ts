import { Component, OnInit } from '@angular/core';
import { TtsService } from './tts.service';
import { IVoice } from './voice';
import {FormControl} from '@angular/forms';
import { startWith } from 'rxjs';
import { map,Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  autoCompleteControl = new FormControl('');
  title = 'TTS Frontend';
  audio: any;
  voices: IVoice[] = [];
  filteredVoices: Observable<IVoice[]>;
  ssml = false;
  audiocontent:any;
  message = ""
  currentVoice = ''
  constructor(private tts: TtsService) {
  }

  ngOnInit(): void {
   
    this.tts.getVoiceList().subscribe(
      {
        next: (result: any) => {
          console.log("FETCHED VOICE LIST");
          this.voices = result.voices;
          this.filteredVoices = this.autoCompleteControl.valueChanges.pipe(
            startWith(''),
            map(voice => (voice ? this._filter(voice) : this.voices.slice())),
          );
        },
        error: (error) => {
          console.error(error.error.error.message)
        }
      }
    );
  }

  sendRequest(value: string) {
    console.log("SENDING REQUEST!")
    console.log(value);
    this.message = "Request currently being processed."
    this.tts.callSTT(value, this.ssml,this.currentVoice).subscribe(
      {
        next: (result) => { console.log(result); this.message = "TTS Request succesful."; this.audio = result;this.audiocontent =  "data:audio/mp3;base64," + this.audio.audioContent; },
        error: (error) => { console.error(error.error.error.message); this.message = "An Error has occured, please see logs for details."; }
      });
  }

  playAudio() {
    let audioPlayer = new Audio();
    audioPlayer.src = this.audiocontent;
    audioPlayer.play();
  }

  check(event: any) {
    this.ssml = event.checked;

  }

  private _filter(value: string): IVoice[] {
    const filterValue = value.toLowerCase();

    return this.voices.filter(voice => voice.name.toLowerCase().includes(filterValue));
  }

}
