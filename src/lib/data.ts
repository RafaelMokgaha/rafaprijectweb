
import type { Game } from '@/lib/types';

export const availableGames: Game[] = [
  {
    title: 'Grand Theft Auto V ENHANCED',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    imageId: 'gta_v_enhanced',
    category: 'Action-Adventure',
  },
  {
    title: 'Red Dead Redemption 2',
    platforms: ['PC', 'PS4', 'Xbox One'],
    imageId: 'rdr2',
    category: 'Action-Adventure',
  },
  {
    title: 'Cyberpunk 2077',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    imageId: 'cyberpunk_2077',
    category: 'RPG',
  },
  {
    title: 'Euro Truck Simulator 2',
    platforms: ['PC'],
    imageId: 'euro_truck_2',
    category: 'Simulation',
  },
  {
    title: 'BeamNG.drive',
    platforms: ['PC'],
    imageId: 'beamng_drive',
    category: 'Simulation',
  },
  {
    title: 'FC 25',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    imageId: 'fc_25',
    category: 'Sports',
  }
];
