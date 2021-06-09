import db from '$lib/db';
import publications from '$lib/publications';

export async function get({headers, query}) {
    if(!headers.referer) return null;
    let publicaciones;

    if(query.get('key') && query.get('pag')){
        publicaciones = await publications.find({author: query.get('key')}).sort({time: -1}).skip((query.get('pag') - 1) * 10).limit(10);
        return {
            status: 200,
            body: {
                data: publicaciones
            }
        }
    }

    if(query.get('type') && query.get('pag') && /^[a-zA-Z]+$/.test(query.get('type'))) {
        if(query.get('type') === 'todo'){
            publicaciones = await publications.find().sort({time: -1}).skip((query.get('pag') - 1) * 10).limit(10);
        } else {
            publicaciones = await publications.find({type: query.get('type')}).sort({time: -1}).skip((query.get('pag') - 1) * 10).limit(10)
        }
    } else {
        publicaciones = await publications.find().sort({time: -1}).skip((query.get('pag') - 1) * 10).limit(10);
    }
    
    return {
        status: 200,
        body: {
            data: publicaciones
        }
    }
}