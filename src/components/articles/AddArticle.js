import React, { useState } from "react";
import TextInputGroup from "../layout/TextInputGroup";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import AuthService from "../../services/auth.service";
import "./addarticle.scss";

const TINY_API = process.env.REACT_APP_TINY_API;
const DEV_API = process.env.REACT_APP_DEV_API;

function AddArticle(props) {
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({ errors: {} });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [tags, setTags] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();

    console.log(e);
    // Check For Errors
    if (title === "") {
      setErrors({ title: "Title is required" });
      console.log(errors);
      return;
    }

    if (body === "") {
      setErrors({ body: "Body is required" });
      return;
    }
    const tokenino = JSON.parse(localStorage.getItem("user"));

    const tagList = tags.split(",");

    const newArticle = {
      tagList,
      title,
      body,
      description,
      author: AuthService.getCurrentUser().username,
      imgUrl: urlImage,
    };

    //// SUBMIT Article ////
    let config = {
      headers: {
        Authorization: `Token ${
          AuthService.getCurrentUser().accessToken ? tokenino.accessToken : ""
        }`,
      },
    };
    axios
      .post(DEV_API + "/articles/newArticle", newArticle, config)
      .then(function (response) {
        redirectToHome();
      })
      .catch(function (error) {
        console.log(error);
      });

    let redirectToHome = () => {
      props.history.push("/");
    };

    // Clear State
    setTitle("");
    setDescription("");
    setBody("");
    setUrlImage("");

    setErrors({});
  };

  const handleEditorChange = (content, editor) => {
    console.log(content, editor);
    setBody(content);
  };
  const handleTitleChange = (content, editor) => {
    setTitle(content);
  };
  const handleDescriptionChange = (content, editor) => {
    setDescription(content);
  };

  return (
    <div className="card mb-3">
      <div className="addarticle__header">
        <h1>Add Article</h1>
      </div>
      <div className="card-body">
        <form className="addarticle__form" onSubmit={onSubmit}>
          <div className="addarticle__input--title">
            <Editor
              style={{ margin: "20px" }}
              apiKey={TINY_API}
              inline={true}
              initialValue="Your Title Here"
              init={{
                height: 220,
                menubar: false,
                plugins: [
                  // "advlist autolink lists link image charmap print preview anchor",
                  // "searchreplace visualblocks code fullscreen",
                  // "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | fontsizeselect  fontselect| bold italic  | \
              \
              |removeformat |",
              }}
              onEditorChange={handleTitleChange}
              outputFormat="html"
            />
          </div>
          <div
            className="addarticle__input--title"
            style={{ marginTop: "2rem" }}
          >
            <Editor
              style={{ margin: "20px" }}
              apiKey={TINY_API}
              inline={true}
              initialValue="Your max 150 char description here"
              init={{
                height: 220,
                menubar: false,
                plugins: [
                  // "advlist autolink lists link image charmap print preview anchor",
                  // "searchreplace visualblocks code fullscreen",
                  // "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | fontsizeselect  fontselect| bold italic  | \
              \
              |removeformat |",
              }}
              onEditorChange={handleDescriptionChange}
              outputFormat="html"
            />
          </div>
          <input
            name="imgUrl"
            value={urlImage}
            className="addarticle__input--image"
            placeholder="Put here the URL of the image you want to use"
            onChange={(e) => setUrlImage(e.target.value)}
          ></input>
          <div className="addarticle__input--body">
            <Editor
              apiKey={TINY_API}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | fontsizeselect formatselect  fontselect| bold italic backcolor forecolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat |  link image |",
              }}
              onEditorChange={handleEditorChange}
              outputFormat="html"
            />
          </div>
          <input
            name="tagsList"
            value={tags}
            className="addarticle__input--image"
            placeholder="Put your tags here, separated by a ',' and no space (ex: casa,cose,cose casa,chiesa) "
            onChange={(e) => setTags(e.target.value)}
          ></input>
          <input
            type="submit"
            value="Submit Article"
            className="submitButton"
          />
        </form>
      </div>
    </div>
  );
}

export default AddArticle;
