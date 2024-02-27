import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs"

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected subscriptions: Subscription = new Subscription();

  ngOnDestroy() {
    // When component is destroyed - remove them.
    this.subscriptions.unsubscribe();
  }
}

