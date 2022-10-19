import _ from 'lodash';

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((p, c) => p + c.likes, 0);

const favoriteBlog = (blogs) => {
  const { title, author, likes } = _.maxBy(blogs, 'likes');

  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const grouped = _.countBy(blogs, 'author');
  const entries = Object.entries(grouped);
  const res = _.maxBy(entries, (e) => e[1]);

  return { author: res[0], blogs: res[1] };
};

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const entries = Object.entries(grouped);
  const authorLikePair = entries.map((e) => [e[0], _.sumBy(e[1], 'likes')]);
  const res = _.maxBy(authorLikePair, (e) => e[1]);
  return { author: res[0], likes: res[1] };
};

export {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
