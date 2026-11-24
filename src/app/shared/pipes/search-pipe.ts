import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  transform<T extends { name: string }>(list: T[] | null | undefined, term: string): T[] {
    const items = list ?? [];
    const t = term.trim().toLowerCase();
    return t ? items.filter((i) => i.name.toLowerCase().includes(t)) : items;
  }
}