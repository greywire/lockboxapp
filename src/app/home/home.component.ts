import { NumberFormatStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
//const PubNub = require('pubnub');

var publishPayload = {
  channel: 'lock_control',
  message: {
    locker: 1,
    locked: true,
  },
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading = false;
  status = [
    { locked: false, opened: true },
    { locked: false, opened: true },
    { locked: false, opened: true },
    { locked: false, opened: true },
  ];

  constructor(public pubnub: PubNubAngular) {
    pubnub.init({
      publishKey: 'pub-c-82e41f24-f0ef-4472-819d-501acafb78a0',
      subscribeKey: 'sub-c-62be485c-907a-11ec-8102-a68c05a281ab',
      uuid: 'lockbox', //** should be unique by user or device */
    });

    pubnub.subscribe({
      channels: ['lock_status'],
    });

    pubnub.addListener({
      message: (m: any) => {
        console.log(m);

        this.status = m.message.status;
        // handle messages
      },
    });
  }

  send(locker: number, locked: boolean) {
    publishPayload.message = { locker: locker, locked: locked };
    console.log(publishPayload);
    this.pubnub.publish(publishPayload, function (status: any, response: any) {
      console.log(status, response);
    });
  }

  ngOnInit() {
    this.isLoading = true;
  }
}
