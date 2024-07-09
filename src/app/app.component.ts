import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal<number>(0);
  clickCount$ = toObservable(this.clickCount);
  // 
  interval$ = interval(1000);
  // Dans ce cas le subscribe se fera automatiquement, et le unsubscribe sera fait automatiquement lors de la destruction du composant:
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  private destroyRef = inject(DestroyRef)

  constructor() {
    // effect(() => {
    // console.log(`Click count: ${this.clickCount()} time(s).`);
    // });
  }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.interval.update((prevIntervalCount) => prevIntervalCount + 1);
    //   console.log(this.interval());
    // }, 1000);

    // const subscription = interval(1000).pipe(
    //   map((val) => val * 2)
    // ).subscribe({
    //   next: (value) => console.log(value),
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
    const subscription = this.clickCount$.subscribe({
      next: (value) => console.log(`Click count: ${this.clickCount()} time(s).`),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onClick(): void {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
