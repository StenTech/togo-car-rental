import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType rend toutes les propriétés optionnelles tout en héritant des décorateurs de validation
export class UpdateUserDto extends PartialType(CreateUserDto) {}
