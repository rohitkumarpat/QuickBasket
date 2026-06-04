import axios from 'axios'
import react from 'react'

async function emiteventhandler(event:string,data:any,socketid?:string) { 
  try {
   await axios.post(`${process.env.NEXT_PUBLIC_SOKET_SERVER_URL}/notify-delivery`,{
      socketid,
      event,
      data
    })

  }catch (error) {
    console.error('Error emitting event:', error)
  }
}

export default emiteventhandler
