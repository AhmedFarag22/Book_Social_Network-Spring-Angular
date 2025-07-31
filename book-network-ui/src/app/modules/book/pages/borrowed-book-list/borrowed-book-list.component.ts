import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BookResponse, BorrowedBookResponse, FeedbackRequest, PageResponseBorrowedBookResponse,} from '../../../../services/models';
import { BookService, FeedbackService } from '../../../../services/services';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from "../../components/rating/rating.component";
@Component({
  selector: 'app-borrowed-book-list',
  imports: [CommonModule, RouterModule, FormsModule, RatingComponent],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss',
})
export class BorrowedBookListComponent implements OnInit {

  borrowedBooks: PageResponseBorrowedBookResponse = {};
  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
    note: 0
  }
  page: number = 0;
  size: number = 3;
  selectedBook: BookResponse | undefined = undefined;
  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {

  }

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  returnBorrowedBook(book: BorrowedBookResponse): void {
    this.selectedBook = book;
     console.log('returnBorrowedBook clicked', book);
    this.feedbackRequest.bookId = book.id as number;
  }

  private findAllBorrowedBooks() {
    this.bookService
      .findAllBorrowedBooks({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (resp: PageResponseBorrowedBookResponse): void => {
          this.borrowedBooks = resp;
        },
      });
  }
    goToLastPage() {
 this.page = this.borrowedBooks.totalPages as number - 1;
    this.findAllBorrowedBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }
  goToPage(page: number) {
    this.page = page;
    this.findAllBorrowedBooks();
  }
  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }
  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.borrowedBooks.totalPages as number - 1;
  }

  returnBook(withFeedback: boolean) {
    this.bookService.returnBorrowBook({
      'book-id':this.selectedBook?.id as number
    }).subscribe({
      next: ():void => {
        if (withFeedback) {
          this.giveFeedback();
        }
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      }
    });
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next: ():void => {

      }
    })
  }
}
