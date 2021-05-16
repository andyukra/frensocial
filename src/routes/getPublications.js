import db from '$lib/db';
import publications from '$lib/publications';

export async function get({headers, query}) {
    if(!headers.referer) return null;
    let publicaciones;

    if(query.get('type') && /^[a-zA-Z]+$/.test(query.get('type'))) {
        if(query.get('type') === 'todo'){
            publicaciones = await publications.find().sort({time: -1});
        } else {
            publicaciones = await publications.find({type: query.get('type')}).sort({time: -1})
        }
    } else {
        publicaciones = await publications.find().sort({time: -1});
    }
    
    return {
        status: 200,
        body: {
            data: publicaciones
        }
    }
}