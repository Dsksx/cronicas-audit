import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<any>();

  innerWidth: number = 0;
  innerHeight: number = 0;
  top: number = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setSizes();
  }

  setSizes() {
    var body = document.body,
    html = document.documentElement;

    this.innerHeight = body.scrollHeight + 47;
    this.innerWidth = body.scrollWidth;

    this.top = 40 + (this.innerWidth * 0.05) ;

    this.cdr.detectChanges();
  }

  close() {
    this.closeEvent.emit();
  }

  // Actualiza el tamaño del pop up al cambiar el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResizeEnd(event:any) {
    this.setSizes();
  }
  onResize(event:any) {
    this.setSizes();
  }
}
