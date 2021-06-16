import React from "react";
import "./Profile.css";

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.user.name,
            email: this.props.user.email
        }
    }

    onFormChange = (event) => {
        switch(event.target.name){
            case 'name':
                this.setState({name: event.target.value});
                break;
            case 'email':
                this.setState({email: event.target.value});
                break;
            default:
                return;
        }
    }

    onProfileUpdate = (data)=>{
        fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({formInput: data}) 
        })
        .then((res)=>{
            this.props.toggleModal();
            this.props.loadUser({...this.props.user, ...data});
        })
        .catch(e => {console.log('error: ', e)});
    }

    render(){
        const { name, email } = this.state;
        return (
            <div className="profile-modal">
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
                    <main className="pa4 black-80 w-80">
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="h3 w3 dib" alt="avatar" />
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="register_name">Name</label>
                            <input 
                                onChange={this.onFormChange}
                                className="pa2 input-reset ba bg-transparent w-100" 
                                defaultValue={this.props.user.name}
                                type="text" 
                                name="name"  
                                id="profile-name" />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                onChange={this.onFormChange}
                                className="pa2 input-reset ba bg-transparent w-100" 
                                defaultValue={this.props.user.email}
                                type="email" 
                                name="email"  
                                id="profile-email-address" />
                        </div>
                        <div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <button className="b pa pointer hover-white" onClick={() => this.onProfileUpdate({name, email})}>
                                Save
                            </button>
                            <button className="b pa pointer hover-white" onClick={this.props.toggleModal}>
                                Cancel
                            </button>
                        </div>
                    </main>   
                    <div className="modal-close" onClick={this.props.toggleModal}>&times;</div> 
                </article>
            </div>
        );
    }
};

export default Profile;