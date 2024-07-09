import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { interval, map, Observable } from 'rxjs';

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

  // Permet de créer un observable personnalisé avec Observable():
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error(); // Si je souhaite gérer des cas d'erreur il faut le faire ici
      if (timesExecuted > 3) {
        clearInterval(interval); // Stop setInterval()
        subscriber.complete(); // Complete the observable - Arrête l'observable, aucune autres valeurs s'affichera dans la console après ceci
        return;
      }
      console.log('Emitting new value...');
      subscriber.next({ message: 'New value' });
      timesExecuted++;
    }, 2000);
  });

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
    this.customInterval$.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('Observable completed.'),
    });

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
