import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { YouthTableComponent } from '../../Common/youth-table/youth-table.component';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';
import { PaymentService } from '../../Services/PaymentService/payment.service';
import { AttendanceService } from '../../Services/AttendanceService/attendance.service';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service'; import { finalize } from 'rxjs/operators';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, YouthTableComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  isGeneratingPayments = false;
  isCheckingPayments = false;
  paymentGenerationResult: any = null;
  eligibleYouths: any[] = [];
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  showErrorDetails = false;
  staticJobRequestId = 'J-93425324';
  activeAdminTab: string = 'working';
  constructor(
    private paymentService: PaymentService,
    private youthService: YouthServiceService,
    private cdr: ChangeDetectorRef,
    private jobRequestService: JobRequestService,
    private employerService: EmployerService,
    private attendanceService: AttendanceService,

  ) { }

  ngOnInit(): void {
    this.loadEligibleYouths(true);
  }


  setActiveTab(tab: 'working' | 'finished'): void {
    this.activeAdminTab = tab;
    this.loadEligibleYouths(tab === 'working');
    this.cdr.detectChanges();
  }
  loadEligibleYouths(workStatus: boolean): void {
    this.errorMessage = null;
    this.infoMessage = null;

    this.youthService.getYouthsByStatus('accepted', workStatus).subscribe({
      next: (youths) => {
        this.eligibleYouths = youths;
        if (youths.length === 0) {
          this.infoMessage = `No ${workStatus ? 'working' : 'finished'} youths found with accepted status.`;
        }
      },
      error: (err) => {
        console.error('Error loading eligible youths:', err);
        this.errorMessage =
          err.message || 'Failed to load eligible youths. Please try again.';
      },
    });
  }

  async generateAllPayments(): Promise<void> {
    if (this.eligibleYouths.length === 0) {
      this.errorMessage = 'No eligible youths found';
      return;
    }

    this.isGeneratingPayments = true;
    this.errorMessage = null;
    this.infoMessage = 'Preparing payment data...';

    try {

      const youthJobPairs = this.eligibleYouths.map((youth) => ({
        youthId: youth.id,
        jobRequestId: this.staticJobRequestId,
      }));


      if (!youthJobPairs.every((pair) => pair.youthId && pair.jobRequestId)) {
        throw new Error('Invalid youth-job pairs format');
      }

      this.infoMessage = 'Generating payments...';

      this.paymentService
        .generatePaymentsForMultipleYouth(youthJobPairs)
        .pipe(
          finalize(() => {
            this.isGeneratingPayments = false;
          })
        )
        .subscribe({
          next: (result) => {
            this.paymentGenerationResult = result;
            this.showPaymentResults(result);
          },
          error: (err) => {
            this.handlePaymentError(err);
          },
        });
    } catch (error) {
      this.isGeneratingPayments = false;
      this.errorMessage =
        error instanceof Error ? error.message : 'Failed to prepare payments';
      console.error('Payment preparation error:', error);
    }
  }

  private handlePaymentError(err: any): void {
    console.error('Payment error:', err);
    this.errorMessage = err.message || 'Payment generation failed';

    if (err.error) {
      if (err.error.failedPayments) {
        this.paymentGenerationResult = {
          failedPayments: err.error.failedPayments
        };

        const failedCount = err.error.failedPayments.length;
        this.errorMessage = `${failedCount} payments failed`;

        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      } else if (err.error.message) {
        this.errorMessage = err.error.message;
      }
    }
  }


  private async checkExistingPayments(
    pairs: any[]
  ): Promise<{ hasExisting: boolean; message: string }> {
    try {
      const youthIds = pairs.map((p) => p.youthId);
      const existingPayments = await this.paymentService
        .getPaymentsByYouthIds(youthIds)
        .toPromise();


      if (existingPayments && existingPayments.length > 0) {
        const existingIds = existingPayments.map((p) => p.youthId).join(', ');
        return {
          hasExisting: true,
          message: `These youths already have payments: ${existingIds}`,
        };
      }
      return { hasExisting: false, message: '' };
    } catch (error) {
      console.error('Check existing payments error:', error);
      return {
        hasExisting: false,
        message: 'Error checking for existing payments',
      };
    }
  }

  private showPaymentResults(result: any): void {
    const successCount = result.successfulPayments?.length || 0;
    const failedCount = result.failedPayments?.length || 0;

    if (successCount > 0) {
      this.infoMessage = `Successfully processed ${successCount} payments`;
    }

    if (failedCount > 0) {
      this.errorMessage = `${failedCount} payments failed`;
    }
  }

  toggleErrorDetails(): void {
    this.showErrorDetails = !this.showErrorDetails;
  }




  exportAllDataWithTemplate(): void {
    this.infoMessage = 'Export in progress...';
    this.errorMessage = null;
    if (!this.eligibleYouths || this.eligibleYouths.length === 0) {
      this.errorMessage = 'No eligible youth data available for export.';
      this.infoMessage = null;
      return;
    }

    const enrichedDataObservables = this.eligibleYouths.map((record: any) => {
      return this.jobRequestService.getJobRequestByYouthId(String(record.id)).pipe(
        catchError(err => {
          console.error('Error fetching jobRequest for youth', record.id, err);
          return of(null);
        }),
        switchMap(jobRequest => {
          record.jobRequest = jobRequest;
          if (jobRequest && jobRequest.employerId) {
            return this.employerService.getEmployerById(jobRequest.employerId).pipe(
              catchError(err => {
                console.error('Error fetching employer for youth', record.id, err);
                return of(null);
              }),
              map(employer => {
                record.employer = employer;
                return record;
              })
            );
          } else {
            record.employer = null;
            return of(record);
          }
        }),
        switchMap(record => {
          if (record.jobRequest && record.jobRequest.jobId) {
            return this.attendanceService.getAttendanceByYouthAndJob(String(record.id), String(record.jobRequest.jobId)).pipe(
              catchError(err => {
                console.error('Error fetching attendance for youth', record.id, err);
                return of(null);
              }),
              map(attRecords => {

                record.attendanceRecords = Array.isArray(attRecords) ? attRecords : (attRecords ? [attRecords] : []);
                return record;
              })
            );
          } else {
            record.attendanceRecords = [];
            return of(record);
          }
        }),
        switchMap(record => {
          return this.paymentService.getPaymentsByYouthId(String(record.id)).pipe(
            catchError(err => {
              console.error('Error fetching payments for youth', record.id, err);
              return of([]);
            }),
            map(payments => {
              record.payments = payments;
              return record;
            })
          );
        })
      );
    });

    forkJoin(enrichedDataObservables).subscribe(
      (enrichedData: any[]) => {
        this.exportToExcel(enrichedData);
      },
      err => {
        console.error('Error enriching data', err);
        this.errorMessage = 'Failed to enrich data for export.';
        this.infoMessage = null;
      }
    );
  }




  exportToExcel(data: any[]): void {
    fetch('assets/final mastersheet.xlsx')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }
        return response.arrayBuffer();
      })
      .then(templateData => {
        const workbook = new Workbook();
        return workbook.xlsx.load(templateData).then(() => workbook);
      })
      .then(workbook => {
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          throw new Error('Worksheet with index 1 not found in the template.');
        }
        const startRow = 3;

        data.forEach((record, index) => {
          const rowNumber = startRow + index;
          const row = worksheet.getRow(rowNumber);


          let dobDate: Date | null = null;
          if (record.dob) {
            dobDate = new Date(record.dob);
            if (isNaN(dobDate.getTime())) { dobDate = null; }
          }
          const dayOfBirth = dobDate ? dobDate.getDate().toString().padStart(2, '0') : "";
          const mob = dobDate ? (dobDate.getMonth() + 1).toString() : "";
          const yob = dobDate ? dobDate.getFullYear().toString() : "";
          let dobFormatted = "";
          if (dobDate) {
            const d = dobDate.getDate().toString().padStart(2, '0');
            const m = (dobDate.getMonth() + 1).toString().padStart(2, '0');
            const y = dobDate.getFullYear();
            dobFormatted = `${d}/${m}/${y}`;
          }
          let ageByMonth = "";
          let ageByDecimal = "";
          if (dobDate) {
            const now = new Date();
            const years = now.getFullYear() - dobDate.getFullYear();
            const monthDiff = now.getMonth() - dobDate.getMonth() + (now.getDate() < dobDate.getDate() ? -1 : 0);
            const totalMonths = years * 12 + monthDiff;
            ageByMonth = totalMonths.toString();
            ageByDecimal = (years + (monthDiff / 12)).toFixed(2);
          }
          let ageOnContract = "";
          if (record.YouthContract && record.YouthContract.startDate && dobDate) {
            const contractDate = new Date(record.YouthContract.startDate);
            if (!isNaN(contractDate.getTime())) {
              const contractYears = contractDate.getFullYear() - dobDate.getFullYear();
              const contractMonthDiff = contractDate.getMonth() - dobDate.getMonth() + (contractDate.getDate() < dobDate.getDate() ? -1 : 0);
              ageOnContract = (contractYears + (contractMonthDiff / 12)).toFixed(2);
            }
          }


          let totalDaysWorked = 0;
          if (record.attendanceRecords && Array.isArray(record.attendanceRecords)) {
            record.attendanceRecords.forEach((attRec: any) => {
              if (attRec.days && Array.isArray(attRec.days)) {
                attRec.days.forEach((dayObj: any) => {

                  if (Boolean(dayObj.adminChecked)) {
                    totalDaysWorked++;
                  }
                });
              }
            });
          }
          let totalPaymentAmount = 0;
          if (record.payments && Array.isArray(record.payments)) {
            record.payments.forEach((p: any) => {
              totalPaymentAmount += parseFloat(p.amountPaid);
            });
          }
          let paymentDateFormatted = "";
          if (record.payments && Array.isArray(record.payments) && record.payments.length > 0) {
            const sortedPayments = record.payments.sort((a: any, b: any) =>
              new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
            );
            const latestPayment = new Date(sortedPayments[0].paymentDate);
            const pd = latestPayment.getDate().toString().padStart(2, '0');
            const pm = (latestPayment.getMonth() + 1).toString().padStart(2, '0');
            const py = latestPayment.getFullYear();
            paymentDateFormatted = `${pd}/${pm}/${py}`;
          }


          const job = record.jobRequest || {};
          const employer = record.employer || {};



          row.getCell(1).value = index + 1;
          row.getCell(2).value = record.area || "";
          row.getCell(3).value = "#N/A";
          row.getCell(4).value = "#N/A";
          row.getCell(5).value = "#REF!";
          row.getCell(6).value = "YIEH";
          row.getCell(7).value = "Omar Wehbeh";
          row.getCell(8).value = `${record.firstNameEn || ''} ${record.lastNameEn || ''}`.trim();
          row.getCell(9).value = `${record.firstNameAr || ''} ${record.lastNameAr || ''}`.trim();
          row.getCell(10).value = record.firstNameEn || "";
          row.getCell(11).value = record.fatherNameEn || "";
          row.getCell(12).value = record.lastNameEn || "";
          row.getCell(13).value = record.firstNameAr || "";
          row.getCell(14).value = record.fatherNameAr || "";
          row.getCell(15).value = record.lastNameAr || "";
          row.getCell(16).value = record.nationality || "";
          row.getCell(17).value = record.gender || "";
          row.getCell(18).value = record.disability ? "Yes" : "No";
          row.getCell(19).value = record.mobilePhone || "";
          row.getCell(20).value = record.fullAddress || "";
          row.getCell(21).value = record.fullAddress || "";
          row.getCell(22).value = record.area || "";
          row.getCell(23).value = record.email || "";
          row.getCell(24).value = dayOfBirth;
          row.getCell(25).value = mob;
          row.getCell(26).value = yob;
          row.getCell(27).value = record.mobilePhone || "";
          row.getCell(28).value = record.mobilePhone ? record.mobilePhone.substring(0, 2) : "";
          row.getCell(29).value = "10";
          row.getCell(30).value = record.area || "";
          row.getCell(31).value = record.area || "";
          row.getCell(32).value = record.area || "";
          row.getCell(33).value = dobFormatted;
          row.getCell(34).value = dobFormatted;
          row.getCell(35).value = ageByMonth;
          row.getCell(36).value = ageByDecimal;
          row.getCell(37).value = ageOnContract;
          row.getCell(38).value = record.educationLevel || "";
          row.getCell(39).value = record.major || "";
          row.getCell(40).value = record.major || "";
          row.getCell(41).value = "#N/A";
          row.getCell(42).value = "#N/A";
          row.getCell(43).value = record.id || "";
          row.getCell(44).value = record.identityCard || "";
          row.getCell(45).value = record.familyRegistrationNumber || "";
          row.getCell(46).value = record.personalRegistrationNumber || "";


          row.getCell(47).value = employer.role || "N/A";
          row.getCell(48).value = job.organizationName || employer.organization || "N/A";
          row.getCell(49).value = employer.role || "N/A";
          row.getCell(50).value = job.location || "N/A";
          row.getCell(51).value = job.supervisorName || "N/A";
          row.getCell(52).value = job.supervisorPosition || "N/A";
          row.getCell(53).value = job.supervisorPhone || "N/A";
          row.getCell(54).value = job.supervisorEmail || "N/A";
          row.getCell(55).value = job.title || ((record.appliedJob && record.appliedJob.length > 0)
            ? record.appliedJob[0].title || "N/A"
            : "N/A");
          row.getCell(56).value = "N/A";
          row.getCell(57).value = job.job || "N/A";
          row.getCell(58).value = "N/A";
          let startDateValue = "N/A";
          if (record.YouthContract?.startDate) {
            startDateValue = job.assignedYouths.YouthContract.startDate;
          } else if (job.assignedYouths.EmployerContract?.startDate) {
            startDateValue = job.assignedYouths.EmployerContract.startDate;
          }
          row.getCell(59).value = startDateValue;
          row.getCell(60).value = "#N/A";


          row.getCell(61).value = "";
          row.getCell(62).value = "EU";
          row.getCell(63).value = "40";
          row.getCell(64).value = job.status || "";



          const attendanceMonths = [
            { name: "May", month: 4 },
            { name: "June", month: 5 },
            { name: "July", month: 6 },
            { name: "August", month: 7 },
            { name: "September", month: 8 },
            { name: "October", month: 9 },
            { name: "November", month: 10 },
            { name: "December", month: 11 },
            { name: "January", month: 0 },
            { name: "February", month: 1 },
            { name: "March", month: 2 },
          ];
          let cumulativeDays = 0;
          attendanceMonths.forEach((attMonth, i) => {
            let currentDays = 0;

            const attRecordsArray = Array.isArray(record.attendanceRecords)
              ? record.attendanceRecords
              : (record.attendanceRecords ? [record.attendanceRecords] : []);
            attRecordsArray.forEach((attRec: any) => {
              if (attRec.days && Array.isArray(attRec.days)) {
                attRec.days.forEach((dayObj: any) => {
                  const dayDate = dayObj.date ? new Date(dayObj.date) : null;

                  if (dayDate && dayDate.getMonth() === attMonth.month && Boolean(dayObj.adminChecked)) {
                    currentDays++;
                  }
                });
              }
            });
            const accumulative = cumulativeDays;
            cumulativeDays += currentDays;
            const jobCreated = currentDays > 0 ? "1" : "0";
            const baseCol = 65 + (i * 3);
            row.getCell(baseCol).value = currentDays;
            row.getCell(baseCol + 1).value = accumulative;
            row.getCell(baseCol + 2).value = jobCreated;
          });


          row.getCell(98).value = "YES";
          row.getCell(99).value = "#N/A";
          row.getCell(100).value = "#N/A";
          row.getCell(101).value = "#N/A";
          row.getCell(102).value = "#N/A";
          row.getCell(103).value = "#N/A";
          row.getCell(104).value = "#N/A";
          row.getCell(105).value = "#N/A";
          row.getCell(106).value = "#N/A";
          row.getCell(107).value = "#N/A";
          row.getCell(108).value = "#N/A";
          row.getCell(109).value = "#N/A";
          row.getCell(110).value = "#N/A";
          row.getCell(111).value = "#N/A";
          row.getCell(112).value = "#N/A";
          row.getCell(113).value = totalPaymentAmount;
          row.getCell(114).value = "#N/A";
          row.getCell(115).value = "#N/A";
          row.getCell(116).value = "#N/A";
          row.getCell(117).value = "#N/A";
          row.getCell(118).value = "#N/A";
          row.getCell(119).value = "NO";
          row.getCell(120).value = new Date();
          row.getCell(121).value = "#N/A";
          row.getCell(122).value = "#N/A";
          row.getCell(123).value = "#REF!";
          row.getCell(124).value = "#REF!";
          row.getCell(125).value = "#REF!";
          row.getCell(126).value = "#REF!";
          row.getCell(127).value = "#REF!";
          row.getCell(128).value = "#REF!";
          row.getCell(129).value = "#REF!";
          row.getCell(130).value = "#REF!";
          row.getCell(131).value = "#N/A";


          row.commit();
        });

        return workbook.xlsx.writeBuffer();
      })
      .then(buffer => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, 'Visible_Youth_Data_Template.xlsx');
        this.infoMessage = 'Export completed successfully.';
      })
      .catch(error => {
        console.error('Error exporting data with template:', error);
        this.errorMessage = 'Export failed. Please check the console for details.';
        this.infoMessage = null;
      });
  }
}
