function isEmail(email){
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true;
    else return false;
}

function isEmpty(str){
    if(str.trim() === ''){
        return true;
    }
    else{
        return false;
    }
}

exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = "Email cannot be Empty!";
    }
    else if(!isEmail(data.email)){
        errors.email = "Must be a valid email address";
    }

    if(isEmpty(data.password)){
        errors.password = "Password cannot be Empty";
    }

    if(data.password !== data.confirmPassword){
        errors.confirmPassword = "Passwords must Match";
    }

    if(isEmpty(data.handle)){
        errors.handle = "User handle cannot be Empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateLoginData = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = "Email must not be Empty";
    }
    else if(!isEmail(data.email)){
        errors.email = "Must be valid Email Address";
    }

    if(isEmpty(data.password)){
        errors.password = "Password must not be Empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.reducedUserDetails = (data) => {
    let userDetails = {};
    if(!isEmpty(data.bio.trim())){
        userDetails.bio = data.bio;
    }
    if(!isEmpty(data.website.trim())){

        //https:website.com
        
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website}`;
        }
        else{
            userDetails.website = data.website;
        }
    }
    if(!isEmpty(data.location.trim())){
        userDetails.location = data.location;
    }

    return userDetails;
};