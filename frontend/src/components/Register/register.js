import { Component } from "react";
import axios from 'axios';
import "./register.css";
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaVenusMars } from "react-icons/fa";

class SignIn extends Component {
  state ={
    fullname: '',
    phonenumber: '',
    email: '',
    password:'',
    confirmpassword:'',
    gender:''
  }

  onChangeInputGender = (event) =>{
    this.setState({gender:event.target.value})
  }

  onChangeInputPassword = (event) =>{
    this.setState({password: event.target.value})
  }

  onChangeInputConfirmPassword = (event) =>{
    this.setState({confirmpassword: event.target.value})
  } 

  onChangeInputPhoneNumber = (event) =>{
    this.setState({phonenumber: event.target.value})
  }

  onChangeInputEmail = (event) =>{
    this.setState({email: event.target.value})
  }
  
  onChangeInputName = (event) =>{
    this.setState({fullname: event.target.value})
  }

  onSubmitForm = async (event) =>{
    event.preventDefault()
    const {fullname, phonenumber, email, password, confirmpassword, gender} = this.state
    console.log(fullname, phonenumber, email, password, confirmpassword, gender);
    const registerDetails = {fullname, phonenumber, email, password, confirmpassword, gender}
    const url="http://localhost:5000/register";
    const response = await axios.post(url,registerDetails);
    if (response.status === 200){
      alert("Registration Successful! Please Login.");
      window.location.href="/login";  
    }else{
      alert("Registration Failed! Please try again.");
    }
  }

  render() {
    const { fullname, phonenumber, email, password, confirmpassword, gender } = this.state;
    return (
      <div className="signin-container">
        <form className="signin-form" onSubmit={this.onSubmitForm}>
          <h2 className="signin-title">Register Now</h2>

          {/* Full Name */}
          <div className="input-group" style={{marginBottom:"13px"}}>
            <FaUser className="input-icon" />
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Full Name"
              required className="input"
              onChange={this.onChangeInputName}
            />
          </div>

          {/* Phone Number */}
          <div className="input-group"  style={{marginBottom:"13px"}}>
            <FaPhoneAlt className="input-icon" />
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter phone number"
              required className="input"
              onChange={this.onChangeInputPhoneNumber}
            />
          </div>

          {/* Email */}
          <div className="input-group"  style={{marginBottom:"13px"}}>
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              required className="input" onChange={this.onChangeInputEmail}
            />
          </div>

          {/* Gender */}
          <label className="gender-label" style={{color:"#ffffff"}}>
            <FaVenusMars className="gender-icon" /> Gender:
          </label>
          <div className="gender-group">
            <label  className="gender-input">
              <input type="radio" name="gender" value="male" onChange={this.onChangeInputGender} required /> Male
            </label>
            <label  className="gender-input" >
              <input type="radio" name="gender" value="female" onChange={this.onChangeInputGender} /> Female
            </label>
            <label  className="gender-input" >
              <input type="radio" name="gender" value="other" onChange={this.onChangeInputGender} /> Other
            </label>
          </div>

          {/* Password */}
          <label htmlFor="password"  className="input-label">Password:</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="password" placeholder="Password"
              name="password" className="input"
              required onChange={this.onChangeInputPassword}
            />
          </div>

          {/* Confirm Password */}
          <label htmlFor="confirm-password"  className="input-label">Confirm Password:</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="confirm-password" placeholder="Confirm Password"
              name="confirm-password" className="input"
              required onChange={this.onChangeInputConfirmPassword}
            />
          </div>

          <button className="signin-button" type="submit">Sign In</button>
          <p className="line">Have already an account? <a href="/login" className="login-link">Login</a></p>
        </form>
      </div>
    );
  }
}

export default SignIn;
