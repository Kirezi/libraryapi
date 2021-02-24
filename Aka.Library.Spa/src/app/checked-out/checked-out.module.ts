import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LibraryMatModule } from "../library-mat.module";
import { CheckedOutBooksHistoryComponent } from "./checked-out-books-history/checked-out-books-history.component";
import { CheckedOutBooksComponent } from "./checked-out-books/checked-out-books.component";
import { CheckedOutRoutingModule } from "./checked-out-routing.module";

@NgModule({
  declarations: [CheckedOutBooksComponent, CheckedOutBooksHistoryComponent],
  imports: [CommonModule, CheckedOutRoutingModule, LibraryMatModule],

  exports: [CheckedOutBooksComponent, CheckedOutBooksHistoryComponent],
})
export class CheckedOutModule {}
