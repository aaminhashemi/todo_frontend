import React, {  useEffect, useState  } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function App() {
  const [formData, setFormData] = useState({title:''});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
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
  const handleUpdate = async (e) => {
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(selectedDate==null || formData.title==''){
    alert('please complete all fields')
    }else{
    try {
    const data={
    'title':formData.title,
    'due':selectedDate.toLocaleDateString('fa-IR')
    }
          const response = await axios.post("https://todo-backend-1-g56h.onrender.com/api/todo/create", data, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Response:", response.data);
           if (response.status==201) {
                          //const result = await response.json();
                          setData((data) => [...data, response.data.data]); // Update state with the new item
                          setFormData({ title: '' }); // Reset form inputs
                      } else {
                          console.error('Insert failed');
                      }


        } catch (error) {
          console.error("Error:", error);
          alert("Failed to send data.");
        }
    }

  };
  return (<div className="container">
                <h1 className="text-center">Todo List Items</h1>
                <form onSubmit={handleSubmit} className="form-inline d-flex">
                  <div className="form-group mx-sm-3 mb-2">
                    <input type="text" name="title"  value={formData.title} onChange={handleChange} className="form-control" id="inputTitle" placeholder="title" />
                  </div> <div className="form-group mx-sm-3 mb-2">
                    <DatePicker
                            selected={selectedDate}
                            onChange={handleDueChange}
                            dateFormat="yyyy/MM/dd" // فرمت تاریخ (مثلاً 2025/03/28)
                            className="form-control"
                            name="due"
                            autoComplete="off"
          onKeyDown={(e) => {
              e.preventDefault();
          }}
          onPaste={(e) => {
              e.preventDefault();
              setSelectedDate(null)
          }}
                          />
                  </div>
                  <button type="submit" className="btn btn-primary mb-2">Add</button>
                </form>
                <h1>Data from Laravel</h1>

                      <table className="table table-bordered table-striped table-hover table-responsive">
                                  <thead className="thead-dark">
                                      <tr>
                                          <th>#</th>
                                          <th>Title</th>
                                          <th>Due date</th>
                                          <th>Status</th>
                                          <th>Operation</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  {data.map((item,index) => (
                                      <tr key={index}>
                                          <td>{index+1}</td>
                                          <td>{item.title}</td>
                                          <td>{item.due}</td>
                                          <td>{item.status}</td>
                                          <td>
                                          <span className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                          delete
                                          </span>
                                          <span className="btn btn-warning" onClick={() => handleUpdate(item.id)}>
                                          delete
                                          </span>
                                          </td>
                                      </tr>
                                     ))}

                                  </tbody>
                              </table>
              </div>
          );
}

export default App;
