var _ = require('lodash')

const dummy = (blogs) => {
  // return blogs.length
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  if (blogs.length === 0) {
    return null
  }

  const favBlog = blogs.reduce((prev, blog) => {
    if (blog.likes > prev.likes) {
      return blog
    }
    return prev
  })

  return favBlog

}

const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return null
  }

  const countByBlogs = _.countBy(blogs, (blog) => blog.author)

  const authorList = _.map(countByBlogs, (amount, author) => ({
    author: author,
    blogs: amount
  }))
  return _.maxBy(authorList, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const reformatted = _.map(groupedByAuthor, (listBlogs, author) => ({
    author: author,
    likes: _.sumBy(listBlogs, 'likes')
  }))

  const blogWithMostLikes = _.maxBy(reformatted, 'likes')

  console.log(blogWithMostLikes)
  return blogWithMostLikes

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
