import { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

import { getUserBooks, deleteBook } from '../utils/API';
import { Book } from '../interfaces/index.d';
import { useStore } from '../store';

const SavedBooks = () => {
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const { state } = useStore()!;

  useEffect(() => {
    getUserBooks()
      .then(res => {
        setUserBooks([...res.data])
      })
  }, []);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId);

      setUserBooks(userBooks.filter(book => book.googleBookId !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {!state.loading && state.user.username}'s saved books!</h1>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {userBooks.length
            ? `Viewing ${userBooks.length} saved ${userBooks.length === 1 ? 'book' : 'books'
            }:`
            : 'You have no saved books!'}
        </h2>
        <section className='d-grid gap-4 book-grid'>
          {userBooks.map((book) => {
            return (
              <Card border='dark' key={book.googleBookId}>
                {book.image ? (
                  <Card.Img
                    className='result-image'
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                ) : null}
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small flex-fill'>Authors: {book.authors}</p>
                  <details>
                    <summary>Description</summary>
                    <Card.Text className='p-2'>{book.description}</Card.Text>
                  </details>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.googleBookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </section>

      </Container>
    </>
  );
};

export default SavedBooks;
