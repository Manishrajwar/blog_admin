import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./page.css";
import JoditEditor from "jodit-react";



// const baseurl = `https://blog-back-7jx6.onrender.com`;
// const baseurl = `http://localhost:4000`
const baseurl = `https://backblog.kusheldigi.com`
function EditPage() {
  
  const { blogId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    subdescription: "",
    images: [],
    banner: [],
    category: "", 
    author:""
  });
  const [categories, setCategories] = useState([]); 
  const navigate = useNavigate();
  const editor = useRef(null);

  const [content , setContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/v1/auth/getBlog/${blogId}`);
        const { title, subdescription, images, category , description , banner , author } = response.data.blog;
        setContent(description);
        setFormData({ title, subdescription, images, category: category._id , banner  , author}); 
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/v1/auth/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBlog();
    fetchCategories();
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };
  const handleFileChange2 = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, banner: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subdescription", formData.subdescription);
    data.append("description", content);
    data.append("author", formData.author);
    data.append("categoryId", formData.category); 
    formData.images.forEach((image) => data.append("images", image));
    formData.banner.forEach((image) => data.append("banner", image));

    try {
      const response = await axios.post(`${baseurl}/api/v1/auth/editBlog/${blogId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        alert("Blog updated successfully!");
        navigate("/allBlog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog");
    }
  };

  return (
    <section className="App">
      <h2>EDIT BLOG</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Title</p>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </label>

        <label>
          <p>subdescription</p>
          <input type="text" name="subdescription" value={formData.subdescription} onChange={handleInputChange} required />
        </label>
        <label>
          <p>Author Name</p>
          <input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
        </label>

        <label>
          <p>Description</p>
          <JoditEditor
                        ref={editor}
                        value={content}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                        onChange={(newContent) => {
                          setContent(newContent);
                        }}
                      
                      />
        </label>


        <label>
          <p>Category</p>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <p>Image</p>
          <input type="file" multiple onChange={handleFileChange} />
        </label>
        <label>
          <p>Banner</p>
          <input type="file" multiple onChange={handleFileChange2} />
        </label>

        <button className="creabun" type="submit">Update Blog</button>
      </form>
    </section>
  );
}

export default EditPage;
