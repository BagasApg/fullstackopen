const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Bibendum, et, tempus ultricies pharetra volutpat et tellus sed vestibulum ac nec.',
    author: 'Nilou',
    url: 'bibendum.com',
    likes: 12,
  },
  {
    title: 'Praesent vulputate, finibus nunc, dictumst erat proin tristique eget ipsum porttitor nulla. Metus.',
    author: 'Sakuta',
    url: 'praesent.gen.com',
    likes: 7,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
