import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Web3ModuleService } from '@dsks/angular-web3-module';
import { box, randomBytes } from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';
import { API_URL } from '../../app.constants';
import { Book } from '../../components/book/book';

const CryptoJS = require("crypto-js");

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {

  buyEventSubject = new Subject();

  loadingEventSubject = new Subject();

  clientKeyPair: any;
  serverPublicKey: string|undefined;
  lastNonce: Uint8Array|any;

  working = false;

  constructor(private http: HttpClient, private web3ModuleService: Web3ModuleService) { 
    this.clientKeyPair = this.generateKeyPair();
  }

  login(callback: Function): void{   
    const response = this.http.get<any>(API_URL+"/log", {observe: 'response'});
    response.subscribe((data:any) => {
      this.serverPublicKey = data.body.message;
      callback();
    });
  }

  getTokenMetadata(URI: string, callback: Function): void{   

    var tokenHeaders = new HttpHeaders();

    let token = "Basic " + btoa('2KbwfnbshnHHqYGNRt7fxsxMD3j:226159419756717a604606bea3d7ef0f');
    var tokenHeaders = tokenHeaders.set('Authorization', token);

    // const response = this.http.get<any>('https://ipfs.io/ipfs/'+URI.substring(7), {observe: 'response'});
    // const response = this.http.post<any>('http://51.68.230.244:5001/api/v0/cat?arg='+URI.substring(7), "", {observe: 'response'});
    const response = this.http.post<any>('https://ipfs.infura.io:5001/api/v0/cat?arg='+URI.substring(7), "", {headers: tokenHeaders, observe: 'response'});
    response.subscribe((response:any) => {
      callback(response.body);
    });
  }

  encryptFile(book: Book, callback: Function): void{
      this.web3ModuleService.userWeb3.eth.personal.sign(this.generateSignHash(book), this.web3ModuleService.currentUserAccount, "SECRET").then((signature: any) => {
        if(this.serverPublicKey != undefined){
          const serverkey = decodeBase64(this.serverPublicKey.trim())
          const sharedA = box.before(serverkey, this.clientKeyPair.secretKey);
          const encrypted = this.encrypt(sharedA, signature);
      
          var body =  JSON.parse('{"message" : "'+encrypted+'", "public" : "'+encodeBase64(this.clientKeyPair.publicKey)+'", "book" : "'+book.id+'"}');
  
          const response = this.http.post<any>(API_URL+"/encrypt_file", body, {observe: 'response'});
          response.subscribe((data:any) => {
            callback(data);
          });
        }    
      }).catch((e: any) => {
        callback(null);
        console.error();
      });       
  }

  requestBuy(cid: string, callback: Function): void{
    var smartContract = this.web3ModuleService.getSmartContract("DsBooks");
    if(smartContract != undefined){
      smartContract.ethContract.methods.mint(this.web3ModuleService.currentUserAccount, cid).send({from: this.web3ModuleService.currentUserAccount, value: 100000000000000000}).then((response: any) => {
        this.working = false;
        this.buyEventSubject.next(response);
        callback(true);        
      }).catch((e: any) => {
        callback(false);        
      });
    }
  }

  downloadPDF(book: Book, callback: Function): void{
    var tokenHeaders = new HttpHeaders();

    let token = "Basic " + btoa('2KbwfnbshnHHqYGNRt7fxsxMD3j:226159419756717a604606bea3d7ef0f');
    var tokenHeaders = tokenHeaders.set('Authorization', token);
    tokenHeaders.set('Content-Type', 'text/plain');

    // const response = this.http.get<any>('https://ipfs.io/ipfs/'+URI.substring(7), {observe: 'response'});
    // const response = this.http.post<any>('http://51.68.230.244:5001/api/v0/cat?arg='+URI.substring(7), "", {observe: 'response'});
    const response = this.http.post<any>('https://ipfs.infura.io:5001/api/v0/cat?arg='+book.pdf.substring(7), "", {headers: tokenHeaders, responseType: 'text' as 'json', observe: 'response'});
    response.subscribe((response:any) => {
      this.web3ModuleService.userWeb3.eth.personal.sign(this.generateSignHash(book), this.web3ModuleService.currentUserAccount, "SECRET").then((signature: any) => {
        var bytes  = CryptoJS.AES.decrypt(atob(String(response.body).substring(37)), signature);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        var data = this.convertBase64ToPDF(originalText);

        callback(data);
      }).catch((e: any) => {
        callback(null);
        console.error();
      });
    });   
  }

  downloadBSO(bsoURL: string, callback: Function): void{
    var tokenHeaders = new HttpHeaders();

    let token = "Basic " + btoa('2KbwfnbshnHHqYGNRt7fxsxMD3j:226159419756717a604606bea3d7ef0f');
    var tokenHeaders = tokenHeaders.set('Authorization', token);
    tokenHeaders.set('Content-Type', 'audio/mpeg');

    // const response = this.http.get<any>('https://ipfs.io/ipfs/'+URI.substring(7), {observe: 'response'});
    // const response = this.http.post<any>('http://51.68.230.244:5001/api/v0/cat?arg='+URI.substring(7), "", {observe: 'response'});
    const response = this.http.post<any>('https://ipfs.infura.io:5001/api/v0/cat?arg='+bsoURL.substring(7), "", {headers: tokenHeaders, responseType: 'blob' as 'json', observe: 'response'});
    response.subscribe((response:any) => {
      callback(response.body);
    });   
  }

  getWinner(callback: Function): void{   
    const response = this.http.get<any>(API_URL+"/winner", {observe: 'response'});
    response.subscribe((data:any) => {
      callback(data.body.message);
    });
  }

  convertBase64ToPDF(pdf: string) {
    const byteString = atob(pdf.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new Blob([ab], {
      type: 'application/pdf',
    });
    return newBlob;
  };

  generateSignHash(book: Book): string{
    var message = "Book:\n" + book.title + "\n"+ book.volume + "\n\nAccount:\n" + this.web3ModuleService.currentUserAccount;
    var hash = this.web3ModuleService.userWeb3.utils.utf8ToHex(message);
    return hash;
  }

  generateKeyPair = () => {
    return box.keyPair();
  };

  newNonce = () => {
    return randomBytes(box.nonceLength);
  };  

  encrypt = (
    secretOrSharedKey: Uint8Array,
    json: any,
    key?: Uint8Array
  ) => {
    const nonce = this.newNonce();
    this.lastNonce = nonce;
    const messageUint8 = decodeUTF8(JSON.stringify(json));
    const encrypted = key
      ? box(messageUint8, nonce, key, secretOrSharedKey)
      : box.after(messageUint8, nonce, secretOrSharedKey);
  
    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);
  
    const base64FullMessage = encodeBase64(fullMessage);
    return base64FullMessage;
  };
  
  decrypt = (
    secretOrSharedKey: Uint8Array,
    messageWithNonce: string,
    key?: Uint8Array
  ) => {
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(
      box.nonceLength,
      messageWithNonce.length
    );
  
    const decrypted = key
      ? box.open(message, nonce, key, secretOrSharedKey)
      : box.open.after(message, nonce, secretOrSharedKey);
  
    if (!decrypted) {
      throw new Error('Could not decrypt message');
    }
  
    const base64DecryptedMessage = encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
  };

  getBuyEventSubject(){
    return this.buyEventSubject.asObservable();
  }

  getLoadingEventSubject(){
    return this.loadingEventSubject.asObservable();
  }
}
