import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications-chatter',
  templateUrl: './notifications-chatter.component.html',
  styleUrl: './notifications-chatter.component.scss',
})
export class NotificationsChatterComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this._userService.getNotifications().subscribe((res) => {
      if (res.result) {
        this.notifications = res.result.reverse();
        this.calNotSeen();
        return;
      }
      this._toastrService.error(
        `${res.message}`,
        'Failed to get notifications'
      );
    });
  }

  notifications: any[] = [];
  notSeenCount: number = 0;

  setSeen(notification: any) {
    this._userService
      .markNotificationAsSeen(notification._id)
      .subscribe((res) => {
        if (res.result) {
          notification.seen = true;
          this.calNotSeen();
          return;
        }
        this._toastrService.error(
          `${res.message}`,
          'Failed to set notification as seen'
        );
      });
  }

  calNotSeen() {
    this.notSeenCount = this.notifications.filter(
      (notification) => !notification.seen
    ).length;
  }
}
