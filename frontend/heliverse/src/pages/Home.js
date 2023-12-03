import React, { useEffect, useState } from 'react';
import { Api_BASE_URL } from '../config';
import axios from 'axios';
import '../css/Home.css';
import User from '../components/User';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Home = () => {
    const [users, setUsers] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [filteredUsers, setFilteredUsers] = useState([])

    const [domain, setDomain] = useState("");
    const [gender, setGender] = useState("");
    const [availability, setAvailability] = useState("");

    const navigate = useNavigate();


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [addUserDetails, setAddUserDetails] = useState({ userId: Number, avatar: "", firstName: "", lastName: "", email: "", gender: "", domain: "", available: "" })

    const [image, setImage] = useState({ img: "", data: "" })



    const getUsers = async () => {
        try {
            const result = await axios.get(`${Api_BASE_URL}/api/users`);
            setUsers(result.data.result);
            setFilteredUsers(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);

        const searchTerm = event.target.value;

        setFilteredUsers(users.filter((user) =>
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm)
        ));
    };




    const applyFilters = (e) => {
        e.preventDefault();


        let updatedFilteredUsers = [...users];


        if (domain !== "") {
            updatedFilteredUsers = updatedFilteredUsers.filter((user) => user.domain.toLowerCase() === domain);
        }

        if (gender !== "") {
            updatedFilteredUsers = updatedFilteredUsers.filter((user) => user.gender.toLowerCase() === gender);
        }

        if (availability !== "") {

            const availabilityValue = availability === "true";
            updatedFilteredUsers = updatedFilteredUsers.filter((user) => user.available === availabilityValue);
        }



        setFilteredUsers(updatedFilteredUsers);
        setDomain("");
        setGender("");
        setAvailability("");
    };



    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }


    const handleImgUpload = async () => {
        if (image.data === "") {
            alert('image field is required')
        }
        else {
            let formData = new FormData();
            formData.append('file', image.data);

            const response = await axios.post(`${Api_BASE_URL}/uploadFile`, formData)
            return response;

        }


    }


    const addUser = async () => {
        const imgRes = await handleImgUpload();

        const request = { userId: addUserDetails.userId, avatar: `${Api_BASE_URL}/files/${imgRes.data.fileName}`, firstName: addUserDetails.firstName, lastName: addUserDetails.lastName, email: addUserDetails.email, gender: addUserDetails.gender, domain: addUserDetails.domain, available: addUserDetails.available }

        await axios.post(`${Api_BASE_URL}/api/users`, request)
            .then((result) => {
                console.log(result)
                alert('user added successfully')
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })

    }



    useEffect(() => {
        getUsers();

    }, []);



    return (
        <div>

            <div className='border p-2 d-flex justify-content-between flex-wrap p-3'>

                <div style={{ cursor: 'pointer' }} className='' >
                    <button className='btn btn-primary' onClick={() => navigate('/group')}>Group</button>
                    <Button variant="warning" className='ms-3' onClick={handleShow}>
                        Add
                    </Button>

                </div>

                <div className="">
                    <input type="text" className='form-control' placeholder="Search by name" onChange={handleSearch} value={searchTerm} />
                </div>



                <div className='d-flex mt-5 m-md-0 border p-2'>

                    <div className="form-group">
                        <label htmlFor="domain">Select Domain:</label>
                        <select
                            id="domain"
                            className="form-select w-25"
                            aria-label="Select Domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        >
                            <option>
                                Choose Domain
                            </option>
                            <option value="it">IT</option>
                            <option value="finance">Finance</option>
                            <option value="management">Management</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Select Gender:</label>
                        <select
                            id="gender"
                            className="form-select w-25"
                            aria-label="Select Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option >
                                Choose Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="bigender">Bigender</option>
                            <option value="polygender">Polygender</option>
                            <option value="agender">Agender</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="availability">Select Availability:</label>
                        <select
                            id="availability"
                            className="form-select w-25"
                            aria-label="Select Availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                        >
                            <option>
                                Choose Availability
                            </option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>

                    <div>
                        <button type='button' className='btn btn-primary ms-2' onClick={(e) => { applyFilters(e) }}>
                            Submit
                        </button>

                    </div>


                </div>


            </div>


            <ul className="d-flex flex-wrap data-container  container">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => <User key={user._id} user={user} remove = "none" />)
                ) : (
                    <p className=' fw-bold'>No users found</p>
                )}
            </ul>


            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>

                            <div className="dropZoneContainer">
                                <input name="file" type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onChange={handleFileSelect} />
                                <div className="dropZoneOverlay mb-3">
                                    {image.preview && <img src={image.preview} className='w-100' alt='...' />}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">Id</label>
                                <input type="number" className="form-control" id="id" value={addUserDetails.userId} onChange={(e) => setAddUserDetails({ ...addUserDetails, userId: Number(e.target.value) })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstname" value={addUserDetails.firstName} onChange={(e) => setAddUserDetails({ ...addUserDetails, firstName: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastname" value={addUserDetails.lastName} onChange={(e) => setAddUserDetails({ ...addUserDetails, lastName: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={addUserDetails.email} onChange={(e) => setAddUserDetails({ ...addUserDetails, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <input type="text" className="form-control" id="gender" value={addUserDetails.gender} onChange={(e) => setAddUserDetails({ ...addUserDetails, gender: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="domain" className="form-label">Domain</label>
                                <input type="text" className="form-control" id="domain" value={addUserDetails.domain} onChange={(e) => setAddUserDetails({ ...addUserDetails, domain: e.target.value })} />
                            </div>
                            <div className="mb-3" required>
                                <select className='form-control' onChange={(e) => setAddUserDetails({ ...addUserDetails, available: (e.target.value === "true") })}>
                                    <option selected value="default">
                                        available
                                    </option>
                                    <option value="true">
                                        true
                                    </option>
                                    <option value="false">
                                        false
                                    </option>
                                </select>
                            </div>


                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addUser}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        </div>
    );
};

export default Home;
