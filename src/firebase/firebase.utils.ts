import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "./firebase";
import { AuthUser, Device } from "@/types/Types";
import {  addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const ALLOWED_DOMAIN = "griddynamics.com";

export const signIn = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { uid, displayName, email, photoURL } = result.user;

    if (email && email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return {
        user: { uid, displayName, email, photoURL },
        error: null,
      };
    } else {
      await auth.signOut();
      return {
        user: undefined,
        error: `Unauthorized domain.`,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      user: undefined,
      error: message,
    };
  }
};

export const signOut = () => auth.signOut();



// export const fetchDevices =  async () : Promise<Device[]> => {
//   const request = await fetch("http://localhost:3001/devices");
//   const data = await request.json();
//   return data;
// }



export const addDevicetofb = async ({name,uid,address,description,location}:Device) =>  {
   try{
    const docRef = await addDoc(collection(db,'bniranjankumar'),{
      name:name,
      address:address,
      location:location,
      uid:uid,
      description:description
    });

    await updateDoc(doc(db, 'bniranjankumar', docRef.id), {
      id: docRef.id,
    });
    const id  =  await docRef.id;
    return id
   }
   catch(e){
    console.error(e);
   }
}


export const getDevicesfromfb = async() => {
 try{
  const querySnapshot = await getDocs(collection(db,"bniranjankumar"));
  const data:Device[] = []

  querySnapshot.forEach((doc) => {
    data.push({...doc.data() as Device});
    
  })
  return data;
 }
 catch(e){
  console.error(e);
 }
}


export const updateDeviceDataToFb = async ({name,address,description,id}:Device) => {
  await updateDoc(doc(db, 'bniranjankumar', id), {
    name:name,
    address:address,
    // location:location,
    description:description
  });
}


export const deleteDeviceFromFb = async (id:string) => {
 try{
  await deleteDoc(doc(db,"bniranjankumar",id));
 }
 catch(e){
  console.log(e);
 }
}