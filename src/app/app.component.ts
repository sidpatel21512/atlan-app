import { Component } from '@angular/core';
import { Clause, ITable } from './app.helper';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'atlan-app';
  public statement: string = '';
  public filteredColumns: string[] = [];
  public queryData: ITable = {} as ITable;
  constructor(private appService: AppService) { }

  public excuteQuery(url: string) {
    this.appService.excuteQuery(url).subscribe(data => {
      this.queryData = data;
      if (this.filteredColumns.length > 0) {
        this.queryData.properties = this.filteredColumns;
      }
    });
  }

  public execute() {
    this.clearSetup();
    const selectedStatement = this.getSelectedStatement().trim();
    if (selectedStatement) {
      const url = this.createExecutableUrl(selectedStatement);
      this.excuteQuery(url);
    }
  }

  private getSelectedStatement(): string {
    let selectedText;
    if (document.getSelection) {
      selectedText = document.getSelection();
    }
    return selectedText && selectedText.toString() !== '' ? selectedText.toString() : this.statement;
  }

  private createExecutableUrl(statement: string): string {
    const splitStatement = statement.split(' ');
    let url = `${this.getClause(splitStatement, Clause.FROM)}`;
    url = `${url}${this.appendQueryParams(url,this.getClause(splitStatement, Clause.WHERE))}`;
    url = `${url}${this.appendQueryParams(url,this.getClause(splitStatement, Clause.LIKE))}`;
    url = `${url}${this.appendQueryParams(url,this.getClause(splitStatement, Clause.LIMIT))}`;
    url = `${url}${this.appendQueryParams(url,this.getClause(splitStatement, Clause.ORDERBY))}`;
    this.getClause(splitStatement, Clause.SELECT);
    console.log('url:', url);
    return url;
  }

  private getClause(statement: string[], clause: string): string {
    switch (clause) {
      case Clause.SELECT:
        const colValue = this.getClauseValue(statement, clause);
        if (colValue !== '*') {
          this.filteredColumns = colValue.split(',').map(v => v.trim());
        }
        return colValue;
      case Clause.LIKE:
        const likeValue = this.getClauseValue(statement, clause);
        return likeValue ? `q=${likeValue.replace(/%/ig, '').replace(/'/ig, '')}` : '';
      case Clause.LIMIT:
        const limitValue = this.getClauseValue(statement, clause);
        return limitValue ? `_limit=${limitValue}` : '';
        case Clause.ORDERBY:
        const colName = this.getClauseValue(statement, clause, 2);
        const orderValue = this.getClauseValue(statement, clause, 3);
        return colName ? `_sort=${colName}&_order=${orderValue ?? 'asc'}` : '';
      case Clause.FROM:
      case Clause.WHERE:
        return this.getClauseValue(statement, clause);
      default:
        return '';
    }
  }

  private getClauseValue(statement: string[], clause: string, clauseValueIndex = 1): string {
    const clauseIndex = statement.indexOf(clause);
    return clauseIndex === -1 ? '' : statement[clauseIndex + clauseValueIndex];
  }

  private appendQueryParams(url: string, queryString: string): string {
    return queryString ? url.indexOf('?') === -1 ? `?${queryString}` : `&${queryString}` : '';
  }

  private clearSetup(): void {
    this.queryData = {} as ITable;
    this.filteredColumns = [];
  }
}
