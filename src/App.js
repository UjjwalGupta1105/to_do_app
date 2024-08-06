import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';


import  SuprSendInbox  from '@suprsend/react-inbox'
import  'react-toastify/dist/ReactToastify.css' 
import { ToastContainer, toast } from 'react-toastify';


function App() {
  const [data,newData]=useState({
    name:"",
    description:"",
    done:false,
  });

  // To get Data from Local Storage
  function getList(){
    const list= JSON.parse(localStorage.getItem("ToDoList"))
 
    if(list){
     return list
    }
    else{
     return []
    }

   }

  //  Creating all state variables
  const [List,newList]=useState(getList())
  const [updateIcon,setUpdateIcon]=useState(false)
  const [updateItem,setUpdateItem]=useState("")
  const [search,setSearch]=useState("")
  let [filteredList,setFilteredList]=useState("")

//  Updating or Adding Data in the Local Storage if any change occurs in the List...
  useEffect(()=>{
    localStorage.setItem("ToDoList",JSON.stringify(List))
  },[List])


  const changed=(e)=>{
      newData({...data,[e.target.name]:e.target.value})
  }

  // Adding or Updating a Task(ToDo)...
const clicked=()=>{
    if(updateItem){
        newList((olditems)=>{
            return(
                olditems.map((elemnt)=>{
                  if(elemnt.id==updateItem){
                      elemnt.input.name=data.name
                      elemnt.input.description=`${data.description}`
                  }
                  return elemnt
                })
            )
        })
        setUpdateItem("") 
        setUpdateIcon(false)
    }
    else{
      newList((olditems)=>{
      return([
          ...olditems,
          {id:new Date().getTime().toString(),input:data}
      ])

  })}

  newData({
    name:"",
    description:"",
    done:false
  })
}

// Deleting a Task
const cancel=(id)=>{
  console.log(id)
  newList((olditems)=>{
      return(
          olditems.filter((elemnt,index)=>{
             return elemnt.id!==id
          })
      )
  })
}

// Updating the Task List
const update=(id)=>{
    setUpdateIcon(true)
  const item=List.find((item)=>{
    return item.id===id
  })
  newData({
    name:item.input.name,
    description:item.input.description,
    done:item.input.done
  })
  setUpdateItem(item.id)
}

// Description showcase handing
const showDescription=(id,key)=>{

    if(document.getElementById(id).style.display=="none"){
        document.getElementById(id).style.display="block"
        document.getElementById(key).innerHTML=`<span>🡹</span>`
    }
    else{
        document.getElementById(id).style.display="none"
        document.getElementById(key).innerHTML=`<span> 🡻 </span>`

    }
}

// Search Handling
const searchTask=(name)=>{
    setSearch(name)

    setFilteredList(
        List.filter((elemnt,index)=>{
        return elemnt.input.name.toLowerCase().includes(name.toLowerCase())
     }))
}

// Checkbox Handling
const setData=(id)=>{
  newList((olditems)=>{

    return(
    olditems.map((item)=>{
      if(item.id==id){
        item.input.done=(!item.input.done)
        if(item.input.done){
          toast(`${item.input.name} Task is Completed...`)
        }
        console.log(item)
      }
      return item
    })
  )
})
}

// User Intereface[UI] of the ToDo Web Page... 
 return (<>
      <div className="main">
          <h1>To Do list</h1>
          <div className='superSend'>

          <SuprSendInbox 
  workspaceKey= "J0j14y36NwjZNeMRPgLk" 
  subscriberId= "9935112024" 
  distinctId= "9935112024" 
/>
          </div>
          
          <input type='text' className='search' value={search} name="search" onChange={(e)=>searchTask(e.target.value)} placeholder='Search for a Task...'></input>
          <div className='input-section'>

             <div>
                 <input type='text' value={data.name} name="name" onChange={changed} placeholder='Add a Item....'></input>
                <input type='text' value={data.description} name="description" onChange={changed} placeholder='Description....'></input>
            </div>
            <div>
                { updateIcon ?  <button  className='submitButton' onClick={clicked}>Edit</button> :  <button className='submitButton' onClick={clicked}>Add ToDo</button> }
            </div>

          </div>

          <div>

          <ol>

     { search ?  
         (     
        filteredList.map((items,key)=>{
          return(
            <>
                <div className='items'>
                    <li>
                              <div className='item-name'>{items.input.name}</div><br/>
                              <div  className="des" id={items.id}>{items.input.description}</div>
                    </li>

                    <div className="allButtons">
                        <Checkbox className='checkBox' type='checkBox' checked={items.input.done} name="done" onChange={()=>setData(`${items.id}`)}  />
                        <button className='des-button' id={key} onClick={()=>showDescription(`${items.id}`,`${key}`)}>🡹</button>
                        <button onClick={()=>{
                              cancel(`${items.id}`)
                          }}><DeleteIcon/></button>
                        <button onClick={()=>{
                            update(`${items.id}`)
                        }}><EditIcon/></button>

                    </div>
                </div>
            </>
                          
                          )
                  })
                     
             ) 

              :
               
  List.map((items,key)=>{
         return(
            <>
                <div className='items'>
                    <li>
                              <div className='item-name'>{items.input.name}</div><br/>
                              <div  className="des" id={items.id}>{items.input.description}</div>
                    </li>

                    <div className="allButtons">
                        <Checkbox className='checkBox' type='checkBox' checked={items.input.done} name="done" onChange={()=>setData(`${items.id}`)}  />
                        <button className='des-button' id={key} onClick={()=>showDescription(`${items.id}`,`${key}`)}>🡹</button>
                        <button onClick={()=>{
                              cancel(`${items.id}`)
                          }}><DeleteIcon/></button>
                        <button onClick={()=>{
                            update(`${items.id}`)
                        }}><EditIcon/></button>

                    </div>
                </div>
            </>
                          
          )
       })}
              </ol>
          </div>
      </div>
  </>)
}

export default App;
