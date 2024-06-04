import { Kviz } from './kviz';
import { KvizOdgovori } from './kviz-odgovori';
import { KvizPitanja } from './kviz-pitanja';

export class NapraviKviz {
  public kviz: Kviz;
  public kvizPitanja: KvizPitanja[];
  public kvizOdgovori: KvizOdgovori[];
}
