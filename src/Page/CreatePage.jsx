import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./page.css";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";

// const baseurl = "http://localhost:4000";
const baseurl = `https://backblog.kusheldigi.com`

function CreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    images: [],
    banner: [],
    categoryId: "",
    subdescription:"" , 
    author:""
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const config = {
    readonly: false, // Enable editing
    toolbarSticky: true, // Sticky toolbar
    style: {
      fontFamily: "Poppins, sans-serif", // Default font-family
    },
    fontfamily: {
      "Poppins": "Poppins, sans-serif", // Add Poppins
      "Arial": "Arial, sans-serif",
      "Georgia": "Georgia, serif",
      "Times New Roman": "Times New Roman, serif",
      "Verdana": "Verdana, sans-serif",
    },
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "video",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
    uploader: {
      insertImageAsBase64URI: true, // Allow images as Base64
    },
    height: 400, // Set editor height
    width: "100%", // Full width
    placeholder: "Start typing here...",
  };

  const [content, setContent] = useState("");

  const editor = useRef(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/v1/auth/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };
  const handleFileChange2 = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, banner: files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", content); 
    data.append("subdescription", formData.subdescription); 
    data.append("categoryId", formData.categoryId);
    data.append("author", formData.author);
    formData.images.forEach((image) => data.append("images", image));
    formData.banner.forEach((image) => data.append("banner", image));

    try {
      const response = await axios.post(`${baseurl}/api/v1/auth/createBlog`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        alert("Blog created successfully!");
        setFormData({
          title: "",
          description: "",
          images: [],
          banner: [],
          categoryId: "",
          author:""
        });
        navigate("/allBlog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog");
    }
  };

  return (
    <section className="App">
      <h2>CREATE BLOG</h2>
      <form onSubmit={handleSubmit}>

        <label>
          <p>Title</p>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          <p>Sub Description</p>
          <input
            type="text"
            name="subdescription"
            value={formData.subdescription}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          <p>Author Name</p>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          <p>Description</p>

          {/* <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1} // Tab index for editor
      onBlur={(newContent) => setContent(newContent)}
      onChange={(newContent) => setContent(newContent)}
    /> */}
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
            name="categoryId"
            className="options"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
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

        <button className="create-btn" type="submit">Create Blog</button>
        <button
          onClick={() => navigate("/allBlog")}
          className="dfewrew"
          type="button"
        >
          Go to all blog
        </button>
        <button onClick={() => navigate("/category")}>Go to create category page</button>
        <button onClick={() => navigate("/allCategory")}>All Category</button>
      </form>
    </section>
  );
}

export default CreatePage;
