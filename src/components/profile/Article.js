import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleSum from "./ArticleSum";

export default function ProfileArticle(props) {
  const DEV_API = process.env.REACT_APP_DEV_API;
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    axios
      .get(DEV_API + `/articles/getByUser/${props.username}`)
      .then((res) => {
        setArticles(res.data.articles);
      })
      .catch((res) => {
        console.log("We couldnt retrieve your Articles");
      });
  };
  return (
    <div className="profile__article">
      {articles ? (
        articles.map((article, index) => (
          <ArticleSum
            key={index}
            article={article}
            getArticles={getArticles}
          ></ArticleSum>
        ))
      ) : (
        <p>You don't have any article duuuude</p>
      )}
    </div>
  );
}
