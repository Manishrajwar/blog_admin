import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseurl = `https://backblog.kusheldigi.com`;

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/auth/getAllBlogAdmin`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.post(`${baseurl}/api/v1/auth/deleteBlog`, { blogId });
      if (response.data.status) {
        alert('Blog deleted successfully');
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/auth/searchBlog?term=${searchTerm}`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error searching blogs:', error);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading blogs...</p>;
  }

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h2>All Blogs</h2>
      <div className="blogs-container">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-box">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-description">{blog.subdescription}</p>
              {blog.images?.length > 0 && (
                <div className="images">
                  {blog.images.map((image, index) => (
                    <img key={index} src={image} alt={`Blog ${index}`} />
                  ))}
                </div>
              )}
              <div className="button-container">
                <button className="delete-button" onClick={() => deleteBlog(blog._id)}>
                  Delete
                </button>
                <button className="edit-button" onClick={() => navigate(`/editBlog/${blog._id}`)}>
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No Blogs Available</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;
