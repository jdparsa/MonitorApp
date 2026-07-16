import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { MonitorService, PrivacyMonitor } from './monitor.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, OnDestroy {
  public monitors: PrivacyMonitor[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private monitorService: MonitorService) {}

  ngOnInit(): void {
    this.startTelemetryPolling();
  }

  public startTelemetryPolling(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // 💡 THE FRONTEND FIX: Wake up immediately (0 delay), then repeat every 2000ms
    timer(0, 1000)
      .pipe(
        takeUntil(this.destroy$),
        // switchMap automatically unsubscribes from the previous HTTP request if it takes too long
        switchMap(() => this.monitorService.getPrivacyStatus().pipe(
          // If a request fails, we catch it locally so the main timer stream doesn't die entirely
          tap({
            error: (err) => {
              console.error('Data pipeline exception detected at component layer:', err);
              this.errorMessage = 'Backend connection fault. Unable to stream security node states.';
              this.isLoading = false;
            }
          })
        ))
      )
      .subscribe({
        next: (incomingData: PrivacyMonitor[]) => {
          console.log('Live backend telemetry received:', incomingData);
          this.monitors = incomingData;
          this.errorMessage = null; // Clear any previous transient errors
          this.isLoading = false;   // Turn off spinner once the first payload arrives
        }
      });
  }

  ngOnDestroy(): void {
    // 💡 This instantly kills the 2-second background timer loop when the user navigates away
    this.destroy$.next();
    this.destroy$.complete();
  }
}