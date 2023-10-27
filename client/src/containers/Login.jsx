import React, { useEffect, useState } from "react"
import{LoginBg, Logo} from "../assets"
import { Logininput } from "../components";
import{FaEnvelope, FaLock, FcGoogle} from "../assets/icons";
import{motion} from "framer-motion";
import { buttonClick } from "../animations";
import {useNavigate} from "react-router-dom";

import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {app} from "../config/firebase.config";
import { validateUserJWTToken } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../context/actions/userActions";

const Login = () => {

  const [userEmail, setuserEmail] = useState("");
  const [isSignUp, setisSignUp] = useState(false);
  const [password, setpassword ] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  {/* get details from our app */}
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //use selector for logged in users prevent going back to login url
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if(user){
      navigate("/", {replace:true});
    }
  },[user])


  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then( userCredintial=>{
      firebaseAuth.onAuthStateChanged(cred => {
        if(cred){
          cred.getIdToken().then((token) =>{
            validateUserJWTToken(token).then(data =>{
              dispatch(setUserDetails(data));
            });
            navigate("/",{replace :true});
          });
        }
      });
    } );
  };

  {/* Login validations */}
  const signUpWithEmailPassword = async () => {
    if(userEmail === "" || password === "" || confirmPassword === ""){
      //console.log("Empty inputs")
    }
    else{
        if(password === confirmPassword){
          //clear inputs
                    setuserEmail("");
                    setconfirmPassword("");
                    setpassword("");
          await createUserWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCredintial => {

            firebaseAuth.onAuthStateChanged(cred => {
              if(cred){
                cred.getIdToken().then((token) =>{
                  validateUserJWTToken(token).then(data =>{
                    
                    dispatch(setUserDetails(data));
                  });
                  navigate("/",{replace :true});
                });
              }
            });

          })
          //console.log("equal")
        }
        else{
          //alert message
        }
    }
  };

  //Sign in with email and password function

  const signInWithEmailAndPass = async () => {
      if(userEmail !== "" && password !==""){
        await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCredintial => {
        
          firebaseAuth.onAuthStateChanged(cred => {
            if(cred){
              cred.getIdToken().then((token) =>{
                validateUserJWTToken(token).then(data =>{
                  dispatch(setUserDetails(data));
                });
                navigate("/",{replace :true});
              });
            }
          });

        });
      }
      else{
        //alert
      }
  };


  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      {/* background image */}
      <img src={LoginBg} className="w-full h-full object-cover absolute top-0 left-0"/>
      {/* content box */}
      
      <div className="flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-[10px] p-4 px-4 py-12 gap-6">
        {/* Top logo */}
            <div className="flex items-center justify-start gap-4 w-full">
                <img src={Logo} className="w-8"/>
                <p className=" text-headingColor font-semibold text-2xl">KABOCHI</p>
            </div>

            {/* Welcome text */}
            <p className="text-3xl font-semibold text-headingColor">Welcome!</p>
            <p className="text-xl font-semibold text-textColor -mt-6">We are happy to see you are hear ! </p>
            <p className="text-xl font-semibold text-textColor -mt-6">{isSignUp ? "Create account" : "Login"} hear</p>

            {/* Inputs */}

            {/* Email */}
            <div className="w-full flex flex-col items-center gap-6 px-4 md:px-12 py-4">
                <Logininput 
                  placeholder={"Enter your email"} 
                  icon={<FaEnvelope className="text-xl text-textColor" />} 
                  inputState={userEmail} 
                  inputStateFunc={setuserEmail} 
                  type="email" 
                  isSignUp={isSignUp} />

                {/* Password */}
                <Logininput 
                  placeholder={"Enter your password"} 
                  icon={<FaLock className="text-xl text-textColor" />} 
                  inputState={password} 
                  inputStateFunc={setpassword} 
                  type="password" 
                  isSignUp={isSignUp} />

                  {/* Confirm password */}
                {isSignUp && (
                    <Logininput placeholder={"Confirm your password"}
                                icon={<FaLock className="text-xl text-textColor" />}
                                inputState={confirmPassword}
                                inputStateFunc={setconfirmPassword}
                                type="password"
                                isSignUp={isSignUp}
                    />            
                )}
                {!isSignUp ? (
                 <p> Doesn't have an account? <motion.button{...buttonClick} className="text-red-800 underline cursor-pointer bg-transparent" onClick={()=>setisSignUp(true)}>Create new one</motion.button> </p> ) : (<p> Already have an account? <motion.button{...buttonClick} className="text-red-900 underline cursor-pointer bg-transparent" onClick={()=>setisSignUp(false)}>Sign in</motion.button> </p>)}
                  {/* Buttons */}
                  {isSignUp ?
                   
                   //sign up
                   <motion.button{...buttonClick} 
                   className="w-full px-4 py-2 rounded-md bg-red-600 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150" 
                   onClick={signUpWithEmailPassword}>
                   Sign Up
                   </motion.button>
                   
                   //Sign in
                   : <motion.button{...buttonClick} 
                   className="w-full px-4 py-2 rounded-md bg-red-600 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
                   onClick={signInWithEmailAndPass}
                   >
                   Sign In
                   </motion.button>}
            </div>
            <div className="flex items-center justify-between gap-16">
              <div className="w-24 h-[1px] rounded-md bg-white"></div>
                  <p className="text-white">or</p>
              <div className="w-24 h-[1px] rounded-md bg-white"></div>
            </div>
            <motion.div {...buttonClick} className=" flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
            onClick={loginWithGoogle}>
                  <FcGoogle className="text-3xl" />
                  <p className="capitalize text-base text-headingColor">Sign in with google</p>
            </motion.div>
      </div>
    </div>
  );
};

export default Login
