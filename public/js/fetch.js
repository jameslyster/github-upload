//Calls the create method in node
const createEntry = async (name, phone, address, DOB)=>{
    console.log(DOB);
    let errors;
    await fetch('/addresses',{
        method : 'post',
        body : JSON.stringify({
            name: name,
            phone: phone,
            address: address,
            DOB: DOB
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


//returns all names
const findAddresses = async (array)=>{
    await fetch('/addresses',{
        method : "get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        array = data;
    });
    return array;
}

//return name with specified id
const findAddressById = async (id, address)=>{
    await fetch(`/addresses/${id}`,{
        method : 'get',
    }).then((response)=>{  
        return response.json();
    }).then((data)=>{
        address = data;
    });
    return address;
}

//return name with specified id
const findAddressByString = async (type , searchString, address)=>{
    await fetch(`/addresses/${type}/${searchString}`,{
        method : 'get'
    }).then((response)=>{  
        return response.json();
    }).then((data)=>{
        console.log(data);
        address = data;
    });
    return address;
}

//updates entry with specified id
const updateEntry = (id, name, phone, address, DOB) => {
    fetch(`/addresses/${id}`,{
        method : "put",
        headers : {
            "Content-Type" : "application/json; charset=utf-8" 
        },
        body : JSON.stringify({
            name: name,
            phone: phone,
            address: address,
            DOB: DOB
        })
    }).then((response)=>{
        return response.json();
    });
}

//updates entry with patch instead of put
const updateEntryPatch = async (id, name, phone, address, DOB) => {
    let errors;
     await fetch(`/addresses/${id}`,{
        method : "PATCH",
        headers : {
            "Content-Type" : "application/json; charset=utf-8" 
        },
        body : JSON.stringify({
            name: name,
            phone: phone,
            address: address,
            DOB: DOB
        })
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        errors = data;
    });
    return errors;
}

//delete address with specified id
const deleteEntry = (id) => {
    fetch(`/addresses/${id}`,{
        method: "delete"
    }).then((response)=>{
        return response.json;
    })
}