// place files you want to import through the `$lib` alias in this folder.
import { writable, type Writable } from 'svelte/store';
import { type UserInfo } from 'firebase/auth';
export const user: Writable<UserInfo | null> = writable(null);
