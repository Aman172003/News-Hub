// rce
import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  constructor() {
    // it will bring Component class methods and features into this class
    super();
    // i am setting a state from my side
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }
  // jab render ke andar waala part run ho jaata hai phir componentdidmount run hota hai
  // totalResults: parsedData.totalResults is number of articles
  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c65b284a86c04a94a46e63de99abe758&page=1&pageSize=${this.props.pageSize}`;
    // initially jab components mount ho rhe honge to loading true hoga
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  // pageSize is number of news articles on a current page
  handleNextClick = async () => {
    if (
      !(
        this.state.page + 1 >
        Math.ceil(this.state.totalResults / this.props.pageSize)
      )
    ) {
      let url = `https://newsapi.org/v2/top-headlines?country=${
        this.props.country
      }&category=${
        this.props.category
      }&apiKey=c65b284a86c04a94a46e63de99abe758&page=${
        this.state.page + 1
      }&pageSize=${this.props.pageSize}`;
      // jaise hi req jaiga data fetching ke liye
      // waise hi loading true ho jaega aur false ho jaega jab data mil jaega
      this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: parsedData.articles,
        page: this.state.page + 1,
        loading: false,
      });
    }
  };

  handlePrevClick = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=c65b284a86c04a94a46e63de99abe758&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      page: this.state.page - 1,
      loading: false,
    });
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "30px 0px" }}>
          NewsMonkey - Top Headlines
        </h1>
        {/* agar this.state.loading true hai to <Spinner /> dikhao warna mat dikhao*/}
        {this.state.loading && <Spinner />}
        <div className="row">
          {/* this.state.loading false hai tabhi aage waala part dikhao nahi to spinner dikhao */}
          {!this.state.loading &&
            this.state.articles.map((ele) => {
              return (
                <div key={ele.url} className="col-md-4 my-3">
                  <NewsItem
                    title={ele.title ? ele.title.slice(0, 45) : ""}
                    description={
                      ele.description ? ele.description.slice(0, 88) : ""
                    }
                    imageurl={ele.urlToImage}
                    newsUrl={ele.url}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
