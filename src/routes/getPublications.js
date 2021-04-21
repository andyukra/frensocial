import db from '$lib/db';
import publications from '$lib/publications';

export async function get({headers}) {
    if(!headers.referer) return null;
    
    const publicaciones = await publications.find().sort({time: -1});

    return {
        status: 200,
        body: {
            data: publicaciones
        }
    }
}