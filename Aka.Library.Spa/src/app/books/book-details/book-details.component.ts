import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { filter, find } from "lodash";
import { combineLatest, Subscription, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { slideInDownAnimation } from "../../animations";
import { AuthService } from "../../services/auth.service";
import { BooksService } from "../../services/books.service";
import { MemberService } from "../../services/member.service";
import { Book } from "../../shared/book";
import { GoogleBooksMetadata } from "../../shared/google-books-metadata";

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrls: ["./book-details.component.scss"],
  animations: [slideInDownAnimation],
})
export class BookDetailsComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("class.book-details") cssClass = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "initial";

  bookSubscription: Subscription;
  book: Book;
  numBooksSignedOut: number;
  numBooksAvailable: number;
  bookMetadata: GoogleBooksMetadata;
  numOfThisBookSignedOutByUser: number;

  constructor(
    private route: ActivatedRoute,
    private books: BooksService,
    private authService: AuthService,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const libraryId = +params.get("lid");
      const bookId = +params.get("id");
      this.getBookDetails(libraryId, bookId);
    });
  }

  /**
   * Check if the maximum number of books for the current member has been reached
   *
   * @returns {boolean}
   * @memberof BookDetailsComponent
   */
  isMaximumNumberOfBooksSignedOut(): boolean {
    // TODO: Implement check
    let maximumCheck = false;
    this.memberService
      .getSignedOutBooks(this.authService.currentMember)
      .pipe(
        take(1),
        tap((signedOutBooks) =>
          signedOutBooks.length > 0
            ? (maximumCheck = true)
            : (maximumCheck = false)
        )
      )
      .subscribe();

    return maximumCheck;
  }

  checkOutBook() {
    const params = this.route.snapshot.paramMap;
    this.books
      .checkOutBook(
        +params.get("lid"),
        +params.get("id"),
        this.authService.currentMember.memberId
      )
      .pipe(take(1))
      .subscribe(() => {
        const libraryId = +params.get("lid");
        const bookId = +params.get("id");
        this.getBookDetails(libraryId, bookId);
      });
  }

  returnBook() {
    const params = this.route.snapshot.paramMap;
    this.books
      .returnBook(
        +params.get("lid"),
        +params.get("id"),
        this.authService.currentMember.memberId
      )
      .pipe(take(1))
      .subscribe(() => {
        const libraryId = +params.get("lid");
        const bookId = +params.get("id");
        this.getBookDetails(libraryId, bookId);
      });
  }

  /**
   * Gets all the details for the passed book to be used for displaying in the books details
   *
   * @param {number} libraryId
   * @param {number} bookId
   * @memberof BookDetailsComponent
   */
  getBookDetails(libraryId: number, bookId: number) {
    console.log("inside the book details");
    combineLatest([
      this.books.getBook(libraryId, bookId),
      this.books.getNumberOfAvailableBookCopies(libraryId, bookId),
      this.memberService.getSignedOutBooks(this.authService.currentMember),
    ])
      .pipe(
        take(1),
        tap(([book, numberOfAvailableCopies, signedOutBooks]) => {
          console.log(book);
          this.numBooksSignedOut = signedOutBooks.length;
          this.numBooksAvailable = numberOfAvailableCopies;
          this.numOfThisBookSignedOutByUser = filter(
            signedOutBooks,
            (signedOutBook) => signedOutBook.bookId === book.bookId
          ).length;
        }),
        map(([book, numberOfAvailableCopies, signedOutBooks]) => {
          const areBooksAvailable = numberOfAvailableCopies > 0;
          const hasUserCheckedThisBookOut = !!find(signedOutBooks, {
            bookId: book.bookId,
          });
          return {
            ...book,
            isAvailable: areBooksAvailable,
            isCheckedOut: hasUserCheckedThisBookOut,
          };
        }),
        tap((book) => (this.book = book)),
        switchMap((book) => this.books.getBookMetaData(book.isbn)),
        tap((bookMetadata) => (this.bookMetadata = bookMetadata)),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe();
  }
}
