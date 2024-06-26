import React, { useState, useEffect } from 'react';
import BASE_URL from "../../../../apiConfig";
const WhychooseUsEdit = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: '',
    image: null
  });
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // Fetch saved data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editMode ? `${BASE_URL}/WhychooseUsEdit/updateWhyChooseUsItem/${editId}` : `${BASE_URL}/WhychooseUsEdit/saveWhyChooseUsItem`;
    const method = editMode ? 'PUT' : 'POST';

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('order', formData.order);
    formDataToSend.append('image', formData.image);

    try {
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        alert(`Item ${editMode ? 'updated' : 'saved'} successfully`);
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          order: '',
          image: null
        });
        setEditMode(false);
        setEditId(null);
        // Refetch data
        const updatedItems = await fetch(`${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`).then(res => res.json());
        setItems(updatedItems);
      } else {
        alert(`Failed to ${editMode ? 'update' : 'save'} item`);
      }
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'saving'} item:`, error);
      alert(`An error occurred while ${editMode ? 'updating' : 'saving'} the item`);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.WhyChooseUsTitle,
      description: item.WhyChooseUsDiscreption,
      order: item.WhyChooseUsOrder,
      image: null // Image needs to be re-uploaded
    });
    setEditMode(true);
    setEditId(item.WhyChooseUsId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/WhychooseUsEdit/deleteWhyChooseUsItem/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Item deleted successfully');
        // Refetch data
        const updatedItems = await fetch(`${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`).then(res => res.json());
        setItems(updatedItems);
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred while deleting the item');
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add Data</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              Order:
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              Image:
              <input type="file" name="image" onChange={handleFileChange} required={!editMode} />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}

      <h2>Saved Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.WhyChooseUsId}>
             <img src={`data:image/png;base64,${item.WhyChooseUsImeage}`} alt={item.WhyChooseUsTitle} />
            {item.WhyChooseUsTitle} - {item.WhyChooseUsDiscreption} - {item.WhyChooseUsOrder}
            <button onClick={() => handleEdit(item)}>Update</button>
            <button onClick={() => handleDelete(item.WhyChooseUsId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhychooseUsEdit;
