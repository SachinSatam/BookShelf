import React, { useState, useEffect } from "react";
import { Form, Alert, InputGroup, Button, ButtonGroup } from "react-bootstrap";
import BookDataService from "../services/book.services";
import { storage } from "../firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

  {/*Declaring constants*/}
  const AddBook = ({ id, setBookId }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Available");
  const [progressPercent, setProgressPercent] = useState(0);
  const [flag, setFlag] = useState(true);
  const [message, setMessage] = useState({ error: false, msg: "" });
  

  const handleSubmit = async (e) => {
    {/*Tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.*/}
    e.preventDefault();

    {/*Getting the file from the element named file-upload*/}
    const file = document.getElementById('file-upload').files[0];
    
    {/*Adding storage reference. This is the path on the cloud storage where files are stored.*/}
    const storageRef = ref(storage, `files/${file.name}`);

    {/*The file which we have get converted into bytes and is uploaded to the server.*/}
    const uploadTask = uploadBytesResumable(storageRef, file);

    {/*Initializing the message*/}
    setMessage("");

    {/*This ensures that the fields title, author and file are not empty. If they are empty show mandatory message to the user*/}
    if (title === "" || author === "" || !file) {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }

    {/*As the bytes are transfred from line 29 perform the below tasks. On state change refers to the change to that constant. This looks on the const upload task and when its value
    changes this function will get executed.*/}
    uploadTask.on("state_changed",
    (snapshot) => {

      {/*As the bytes are uploaded record the progress. Note: This is just for debugging purpose. You can show the variable on the homescree if you like.*/}
      const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      setProgressPercent(progress);
    },
    (error) => {

      {/*If we encounter any error while uploading the bytes, display the error message.*/}
      alert(error);
    },
    () => {

      {/*After the upload is complete, get back the download URL from the storage server. This is predefined function provided as a part of firebase storage package.*/}
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        if(downloadURL){

          {/*One we receive the download URL create a new book object*/}
          const newBook = {
            title,
            author,
            status,
            downloadURL,
          };
      
          try {

            {/*Up the book already has an id then update the book details and show the message that the book is updated.*/}
            if (id !== undefined && id !== "") {
              BookDataService.updateBook(id, newBook);
              setBookId("");
              setMessage({ error: false, msg: "Updated successfully!" });
            } else {

              {/*If the book does not have an id then it mean that it is a new book, so add the book and display the success message.*/}
              BookDataService.addBooks(newBook);
              setMessage({ error: false, msg: "New Book added successfully!" });
            }
          } catch (err) {

            {/*In case there is any error receiving the list of books or adding the book get and show the error message.*/}
            setMessage({ error: true, msg: err.message });
          }
        } else {

          {/*This message will be displayed in case we do not get a URL back from the storage server.*/}
          console.log("Could not wait till the file was uploaded so moving forward.");
        }

        {/*Reset the fields*/}
        setTitle("");
        setAuthor("");
      });
    });
  };

  const editHandler = async () => {

    {/*Reinitializing the message*/}
    setMessage("");
    try {

      {/*Edit the title, author and status.*/}
      const docSnap = await BookDataService.getBook(id);
      console.log("the record is :", docSnap.data());
      setTitle(docSnap.data().title);
      setAuthor(docSnap.data().author);
      setStatus(docSnap.data().status);
    } catch (err) {

      {/*In case an error occures while editing the book, display the error message.*/}
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);


  return (
    <>
  
      <div className="p-4 box">
        {message?.msg && (
          <Alert
            variant={message?.error ? "danger" : "success"}
            dismissible
            onClose={() => setMessage("")}
          >
            {message?.msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBookTitle">
            <InputGroup>
              <InputGroup.Text id="formBookTitle">B</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBookAuthor">
            <InputGroup>
              <InputGroup.Text id="formBookAuthor">A</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Book Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFileUploader">
          <input type="file" id="file-upload"/>
          </Form.Group>

         <ButtonGroup aria-label="Basic example" className="mb-3">
            <Button
              disabled={flag}
              variant="success"
              onClick={(e) => {
                setStatus("Available");
                setFlag(true);
              }}
            >
              Available
            </Button>
            <Button
              variant="danger"
              disabled={!flag}
              onClick={(e) => {
                setStatus("Not Available");
                setFlag(false);
              }}
            >
              Not Available
            </Button>
          </ButtonGroup>
          <div className="d-grid gap-2" >
            <Button  variant="primary" type="Submit">
              Add/ Update
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddBook;

