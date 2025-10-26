import { Title } from './title.model';

export interface EditableTitle extends Title {
  userNotes?: string;
  localRating?: number;
}
