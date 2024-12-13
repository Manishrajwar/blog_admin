import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const baseurl = "http://localhost:4000"
const baseurl = `https://backblog.kusheldigi.com`

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/auth/getAllBlogAdmin`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.post(`${baseurl}/api/v1/auth/deleteBlog`, { blogId });
      if (response.data.status) {
        alert("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>All Blogs</h2>
      <div className="blogs-container">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-box">
            <h3 className="blog-title">{blog.title}</h3>
            <p className="blog-description">{blog.subdescription}</p>
            <div className="images">
              {blog.images.map((image, index) => (
                <img key={index} src={image} alt={`Blog ${index}`} />
              ))}
            </div>
            <div className="button-container">
              <button onClick={() => deleteBlog(blog._id)}>Delete</button>
              <button onClick={() => navigate(`/editBlog/${blog._id}`)}>Edit</button> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
