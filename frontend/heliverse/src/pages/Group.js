import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Api_BASE_URL } from '../config';
import User from '../components/User';

const Group = () => {

    const [users, SetUsers] = useState(null);

    useEffect(() => {
        axios.get(`${Api_BASE_URL}/api/getgroupusers`)
            .then((result) => {
                SetUsers(result.data.users)

            })
            .catch((error) => {
                console.log(error)
            })
    }, []);

    
    return (
        <div >
            <ul className=' container d-flex flex-wrap'>
                {users !== null ?

                    users.map((user) => <User user={user} key={user._id} display="none" remove = "block" />

                    )

                    :
                    <p>...loading</p>}

            </ul>

        </div>)
}

export default Group