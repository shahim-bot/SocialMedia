let text = "@Ayush, Hello this is a test post content and I am tagging @ayush_shah,@ayushzz and @shahayush954";

let i=0;
let user="";
let tags = [];
while(i<text.length){
    // console.log("hii");
    if(text.charAt(i) === '@'){
        i++;
        while(i<text.length && (text.charAt(i) !== ' ' && text.charAt(i) !== ',')){
           user=user+text.charAt(i); 
           i++;
        }
        user !== "" ? tags.push(user) : null;
        user="";
    }
    i++;
}

console.log("tags: "+tags);