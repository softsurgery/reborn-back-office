import { ResponseJobDto } from "../job-management";
import { DatabaseEntity } from "../utils/database-entity";

export interface ResponseCurrencyDto extends DatabaseEntity {
  id: string;
  label: string;
  code: string;
  symbol?: string;
  digitsAfterComma?: number;
  jobs?: ResponseJobDto[];
}
