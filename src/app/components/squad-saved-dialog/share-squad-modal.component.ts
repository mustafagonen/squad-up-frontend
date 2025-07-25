import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mg-share-squad-modal',
  templateUrl: './share-squad-modal.component.html',
  styleUrls: ['./share-squad-modal.component.scss'],
  imports: [
    SharedModule,
  ],
  standalone: true
})
export class MgShareSquadModalComponent {
  @ViewChild('shareLinkInput') shareLinkInput!: ElementRef;

  @Input() public generatedShareLink: any;
  copySuccess: boolean = false;


  constructor(
    public _dialogRef: MatDialogRef<MgShareSquadModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this._dialogRef.close();
  }

  copyLinkToClipboard(): void {
    if (this.shareLinkInput && this.generatedShareLink) {
      this.shareLinkInput.nativeElement.select();
      this.shareLinkInput.nativeElement.setSelectionRange(0, this.generatedShareLink.length);

      try {
        const successful = document.execCommand('copy');
        this.copySuccess = successful;
        if (successful) {
          console.log('Link başarıyla kopyalandı:', this.generatedShareLink);
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000);
        } else {
          console.error('Link kopyalanamadı.');
        }

        setTimeout(() => {
          this.closeModal();
        }, 2500);


      } catch (err) {
        console.error('Kopyalama işlemi desteklenmiyor veya başarısız:', err);
      }
    }
  }

  async copyLinkToClipboardModern(): Promise<void> {
    if (this.generatedShareLink) {
      try {
        await navigator.clipboard.writeText(this.generatedShareLink);
        this.copySuccess = true;
        console.log('Link başarıyla kopyalandı (Modern API):', this.generatedShareLink);
        setTimeout(() => {
          this.copySuccess = false;
        }, 2500);
      } catch (err) {
        console.error('Link kopyalanamadı (Modern API):', err);
        this.copyLinkToClipboard();
      }
    }
  }
}