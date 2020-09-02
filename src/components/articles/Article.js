import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import classNames from "classnames";

function Article(props) {
  const [articleInfo, setArticleInfo] = useState(false);
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    setIsTop(props.isTop);
  });

  const {
    _id,
    title,
    index,
    body,
    description,
    imgUrl,
    author,
  } = props.article;
  const onDeleteClick = props.onDeleteClick;
  const { getAllArticles } = props.getAllArticles;

  const cardClass = classNames({
    cardSmall: !isTop,
    card: isTop,
  });

  return (
    <div className={`${cardClass}__container`}>
      <Link to={{ pathname: `article/${_id}` }}>
        <img className={`${cardClass}__image`} src={imgUrl}></img>
      </Link>
      <div className={`${cardClass}__texts`}>
        <h4
          tyle={{ color: "red !important" }}
          className={`${cardClass}__title`}
        >
          <Link
            to={{ pathname: `article/${_id}` }}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </h4>
        {isTop ? (
          <h4
            className={`${cardClass}__description`}
            dangerouslySetInnerHTML={{ __html: description }}
          ></h4>
        ) : null}
      </div>
      {author === props.currentUser && (
        <div>
          <i
            onClick={() => setArticleInfo(!articleInfo)}
            className="fas fa-sort-down"
            style={{ cursor: "pointer" }}
          />
          <i
            className="fas fa-times"
            style={{ cursor: "pointer", float: "right", color: "red" }}
            onClick={() => onDeleteClick(_id)}
          />
          <Link to={{ pathname: `article/edit/${_id}` }}>
            <i
              className="fas fa-pencil-alt"
              style={{
                cursor: "pointer",
                float: "right",
                color: "black",
                marginRight: "1rem",
              }}
            />
          </Link>

          {articleInfo ? (
            <ul className="list-group">
              <li className="list-group-item">Email:</li>
              <li className="list-group-item">Phone:</li>
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

Article.propTypes = {
  article: PropTypes.object.isRequired,
};

export default Article;
