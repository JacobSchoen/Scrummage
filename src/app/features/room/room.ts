import { Component, inject } from '@angular/core';
import { RoomSyncService } from '../../services/room-sync.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-room',
  styleUrl: './room.css',
  templateUrl: './room.html',
})
export class Room {
  protected sync = inject(RoomSyncService);
  protected roomId = inject(ActivatedRoute).snapshot.paramMap.get('id');

}
