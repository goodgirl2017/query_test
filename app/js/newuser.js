 function register(){

    var newuser=$('#newuser').val();
	
    var newpass=$('#newpass').val();
	
	var repass=$('#repass').val();
	
	var firstname=$('#firstname').val();
	
	var lastname=$('#lastname').val();
		
	if (newpass!==repass){
		window.alert("Password mismatch, please try again");}
	
    else if (newuser !== null && newpass !== null && repass!== null){

        var newUser={};
		newUser.userName=newuser;
        newUser.password=newpass;
		newUser.firstName=firstname;
		newUser.lastName=lastname;		
		
		newUser = JSON.stringify(newUser);
        console.log(newUser);
        $.ajax({
            type: "POST",
            url: '../api/user',
            data: newUser,
            dataType: 'json',
            contentType: "application/json",
			//success- jump to login page:index.html
            success:function(data) {
                window.alert ("Registration succeed!");
				window.location.href = "index.html";
            }
        });

    }
	else
	{
		window.alert ("Please type your username and password!");
	}
}