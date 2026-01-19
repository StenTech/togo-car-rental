import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Abstraction pour respecter le principe d'Inversion de Dépendance (D de SOLID)
// Si demain on veut passer à Argon2, on change juste l'implémentation ici.
@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Standard industriel : 10 rounds
    return bcrypt.hash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
