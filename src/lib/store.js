import { writable } from 'svelte/store';

export const publicaciones = writable(0);

export const usuarios = writable(0);

export const seccion = writable('todo');

export const yo = writable(0);

export const pag = writable(2);

export const uniquePubs = writable(0);

export const msgsChat = writable([]);

export const modalOn = writable(false);