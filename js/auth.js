import {set,get} from "./storage.js";

const users = get("users") || [];


// demo users //
const demoUsers = [
    {
     uId : crypto.randomUUID(),
     name : "Mc Hamouda",
     email : "hamouda@gmail.com",
     password : "mentor000@",
     role : "admin"
    }
]



demoUsers.forEach(d => {
    let isDemoExist = users.find(u => u.email == d.email);

    if(isDemoExist) {
       return;
    }else{
       users.push(d);
       set("users", users)
    }

})




export function register (name,email,password,confirmPassowrd) {
   const isExist = users.find(user => user.email == email);
   if(!password === confirmPassowrd){
       alert("password does not match");
       return;
    }
    
    if(isExist){
        alert("This email is already registered.");
        return;
    }

   users.push({
    name,
    password,
    email,
    role : "user"
   })

   set("users", users);

   alert("user registeraed successfully.");
   console.log("hello");
   
}


export function login (email,password) {
    const users = get("users");

    const user = users.find(u => u.email == email && u.password == password);

    if(!user){
       alert("user does not exist");
       return; 
    }

    sessionStorage.setItem("currentUser", JSON.stringify(user));
}


export function currentUser () {
    return JSON.parse(sessionStorage.getItem("currentUser"));
}

