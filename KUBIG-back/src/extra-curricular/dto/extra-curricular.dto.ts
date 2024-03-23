import { ExtraCategory } from '../entity/extra-curricular.entity';

export class ExtraCurricularDto {
  title: string;
  content: string;
  date: string;
  category: ExtraCategory;
}

export class AwardDto {
  title: string;
  content: string;
  date: string;
  winners: string[];
  yearId: number;
}
export class AwardYearDto {
  year: number;
  semester: number;
}
