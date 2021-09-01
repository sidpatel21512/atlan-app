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
  public queryData: ITable = {} as ITable;
  constructor(private appService: AppService) { }

  public excuteQuery(url: string) {
    this.appService.excuteQuery(url).subscribe(data => this.queryData = data);
  }

  public execute() {
    const selectedStatement = this.getSelectedStatement().trim();
    const url = this.createExecutableUrl(selectedStatement);
    this.excuteQuery(url);
  }

  private getSelectedStatement(): string {
    return 'select * from posts';
  }

  private createExecutableUrl(statement: string): string {
    const splitStatement = statement.split(' ');
    let url = `${this.getClause(splitStatement, Clause.FROM)}?`
    console.log('url:', url);
    return url;
  }

  private getClause(statement: string[], clause: string): string {
    switch (clause) {
      case 'from':
        return this.getClauseValue(statement, clause);
      default:
        return '';
    }
  }

  private getClauseValue(statement: string[], clause: string): string {
    const clauseIndex = statement.indexOf(clause);
    return statement[clauseIndex + 1];
  }
}
