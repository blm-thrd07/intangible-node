#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            LOGIN                              / "
 echo "/.............................................../ "


function Login(){
	 echo 'Login'
	 for((usr=1;usr<=100;usr++))
	  do
       curl -X POST   -H  'x-api-key: lnx1337'   -F email="" -F password="" http://localhost:3000/users/login
      done  
}
Login
