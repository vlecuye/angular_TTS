import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IVoice } from './voice';
@Injectable({
  providedIn: 'root'
})
export class TtsService {

  constructor(private httpClient:HttpClient) {
   }

   callTTS(value:string,ssml:boolean,currentVoice:string){
    console.log("CALLING TTS!");
    console.log(ssml);
    let languageCode = currentVoice.split('-',2).join('-');
    const request: any = {
      // Select the text to synthesize
      // Select the language and SSML Voice Gender (optional)
      voice: { languageCode: languageCode, name: currentVoice },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3', speakingRate: 1.1 }
    };
    ssml ? request.input = {ssml:value} : request.input = {text:value};
    console.log(request);
    return this.httpClient.post("https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=",request);
   }

   getVoiceList(){
    console.log("GETTING VOICES!");
    return this.httpClient.get("https://texttospeech.googleapis.com/v1/voices?key=");
   }
}
