import { Component, Input, OnInit } from '@angular/core';
import { Youth } from '../../Model/Youth';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SecurityContext } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';

@Component({
  selector: 'app-youthsignup-details',
  standalone: true,
  imports: [CommonModule, TabViewModule, ReactiveFormsModule, MatTabsModule,PdfViewerModule],
  templateUrl: './Detailsyouth.component.html',
  styleUrls: ['./Detailsyouth.component.css'],
})
export class YouthSignupDetailsComponent implements OnInit {
  isPdfModalOpen = false;
  currentPdfUrl: string | null = null;

  @Input() youthId!: number; // Accept ID from parent
  public youth: Youth | undefined;

  constructor(private youthService: YouthServiceService,     private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    if (this.youthId) {
      this.fetchYouthDetails();
    }
  }

  ngOnChanges(): void {
    if (this.youthId) {
      this.fetchYouthDetails();
    }
  }


  private fetchYouthDetails(): void {
    this.youthService.getYouthById(this.youthId).subscribe({
      next: (data: Youth) => {
        this.youth = data;
      },
      error: (err) => {
        console.error('Error fetching youth data:', err);
      },
    });
  }
  openPdfModal(fileUrl: string | null | undefined): void {
    if (!fileUrl) {
      console.warn("No file available for preview.");
      return;
    }
    // First, bypass security to get a SafeResourceUrl
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    // Then, sanitize it to get a string
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    if (sanitizedUrl) {
      this.currentPdfUrl = sanitizedUrl;
      this.isPdfModalOpen = true;
    } else {
      console.error("Sanitization returned null for URL:", fileUrl);
    }
  }

  closePdfModal(): void {
    this.isPdfModalOpen = false;
    this.currentPdfUrl = null;
  }

}
