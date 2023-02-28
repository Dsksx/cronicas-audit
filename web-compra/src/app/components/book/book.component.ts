import { Component, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Web3ModuleService } from '@dsks/angular-web3-module';
import { ApicallsService } from '../../services/apicalls/apicalls.service';
import { Book } from './book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.less']
})
export class BookComponent implements OnInit {

  @ViewChild('sign_button') sign_button: any;
  @ViewChild('mint_button') mint_button: any;
  @ViewChild('link') link: any;
  @ViewChild('link_free') link_free: any;
  @ViewChild('loader') loader: any;

  @Input() book: Book = new Book();

  cid: string|undefined;

  downloadedPDF: any;

  downloadTextButton: string = "Firmar para descargar";

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private web3ModuleService: Web3ModuleService, private apiCalls: ApicallsService, private _snackBar: MatSnackBar, private renderer: Renderer2) {
    this.apiCalls.getLoadingEventSubject().subscribe((data: any) => {
        if(data){
          this.renderer.removeClass(this.loader.nativeElement, 'hide');
        }else{
          if(this.loader != undefined){
            this.renderer.addClass(this.loader.nativeElement, 'hide');
          }
        }
    });
  }

  ngOnInit(): void {
  }

  signToMint(){
    if(this.web3ModuleService.currentUserAccount != undefined && this.web3ModuleService.currentUserAccount != null && this.book != undefined){
      if(!this.apiCalls.working){
        this.apiCalls.working = true;
        this.renderer.addClass(this.sign_button.nativeElement, 'hide');
        this.renderer.addClass(this.mint_button.nativeElement, 'hide');
        this.renderer.removeClass(this.loader.nativeElement, 'hide');
        this.apiCalls.encryptFile(this.book, (data: any) => {
          if(data == null){
            this.renderer.addClass(this.mint_button.nativeElement, 'hide');
            this.renderer.addClass(this.loader.nativeElement, 'hide');
            this.renderer.removeClass(this.sign_button.nativeElement, 'hide');
            this.apiCalls.working = false;
          }else {
            // this.apiCalls.requestBuy(data.body.message, (data: any) => {
            //   this.renderer.removeClass(this.buy_button.nativeElement, 'hide');
            //   this.renderer.addClass(this.loader.nativeElement, 'hide');
            //   this.apiCalls.working = false;
            // });

            this.cid = data.body.message;

            this.renderer.removeClass(this.mint_button.nativeElement, 'hide');
            this.renderer.addClass(this.loader.nativeElement, 'hide');
            this.apiCalls.working = false;
          }
          
        });    
      }      
    }else{
      this._snackBar.open("Conecte con su cuenta", "X", {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['top_snackbar']
      });
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }
  }

  mint(): void{
    if(this.web3ModuleService.currentUserAccount != undefined && this.web3ModuleService.currentUserAccount != null && this.book != undefined){
      if(!this.apiCalls.working){
        this.apiCalls.working = true;
        this.renderer.addClass(this.mint_button.nativeElement, 'hide');
        this.renderer.removeClass(this.loader.nativeElement, 'hide');
        
        if(this.cid != undefined){
          this.apiCalls.requestBuy(this.cid, (data: any) => {
            if(data){
              this.renderer.addClass(this.loader.nativeElement, 'hide');
              this.apiCalls.working = false;
            }else{
              this.renderer.removeClass(this.mint_button.nativeElement, 'hide');
              this.renderer.addClass(this.loader.nativeElement, 'hide');
              this.apiCalls.working = false;
            }
          });  
        }        
      }      
    }else{
      this._snackBar.open("Conecte con su cuenta", "X", {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['top_snackbar']
      });
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }
  }

  download(){
    if(this.book == undefined || this.downloadTextButton == "Descargar") return;
    if(this.web3ModuleService.currentUserAccount != undefined && this.web3ModuleService.currentUserAccount != null){
      if(!this.apiCalls.working){
        this.apiCalls.working = true;
        this.renderer.addClass(this.link.nativeElement, 'hide');
        this.renderer.removeClass(this.loader.nativeElement, 'hide');
        this.apiCalls.downloadPDF(this.book, (data: any) => {
          if(data == null){
            this.renderer.addClass(this.loader.nativeElement, 'hide');
            this.renderer.removeClass(this.link.nativeElement, 'hide');
            this.apiCalls.working = false;
          }else{
            if (this.downloadedPDF !== null) {
              window.URL.revokeObjectURL(this.downloadedPDF);
            }
      
            this.downloadedPDF = window.URL.createObjectURL(data);
            this.link.nativeElement.href = this.downloadedPDF;
            this.link.nativeElement.download = this.book.title + " - " + this.book.volume + ".pdf";
            this.downloadTextButton = "Descargar";            
            this.link.nativeElement.click();
    
            this.renderer.addClass(this.loader.nativeElement, 'hide');
            this.renderer.removeClass(this.link.nativeElement, 'hide');
            this.apiCalls.working = false;
          }        
        });
      }      
    }else{
      this._snackBar.open("Conecte con su cuenta", "X", {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['top_snackbar']
      });
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }
  }

  freeDownload(){
    this.link_free.nativeElement.href = this.book.free_link;
    this.link_free.nativeElement.download = this.book.title + " - " + this.book.volume + ".pdf";
  }
  
}
