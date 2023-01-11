import {useEffect, useState} from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export const Home = () => {

    const [edID, setEdID] = useState('');
    const [edName, setEdName] = useState('');
    const [edCat, setEdCat] = useState('');
    const [edRating, setEdRating] = useState('');
    const [data, setData] = useState([]);

    const [newName, setNewName] = useState('');
    const [newCat, setNewCat] = useState('');
    const [newRat, setNewRat] = useState('');

    const [addName, setAddName] = useState('');
    const [addCat, setAddCat] = useState('');
    const [addRat, setAddRat] = useState('');

    const [search, setSearch] = useState('');

    function searchData() {
        axios.get(`http://localhost:3000/search?search=${search}`)
            .then((res)=>{
                console.log('search: '+res.data);
                setData(res.data);
            })
    }

    function edit() {
        axios.post('http://localhost:3000/editUser', {
            newName,
            newCat,
            newRat,
            edID
        }).then((res) => {
            console.log(res.data);
            if (res.data === 'success') {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User Details Updated!',
                    showConfirmButton: false,
                    timer: 1500
                })
                showAll();
            }
        })
    }

    function fetchUser(userId) {
        axios.get(`http://localhost:3000/getUser?id=${userId}`)
            .then((res) => {
                console.log("User Data: " + res.data);
                let data = res.data;
                setEdID(userId);
                setEdName(data[0].name);
                setEdCat(data[0].category);
                setEdRating(data[0].rating);
            })
    }

    function deleteCat(userId) {
        Swal.fire({
            title: 'Do you want to delete this user?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log('Confirmed')
                axios.get(`http://localhost:3000/deleteCat?id=${userId}`)
                    .then((res) => {
                        console.log(res.data);
                        if (res.data === 'Deleted') {
                            Swal.fire('Deleted', '', 'success')
                            showAll();
                        }
                    });

            } else if (result.isDenied) {
                console.log('Denied')
                Swal.fire('Delete Cancelled', '', 'info');
                showAll();
            }
        })
    }
    
    function addUser() {
        axios.post('http://localhost:3000/addUser', {
            addName,
            addCat,
            addRat
        }).then(res => {
            console.log(res.data);
            if(res.data==='Added'){
                Swal.fire('User Added', '','success')
            }
            showAll();
        });
    }

    function showAll(){
        axios.get('http://localhost:3000/getData')
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
    }

    useEffect(() => {
        showAll();
    }, []);

    return (
        <>
            <div className="main-cont">
                <div className="top-sect d-flex justify-content-center align-items-center">
                    <div className="nav-title text-light text-uppercase font-weight-bolder">
                        <h2>Admin Dashboard</h2>
                    </div>
                </div>
                <div className="mid-sect w-75">
                    <div className="table_cont d-flex justify-content-center align-items-center w-100">
                        <table className="table-hover table-bordered w-100">
                            <thead>
                            <th>id</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Rating</th>
                            <th colSpan={2}>Options</th>
                            </thead>
                            <tbody>
                            {
                                data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {value.name}
                                            </td>
                                            <td>
                                                {value.category}
                                            </td>
                                            <td>
                                                {value.rating}
                                            </td>
                                            <td>
                                                <button title="Edit" onClick={() => fetchUser(value.id)} className="btn btn-outline-info" data-toggle="modal" data-target="#editModal"><i className="fa-solid fa-pen-to-square"></i></button>
                                            </td>
                                            <td>
                                                <button title="Delete" onClick={() => deleteCat(value.id)} className="btn btn-outline-danger"><i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="options mt-5">
                        <h2 className="text-light">Options</h2>
                        <div className="opCont d-flex align-items-center">
                            <div className="opBtns px-5">
                                <button className="btn btn-outline-light" data-toggle="modal" data-target="#addModal">ADD</button>
                            </div>
                            <div className="search px-5 d-flex align-items-center">
                                <input type="text" name="search" id="search" placeholder="search data..." onChange={(e)=>setSearch(e.target.value)}/>
                                <button className="btn btn-outline-light mx-2" onClick={searchData}>Search</button>
                                <button className="btn btn-outline-light mx-2" onClick={showAll}>Show All</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Edit Modal  */}
                <div>
                    <div className="modal fade" id="editModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit User Details</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="border border-light p-5">
                                        <p className="h4 mb-4">User Details</p>
                                        <div className="d-flex flex-column">
                                            <label htmlFor="edname">Name</label>
                                            <input type="text" id="edname" className="input-group mb-2" onChange={(e) => setNewName(e.target.value)} defaultValue={edName}/>
                                            <label htmlFor="edCat" className="mt-2">Category</label>
                                            <input type="text" id="edCat" className="input-group mb-2" onChange={(e) => setNewCat(e.target.value)} defaultValue={edCat}/>
                                            <label htmlFor="edRat" className="mt-2">Rating</label>
                                            <input type="number" id="edRat" className="input-group mb-2" onChange={(e) => setNewRat(e.target.value)} defaultValue={edRating}/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={edit}>Edit Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Edit Modal End  */}
                {/*  Add Modal  */}
                <div>
                    <div className="modal fade" id="addModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="border border-light p-5">
                                        <p className="h4 mb-4">User Details</p>
                                        <div className="d-flex flex-column">
                                            <label htmlFor="edname">Name</label>
                                            <input type="text" id="edname" className="input-group mb-2" onChange={(e) => setAddName(e.target.value)} placeholder="Name"/>
                                            <label htmlFor="edCat" className="mt-2">Category</label>
                                            <input type="text" id="edCat" className="input-group mb-2" onChange={(e) => setAddCat(e.target.value)} placeholder="Category"/>
                                            <label htmlFor="edRat" className="mt-2">Rating</label>
                                            <input type="number" id="edRat" className="input-group mb-2" onChange={(e) => setAddRat(e.target.value)} placeholder="Rating"/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={addUser}>Add User</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Add Modal End  */}
            </div>
        </>
    )
}