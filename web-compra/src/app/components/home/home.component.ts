import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { Book } from '../book/book';
import { Web3ModuleService, Network } from '@dsks/angular-web3-module';
import { ApicallsService } from '../../services/apicalls/apicalls.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  @ViewChild('link_bso') link_bso: any;

  books: Book[] = [];
  bsoOwned = false;
  bso: any;

  showWelcome = false;
 
  constructor(private web3ModuleService: Web3ModuleService, private apiCalls: ApicallsService, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.books.push(new Book(1, "Crónicas de un marinero desahuciado", "Vol. I", "assets/Portada-01-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmYbfs4VcyTfu4XWyK7RkmEmSHZ5shJdyhbDzWXdwtaWKm"));
    this.books.push(new Book(2, "Crónicas de un marinero desahuciado", "Vol. II", "assets/Portada-02-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmVQsPPbDM22FW9asvw5rQoPhzG9N9TCfc2graJDdCWvzo"));
    this.books.push(new Book(3, "Crónicas de un marinero desahuciado", "Vol. III", "assets/Portada-03-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmXsM4wqwwCAfAMzsvYjZgoMRWEMhLLs8J7PuKJREbfnNP"));
    this.books.push(new Book(4, "Crónicas de un marinero desahuciado", "Vol. IV", "assets/Portada-04-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmYdNecqxGmt1FMRB1ZKCmqesbUrpWQ4kcG7zibERvAmEV"));
    this.books.push(new Book(5, "Crónicas de un marinero desahuciado", "Vol. V", "assets/Portada-05-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmUC6PtyRtBEupKxowzw2ij39An4C4yKanMmQrs1avjmrP"));
    this.books.push(new Book(6, "Crónicas de un marinero desahuciado", "Vol. VI", "assets/Portada-06-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmVzwZS7gynurxjhywrL39dYh5uxk5zJG2Sb3xMf5h7ipA"));
    this.books.push(new Book(7, "Crónicas de un marinero desahuciado", "Vol. VII", "assets/Portada-07-3D.webp", "https://cloudflare-ipfs.com/ipfs/Qmf5yESsd1FHnXQNnB791FQxHSWnqNY7wFy1uRRqZ4gBUT"));
    this.books.push(new Book(8, "Crónicas de un marinero desahuciado", "Vol. VIII", "assets/Portada-08-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmeG1Y7z2zTZ6iA9C6tNTjYqWtr74wHoaFQbuFrfLHCPZY"));
    this.books.push(new Book(9, "Crónicas de un marinero desahuciado", "Vol. IX", "assets/Portada-09-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmXfPfGJq8LtQXL4fN5uVUT2uRpMifycsUgWUpToZqpCMh"));
    this.books.push(new Book(10, "Crónicas de un marinero desahuciado", "Vol. X", "assets/Portada-10-3D.webp", "https://cloudflare-ipfs.com/ipfs/QmauuSLNaLvMawx3EMFuxw3vmEujEjZwKNPxLG9Q5obkFZ"));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Get server public key
    this.apiCalls.login(() => {
      // Suscribe to connect event
      this.web3ModuleService.getWeb3UserSubject().subscribe((user: any) => {
        if(user != null){
          this.books.forEach((book: Book) => {
            book.owned = false;
          });
          this.bso = window.URL.createObjectURL(new Blob());
          this.link_bso.nativeElement.href = "";
          this.link_bso.nativeElement.download = "";      

          this.bsoOwned = false;
          // Init smart contract
          this.web3ModuleService.addSmartContract('DsBooks', '0x0b93c743620A5a0afC807f08cf2e64532E6fC8A3', [{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "burn","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "string","name": "cid","type": "string"}],"name": "mint","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "address","name": "contractAddress","type": "address"}],"name": "setBSOContractAddress","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address payable","name": "payee","type": "address"}],"name": "withdrawPayments","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "admin","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "mintedBooks","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "tokensOf","outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}]);
          this.web3ModuleService.addSmartContract('DsAudios', '0xba83B007019AC9C69985B55c69487B75dCe1aDaD', [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "burn","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"}],"name": "mint","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "mintedAudios","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "tokensOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}]);
          this.setOwnedTokens();
          this.setOwnedBSO();
        }else{
          this.books.forEach((book: Book) => {
            book.owned = false;
          });
          this.cdr.detectChanges();
        }
      });

      // Init web3 module
      // this.web3ModuleService.web3InitSubject.next([new Network('137', 'Polygon Mainnet', 'MATIC', 'MATIC', 18, ['https://polygon-rpc.com/'])]);
      this.web3ModuleService.web3InitSubject.next([new Network('80001', 'Polygon testnet (Mumbai)', 'MATIC', 'MATIC', 18, ['https://matic-mumbai.chainstacklabs.com/'], ['https://mumbai.polygonscan.com/'])]);
      this.web3ModuleService.forceChangeNetwork('80001');

      // Suscribe to buy event
      this.apiCalls.getBuyEventSubject().subscribe(() => {
        this.setOwnedTokens();
        this.setOwnedBSO();
      });
    });

    if(window.scrollY == 0){
      this.showWelcome = true;
      this.cdr.detectChanges();
    }else{
      window.scroll({ 
        top: 0, 
        left: 0,
        behavior: 'smooth' 
      });
      setTimeout(() => {
        this.showWelcome = true;
        this.cdr.detectChanges();
      }, 500);
    }    
  }

  setOwnedTokens(){

    var smartContract = this.web3ModuleService.getSmartContract('DsBooks');
    
    if(smartContract != null && smartContract.ethContract != null){
      smartContract.ethContract.methods.tokensOf(this.web3ModuleService.currentUserAccount).call().then((tokens: any) => {
        var count = tokens.length;
        var i = 0;
        tokens.forEach((token: number) => {
          var smartContract = this.web3ModuleService.getSmartContract('DsBooks');
          if(smartContract != null && smartContract != undefined && smartContract.ethContract != null){
            smartContract.ethContract.methods.tokenURI(token).call().then((tokenURI: any) => {
              this.apiCalls.getTokenMetadata(tokenURI, (metadata: any) => {
                switch(metadata.attributes[0].value){
                  case "I":
                    this.books[0].owned = true;
                    this.books[0].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "II":
                    this.books[1].owned = true;
                    this.books[1].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "III":
                    this.books[2].owned = true;
                    this.books[2].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "IV":
                    this.books[3].owned = true;
                    this.books[3].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "V":
                    this.books[4].owned = true;
                    this.books[4].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "VI":
                    this.books[5].owned = true;
                    this.books[5].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "VII":
                    this.books[6].owned = true;
                    this.books[6].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "VIII":
                    this.books[7].owned = true;
                    this.books[7].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "IX":
                    this.books[8].owned = true;
                    this.books[8].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                  case "X":
                    this.books[9].owned = true;
                    this.books[9].pdf = metadata.pdf;
                    i++;
                    if(i == count -1) {
                      this.apiCalls.loadingEventSubject.next(false);
                      this.cdr.detectChanges();
                    }
                    break;
                }
              });
            });
          }      
        });
      });
    }          
  }

  setOwnedBSO(){
    var audiosSmartContract = this.web3ModuleService.getSmartContract('DsAudios');
    if(audiosSmartContract != null && audiosSmartContract.ethContract != null){
      audiosSmartContract.ethContract.methods.tokensOf(this.web3ModuleService.currentUserAccount).call().then((tokens: any) => {
        if(tokens > 0){
          this.downloadBSO();
        }
      });
    }      
  }

  downloadBSO(){
    var audiosSmartContract = this.web3ModuleService.getSmartContract('DsAudios');
    if(audiosSmartContract != null && audiosSmartContract.ethContract != null){
      audiosSmartContract.ethContract.methods.tokensOf(this.web3ModuleService.currentUserAccount).call().then((tokens: any) => {
        if(audiosSmartContract != null && audiosSmartContract.ethContract != null){
          audiosSmartContract.ethContract.methods.tokenURI(tokens[0]).call().then((tokenURI: any) => {
            this.apiCalls.getTokenMetadata(tokenURI, (metadata: any) => {
              this.apiCalls.downloadBSO(metadata.audio, (data: any) => {
                if (this.bso !== null) {
                  window.URL.revokeObjectURL(this.bso);
                }
          
                this.bso = window.URL.createObjectURL(data);
                this.link_bso.nativeElement.href = this.bso;
                this.link_bso.nativeElement.download = "crónicas_de_un_marinero_desahuciado_BSO.mp3";      

                this.bsoOwned = true;
                this.cdr.detectChanges();
              });
            });
          });
        }        
      });
    }      
  }

  closePopUp(){
    this.showWelcome = false;
    this.showWinner();
  }

  showWinner(){
    const horizontalPositionWinner: MatSnackBarHorizontalPosition = 'start';
    const verticalPositionWinner: MatSnackBarVerticalPosition = 'bottom';

    this.apiCalls.getWinner((winner: any) => {
      console.log(winner)
      this._snackBar.open(winner, "X", {
        duration: 0,
        horizontalPosition: horizontalPositionWinner,
        verticalPosition: verticalPositionWinner,
        panelClass: ['winner_snackbar']
      });
    });
  }

}
