 let base_url = "https://jsonplaceholder.typicode.com"; 

 let post_url = `${base_url}/posts`; 

const postForm = document.getElementById('postForm');
const titleControl= document.getElementById('title');
const bodyControl= document.getElementById('body');
const userIdControl =document.getElementById('userId'); 

const postContainer=document.getElementById('postContainer');

const spinner= document.getElementById('spinner')
const addPost = document.getElementById('addPost');
const updatePost = document.getElementById('updatePost');


let postArr= [];



function snackbar(msg,icon){ 
            swal.fire({ 
                  title:msg,
                  icon:icon ,
                  timer:3000
            }) 


}



function createCard(arr){ 
      let res= ''; 
      arr.forEach(ele=>{ 
          res += `<div class="col-md-4 mb-4" id=${ele.id}>
                    <div class="card">
                        <div class="card-header">
                        <h3>
                             ${ele.title}
                        </h3>
                        </div>
                        <div class="card-body">
                          
                         <p>    
                            ${ele.body}
                         </p>      
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>

                        </div>
                    </div>
                </div>`
      })
      postContainer.innerHTML= res ;
}




function fetchPost(){ 
           
   let xhr = new XMLHttpRequest(); 
     xhr.open("GET",post_url); 
     xhr.send(null); 

     xhr.onload = function(){ 

        if(xhr.status>=200 && xhr.status<=299){ 
              console.log(xhr.response);
              
             let postArr = JSON.parse(xhr.response);
                createCard(postArr); 
        }else{ 
            snackbar('Failed to fetch API', 'error'); 
        }   

     }

}

fetchPost();




function onSubmit(eve){
     eve.preventDefault(); 

     let postObj ={ 
          title:titleControl.value ,
          body:bodyControl.value,
          userId:userIdControl.value
     } 
            //API call To save post in database
           spinner.classList.remove('d-none')
        let xhr= new XMLHttpRequest(); 
        
            xhr.open("POST", post_url); 
            xhr.send(JSON.stringify(postObj)); 

           xhr.onload = function (){ 
                if(xhr.status>=200 && xhr.status<=299){ 
                     //to get Id 
                       console.log(xhr.response);
                       
                    let res = JSON.parse(xhr.response); 
                    let  div=document.createElement('div') 
                      div.className="col-md-4 mb-4"
                      div.id= res.id;
                      div.innerHTML=`<div class="card">
                                        <div class="card-header">
                                         <h3>
                                            ${postObj.title}
                                           </h3> 
                                        </div>
                                        <div class="card-body">
                                        <p>
                                            ${postObj.body}
                                         </p>  
                                        </div>
                                        <div class="card-footer d-flex justify-content-between align-items-center">
                                            <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info">Edit</button>
                                            <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>

                                        </div>
                                    </div>`
                       postContainer.prepend(div);
                       postForm.reset();
                       spinner.classList.add('d-none');


                }else{
                       snackbar('Data add failed...!', 'error') ;
                       spinner.classList.add('d-none');

                }
           }

}



function onRemove(ele){ 
       let removeId= ele.closest('.col-md-4').id ;
       let removeUrl= `${base_url}/posts/${removeId}`


        Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                if (result.isConfirmed) {
                    let xhr = new XMLHttpRequest(); 
                      xhr.open('DELETE', removeUrl);
                      xhr.send(null); 
                     
                      xhr.onload = function (){ 
                          if(xhr.status>=200 && xhr.status<=299 ){
                              ele.closest('.col-md-4').remove(); 
                          }else{ 
                             snackbar('failed to delete data...!', "error");
                          }
                      }
                   }
            });


}




function onEdit(ele){ 
      let editId=  ele.closest('.col-md-4').id ;
       localStorage.setItem('EditId', editId);
    
       let editUrl = `${base_url}/posts/${editId}`; 
        
           postForm.reset();     
       
           spinner.classList.remove("d-none")
         
       let xhr = new XMLHttpRequest() ;
           xhr.open("GET", editUrl);
           
           xhr.setRequestHeader('content-type', 'application/json') ;
           xhr.setRequestHeader('Autho','Get token from');
           
           xhr.send(null);
    
           xhr.onload=function (){  
              if(xhr.status>=200 && xhr.status<=299){ 
                   let EditObj = JSON.parse(xhr.response);
          
                   titleControl.value= EditObj.title;
                   bodyControl.value= EditObj.body;
                   userIdControl.value= EditObj.userId;
                   
                   addPost.classList.add('d-none');
                   updatePost.classList.remove('d-none');
                  
                   spinner.classList.add("d-none")

              }else{
                   snackbar('Data patch failed...!' , "error");
                   spinner.classList.add("d-none")

              }
           }
    }





function onUpdate(){
       let updateId = localStorage.getItem('EditId');
    
      let update_url= `${base_url}/posts/${updateId}`;
               spinner.classList.remove("d-none")
      
   let updateObj = { 
          title:titleControl.value ,
          body:bodyControl.value ,
          userId:userIdControl.value
          }

       let xhr = new XMLHttpRequest();
           xhr.open("PATCH", update_url);
           xhr.send(JSON.stringify(updateObj));         
    
         xhr.onload= function (){ 
            if(xhr.status>=200 && xhr.status<=299){ 
              
              let col= document.getElementById(updateId);
                   let h3 =col.querySelector('.col-md-4 h3');
                       h3.innerText= updateObj.title
                 
                   let p =col.querySelector('.col-md-4 p');
                       p.innerText= updateObj.body ;  
             
                       postForm.reset();
             
                      addPost.classList.remove('d-none');
                      updatePost.classList.add('d-none');     
                      spinner.classList.add('d-none') 

               snackbar('Data Updated successfully...!', 'success');    
            }else{ 
             spinner.classList.add('d-none') 
              
            }
         } 
    }














postForm.addEventListener('submit', onSubmit); 
updatePost.addEventListener('click',onUpdate);