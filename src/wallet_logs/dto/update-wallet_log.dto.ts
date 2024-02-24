import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletLogDto } from './create-wallet_log.dto';

export class UpdateWalletLogDto extends PartialType(CreateWalletLogDto) {}
