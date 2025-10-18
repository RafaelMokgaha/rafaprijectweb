import type { Game } from '@/lib/types';

export const availableGames: Game[] = [
  {
    title: 'Grand Theft Auto V ENHANCED',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    imageId: 'gta_v_enhanced',
  },
  {
    title: 'Red Dead Redemption 2',
    platforms: ['PC', 'PS4', 'Xbox One'],
    imageId: 'rdr2',
  },
  {
    title: 'Cyberpunk 2077',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    imageId: 'cyberpunk_2077',
  },
  {
    title: 'Euro Truck Simulator 2',
    platforms: ['PC'],
    imageId: 'euro_truck_2',
  },
  {
    title: 'BeamNG.drive',
    platforms: ['PC'],
    imageId: 'beamng_drive',
  },
];
