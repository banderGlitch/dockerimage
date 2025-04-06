import { readFile, writeFile } from 'fs/promises';

const DB_FILE = './db.json'

// get the file

export const getUsers = async () => {
    const data = await readFile(DB_FILE, 'utf-8');
    return JSON.parse(data).users;
}

// save file 

export const saveUsers = async (users) => {
    await writeFile(DB_FILE, JSON.stringify({ users }, null, 2));
}

// find user

export const findUser = async (username) => {
    const users = await getUsers();
    return users.find(u => u.username === username);
}

// create user

export const createUser = async (user) => {
    const users = await getUsers();
    users.push(user)
    await saveUsers(users)
    return user
}

