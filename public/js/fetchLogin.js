//Calls the create method in node
const createLogin = async (username, password)=>{
    let errors;
    await fetch('/logins',{
        method : 'post',
        body : JSON.stringify({
            username: username,
            password: password,
            active: true
        }),
        headers : {
            "Content-Type" : "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        errors = data;
    });

    return errors;
}