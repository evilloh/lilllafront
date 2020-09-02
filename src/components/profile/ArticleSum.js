import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ArticleSum from "./ArticleSum";
import moment from "moment";
import AuthService from "../../services/auth.service";
const DEV_API = process.env.REACT_APP_DEV_API;

export default function ProfileArticle(props) {
  const article = props.article;
  const _id = props.article._id;
  const articleComments = article.comments.length;
  const date = moment(article.createdAt).format("LLL");
  const [sure, setSure] = useState(false);
  const [completeDelete, setCompleteDelete] = useState(false);

  const surePopup = () => {
    setSure(true);
  };

  const onDeleteClick = (id) => {
    sure
      ? axios
          .delete(DEV_API + `/articles/${id}`, AuthService.config)
          .then((res) => {
            props.getArticles();
            setCompleteDelete(false);
            setSure(false);
            console.log("you have succesfully deleted an article");
          })
          .catch((res) => {
            console.log("There was some issue with the deleting process", res);
          })
      : surePopup(id);
    //// DELETE article ////
  };

  return (
    <div className="profile__article__individual">
      {sure ? (
        <div className="profile__sure-popup__background">
          <div className="profile__sure-popup">
            <h2>
              Are you sure you want to delete this article FOREVERANDEVER?
            </h2>
            <div className="profile__sure-popup__buttons-container">
              <input
                value="Yes"
                className="submitButton--small"
                onClick={() => onDeleteClick(_id)}
              />
              <input
                value="No"
                className="submitButton--small"
                onClick={() => setSure(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="profile__article__content">
        <div className="profile__article__content__top-row">
          <Link
            to={{ pathname: `article/${_id}` }}
            className="profile__article__content__title"
            dangerouslySetInnerHTML={{ __html: article.title }}
            style={{ fontSize: "3rem" }}
          ></Link>
          <div>
            <Link to={{ pathname: `article/edit/${_id}` }}>edit</Link>
            <p
              className="profile__article__content__delete"
              onClick={() => surePopup()}
            >
              delete
            </p>
          </div>
        </div>

        <p
          className="profile__article__content__description"
          dangerouslySetInnerHTML={{ __html: article.description }}
        ></p>
      </div>
      <div className="profile__article__data">
        <p>
          Date: <span dangerouslySetInnerHTML={{ __html: date }}></span>
        </p>
        <p>
          Comments:{" "}
          <span dangerouslySetInnerHTML={{ __html: articleComments }}></span>
        </p>
        <p>
          Tags:{" "}
          {article.tagList
            ? article.tagList.map((tag, index) => (
                <span
                  key={index}
                  dangerouslySetInnerHTML={{ __html: tag + " " }}
                ></span>
              ))
            : null}
        </p>
      </div>
    </div>
  );
}
