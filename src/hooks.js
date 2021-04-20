import cookie from 'cookie';
import db from '$lib/db';
import users from '$lib/users';

const {parse} = cookie;

export async function getContext({headers}) {
    const cookies = parse(headers.cookie || '');

    if(!cookies.sessionID) {
        return {
            authenticated: false
        }
    }
    const asd = await users.findById(cookies.sessionID);
    if(asd?.username) {
        return {
            user : asd.username,
            authenticated: true
        }
    } else {
        return {
            authenticated: false
        }
    }
}

export async function getSession({context}) {
    if(!context.authenticated) {
        return {
            authenticated: false
        }
    } else {
        return {
            authenticated: true,
            user: context.user
        }
    }
}