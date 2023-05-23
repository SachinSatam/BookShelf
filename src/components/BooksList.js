import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import BookDataService from "../services/book.services";
import AddBook from "./AddBook";
import { render } from "@testing-library/react";

// function redirect(){
//   window.location.href ='https://firebasestorage.googleapis.com/v0/b/cclminiproj-6fd03.appspot.com/o/images%2Ftkt.pdf2dd69fb6-4dbd-4350-8318-89ba2267f31e?alt=media&token=d5115b3f-dd20-4615-b225-fa917bb4f38d'
// }
const BooksList = ({ getBookId }) => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    const data = await BookDataService.getAllBooks();
    console.log(data.docs);
    setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await BookDataService.deleteBook(id);
    getBooks();
  };
  return (
    <>
      <div className="mb-2">
        <Button variant="dark edit" onClick={getBooks}>
          Refresh List
        </Button>
      </div>

      {/* <pre>{JSON.stringify(books, undefined, 2)}</pre>} */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Book Title</th>
            <th>Book Author</th>
            <th>Status</th>
            <th>Action</th>
            <th>E-book</th>
          </tr>
        </thead>
        <tbody>
          {books.map((doc, index) => {
            return (
              <tr key={doc.id}>
                <td>{index + 1}</td>
                <td>{doc.title}</td>
                <td>{doc.author}</td>
                <td>{doc.status}</td>
                <td>
                  <Button
                    variant="secondary"
                    className="edit"
                    onClick={(e) => getBookId(doc.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="delete"
                    onClick={(e) => deleteHandler(doc.id)}
                  >
                    Delete
                  </Button>
                </td>
                <td>{ doc.downloadURL != "" ? <a href={doc.downloadURL} target="_blank">View</a> : <a>No File</a> }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default BooksList;
