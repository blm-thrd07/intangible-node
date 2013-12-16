#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            ReadUsers                           / "
 echo "/.............................................../ "

function ReadUsers(){
    echo "Listando Usuarios"
    curl  -X GET  -H  'x-api-key: lnx1337' http://sspdemo.cloudapp.net/users/list
}
ReadUsers