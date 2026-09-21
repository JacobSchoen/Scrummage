import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomSyncService } from '../../services/room-sync.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { roomCodeFormatValidator } from '../../validators/roomCode.validator';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-lobby',
  styleUrl: './lobby.css',
  templateUrl: './lobby.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Lobby {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private sync = inject(RoomSyncService);
 
  protected creating = signal(false);
  protected joining = signal(false);
  protected joinError = signal<string | null>(null);
 
  protected createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    ticketNumber: ['', [ Validators.minLength(2)]]
  });
 
  protected joinForm = this.fb.nonNullable.group({
    roomCode: ['', [Validators.required, roomCodeFormatValidator()]],
    name: ['', [Validators.required, Validators.minLength(2)]],
  });
 
  async onCreate(): Promise<void> {
    if (this.createForm.invalid) return;
 
    this.creating.set(true);
    try {
      const { name, ticketNumber } = this.createForm.getRawValue();
      const roomId = await this.sync.createRoom(name, ticketNumber);
      this.router.navigate(['/room', roomId]);
    } finally {
      this.creating.set(false);
    }
  }
 
  async onJoin(): Promise<void> {
    if (this.joinForm.invalid) return;
 
    this.joining.set(true);
    this.joinError.set(null);
    try {
      const { roomCode, name } = this.joinForm.getRawValue();
      await this.sync.joinRoom(roomCode.toUpperCase(), name);
      this.router.navigate(['/room', roomCode.toUpperCase()]);
    } catch (err) {
      this.joinError.set('Could not find that room. Check the code and try again.');
    } finally {
      this.joining.set(false);
    }
  }
}
