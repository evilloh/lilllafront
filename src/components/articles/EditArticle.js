import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { Editor } from "@tinymce/tinymce-react";
import "./addarticle.scss";
const TINY_API = process.env.REACT_APP_TINY_API;
const DEV_API = process.env.REACT_APP_DEV_API;

function EditArticle(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [articles, setArticles] = useState({});
  const [urlImage, setUrlImage] = useState("");
  const [tags, setTags] = useState("");

  const state = {
    title: "",
    body: "",
    errors: {},
  };

  useEffect(() => {
    getArticle();
  }, []);

  const getArticle = () => {
    const { id } = props.match.params;
    // request to the backend to retrieve all the articles
    axios
      .get(DEV_API + `/articles/${id}`)
      .then((res) => {
        const articles = res.data;
        setTitle(articles.title);
        setBody(articles.body);
        setUrlImage(articles.imgUrl);
        setDescription(articles.description);
        const tags = articles.tagList.join(", ");
        setTags(tags);
      })
      .catch((res) => {
        console.log("We couldnt retrieve your Article");
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Check For Errorors
    if (title == "") {
      setErrors({ title: "Title is required" });
      console.log(errors);
      return;
    }

    if (body == "") {
      setErrors({ body: "Body is required" });
      return;
    }

    //
    const tagList = tags.split(",");

    const updArticle = {
      title,
      body,
      description,
      imgUrl: urlImage,
      tagList,
    };

    const { id } = props.match.params;

    //// UPDATE Article ////

    axios
      .put(DEV_API + `/articles/update/${id}`, updArticle, AuthService.config)
      .then((res) => {
        console.log("vediamo se e passato qualkcosa", res.data);
      })
      .catch((res) => {
        console.log("We couldnt UPDATE your Article");
      });

    // Clear State
    setTitle("");
    setBody("");
    setDescription("");
    setUrlImage("");
    setErrors({});

    axios.get(DEV_API + `/articles/`).then((res) => {
      const articles = res.data;
      setArticles({ articles });
      props.history.push("/");
    });
  };

  const handleEditorChange = (content, editor) => {
    setBody(content);
  };
  const handleDescriptionChange = (content, editor) => {
    setDescription(content);
  };
  const handleTitleChange = (content, editor) => {
    setTitle(content);
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
              value={title}
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
              value={description}
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
              value={body}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo |fontsizeselect formatselect  fontselect| bold italic backcolor forecolor | \
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

export default EditArticle;
