import React from 'react';
import { Link } from 'react-router-dom'
import ValidationError from '../AddNote/ValidationError';
import config from '../config';
import NoteError from '../NoteError';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';

class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          },
          content: '',
          folderId: ''
        }
    } 
    static contextType = ApiContext

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    updateContent(content) {
        this.setState({content: content });
    }

    handleDropdownClick(folderId) { 
        console.log(folderId)
        this.setState({folderId: folderId});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {name, folderId, content} = this.state;
        const folderIdInt = parseInt(folderId);
        
    
        console.log('handle submit variables name', name );
        console.log('handle submit variables folderId', folderId ); 
        console.log('handle submit variables content', content );

        let options = {
            method: 'POST', 
            body: JSON.stringify({name: name.value, folderid: folderIdInt, content}),
            headers: { 'Content-Type': 'application/json'}
        }
        fetch(`${config.API_ENDPOINT}/note`, options) 
            .then(res => res.json())
            .then((result) => {
            this.props.routeProps.history.push('/')
            console.log(result)
            console.log(folderId)
            
            })
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
          return "Name is required";
        } else if (name.length < 3) {
          return "Name must be at least 3 characters long";
        }
    }

    validateFolder() {
        const folder = this.state.folderID.trim();
        if (folder.length === 0) {
          return "Folder is required";
        }
    }

    render() { 
        const {folders} = this.props
        const dropdownItems = folders.map(item => { 
            return <option key={item.id} value={item.id}>{item.name}</option>
        })
        

    

        return (
            <form className="addnote" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Note</h2>
                <div className="addnote__hint">* required field</div>  
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" className="name__control"
                        name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                    {this.state.name.touched && <ValidationError message={'There was an error'} />}

                    <label htmlFor="content">Add Text *</label>
                    <input type="text" className="name__control"
                        name="content" id="content" onChange={e => this.updateContent(e.target.value)}/>

                    <label htmlFor="folder">Select Folder *</label>
                    <select onChange={e => this.handleDropdownClick(e.target.value)}>
                        <option/>
                        {dropdownItems} 
                    </select>
    
                </div>
    
                <div className="addfolder__button__group">
                <button 
                    tag={Link}
                    to='/'
                    type="reset" 
                    className="addnote__button">
                    Cancel
                </button>
                <NoteError>
                    <button 
                        tag={Link}
                        to='/'
                        type="submit" 
                        className="addnote__button"
                        disabled={this.validateName()}>
                        Save
                    </button>
                </NoteError>
                </div>
            </form>
        )
    }
}

AddNote.propTypes = {
    name: PropTypes.string,
    content: PropTypes.string,
    folderid: PropTypes.number,
};

export default AddNote;