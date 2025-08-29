import { useEffect, useState } from 'react';
import './App.css';
import Header from './component/Header';
import axios from 'axios';

const App = () => {

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'low':
        return { backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', };
      case 'medium':
        return { backgroundColor: 'orange', color: 'white', padding: '5px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', };
      case 'high':
        return { backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', };
      default:
        return {};
    }
  };



  const [editMode, setEditMode] = useState(false);
  const [list, setList] = useState([]);
  const [list2, setList2] = useState([]);
  const [task, setTask] = useState('');
  const [userId, setUserId] = useState('');
  const [priority, setPriority] = useState('low');
  const [filterPriority, setFilterPriority] = useState('all'); 




  const showTodos = async () => {
    try {
      const { data } = await axios.get('/api/show/todos');
      setList(data);
    } catch (error) {
      console.log(error);
    }
  }

  const showCompleted = async () => {
    try {
      const { data } = await axios.get('/api/show/complete');
      setList2(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  // add todo
  const addtodo = async (e) => {
    e.preventDefault();
    try {
      const add = await axios.post('/api/create/list', { task, priority });
      if (add.status === 200) {
        setTask('');
        showTodos();
      }

    } catch (error) {
      console.log(error);
    }
  }

  // delete single todo
  const deleteTodo = async (id) => {

    try {
      const todoDelete = await axios.delete(`/api/delete/todo/${id}`);
      if (todoDelete.status === 200) {
        showTodos();
        showCompleted();
      }

    } catch (error) {
      console.log(error);
    }
  }
  // delete completed todo
  const deleteCompleted = async (id) => {

    try {
      const todoDelete = await axios.delete(`/api/delete/Completed/${id}`);
      if (todoDelete.status === 200) {
        showTodos();
        showCompleted();
      }

    } catch (error) {
      console.log(error);
    }
  }

  const showSingleTodo = async (id) => {
    setEditMode(true);

    try {
      const { data } = await axios.get(`/api/todo/${id}`);
      setTask(data.data.task);
      setUserId(data.data.id);
      setPriority(data.data.priority)

    } catch (error) {
      console.log(error);
    }
  }

  //edit todo
  const editTodo = async (e) => {
    e.preventDefault() // stops refreshing the page retainig all the state varibales of react

    try {
      const edit = await axios.put(`/api/update/todo/${userId}`, { task, priority });

      if (edit.status === 200) {
        setEditMode(false);
        setTask('');
        showTodos();
      }
    } catch (error) {
      console.log(error)
    }

  }


  // completed todo
  const markCompleted = async (id) => {
    try {
      const res = await axios.put(`/api/complete/todo/${id}`);
      console.log(res.data);
      showTodos();
      showCompleted();
    } catch (error) {
      console.error("Error completing todo:", error.response?.data || error.message);
    }
  }

  //mark todo
  const markTodo = async (id) => {
    try {
      const res = await axios.put(`/api/mark/todo/${id}`);
      showTodos();
      showCompleted();
    } catch (error) {
      console.error("Error marking it todo : ", error.resposne?.data || error.message);
    }
  }


  useEffect(() => {
    showTodos();
    showCompleted();
  }, []); // [] signifies rendering only once

  return (
    <>
      <Header />
      <div className="container">
        <div className="form" style={{ paddingBottom: "50px", paddingTop: "50px" }}>
          <form onSubmit={editMode ? editTodo : addtodo}>
            <div className="form-wrapper" style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, marginRight: "10px" }}>
                <input onChange={(e) => setTask(e.target.value)} value={task} className="form-control" type="text" placeholder="Task" name="task"></input>
              </div>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: "200px", marginLeft: "10px" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>


              {/* */}
              {
                editMode ?
                  <button type='submit' style={{ width: "200px", marginLeft: "10px" }} className='btn btn-primary'>Edit</button>
                  :
                  <button type='submit' style={{ width: "200px", marginLeft: "10px" }} className='btn btn-success'>Add</button>
              }

            </div>
            <div style={{ marginBottom: "20px",marginTop:'25px' }}>
              <label>Filter by priority: </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="form-control"
                style={{ width: "200px", display: "inline-block", marginLeft: "10px" }}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

          </form>
        </div>

        <table className="table">
          {/* <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task</th>
              
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              list && list.map(d => (
                <tr key={d.id} >
                  <th scope="row">{d.id}</th>
                  <td>{d.task}</td>
                  
                  <td>
                    <i onClick={() => showSingleTodo(d.id)} className="fa-solid fa-pen-to-square" style={{ color: "green", cursor: "pointer", marginRight: "25px" }} ></i>
                    <i onClick={() => deleteTodo(d.id)} style={{ color: "red", cursor: "pointer" }} className="fa-solid fa-trash-can"></i>
                  </td>

                </tr>

              ))
            }

          </tbody> */}


          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list && list.length > 0 ? (
              list
                .filter(d => filterPriority === 'all' || d.priority === filterPriority)
                .map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.task}</td>
                    <td>
                      <span style={getPriorityStyle(d.priority)}>
                        {d.priority.toUpperCase()}
                      </span>
                    
                    </td>
                    <td>{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
                    <td>{d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '-'}</td>
                    <td>
                      <i onClick={() => showSingleTodo(d.id)} className="fa-solid fa-pen-to-square" style={{ color: "green", cursor: "pointer", marginRight: "25px" }} ></i>
                      <i onClick={() => deleteTodo(d.id)} style={{ color: "red", cursor: "pointer",marginRight:'25px' }} className="fa-solid fa-trash-can"></i>
                    
                      <button className="btn btn-info" onClick={() => markCompleted(d.id)}>Complete</button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  <h4>No records found</h4>
                </td>
              </tr>
            )}
          </tbody>


          <div><h2 style={{marginTop:'35px'}}>Completed tasks</h2></div>

        </table>
        <table className='table'>
          <thead><tr>
            <th>id</th>
            <th>task</th>
            <th>createdAt</th>
            <th>CompletedAt</th>
            <th>Actions</th>
          </tr></thead>

          <tbody>
            {list2 && list2.length > 0 ? (
              list2.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.task}</td>
                  <td>{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
                  <td>{d.completedAt ? new Date(d.completedAt).toLocaleString() : '-'}</td>
                  <td>

                    <i onClick={() => deleteCompleted(d.id)} style={{ color: "red", cursor: "pointer" }} className="fa-solid fa-trash-can"></i>
                  
                  <button className="btn btn-info" onClick={() => markTodo(d.id)} style={{marginLeft:'25px'}}>ToDo</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  <h4>No records found</h4>
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App