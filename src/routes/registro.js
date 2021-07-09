import db from '$lib/db';
import users from '$lib/users';
import StringHash from 'string-hash';
import cookie from 'cookie';

export async function post({body, headers}) {
    let { username, password, email } = JSON.parse(body);
    if(username.length < 3 || username.length > 25 || password.length < 3 || password.length > 25 || email.length < 3 || email.length > 100) {
        return {
            status: 409,
            body: {
                message: 'Error en el registro'
            }
        }
    }

    if(/p+e+d+[o0]+/ig.test(username) || /f+[iy]+l+[o0]+/ig.test(username)) {
        console.log(headers)
        return {
            headers: {Location: '/register'},
            status: 302
        }
    }

    const existsUser = await users.findOne({username}, {email});

    if(existsUser) {
        return {
            status: 409,
            body: {
                message: 'exists'
            }
        }
    }

    const newUser = new users({ username, password : StringHash(password), email });

    let { _id } = await newUser.save();

    if(!_id) return {
        status: 409,
        body: {
            message: 'Error en el registro'
        }
    }

    const Headers = {
        'Set-cookie' : cookie.serialize('sessionID', _id, {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            path: '/'
        })
    }

    return {
        status: 200,
        Headers,
        body : {
            message: 'success'
        }
    }
}