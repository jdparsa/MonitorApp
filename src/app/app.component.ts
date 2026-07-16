import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// 💡 MODEL CONTRACT: Aligns explicitly with the structure returned by your C# controller
export interface PrivacySensor {
  name: string;
  isActive: boolean;
  activeApps: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  // 💡 IMPORT SYSTEM: Registers global template structures, including HttpClient and standard loop directives
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  })
export class AppComponent implements OnInit, OnDestroy {
  // Global application metadata tracker variables
  public applicationVersion: string = 'v1.4.2';

  // Live sensor arrays managed by the 2-second background engine loop
  public sensors: PrivacySensor[] = [];
  private pollingSubscription!: Subscription;

  // 💡 DEPENDENCY INJECTION: Angular hooks up the native HttpClient engine
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // ⏳ POLLING ENGINE: Starts immediately (0) and requests fresh data every 2000ms (2 seconds)
    this.pollingSubscription = timer(0, 2000)
      .pipe(
        // switchMap safely drops lagging requests if the backend network connection drops or pauses
        switchMap(() => this.http.get<PrivacySensor[]>('https://localhost:7084/api/privacystatus'))
      )
      .subscribe({
        next: (data) => {
          this.sensors = data; // Seamlessly overwrites UI state to trigger an HTML re-render
          console.log('Live privacy telemetry synchronized:', data);
        },
        error: (err) => {
          console.error('Failed to communicate with the C# hardware tracking engine:', err);
        }
      });
  }

  ngOnDestroy(): void {
    // ⚠️ MEMORY LEAK GUARD: Destroys the subscription immediately if the core view state shifts
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}