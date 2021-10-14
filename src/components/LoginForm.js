import Web3 from 'web3';
import file from '../abis/HealthCare.json'; 
import React, { Component } from 'react';
import '../loginStyle.css';
import './App.css';
export class LoginForm extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props) {
  super(props)

    this.state = {
      account:'',
      buffer: null,
      filehash: '',
      contract: null,
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: ''  
    };
  }
  continue = e => {
    e.preventDefault();
    this.props.nextStep();

  };
  Doccontinue = e => {
    e.preventDefault();
    this.props.docnextStep();
  };
  changeText(event){
         this.setState(
             {name : event.target.state.name}
         );
     };
  async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
  }
  
  async loadBlockchainData() {
  
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = file.networks[networkId]
        if(networkData) {
          const contract = new web3.eth.Contract(file.abi, networkData.address)
          this.setState({ contract })
        } else {
          window.alert('Smart contract not deployed to detected network.')
        }
  }
  
    cambiar_login (event) {
      document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";  
      document.querySelector('.cont_form_login').style.display = "block";
      document.querySelector('.cont_form_sign_up').style.opacity = "0";               
      setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },400);  
      setTimeout(function(){    
        document.querySelector('.cont_form_sign_up').style.display = "none";
      },200);  
    };
    
  cambiar_sign_up = async () => {
      document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
      document.querySelector('.cont_form_sign_up').style.display = "block";
      document.querySelector('.cont_form_login').style.opacity = "0";
      setTimeout(function(){  
        document.querySelector('.cont_form_sign_up').style.opacity = "1";
      },100);  
      setTimeout(function(){   
        document.querySelector('.cont_form_login').style.display = "none";
      },400);  
    }    
    
    ocultar_login_sign_up = e => {
      document.querySelector('.cont_forms').className = "cont_forms";  
      document.querySelector('.cont_form_sign_up').style.opacity = "0";               
      document.querySelector('.cont_form_login').style.opacity = "0"; 
      setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
        document.querySelector('.cont_form_login').style.display = "none";
      },500);      
    };
    function = async () => {
      (window).load( async function() {
        this.resp = await this.App.init();
        if(this.resp == false) {  
          ('.freeze').attr('disabled',true); 
          alert("Install MetaMask, connect you to your account and refresh web page."); 
        }
        ('.reduire').click(function(event){ event.preventDefault(); return this.ocultar_login_sign_up; });
        ('#sign_up_licence').hide();
        ('#sign_up_illness').hide();
        ('input[type=radio]').on( "click", function() {
          if(( "input:checked" ).val() === "Doctor" ) {
              ('#sign_up_illness').hide();
              ('.cont_forms_active_sign_up').css("height","590px");
              ('#sign_up_licence').show();
          } else {
              ('#sign_up_licence').hide();
              ('.cont_forms_active_sign_up').css("height","590px");
              ('#sign_up_illness').show();
          }
        });
        ('#sign_up_ethAddress').change(function(){
          var ethAddress= ('#sign_up_ethAddress').val();
          this.App.contracts.HealthCare.deployed().then(async function(instance){
            let docs = await instance.doctors(ethAddress);
            let pats = await instance.patients(ethAddress);
            if ((docs[1] != '') || (pats[1] != '')) {
              alert("There is already an account for this address, please try again.");
              ('#sign_up_ethAddress').focus();
              ('#btnRegister').prop('disabled', true);
            } else {
              ('#btnRegister').prop('disabled', false);
            }
          }).catch((err) =>{
            alert(err);
          });
        });
        ('#btnConnexion').onClick( async function(){
          var u_add = ('#user_address').val();
          var u_pass = ('#user_password').val();
          if(u_add ==='' || u_pass ==='') {
              alert("You need to enter both your Ethereum address and your Password.");
          } else {
              this.App.contracts.HealthCare.deployed().then(async function(instance) {
                let docs = await instance.doctors(u_add);
                let pats = await instance.patients(u_add);
                if((docs[1].toString() == '') || (pats[1].toString() == ''))
                  alert("The entered address is not recognized, please try agin.");
                else if (docs[1].toString() == u_pass) {
                  sessionStorage.setItem('D_address',docs[0]);
                  if(docs[2] === "Doctor")
                    window.location.href=window.location.href+"medecin_bienvenue";
                } else if (pats[1].toString() == u_pass) {
                  sessionStorage.setItem('P_address',pats[0]);
                  if(pats[2] === "Patient")
                    window.location.href=window.location.href+"patient_bienvenue";
                } else 
                    alert("Wrong password");
              }).catch((err) =>{
                alert(err);
              });
            }
        });
        ('#btnRegister').click( async function(){
          var pass = ('#sign_up_password').val();
          var confirmp = ( "#sign_up_confirmp" ).val() ;
          var fName = ( "#sign_up_fName" ).val() ;
          var lName = ( "#sign_up_nom" ).val() ;
          var licence = ( "#sign_up_licence" ).val() ;
          var ethAddress = ( "#sign_up_ethAddress" ).val() ;
          var radio = ( "input:checked" ).val() ;
          var illness = ( "#sign_up_illness" ).val() ;
          var age = ( "#sign_up_age" ).val() ;
          var phNum = ( "#sign_up_phNum" ).val() ;
          if(pass=='' || confirmp=='' || fName=='' || lName=='' || ethAddress==''){ 
            alert('Veuillez renseigner toutes les informations, verifier bien.'); return;}
          else if(radio!="Doctor" && radio!="Patient") { 
            alert('Vous êtes un médecin ou un patient veuillez faire la selection.'); return;}
          else if(confirmp != pass) { 
            alert("Le mot de passe saisie n'est pas le même qui a été confirmpé."); return; }
          else if(radio=="Doctor" && licence=='') { 
            alert('Vous devez renseigner votre licence.'); return;}
          else if(radio=="Patient" && illness=='') { 
            alert('Vous devez renseigner votre illness.'); return;}
          let accounts = await window.ethereum.enable();
            //alert(Object.keys(this.App.contracts).length);
          if(radio=="Doctor"){ 
            this.App.contracts.HealthCare.deployed().then(async function(instance){
              return await instance.signupDoctor(lName, fName, licence,phNum );
            }).then(function(result){
                (':text, :password').val('');
                (':radio').removeAttr("checked");
                ('.cont_forms_active_sign_up').css("height","520px");
                ('#sign_up_illness').hide();
                ('#sign_up_licence').hide();
                this.ocultar_login_sign_up();
                alert('Nouveau compte créé pour '+fName);
              }).catch((err)=>{
                alert(err);
              });
            
          } else {
            this.App.contracts.HealthCare.deployed().then(async function(instance){
              return await instance.signupPatient( lName, fName, age, illness,phNum );
            }).then(function(result){
                (':text, :password').val('');
                (':radio').removeAttr("checked");
                ('.cont_forms_active_sign_up').css("height","520px");
                ('#sign_up_illness').hide();
                ('#sign_up_licence').hide();
                this.ocultar_login_sign_up();
                alert('Nouveau compte créé pour '+fName);
            }).catch((err)=>{
              alert(err);
            });
          }
        });
      });
    };
  render(){
    const { values, handleChange } = this.props;
    return ( 
      <>
      
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      
      <div className="cotn_principal">
        <div className="cont_centrar">
          <div className="cont_login">
            <div className="cont_info_log_sign_up">
              <div className="col_md_login">
                <div className="cont_ba_opcitiy">
                  <h2>LOGIN</h2>
                  <p>Have an account?</p>
                  <button className="btn_login" onClick={this.cambiar_login}>LOGIN</button>
                </div>
              </div>
              <div className="col_md_sign_up">
                <div className="cont_ba_opcitiy">
                  <h2>SIGN UP</h2>
                  <p>Don't have an account ?</p>
                  <button className="btn_sign_up" onClick={this.cambiar_sign_up}>SIGN UP</button>
                </div>
              </div>
            </div>
            <div className="cont_back_info">
              <div className="cont_img_back_grey">
              </div>
            </div>
            <div className="cont_forms">
              <div className="cont_img_back_">
              </div>
              <div className="cont_form_login">
                <a href="#" className="reduire" onClick={this.ocultar_login_sign_up}><i className="material-icons">arrow_back</i></a>
                <h2>LOGIN</h2>
                <input type="text" id='user_address' placeholder="Ethereum account address" required/>
                <input type="password" id='user_password' placeholder="Password" required/>
                <button className="btn_login" id="btnConnexion" onClick={this.cambiar_login}>LOGIN</button>
              </div>
              <div className="cont_form_sign_up">
                <a href="#" className="reduire" onClick={this.ocultar_login_sign_up}><i className="material-icons">arrow_back</i></a>
                <h2 align="center">SIGN UP</h2>
                <input type="text" id="sign_up_ethAddress" placeholder="Ethereum Address" required/><br/>
                <input type="text" id="sign_up_fName" placeholder="First Name" required/><br/>
                <input type="text" id="sign_up_lName" placeholder="Last Name" required/><br/>
                <div className="radio" align="left">
                 <input type="radio" align='left' name="radioR" id="roleD"  /> Doctor <br/>
                 Licence ID<input type="text" id="sign_up_licence" name="licenceID" placeholder="Licence ID" /><br/>
                 <input type="radio" align='left' name="radioR" id="roleP"  /> Patient <br/>
                 Illness   <input type="text" id="sign_up_illness" name="illness" placeholder="Illness"  required/><br/>
                 age       <input type="text" id="sign_up_age" name="age" placeholder="age"  required/><br/>
                </div>
                <input type="text" id="sign_up_phNum" placeholder="Phone number" required/><br/>
                <input type="password" id="sign_up_password" placeholder="Password" required/>
                <input type="password" id="sign_up_confirmp" placeholder="Confirm Password" required/>

                <button className="btn_sign_up" id="btnRegister" onClick={this.cambiar_sign_up}>SIGN UP</button>
              </div>
            </div>
          </div>
        </div>
      </div></>
    );
    }
  }



export default LoginForm;
