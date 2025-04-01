import React, {  useEffect, useState  } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function App() {
  const [formData, setFormData] = useState({title:''});
  const [data, setData] = useState([]);
  const [isFiltered,setIsFiltered]=useState(false)
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const statuses=['pending','in-progress','completed'];
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    axios
      .get("https://todo-backend-1-g56h.onrender.com/api/todo/list") // Replace with your Laravel API endpoint
      .then((response) => {
        setData(response.data.data); // Store data in state
        console.log(response.data)
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  const handleDueChange = (date) => {
    setSelectedDate(date);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSearch = (search) => {
  if(search.length>0){
        setIsFiltered(true);
        setFilteredData(data.filter((item) =>item.title.toLowerCase().includes(search.toLowerCase())))
  }else{
      setFilteredData([])
      setIsFiltered(false);
  }
  };
const handleDelete=(id)=>{

    Swal.fire({
      title: 'Danger!',
      text: 'Do you want to delete this item?',
      icon: 'error',
      confirmButtonText: 'Yes',
      cancelButtonText:'No!',
        showCancelButton: true,
    }).then(async(result) => {
     if (result.isConfirmed) {
     const response1 = await axios.post("https://todo-backend-1-g56h.onrender.com/api/todo/delete", {'id':id}, {
             headers: {
               "Content-Type": "application/json",
             },
           });
           if(response1.status==200){
           setData(data.filter(item => item.id !== id))
           }
     }else{

     }
   })
}
  const handleEdit = async (id) => {
  setEditingId(id);
  }

  const handleUpdate = async (id) => {
  try {
      const data={
      'status':status,
      'id':id
      }
            const response = await axios.post("https://todo-backend-1-g56h.onrender.com/api/todo/update", data, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log("Response:", response.data);
             if (response.status==200) {
                            setData((data) =>
                                  data.map((item) =>
                                    item.id === editingId ? { ...item, status: status } : item
                                  )
                                );
                                setEditingId(null)
                                Swal.fire({
                                  title: 'Info!',
                                  text: 'Todo status updated successfully',
                                  icon: 'success',
                                  confirmButtonText: 'OK!',
                                })
                        } else {
                            Swal.fire({
                              title: 'Info!',
                              text: 'Todo status did not update',
                              icon: 'error',
                              confirmButtonText: 'OK!',
                            })
                        }


          } catch (error) {
            console.error("Error:", error);
            alert("Failed to send data.");
          }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(selectedDate==null || formData.title==''){
    alert('please complete all fields')
    }else{
    try {
    const data={
    'title':formData.title,
    'due':selectedDate.toLocaleDateString('en-CA')
    }
          const response = await axios.post("https://todo-backend-1-g56h.onrender.com/api/todo/create", data, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Response:", response.data);
           if (response.status==201) {
                          setData((data) => [...data, response.data.data]);
                          setFormData({ title: '' });
                          setSelectedDate(null);
                      } else {
                          console.error('Insert failed');
                      }


        } catch (error) {
          console.error("Error:", error);
          alert("Failed to send data.");
        }
    }

  };
  return (
  <div className="container mt-4">
      <h1 className="text-center mb-4">Create new Todo</h1>
      <form onSubmit={handleSubmit} className="form-inline d-flex justify-content-center mb-4">
          <div className="form-group mx-2">
              <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  id="inputTitle"
                  placeholder="Task title"
              />
          </div>
          <div className="form-group mx-2">
              <DatePicker
                  selected={selectedDate}
                  onChange={handleDueChange}
                  dateFormat="yyyy/MM/dd"
                  className="form-control form-control-lg"
                  name="due"
                  placeholderText="Due date"
                  autoComplete="off"
                  onKeyDown={(e) => e.preventDefault()}
                  onPaste={(e) => {
                      e.preventDefault();
                      setSelectedDate(null);
                  }}
              />
          </div>
          <button type="submit" className="btn btn-primary btn-lg mb-2">Add</button>
      </form>
      <div>
      <h2 className="text-center mb-4">Todo list items</h2>
      <div className="form-group my-3">
                    <input
                        type="text"
                        name="title"
                        onChange={(e)=>handleSearch(e.target.value)}
                        className="form-control form-control-lg"
                        id="inputTitleSearch"
                        placeholder="search based on title"
                    />
                </div>
            <table className="table table-bordered table-striped table-hover table-responsive-sm">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isFiltered==false?data.length>0?data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.title}</td>
                            <td>{item.due}</td>
                            <td>
                            <select className="form-control" disabled={item.id !== editingId} onChange={(e) => setStatus(e.target.value)}>
                              {statuses.map((status, index) => (
                                <option key={index} value={status} selected={status === item.status}>{status}</option>
                              ))}
                            </select>
                            </td>
                            <td>
                                <button className="btn btn-danger mx-2 delete_btn" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </button>
                                <button className={editingId==item.id? 'btn btn-warning mx-2 d-none' : 'btn btn-warning mx-2 '} onClick={() => handleEdit(item.id)}>
                                    Edit
                                </button>
                                <button className={editingId==item.id? 'btn btn-success mx-2' : 'btn btn-warning mx-2 d-none'} onClick={() => handleUpdate(item.id)}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    )):<tr ><td colSpan="5">No items found.</td></tr>:filteredData.length>0?filteredData.map((item, index) => (
                                              <tr key={index}>
                                                  <td>{index + 1}</td>
                                                  <td>{item.title}</td>
                                                  <td>{item.due}</td>
                                                  <td>
                                                  <select className="form-control" disabled={item.id !== editingId} onChange={(e) => setStatus(e.target.value)}>
                                                    {statuses.map((status, index) => (
                                                      <option key={index} value={status} selected={status === item.status}>{status}</option>
                                                    ))}
                                                  </select>
                                                  </td>
                                                  <td>
                                                      <button className="btn btn-danger mx-2 delete_btn" onClick={() => handleDelete(item.id)}>
                                                          Delete
                                                      </button>
                                                      <button className={editingId==item.id? 'btn btn-warning mx-2 d-none' : 'btn btn-warning mx-2 '} onClick={() => handleEdit(item.id)}>
                                                          Edit
                                                      </button>
                                                      <button className={editingId==item.id? 'btn btn-success mx-2' : 'btn btn-warning mx-2 d-none'} onClick={() => handleUpdate(item.id)}>
                                                          Update
                                                      </button>
                                                  </td>
                                              </tr>
                                          )):<tr><td colSpan="5">No items found for this search term.</td></tr>}
                </tbody>
            </table>
      </div>

  </div>

          );
}

export default App;
