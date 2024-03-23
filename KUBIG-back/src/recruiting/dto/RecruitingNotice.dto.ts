export class NoticeReqDto {
  title: string;
  content: string;

  tags: string[];
  deadline: 'over' | 'regular' | 'announcement';
}

export class NoticeResDto {
  id: number;
  title: string;
  content: string;

  author: {
    name: string;
    generation: number;
  };
  fixed: boolean;
  tags: string[];
  deadline: 'over' | 'regular' | 'announcement';
  createdAt: Date;
}
