import { Kviz } from './kviz';
import { KvizOdgovori } from './kviz-odgovori';
import { KvizPitanja } from './kviz-pitanja';
import { User } from './user';

export class NapraviKviz {
  public user: User;
  public kviz: Kviz;
  public kvizPitanja: KvizPitanja[];
  public kvizOdgovori: KvizOdgovori[];
}
