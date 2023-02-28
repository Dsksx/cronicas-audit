import { ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
import { Web3ModuleService } from '@dsks/angular-web3-module';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  @ViewChild('network') network: any;
  @ViewChild('network_text') network_text: any;

  networkText = 'Polygon (Mumbai)';

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private web3ModuleService: Web3ModuleService, private renderer: Renderer2, private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this.web3ModuleService.getWeb3EventSubject().subscribe((event: any) => {
      this.renderer.removeClass(this.network.nativeElement, 'error');
      this.networkText = 'Polygon (Mumbai)';
      this.cdr.detectChanges();
    });

    this.web3ModuleService.getWeb3ErrorSubject().subscribe((error) => {
      if(error === 'Wrong network!') {
        this.renderer.addClass(this.network.nativeElement, 'error');
        this.networkText = 'Cambie a Polygon (Mumbai)';
        this.cdr.detectChanges();
      }else if(error === 'Wrong network!(Click event)'){
        this.changeNetwork();
      }else if(error === 'MetaMask is not installed!'){
        this._snackBar.open("Necesitas MetaMask u otra billetera compatible", "X", {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: ['top_snackbar']
        });
      }
    });
  }

  changeNetwork() {
    this.web3ModuleService.forceChangeNetwork('80001');
  }
}
