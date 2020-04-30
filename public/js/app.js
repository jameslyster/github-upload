$(document).ready(() => {
    console.log('Ready To GO!!');

    const nameCreate = document.getElementById('nameCreate');
    const phoneCreate = document.getElementById('phoneCreate');
    const addressCreate = document.getElementById('addressCreate');
    const DOBCreate = document.getElementById('DOBCreate');
    const createResult = document.getElementById('createResult');
    const nameUpdate = document.getElementById('nameUpdate');
    const phoneUpdate = document.getElementById('phoneUpdate');
    const addressUpdate = document.getElementById('addressUpdate');
    const DOBUpdate = document.getElementById('DOBCreate');
    const loginBtn = document.getElementById('loginBtn');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const createBtn = document.getElementById('createBtn');
    const table = document.getElementById('myTable');
    const tableBody = table.getElementsByTagName('tbody')[0];
    const nameRadio = document.getElementById('nameRadio');
    const addressRadio = document.getElementById('addressRadio');
    const phoneRadio = document.getElementById('phoneRadio');
    const searchLabel = document.getElementById('searchLabel');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const findAllBtn = $('#findAllBtn');

    let editDeleteDisplayedIndex= null;
    let updateID;

    //login
    loginBtn.onclick = async () => {
        let username = inputEmail.value;
        let password = inputPassword.value;
        let result = await checkLoginDetails(username, password)

        //let result = await createLogin(username, password);
        console.log(result);
    }


    //Creates new Entry
    createBtn.onclick = async () => {
        let name = nameCreate.value;
        let phone = phoneCreate.value;
        let address = addressCreate.value;
        let DOB = new Date(DOBCreate.value);
        let result = await createEntry(name, phone, address, DOB);
        console.log(result);
        if (result.errors == undefined){
            console.log(result.name);
            nameCreate.value='';
            phoneCreate.value='';
            addressCreate.value='';
            DOBCreate.valueAsDate = null;
            alert(`${result.name} has been successfully added too the database`);
        }else {
            makeValid([$('#nameCreate'),$('#addressCreate'),$('#phoneCreate'),$('#DOBCreate')]);
            $('#nameCreateError').text("");
            $('#addressCreateError').text("");
            $('#phoneCreateError').text("");
            $('#DOBCreateError').text("");
            let errors = result.errors;
            let i, dateErrorCheck=false;
            for(i=0;i<errors.length;i++){
                if(errors[i].param == 'name'){
                    $('#nameCreateError').text(errors[i].msg);
                    changeToInvalid($('#nameCreate'));
                }
                if(errors[i].param == 'address'){
                    $('#addressCreateError').text(errors[i].msg);
                    changeToInvalid($('#addressCreate'));
                }
                if(errors[i].param == 'phone'){
                    $('#phoneCreateError').text(errors[i].msg);
                    changeToInvalid($('#phoneCreate'));
                }
                if(errors[i].param == 'DOB' && dateErrorCheck===false){
                    $('#DOBCreateError').text(errors[i].msg);
                    changeToInvalid($('#DOBCreate'));
                    dateErrorCheck = true;
                }
            }
            
        }
    }

    


    //get all addresses and poulate table
    findAllBtn.click( async () => {
        //console.log("Login Pressed!");
        getAndDisplayAddresses();
    });

    const getAndDisplayAddresses = async () => {
        let addressArray = [];
        addressArray = await findAddresses(addressArray);
        //console.log(addressArray);
        addressArray.sort(compareNames);
        console.log(addressArray);
        displayAddresses(addressArray);
    }

    //shows array of addresses in addressArray
    const displayAddresses = (addressArray) => {
        console.log(tableBody.rows.length);
        while (tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }
        let i;
        for(i=0; i<addressArray.length; i++){
            let address = addressArray[i];
            let date = new Date(address.DOB)
            let row = tableBody.insertRow();
            row.id = String(address._id);
            row.className = "displayedAddress";
            let cellName = row.insertCell(0);
            let cellAddress = row.insertCell(1);
            let cellPhone = row.insertCell(2);
            let cellDOB = row.insertCell(3);
            cellName.innerHTML = `<div id="name${address._id}">${address.name}</div>`
            cellAddress.innerHTML = address.address;
            cellPhone.innerHTML = address.phone;
            cellDOB.innerHTML = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            showButton(address);  
        }
    }

    const showButton = (address)=>{
        let displayedAddress = $(`#${address._id}`); 
        displayedAddress.click(async function() {

            /*if(editDeleteDisplayedIndex!=null){
                tableBody.deleteRow(editDeleteDisplayedIndex);
            }*/
            $('table#myTable tr#editDelete').remove();
            let rowIndex = $(this).index('#myTable tbody tr');
            //console.log(rowIndex);
            editDeleteDisplayedIndex = rowIndex + 1;
            let row = tableBody.insertRow(rowIndex+1);
            row.id = "editDelete";
            let cell = row.insertCell(0);  
            cell.colSpan = "4";
            cell.innerHTML = `<button id="edit${address._id}">Edit</button><button id="delete${address._id}">Delete</button><button id="closeEditDelete">X</button>`;
            deleteAddress(address._id);  
            editAddress(address);
            removeButtons();   
        });
    }
    
    const removeButtons = ()=>{
        let closeEditDeleteBtn = $('#closeEditDelete');
        closeEditDeleteBtn.click(()=>{
            let rowIndex = $('#editDelete').index('#myTable tbody tr');
            tableBody.deleteRow(rowIndex);
            editDeleteDisplayedIndex = null;
        });
    }

    const deleteAddress = (ID)=>{
        let deleteAddressBtn = $(`#delete${ID}`);
        deleteAddressBtn.click( async () =>{
            let name = $(`#name${ID}`).text();
            let confirmDelete = await confirm(`Are you sure you want to delete entry for ${name}`);
            if(confirmDelete == true){
                console.log("delete");
                deleteEntry(ID);
                getAndDisplayAddresses();
                editDeleteDisplayedIndex = null;
            }else {
                console.log("not deleted");
            }
        });
    }

    const editAddress = (address)=>{
        let editAddressBtn = $(`#edit${address._id}`);
        editAddressBtn.click( async () =>{
            let name = address.name;
            let confirmDelete = await confirm(`Are you sure you want to edit entry for ${name}`);
            if(confirmDelete == true){
                //console.log("edited");
                $('#updateForm').css('display', 'block');
                $('#nav-update-tab').trigger("click");
                $('#updateHeading').text(`Update Info For entry "${address.name}"`);
                updateID = address._id;
                nameUpdate.value = address.name;
                addressUpdate.value = address.address;
                phoneUpdate.value = address.phone;
                let dateBirth = new Date(address.DOB);
                let day = dateBirth.getDate(); 
                month = dateBirth.getMonth()+1;
                if(day < 10)
                    day = "0"+day;
                if(month < 10)
                    month = "0"+ month;
                let date = `${dateBirth.getFullYear()}-${month}-${day}`;
                console.log(date)
                //DOBUpdate.value = date;
                document.getElementById('DOBUpdate').value=date;
                updateID = address._id;
            }else {
                console.log("not edited");
            }
        });
    }

    
    let updateAddressBtn = $('#updateBtn');
    updateAddressBtn.click(async()=>{
    let name = nameUpdate.value;
    let phone = phoneUpdate.value;
    let address = addressUpdate.value;
    console.log
    let DOB = new Date(document.getElementById('DOBUpdate').value);
    //console.log(DOB);
    let result = await updateEntryPatch(updateID,name,phone,address,DOB); //updateEntry(updateID, name, phone, address, DOB);
    console.log(result);
    if(result.errors == undefined){
        getAndDisplayAddresses();
        editDeleteDisplayedIndex = null;
        $('#updateForm').css('display', 'none');
        alert(`${result.name} has been changed in the database`);
    }else {
        makeValid([$('#nameUpdate'),$('#addressUpdate'),$('#phoneUpdate'),$('#DOBUpdate')]);
        $('#nameUpdateError').text("");
        $('#addressUpdateError').text("");
        $('#phoneUpdateError').text("");
        $('#DOBUpdateError').text("");
        let errors = result.errors;
            let i, dateErrorCheck=false;
            for(i=0;i<errors.length;i++){
                if(errors[i].param == 'name'){
                    $('#nameUpdateError').text(errors[i].msg);
                    changeToInvalid($('#nameUpdate'));
                }
                if(errors[i].param == 'address'){
                    $('#addressUpdateError').text(errors[i].msg);
                    changeToInvalid($('#addressUpdate'));
                }
                if(errors[i].param == 'phone'){
                    $('#phoneUpdateError').text(errors[i].msg);
                    changeToInvalid($('#phoneUpdate'));
                }
                if(errors[i].param == 'DOB' && dateErrorCheck===false){
                    $('#DOBUpdateError').text(errors[i].msg);
                    changeToInvalid($('#DOBUpdate'));
                    dateErrorCheck = true;
                }
            }
    }
    });

    searchBtn.onclick = async () => {
        let foundAddresses;
        let type;
        let searchString = searchInput.value;
        if(nameRadio.checked){
            console.log('name');
            type="name";
        }else if (addressRadio.checked){
            console.log('address');
            type='address';
        }else if(phoneRadio.checked){
            console.log('Phone');
            type='phone';
        }

        console.log(searchInput.value);
        foundAddresses = await findAddressByString(type , searchString, foundAddresses);
        console.log(foundAddresses);
        //console.log(addressArray);
        displayAddresses(foundAddresses);
    }

    nameRadio.onclick = () => {
        searchLabel.innerHTML = "Enter name to search"
        searchInput.value = "";
    }

    addressRadio.onclick = () => {
        searchLabel.innerHTML = "Enter address to search"
        searchInput.value = "";
    }

    phoneRadio.onclick = () => {
        searchLabel.innerHTML = "Enter phone number to search"
        searchInput.value = "";
    }
});