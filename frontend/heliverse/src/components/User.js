import axios from 'axios'
import React from 'react'
import { Api_BASE_URL } from '../config'

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const User = (props) => {
    const user = props.user


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [image, setImage] = useState({ preview: '', data: '' })

    const [editDetails, setEditDetails] = useState({ userId: Number, avatar: "", firstName: "", lastName: "", email: "", gender: "", domain: "", available: "" })



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



    const addToGroup = () => {
        axios.post(`${Api_BASE_URL}/api/addtogroup`, { userId: user.userId, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, email: user.email, gender: user.gender, domain: user.domain, available: user.available })
            .then((result) => {
                alert('user Added')
            })
            .catch((error) => {
                alert('user already exists')
            })
    }


    const editUser = async () => {
        if (image.data === "") {
            alert('image required')
        }
        else {
            const imgRes = await handleImgUpload();
            const imgUrl = `${Api_BASE_URL}/files/${imgRes.data.fileName}`


            const requestData = Object.entries(editDetails).reduce((acc, [key, value]) => {
                if (value !== "") {
                    acc[key] = value;
                }
                return acc;
            }, {});


            await axios.put(`${Api_BASE_URL}/api/users/${user._id}`, { ...requestData, avatar: imgUrl })
                .then((response) => {
                    console.log(response);
                    window.location.reload();
                    alert('user edited successfully');
                   

                })
                .catch((error) => {
                    console.log(error)
                })

        }


    };



    const deleteUser = () => {
        axios.delete(`${Api_BASE_URL}/api/users/${user._id}`)
        .then((response) => {
            console.log(response);
            alert('user deleted successfully')
            window.location.reload();
           
        })
        .catch((error) => {
            console.log(error)
        })
    }


    const removeGroupUser = () => {
        axios.delete(`${Api_BASE_URL}/api/removegroupuser/${user._id}`)
        .then((response) => {
            console.log(response);
            alert('user removed successfully')
            window.location.reload();
           
        })
        .catch((error) => {
            console.log(error)
        })

    }

    return (
        <li style={{ listStyleType: 'none' }} className='m-3'>
            <div className="card" style={{ width: 18 + "rem" }}>
                <img src={user.avatar} className="card-img-top " style={{height: 350 + "px"}} alt={user.firstName} />
                <div className="card-body">
                    <h5 className="card-title">{user.firstName} {user.lastName} </h5>
                    <p className="card-text">Id: {user.userId} </p>
                    <p className="card-text">Email: {user.email}</p>
                    <p className="card-text">Gender: {user.gender}</p>
                    <p className="card-text">Domain: {user.domain} </p>
                    <p className="card-text">Available: {`${user.available}`} </p>


                    <div>
                        <button className={`btn btn-primary d-${props.display} mb-3`} onClick={addToGroup}>Add to group</button>
                    </div>



                    <Button variant="warning" className='mb-3' onClick={handleShow}>
                        Edit
                    </Button>


                    <div>
                        <button className={`btn btn-danger d-${props.display} mb-3`} onClick={deleteUser} >Delete</button>
                    </div>

                    <div>
                        <button className={`btn btn-danger d-${props.remove} mb-3`} onClick={removeGroupUser} >Remove</button>
                    </div>

                </div>
            </div>


            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
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
                                <input type="number" className="form-control" id="id" value={editDetails.userId} onChange={(e) => setEditDetails({ ...editDetails, userId: Number(e.target.value) })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstname" value={editDetails.firstName} onChange={(e) => setEditDetails({ ...editDetails, firstName: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastname" value={editDetails.lastName} onChange={(e) => setEditDetails({ ...editDetails, lastName: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={editDetails.email} onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <input type="text" className="form-control" id="gender" value={editDetails.gender} onChange={(e) => setEditDetails({ ...editDetails, gender: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="domain" className="form-label">Domain</label>
                                <input type="text" className="form-control" id="domain" value={editDetails.domain} onChange={(e) => setEditDetails({ ...editDetails, domain: e.target.value })} />
                            </div>
                            <div className="mb-3" required>
                             
                                <select className='form-control' onChange={(e) => setEditDetails({ ...editDetails, available: (e.target.value === "true") })} >
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
                        <Button variant="primary" onClick={editUser}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        </li>
    )
}

export default User