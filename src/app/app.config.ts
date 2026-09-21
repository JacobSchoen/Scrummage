import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RoomSyncService } from './services/room-sync.interface';
import { SupabaseRoomSyncService } from './services/SupabaseRoomSync.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RoomSyncService, useClass: SupabaseRoomSyncService}
  ]
};
