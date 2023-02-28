import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IVoice } from './voice';
@Injectable({
  providedIn: 'root'
})
export class TtsService {

  constructor(private httpClient:HttpClient) {
   }

   callTTS(value:string,ssml:boolean,currentVoice:string){
    console.log("CALLING TTS!");
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
    return this.httpClient.post(this.buildTTSRequest("/v1/text:synthesize"), request);
   }

   getVoiceList(){
    console.log("GETTING VOICES!");
    return this.httpClient.get(this.buildTTSRequest("/v1/voices"));
   }

   buildTTSRequest(method : string){
    var url = environment.url + method;
    if (environment.apiKey)
    {
      url = url + "?key=" + environment.apiKey
       }

      return url
   }
}
